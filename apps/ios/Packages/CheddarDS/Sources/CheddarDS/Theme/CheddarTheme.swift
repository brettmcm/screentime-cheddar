import SwiftUI

/// How a brand is presented, mirroring the web app's `Mode`.
///
/// `dark` is the design system's `appearance="brand"` shell — a saturated brand-100 canvas
/// carrying light cards — and *not* the `data-theme="dark"` layer, which the product never
/// uses. `light` is the ordinary light scheme with the same brand accents.
public enum CheddarMode: String, CaseIterable, Sendable, Identifiable {
    case light
    case dark

    public var id: String { rawValue }
}

/// The active brand ramp, resolved per brand.
///
/// `CheddarTokens.ramp(_:)` cannot be used: the generated switch returns the magenta ramp for
/// all four brands. The primitives it should have returned are correct, so read those instead.
public struct CheddarRamp: Equatable, Sendable {
    public let step100: Color
    public let step200: Color
    public let step300: Color
    public let step400: Color
    public let step500: Color
    public let step600: Color

    static func forBrand(_ brand: CheddarBrand) -> CheddarRamp {
        switch brand {
        case .magenta:
            CheddarRamp(
                step100: CheddarPrimitives.brand100.color,
                step200: CheddarPrimitives.brand200.color,
                step300: CheddarPrimitives.brand300.color,
                step400: CheddarPrimitives.brand400.color,
                step500: CheddarPrimitives.brand500.color,
                step600: CheddarPrimitives.brand600.color
            )
        case .blue:
            CheddarRamp(
                step100: CheddarPrimitives.blue100.color,
                step200: CheddarPrimitives.blue200.color,
                step300: CheddarPrimitives.blue300.color,
                step400: CheddarPrimitives.blue400.color,
                step500: CheddarPrimitives.blue500.color,
                step600: CheddarPrimitives.blue600.color
            )
        case .green:
            CheddarRamp(
                step100: CheddarPrimitives.green100.color,
                step200: CheddarPrimitives.green200.color,
                step300: CheddarPrimitives.green300.color,
                step400: CheddarPrimitives.green400.color,
                step500: CheddarPrimitives.green500.color,
                step600: CheddarPrimitives.green600.color
            )
        case .purple:
            CheddarRamp(
                step100: CheddarPrimitives.purple100.color,
                step200: CheddarPrimitives.purple200.color,
                step300: CheddarPrimitives.purple300.color,
                step400: CheddarPrimitives.purple400.color,
                step500: CheddarPrimitives.purple500.color,
                step600: CheddarPrimitives.purple600.color
            )
        }
    }
}

/// A brand and the way it is presented — the Swift equivalent of the web's `ThemeScope`.
///
/// The design system resolves colour in two layers, and so does this. ``canvas`` is the shell
/// the screen is painted on; ``island`` is the light palette the DS pins onto the cards and
/// panels that float on it (`SURFACE_SELECTORS` and `PINNED_LIGHT_SELECTORS` in the token
/// build). Under `light` the two coincide, which is exactly how the CSS behaves.
public struct CheddarTheme: Equatable, Sendable {
    public var brand: CheddarBrand
    public var mode: CheddarMode

    public init(brand: CheddarBrand = .magenta, mode: CheddarMode = .dark) {
        self.brand = brand
        self.mode = mode
    }

    /// The token layer the canvas resolves against.
    public var canvasAppearance: CheddarAppearance {
        mode == .dark ? .brand : .light
    }

    public var canvas: CheddarPalette {
        CheddarPalette(
            CheddarTokens.semantic(appearance: canvasAppearance, brand: brand),
            ramp: ramp
        )
    }

    /// Light islands sitting on the canvas. Always the light layer, whatever the mode.
    public var island: CheddarPalette {
        CheddarPalette(CheddarTokens.semantic(appearance: .light, brand: brand), ramp: ramp)
    }

    public var ramp: CheddarRamp { CheddarRamp.forBrand(brand) }

    /// SwiftUI's own light/dark signal, so system-drawn chrome matches the canvas.
    public var colorScheme: ColorScheme { mode == .dark ? .dark : .light }
}

// MARK: - Environment

private struct CheddarThemeKey: EnvironmentKey {
    static let defaultValue = CheddarTheme()
}

private struct CheddarPaletteKey: EnvironmentKey {
    static let defaultValue = CheddarTheme().canvas
}

private struct CheddarIconKnockoutKey: EnvironmentKey {
    static let defaultValue = CheddarTheme().canvas.backgroundDefault
}

private struct CheddarSafeBottomKey: EnvironmentKey {
    static let defaultValue: CGFloat = 0
}

public extension EnvironmentValues {
    /// The brand and mode in force. Read this when a view needs to re-resolve a palette
    /// itself — a card that pins to the light layer, say.
    var cheddarTheme: CheddarTheme {
        get { self[CheddarThemeKey.self] }
        set { self[CheddarThemeKey.self] = newValue }
    }

    /// The palette for the surface this view is drawn on. Everything visual reads from here.
    var cheddarPalette: CheddarPalette {
        get { self[CheddarPaletteKey.self] }
        set { self[CheddarPaletteKey.self] = newValue }
    }

    /// The colour a two-tone glyph knocks its detail out in — the DS `--cds-icon-knockout`.
    /// Set it to whatever the icon is actually sitting on, or the detail vanishes into the
    /// silhouette.
    var cheddarIconKnockout: Color {
        get { self[CheddarIconKnockoutKey.self] }
        set { self[CheddarIconKnockoutKey.self] = newValue }
    }

    /// The DS's stand-in for `env(safe-area-inset-bottom)`, which the bottom sheet adds to its
    /// own padding on the web. A view that reaches the bottom edge of the screen cannot read
    /// the real inset when the app frame has already waived it, so the host passes it down.
    var cheddarSafeBottom: CGFloat {
        get { self[CheddarSafeBottomKey.self] }
        set { self[CheddarSafeBottomKey.self] = newValue }
    }
}

public extension View {
    /// Applies a theme and paints the subtree on its canvas palette.
    func cheddarTheme(_ theme: CheddarTheme) -> some View {
        environment(\.cheddarTheme, theme)
            .environment(\.cheddarPalette, theme.canvas)
            .environment(\.cheddarIconKnockout, theme.canvas.backgroundDefault)
    }

    func cheddarTheme(brand: CheddarBrand, mode: CheddarMode) -> some View {
        cheddarTheme(CheddarTheme(brand: brand, mode: mode))
    }

    /// Re-scopes the subtree to the light island palette — the DS surface layer. Cards and
    /// panels that stay white on the branded canvas apply this to everything inside them.
    func cheddarIsland() -> some View {
        modifier(CheddarIslandModifier())
    }

    func cheddarIconKnockout(_ color: Color) -> some View {
        environment(\.cheddarIconKnockout, color)
    }
}

private struct CheddarIslandModifier: ViewModifier {
    @Environment(\.cheddarTheme) private var theme

    func body(content: Content) -> some View {
        content
            .environment(\.cheddarPalette, theme.island)
            .environment(\.cheddarIconKnockout, theme.island.backgroundSurface)
    }
}
