import SwiftUI

/// `IconButton` — a circular control carrying a single glyph.
///
/// The size classes set the box outright rather than padding a glyph, because the DS box is
/// not a constant multiple of the icon: `neutral` and `outline` are 40pt at medium where
/// `primary` is 48pt, and `neutral` shrinks to 24pt at small where the others hold 32pt.
public struct CDSIconButton: View {
    public enum Variant {
        case primary
        case outline
        case neutral
        case ghost
    }

    public enum Size {
        case medium
        case small
    }

    @Environment(\.cheddarPalette) private var palette

    private let icon: CheddarIconName
    private let label: String
    private let variant: Variant
    private let size: Size
    private let action: () -> Void

    public init(
        _ icon: CheddarIconName,
        label: String,
        variant: Variant = .ghost,
        size: Size = .medium,
        action: @escaping () -> Void
    ) {
        self.icon = icon
        self.label = label
        self.variant = variant
        self.size = size
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            CDSIcon(icon, size: glyphSize, knockout: knockout)
                .frame(width: box, height: box)
                .foregroundStyle(foreground)
                .background(background)
                .clipShape(Circle())
                .overlay {
                    if variant == .outline {
                        Circle().strokeBorder(
                            palette.foregroundBrandPrimary,
                            lineWidth: CheddarSpacing.border
                        )
                    }
                }
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
    }

    private var box: CGFloat {
        switch (variant, size) {
        case (.primary, .medium), (.ghost, .medium): 48
        case (.outline, .medium), (.neutral, .medium): 40
        case (.neutral, .small): 24
        case (_, .small): 32
        }
    }

    private var glyphSize: CGFloat {
        box <= 24 ? CheddarSpacing.iconMedium : CheddarSpacing.iconLarge
    }

    private var foreground: Color {
        switch variant {
        case .primary: palette.bgOnBrand
        case .outline: palette.foregroundBrandPrimary
        case .neutral: palette.foregroundPrimary
        case .ghost: palette.foregroundSecondary
        }
    }

    private var background: Color {
        switch variant {
        case .primary: palette.foregroundBrandPrimary
        case .neutral: palette.backgroundMuted
        case .outline, .ghost: .clear
        }
    }

    private var knockout: Color {
        switch variant {
        case .primary: palette.foregroundBrandPrimary
        case .neutral: palette.backgroundMuted
        case .outline, .ghost: palette.backgroundDefault
        }
    }
}
