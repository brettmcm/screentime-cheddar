import SwiftUI

/// Draws a design system glyph from the generated `CheddarIcons` path data.
///
/// Most glyphs are two-tone: a filled silhouette with a detail knocked out of it
/// rather than drawn on top. The web does this with `--cds-icon-knockout`, which
/// each surface sets to its own background colour, so ``knockout`` means the same
/// thing here — pass the colour the icon is sitting on, or the detail will
/// disappear into the silhouette.
public struct CDSIcon: View {
    /// Mirrors the icon library's `Color` variant: `mono` inherits the
    /// surrounding foreground style, `brand` paints the glyph in the brand ramp.
    public enum Tone {
        case mono
        case brand
    }

    private let name: CheddarIconName
    private let size: CGFloat
    private let tone: Tone
    private let knockout: Color

    public init(
        _ name: CheddarIconName,
        size: CGFloat = 20,
        tone: Tone = .mono,
        knockout: Color = CheddarColors.surface.backgroundSurface
    ) {
        self.name = name
        self.size = size
        self.tone = tone
        self.knockout = knockout
    }

    public var body: some View {
        ZStack {
            ForEach(Array(CheddarIcons.paths(for: name).enumerated()), id: \.offset) { _, path in
                layer(path)
            }
        }
        .frame(width: size, height: size)
        .accessibilityHidden(true)
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
            shape
                .stroke(style: StrokeStyle(lineWidth: width * size, lineCap: .round, lineJoin: .round))
                .paint(paint(for: path.role))
        }
    }

    /// `nil` leaves the layer on the inherited foreground style, which is how the
    /// web's `currentColor` behaves for the mono tone.
    private func paint(for role: CheddarIconRole) -> Color? {
        switch (tone, role) {
        case (.mono, .primary): nil
        case (.mono, .secondary): knockout
        case (.brand, .primary): CheddarColors.brand200
        case (.brand, .secondary): CheddarColors.brand400
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
