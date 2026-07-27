import SwiftUI

/// A display heading, set with the design system's own line breaking.
///
/// Two things separate this from a plain `Text` with `cdsType`. The headings that carry a
/// `max-width` break against that width without being held to it — see `CheddarSoftWrap` —
/// and the lines are laid out here rather than by `Text`, so a heading that runs long breaks
/// the same way on both platforms instead of at whatever width the card happens to offer.
public struct CDSDisplayText: View {
    private let text: String
    private let style: CheddarTextStyle
    private let lineHeight: CGFloat?
    private let wrapWidth: CGFloat?
    private let alignment: HorizontalAlignment

    /// - Parameters:
    ///   - lineHeight: Overrides the preset's leading, in points.
    ///   - wrapWidth: The `max-width` the line breaks are measured against. Without one the
    ///     text breaks only where it already carries a newline.
    public init(
        _ text: String,
        style: CheddarTextStyle,
        lineHeight: CGFloat? = nil,
        wrapWidth: CGFloat? = nil,
        alignment: HorizontalAlignment = .leading
    ) {
        self.text = text
        self.style = style
        self.lineHeight = lineHeight
        self.wrapWidth = wrapWidth
        self.alignment = alignment
    }

    private var lines: [String] {
        let source = wrapWidth.map { CheddarSoftWrap.wrap(text, style: style, maxWidth: $0) } ?? text
        return source.components(separatedBy: "\n")
    }

    public var body: some View {
        let leading = (lineHeight ?? style.lineHeight) - CheddarFonts.uiFont(for: style).lineHeight
        VStack(alignment: alignment, spacing: leading) {
            ForEach(Array(lines.enumerated()), id: \.offset) { _, line in
                Text(line)
                    .font(CheddarFonts.font(for: style))
                    .tracking(style.tracking)
                    .fixedSize()
            }
        }
        .accessibilityElement()
        .accessibilityLabel(text)
    }
}
