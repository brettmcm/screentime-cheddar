import SwiftUI

public enum CDSButtonVariant {
    case primary
    case secondary
}

public enum CDSButtonSize {
    case large
    case medium
    case small
}

/// `Button` — the design system's primary action.
///
/// Large and medium are rounded rectangles at `corner-large`; only small is a pill. The
/// shared CSS rule starts every control at `corner-full` for the circular icon buttons and
/// then walks the two bigger sizes back, which is why the radius does not simply grow with
/// the size.
public struct CDSButton: View {
    @Environment(\.cheddarPalette) private var palette

    private let label: String
    private let variant: CDSButtonVariant
    private let size: CDSButtonSize
    private let icon: CheddarIconName?
    private let isEnabled: Bool
    private let action: () -> Void

    public init(
        _ label: String,
        variant: CDSButtonVariant = .primary,
        size: CDSButtonSize = .large,
        icon: CheddarIconName? = nil,
        isEnabled: Bool = true,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.variant = variant
        self.size = size
        self.icon = icon
        self.isEnabled = isEnabled
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: CheddarSpacing.gapS) {
                if let icon {
                    CDSIcon(icon, size: glyphSize, knockout: knockout)
                }
                Text(label)
            }
            .font(CheddarFonts.monaSans(size: fontSize, weight: .medium))
            .lineSpacing(fontSize * 0.3)
            .padding(.vertical, verticalPadding)
            .padding(.horizontal, horizontalPadding)
            .frame(maxWidth: .infinity)
            // `min-height` is on the border box, so it floors the padded label rather than
            // adding to it.
            .frame(minHeight: minHeight)
            .foregroundStyle(foreground)
            .cdsCard(background: background, border: border, radius: radius)
        }
        .buttonStyle(.plain)
        // `.disabled` fades the label a second time under the DS's own 0.4, which halved the
        // fill again and left the label all but invisible. The press is refused instead.
        .allowsHitTesting(isEnabled)
        // CSS fades the button as one composite: the label keeps its contrast against the
        // fill. Ungrouped, SwiftUI fades each layer on its own and the label washes out.
        .compositingGroup()
        .opacity(isEnabled ? 1 : 0.4)
    }

    /// `.btn-large` reserves a 144px floor on the web. Nothing in the app renders a
    /// standalone large button narrower than that, and the cards that do — the article
    /// action — release it, so the floor is left off here.
    private var minHeight: CGFloat { size == .large ? 66 : 0 }

    private var fontSize: CGFloat {
        size == .small ? CheddarSize.fontXs : CheddarSize.fontS
    }

    /// Off the icon scale: the DS sets the button's glyph in the label's own terms.
    private var glyphSize: CGFloat { size == .small ? 12 : 20 }

    private var verticalPadding: CGFloat {
        switch size {
        case .large: CheddarSpacing.l
        case .medium: CheddarSpacing.s
        case .small: CheddarSpacing.xs
        }
    }

    private var horizontalPadding: CGFloat {
        switch size {
        case .large: CheddarSpacing.xl
        case .medium: CheddarSpacing.l
        case .small: CheddarSpacing.m
        }
    }

    private var radius: CGFloat {
        size == .small ? CheddarSpacing.cornerFull : CheddarSpacing.cornerLarge
    }

    private var foreground: Color {
        switch variant {
        case .primary: palette.bgOnBrand
        case .secondary: palette.bgBrandSecondary
        }
    }

    /// A small secondary button is filled rather than open: with a transparent fill it
    /// vanished under the brand appearance, where the subtle brand tint is the canvas colour.
    private var background: Color {
        switch variant {
        case .primary: palette.foregroundBrandPrimary
        case .secondary: size == .small ? palette.bgBrandPrimary : .clear
        }
    }

    private var border: Color? {
        variant == .primary ? nil : palette.foregroundBrandPrimary
    }

    /// Two-tone glyphs knock their detail out to whatever the button sits on: the fill for a
    /// primary button or a filled small secondary, the canvas showing through an outlined one.
    private var knockout: Color {
        switch variant {
        case .primary: palette.foregroundBrandPrimary
        case .secondary: size == .small ? palette.bgBrandPrimary : palette.backgroundDefault
        }
    }
}

/// The action pair on `TotalSavingsCard` and `ProfileCard`. Border, label and icon all take
/// the card's own foreground, so the pair stays matched when the card flips from
/// dark-maroon-on-pink to pale-on-magenta.
public struct CDSCardActionButton: View {
    private let label: String
    private let icon: CheddarIconName
    private let knockout: Color
    private let fillsHeight: Bool
    private let action: () -> Void

    /// `fillsHeight` is the stretch a grid row gives its items: the savings card shares its
    /// leftover height out across its three rows, where the profile card centres them and
    /// leaves the pair at its own height.
    public init(
        _ label: String,
        icon: CheddarIconName,
        knockout: Color,
        fillsHeight: Bool = false,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.icon = icon
        self.knockout = knockout
        self.fillsHeight = fillsHeight
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: CheddarSpacing.gapS) {
                CDSIcon(icon, size: CheddarSpacing.iconLarge, knockout: knockout)
                Text(label)
            }
            .cdsType(CheddarType.bodyLarge)
            .frame(maxWidth: .infinity)
            .frame(minHeight: 66, maxHeight: fillsHeight ? .infinity : nil)
            .cdsCard(background: .clear, border: nil, radius: CheddarSpacing.cornerLarge)
            .overlay {
                RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous)
                    .strokeBorder(.foreground, lineWidth: CheddarSpacing.border)
            }
        }
        .buttonStyle(.plain)
    }
}
