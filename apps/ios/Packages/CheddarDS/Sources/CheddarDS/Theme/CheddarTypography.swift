import SwiftUI
import UIKit

public extension CheddarTextStyle {
    /// Letter spacing for the display styles. The design system expresses tracking in `em`,
    /// which the Swift token export drops, so resolve it back to points here.
    var tracking: CGFloat {
        if self == CheddarType.displayMedium { return size * -0.03 }
        let widelyTracked = [
            CheddarType.displayXlarge,
            CheddarType.displayLarge,
            CheddarType.displaySmall,
            CheddarType.displayXsmall,
        ]
        return widelyTracked.contains(self) ? size * -0.04 : 0
    }
}

/// Applies one of the design system's type presets — face, size, weight, tracking and
/// leading together, the way `font: var(--cds-type-*)` does on the web.
public struct CheddarTypeModifier: ViewModifier {
    let style: CheddarTextStyle
    /// The CSS `line-height`, in points, for the few places the app sets its own: the
    /// landing headline is set solid, the article body runs looser.
    let lineHeight: CGFloat?

    public func body(content: Content) -> some View {
        // The bundled faces are retuned to the ramp's own leading (see `sync-ios-fonts`), so
        // a line box is already the right height and only the looser styles — `heading`, the
        // article body — have anything left to add. SwiftUI ignores a negative `lineSpacing`,
        // which is why the tightening cannot happen here.
        let extra = (lineHeight ?? style.lineHeight) - CheddarFonts.uiFont(for: style).lineHeight
        return content
            .font(CheddarFonts.font(for: style))
            .tracking(style.tracking)
            .lineSpacing(max(0, extra))
    }
}

public extension View {
    /// - Parameter lineHeight: Overrides the preset's leading, in points.
    func cdsType(_ style: CheddarTextStyle, lineHeight: CGFloat? = nil) -> some View {
        modifier(CheddarTypeModifier(style: style, lineHeight: lineHeight))
    }
}

public extension Text {
    /// The `Text`-returning form, for the cases that need to concatenate runs — the
    /// notification body's bolded category, or the goal readout's smaller cents.
    func cdsFont(_ style: CheddarTextStyle) -> Text {
        font(CheddarFonts.font(for: style)).tracking(style.tracking)
    }
}
