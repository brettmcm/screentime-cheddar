import SwiftUI

/// Draws a design system glyph from the generated `CheddarIcons` path data.
///
/// Most glyphs are two-tone: a filled silhouette with a detail knocked out of it rather than
/// drawn on top. The web does this with `--cds-icon-knockout`, which each surface re-points
/// to its own background; here that is ``EnvironmentValues/cheddarIconKnockout``, so a glyph
/// picks up the right colour from whatever it is nested in. Pass ``knockout`` only to
/// override it for one call site.
public struct CDSIcon: View {
    /// Mirrors the icon library's `Color` variant: `mono` inherits the surrounding
    /// foreground style, `brand` paints the glyph in the brand ramp.
    public enum Tone {
        case mono
        case brand
    }

    @Environment(\.cheddarIconKnockout) private var environmentKnockout
    @Environment(\.cheddarPalette) private var palette

    private let name: CheddarIconName
    private let size: CGFloat
    private let tone: Tone
    private let knockoutOverride: Color?

    public init(
        _ name: CheddarIconName,
        size: CGFloat = CheddarSpacing.iconLarge,
        tone: Tone = .mono,
        knockout: Color? = nil
    ) {
        self.name = name
        self.size = size
        self.tone = tone
        self.knockoutOverride = knockout
    }

    public var body: some View {
        ZStack {
            ForEach(Array(CheddarIcons.paths(for: name).enumerated()), id: \.offset) { _, path in
                layer(path)
            }
        }
        .frame(width: glyph.width, height: glyph.height)
        .frame(width: size, height: size)
        .accessibilityHidden(true)
    }

    /// The glyph fitted inside the square box without distortion — SVG's `xMidYMid meet`.
    /// A caret is nearly twice as tall as it is wide and reads as a chevron only at that
    /// proportion.
    private var glyph: CGSize {
        let aspect = name.aspectRatio
        return aspect >= 1
            ? CGSize(width: size, height: size / aspect)
            : CGSize(width: size * aspect, height: size)
    }

    @ViewBuilder
    private func layer(_ path: CheddarIconPath) -> some View {
        let shape = CDSIconShape(segments: path.segments)
        switch path.style {
        case let .fill(evenOdd, opacity):
            shape
                .fill(style: FillStyle(eoFill: evenOdd))
                .opacity(opacity)
                .paint(paint(for: path.role))
        case let .stroke(width):
            // Stroke widths are exported against the viewBox's width, so they scale with the
            // drawn width rather than the box.
            shape
                .stroke(style: StrokeStyle(
                    lineWidth: width * glyph.width,
                    lineCap: .round,
                    lineJoin: .round
                ))
                .paint(paint(for: path.role))
        }
    }

    /// `nil` leaves the layer on the inherited foreground style, which is how the web's
    /// `currentColor` behaves for the mono tone.
    private func paint(for role: CheddarIconRole) -> Color? {
        switch (tone, role) {
        case (.mono, .primary): nil
        case (.mono, .secondary): knockoutOverride ?? environmentKnockout
        case (.brand, .primary): palette.iconPrimary
        case (.brand, .secondary): palette.iconSecondary
        }
    }
}

extension CheddarIconName {
    /// The glyph's authored width over its height.
    ///
    /// The Swift export normalises every path into a unit square, which flattens the eight
    /// glyphs the library does not draw square. Their proportions are restored here until
    /// the generator carries the viewBox through.
    var aspectRatio: CGFloat {
        switch self {
        case .learn: 18 / 24
        case .wallet: 24 / 22
        case .caretLeft, .caretRight: 9.64081 / 17.4
        case .caretDown: 17.4 / 9.64081
        case .notification, .guide: 20 / 24
        case .chart: 23.3913 / 20
        default: 1
        }
    }
}

private struct CDSIconShape: Shape {
    let segments: [CheddarIconSegment]

    func path(in rect: CGRect) -> Path {
        var path = Path()
        func point(_ x: CGFloat, _ y: CGFloat) -> CGPoint {
            CGPoint(x: rect.minX + x * rect.width, y: rect.minY + y * rect.height)
        }
        for segment in segments {
            switch segment {
            case let .move(x, y):
                path.move(to: point(x, y))
            case let .line(x, y):
                path.addLine(to: point(x, y))
            case let .curve(x1, y1, x2, y2, x, y):
                path.addCurve(to: point(x, y), control1: point(x1, y1), control2: point(x2, y2))
            case .close:
                path.closeSubpath()
            }
        }
        return path
    }
}

private extension View {
    @ViewBuilder
    func paint(_ color: Color?) -> some View {
        if let color {
            foregroundStyle(color)
        } else {
            self
        }
    }
}
