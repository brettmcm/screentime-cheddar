import SwiftUI

/// A resolved set of semantic colors, wrapping the design system's Swift token export
/// so call sites get SwiftUI `Color` values without reaching through `.color` each time.
///
/// A palette is one resolution of the token layers — a brand crossed with an appearance.
/// Views never build one; they read ``EnvironmentValues/cheddarPalette``, which
/// ``CheddarTheme`` puts in place and ``View/cheddarIsland()`` re-scopes.
public struct CheddarPalette: Equatable, Sendable {
    private let tokens: CheddarTokens.Semantic

    /// The active brand ramp. The web exposes this as `--cds-color-brand-100…600`; a few
    /// components paint straight off it rather than through a semantic alias.
    public let ramp: CheddarRamp

    init(_ tokens: CheddarTokens.Semantic, ramp: CheddarRamp) {
        self.tokens = tokens
        self.ramp = ramp
    }

    public var foregroundPrimary: Color { tokens.foregroundPrimary.color }
    public var foregroundSecondary: Color { tokens.foregroundSecondary.color }
    public var foregroundTertiary: Color { tokens.foregroundTertiary.color }

    public var foregroundOnSurface: Color { tokens.foregroundOnSurface.color }
    public var foregroundOnSurfaceSecondary: Color { tokens.foregroundOnSurfaceSecondary.color }
    public var foregroundOnSurfaceTertiary: Color { tokens.foregroundOnSurfaceTertiary.color }

    public var foregroundBrandPrimary: Color { tokens.foregroundBrandPrimary.color }
    public var foregroundBrandSecondary: Color { tokens.foregroundBrandSecondary.color }
    public var foregroundBrandTertiary: Color { tokens.foregroundBrandTertiary.color }
    public var foregroundBrandHighlight: Color { tokens.foregroundBrandHighlight.color }

    public var foregroundBrandReverse: Color { tokens.foregroundBrandReverse.color }
    public var foregroundBrandReverseSecondary: Color { tokens.foregroundBrandReverseSecondary.color }
    public var foregroundBrandReverseTertiary: Color { tokens.foregroundBrandReverseTertiary.color }
    public var foregroundOnReverse: Color { tokens.foregroundOnReverse.color }
    public var foregroundOnReverseSecondary: Color { tokens.foregroundOnReverseSecondary.color }

    public var foregroundDanger: Color { tokens.foregroundDanger.color }
    public var foregroundSuccess: Color { tokens.foregroundSuccess.color }
    public var foregroundWarning: Color { tokens.foregroundWarning.color }

    public var backgroundDefault: Color { tokens.backgroundDefault.color }
    public var backgroundSurface: Color { tokens.backgroundSurface.color }
    public var backgroundMuted: Color { tokens.backgroundMuted.color }
    public var backgroundOverlay: Color { tokens.backgroundOverlay.color }

    public var bgBrandPrimary: Color { tokens.bgBrandPrimary.color }
    public var bgBrandSecondary: Color { tokens.bgBrandSecondary.color }
    public var bgBrandTertiary: Color { tokens.bgBrandTertiary.color }
    public var bgBrandShade: Color { tokens.bgBrandShade.color }
    public var bgOnBrand: Color { tokens.bgOnBrand.color }
    public var bgDanger: Color { tokens.bgDanger.color }
    public var bgScrim: Color { tokens.bgScrim.color }

    public var borderDefault: Color { tokens.borderDefault.color }
    public var borderStrong: Color { tokens.borderStrong.color }
    public var borderFocus: Color { tokens.borderFocus.color }
    public var borderDanger: Color { tokens.borderDanger.color }
    public var trackDefault: Color { tokens.trackDefault.color }

    public var iconPrimary: Color { tokens.iconPrimary.color }
    public var iconSecondary: Color { tokens.iconSecondary.color }

    public var shadowSurface: Color { tokens.shadowSurface.color }
    public var shadowControl: Color { tokens.shadowControl.color }
}

/// Raw primitives, for the handful of places the design system paints off the palette:
/// accent ramps, the notification illustration tiles, and the always-black tag label.
///
/// Anything themed should come from ``CheddarPalette`` instead — these do not react to the
/// active brand.
public enum CheddarColors {
    public static let black100 = CheddarPrimitives.black100.color
    public static let black200 = CheddarPrimitives.black200.color
    public static let black300 = CheddarPrimitives.black300.color
    public static let black400 = CheddarPrimitives.black400.color
    public static let black500 = CheddarPrimitives.black500.color
    public static let black600 = CheddarPrimitives.black600.color

    public static let white100 = CheddarPrimitives.white100.color
    public static let white200 = CheddarPrimitives.white200.color
    public static let white300 = CheddarPrimitives.white300.color
    public static let white400 = CheddarPrimitives.white400.color
    public static let white500 = CheddarPrimitives.white500.color
    public static let white600 = CheddarPrimitives.white600.color

    public static let cheddarBlackCherry = CheddarPrimitives.cheddarBlackCherry.color
    public static let cheddarOrange = CheddarPrimitives.cheddarOrange.color
}
