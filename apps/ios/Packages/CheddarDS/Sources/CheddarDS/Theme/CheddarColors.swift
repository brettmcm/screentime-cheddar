import SwiftUI

/// A resolved set of semantic colors, wrapping the design system's Swift token export
/// so call sites get SwiftUI `Color` values without reaching through `.color` each time.
public struct CheddarPalette {
    private let tokens: CheddarTokens.Semantic

    init(_ tokens: CheddarTokens.Semantic) {
        self.tokens = tokens
    }

    public var foregroundPrimary: Color { tokens.foregroundPrimary.color }
    public var foregroundSecondary: Color { tokens.foregroundSecondary.color }
    public var foregroundTertiary: Color { tokens.foregroundTertiary.color }

    public var foregroundOnSurface: Color { tokens.foregroundOnSurface.color }
    public var foregroundOnSurfaceSecondary: Color { tokens.foregroundOnSurfaceSecondary.color }

    public var foregroundBrandPrimary: Color { tokens.foregroundBrandPrimary.color }
    public var foregroundBrandSecondary: Color { tokens.foregroundBrandSecondary.color }
    public var foregroundBrandReverseSecondary: Color { tokens.foregroundBrandReverseSecondary.color }
    public var foregroundOnReverse: Color { tokens.foregroundOnReverse.color }
    public var foregroundOnReverseSecondary: Color { tokens.foregroundOnReverseSecondary.color }
    public var foregroundSuccess: Color { tokens.foregroundSuccess.color }

    public var backgroundDefault: Color { tokens.backgroundDefault.color }
    public var backgroundSurface: Color { tokens.backgroundSurface.color }
    public var backgroundMuted: Color { tokens.backgroundMuted.color }

    public var bgBrandPrimary: Color { tokens.bgBrandPrimary.color }
    public var bgBrandSecondary: Color { tokens.bgBrandSecondary.color }
    public var bgBrandTertiary: Color { tokens.bgBrandTertiary.color }
    public var bgBrandShade: Color { tokens.bgBrandShade.color }
    public var bgOnBrand: Color { tokens.bgOnBrand.color }

    public var borderDefault: Color { tokens.borderDefault.color }
    public var borderStrong: Color { tokens.borderStrong.color }
    public var trackDefault: Color { tokens.trackDefault.color }

    public var iconPrimary: Color { tokens.iconPrimary.color }
    public var iconSecondary: Color { tokens.iconSecondary.color }
}

/// Semantic colors for the app.
///
/// The design system renders the product in its `brand` appearance — a saturated brand-100
/// canvas — but pins a specific set of components to the light palette so they read as light
/// islands floating on that canvas (`SURFACE_SELECTORS` and `PINNED_LIGHT_SELECTORS` in the
/// DS token build). Mirror that split here: chrome and anything drawn straight on the canvas
/// reads from ``shell``, and the pinned cards read from ``surface``.
///
/// Pinned to ``surface``: goal card, chart panel, activity card, account card, goal summary
/// card, savings streak, badge card, completed goal card, search field, sheet, and the plain
/// article card. The large/media and small/flat article variants deliberately follow ``shell``.
public enum CheddarColors {
    /// The branded app shell — brand canvas, light type.
    public static let shell = CheddarPalette(CheddarTokens.semantic(appearance: .brand, brand: .magenta))

    /// Light islands sitting on the branded canvas.
    public static let surface = CheddarPalette(CheddarTokens.semantic(appearance: .light, brand: .magenta))

    /// Brand ramps come from `CheddarPrimitives` rather than `CheddarTokens.ramp(_:)`, because
    /// that resolver currently returns the magenta ramp for every brand.
    public static let brand100 = CheddarPrimitives.brand100.color
    public static let brand200 = CheddarPrimitives.brand200.color
    public static let brand300 = CheddarPrimitives.brand300.color
    public static let brand400 = CheddarPrimitives.brand400.color
    public static let brand500 = CheddarPrimitives.brand500.color
    public static let brand600 = CheddarPrimitives.brand600.color

    public static let green300 = CheddarPrimitives.green300.color
    public static let green400 = CheddarPrimitives.green400.color
    public static let green500 = CheddarPrimitives.green500.color

    public static let purple300 = CheddarPrimitives.purple300.color
    public static let purple400 = CheddarPrimitives.purple400.color
    public static let purple500 = CheddarPrimitives.purple500.color

    public static let blue300 = CheddarPrimitives.blue300.color
    public static let blue400 = CheddarPrimitives.blue400.color
    public static let blue500 = CheddarPrimitives.blue500.color

    public static let black100 = CheddarPrimitives.black100.color
    public static let black200 = CheddarPrimitives.black200.color
    public static let black300 = CheddarPrimitives.black300.color
    public static let black600 = CheddarPrimitives.black600.color

    public static let white100 = CheddarPrimitives.white100.color

    public static let cheddarBlackCherry = CheddarPrimitives.cheddarBlackCherry.color
    public static let cheddarOrange = CheddarPrimitives.cheddarOrange.color
}
