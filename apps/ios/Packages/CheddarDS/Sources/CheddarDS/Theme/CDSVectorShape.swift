import SwiftUI

/// A shape built from an SVG `<path>` in the design system bundle.
///
/// The brand marks are single-colour vector paths on the web and have to stay that way here:
/// as bitmaps they cannot be re-tinted per theme, and their knocked-out details — the sparkle
/// inside the logo — are holes in the path rather than white pixels.
///
/// Only the commands those files use are supported: absolute move, line, horizontal, vertical,
/// cubic and close.
public struct CDSVectorShape: Shape {
    private let path: CDSVectorPath

    public init(_ resource: String) {
        path = CDSVectorPath.load(resource)
    }

    public func path(in rect: CGRect) -> Path {
        guard path.size.width > 0, path.size.height > 0 else { return Path() }
        let scale = min(rect.width / path.size.width, rect.height / path.size.height)
        let offset = CGPoint(
            x: rect.minX + (rect.width - path.size.width * scale) / 2,
            y: rect.minY + (rect.height - path.size.height * scale) / 2
        )
        return path.path.applying(
            CGAffineTransform(translationX: offset.x, y: offset.y).scaledBy(x: scale, y: scale)
        )
    }
}

/// A parsed path and the viewBox it was authored in.
struct CDSVectorPath {
    let path: Path
    let size: CGSize

    private static let cache = Cache()

    static func load(_ resource: String) -> CDSVectorPath {
        if let hit = cache.value(for: resource) { return hit }
        let parsed = parse(resource)
        cache.store(parsed, for: resource)
        return parsed
    }

    private static func parse(_ resource: String) -> CDSVectorPath {
        let name = resource.hasSuffix(".svg") ? String(resource.dropLast(4)) : resource
        guard
            let url = Bundle.module.url(forResource: name, withExtension: "svg"),
            let markup = try? String(contentsOf: url, encoding: .utf8)
        else {
            return CDSVectorPath(path: Path(), size: .zero)
        }

        return CDSVectorPath(
            path: buildPath(from: attribute("d", in: markup) ?? ""),
            size: viewBox(in: markup)
        )
    }

    /// The leading space matters: `d=` is a suffix of `id=`, and the marks carry both.
    private static func attribute(_ name: String, in markup: String) -> String? {
        guard let range = markup.range(of: " \(name)=\"") else { return nil }
        let rest = markup[range.upperBound...]
        guard let end = rest.firstIndex(of: "\"") else { return nil }
        return String(rest[..<end])
    }

    private static func viewBox(in markup: String) -> CGSize {
        let numbers = (attribute("viewBox", in: markup) ?? "")
            .split(whereSeparator: { $0 == " " || $0 == "," })
            .compactMap { Double($0) }
        guard numbers.count == 4 else { return .zero }
        return CGSize(width: numbers[2], height: numbers[3])
    }

    private static func buildPath(from data: String) -> Path {
        var path = Path()
        var numbers: [CGFloat] = []
        var command: Character?
        var current = CGPoint.zero
        var start = CGPoint.zero

        func flush() {
            guard let command else { return }
            var index = 0
            func next() -> CGFloat {
                defer { index += 1 }
                return index < numbers.count ? numbers[index] : 0
            }

            switch command {
            case "M":
                while index < numbers.count {
                    current = CGPoint(x: next(), y: next())
                    // Subsequent pairs after a move are implicit line-tos.
                    if index == 2 {
                        path.move(to: current)
                        start = current
                    } else {
                        path.addLine(to: current)
                    }
                }
            case "L":
                while index < numbers.count {
                    current = CGPoint(x: next(), y: next())
                    path.addLine(to: current)
                }
            case "H":
                while index < numbers.count {
                    current = CGPoint(x: next(), y: current.y)
                    path.addLine(to: current)
                }
            case "V":
                while index < numbers.count {
                    current = CGPoint(x: current.x, y: next())
                    path.addLine(to: current)
                }
            case "C":
                while index + 5 < numbers.count {
                    let control1 = CGPoint(x: next(), y: next())
                    let control2 = CGPoint(x: next(), y: next())
                    current = CGPoint(x: next(), y: next())
                    path.addCurve(to: current, control1: control1, control2: control2)
                }
            case "Z", "z":
                path.closeSubpath()
                current = start
            default:
                break
            }
            numbers.removeAll(keepingCapacity: true)
        }

        var literal = ""
        func takeNumber() {
            if let value = Double(literal) { numbers.append(CGFloat(value)) }
            literal = ""
        }

        for character in data {
            switch character {
            case "0"..."9", ".":
                literal.append(character)
            case "e", "E":
                literal.append(character)
            case "+", "-":
                // A sign only starts a new number when it is not an exponent's.
                if literal.hasSuffix("e") || literal.hasSuffix("E") {
                    literal.append(character)
                } else {
                    takeNumber()
                    literal.append(character)
                }
            case " ", ",", "\n", "\t":
                takeNumber()
            default:
                takeNumber()
                flush()
                command = character
            }
        }
        takeNumber()
        flush()

        return path
    }

    private final class Cache: @unchecked Sendable {
        private var storage: [String: CDSVectorPath] = [:]
        private let lock = NSLock()

        func value(for key: String) -> CDSVectorPath? {
            lock.lock()
            defer { lock.unlock() }
            return storage[key]
        }

        func store(_ value: CDSVectorPath, for key: String) {
            lock.lock()
            defer { lock.unlock() }
            storage[key] = value
        }
    }
}
