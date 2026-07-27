import SwiftUI

/// Card chrome — a fill, a hairline border and a corner radius applied together.
///
/// Every card in the design system is the same three declarations over a different fill, so
/// they share one modifier rather than each re-stating `background` + `overlay(stroke)` +
/// `clipShape` and drifting apart.
private struct CDSCardChrome: ViewModifier {
    let background: Color
    let border: Color?
    let radius: CGFloat

    func body(content: Content) -> some View {
        content
            .background(background)
            .clipShape(RoundedRectangle(cornerRadius: radius, style: .continuous))
            .overlay {
                if let border {
                    RoundedRectangle(cornerRadius: radius, style: .continuous)
                        .strokeBorder(border, lineWidth: CheddarSpacing.border)
                }
            }
    }
}

public extension View {
    func cdsCard(
        background: Color,
        border: Color? = nil,
        radius: CGFloat = CheddarSpacing.cornerLarge
    ) -> some View {
        modifier(CDSCardChrome(background: background, border: border, radius: radius))
    }

    /// `--cds-shadow-surface`. The branded shell throws a longer, softer shadow than the
    /// light scheme does, so the offset comes from the mode rather than being fixed.
    func cdsShadowSurface() -> some View {
        modifier(CDSSurfaceShadow())
    }

    /// `--cds-shadow-control-raised`, the lift under the slider thumb.
    func cdsShadowControlRaised() -> some View {
        modifier(CDSControlShadow(radius: 12, y: 4))
    }

    /// `--cds-shadow-control`, the hairline lift under a switch thumb.
    func cdsShadowControl() -> some View {
        modifier(CDSControlShadow(radius: 2, y: 1))
    }
}

private struct CDSSurfaceShadow: ViewModifier {
    @Environment(\.cheddarTheme) private var theme
    @Environment(\.cheddarPalette) private var palette

    func body(content: Content) -> some View {
        let isShell = theme.mode == .dark
        return content.shadow(
            color: palette.shadowSurface,
            radius: (isShell ? 30 : 24) / 2,
            y: isShell ? 12 : 8
        )
    }
}

private struct CDSControlShadow: ViewModifier {
    @Environment(\.cheddarPalette) private var palette
    let radius: CGFloat
    let y: CGFloat

    func body(content: Content) -> some View {
        content.shadow(color: palette.shadowControl, radius: radius / 2, y: y)
    }
}

/// The design system's `.panel` — a plain light island the app composes onto when a shape
/// has no card component of its own. The activity feed is the product's only use.
///
/// It is one of the DS `SURFACE_SELECTORS`, so it re-scopes its subtree to the light palette:
/// the rows nested inside it read light tokens even on the branded canvas.
public struct CDSPanel<Content: View>: View {
    @Environment(\.cheddarTheme) private var theme

    private let spacing: CGFloat
    private let content: Content

    public init(spacing: CGFloat = 12, @ViewBuilder content: () -> Content) {
        self.spacing = spacing
        self.content = content()
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: spacing) {
            content
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(CheddarSpacing.m)
        .foregroundStyle(theme.island.foregroundPrimary)
        .cdsCard(
            background: theme.island.backgroundSurface,
            border: theme.island.borderDefault
        )
        .cheddarIsland()
    }
}
