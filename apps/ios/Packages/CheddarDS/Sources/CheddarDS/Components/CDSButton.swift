import SwiftUI

public enum CDSButtonVariant {
    case primary
    case secondary
    /// The secondary treatment used on brand-tinted surfaces such as the profile card, where
    /// the design system reverses the outline and label against the light fill.
    case secondaryReverse
}

public enum CDSButtonSize {
    case large
    case medium
}

public struct CDSButton: View {
    let label: String
    var variant: CDSButtonVariant = .primary
    var size: CDSButtonSize = .large
    var icon: CheddarIconName?
    /// Only for glyphs the design system doesn't ship; prefer ``icon``.
    var systemImage: String?
    var isEnabled: Bool = true
    let action: () -> Void

    public init(
        _ label: String,
        variant: CDSButtonVariant = .primary,
        size: CDSButtonSize = .large,
        icon: CheddarIconName? = nil,
        systemImage: String? = nil,
        isEnabled: Bool = true,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.variant = variant
        self.size = size
        self.icon = icon
        self.systemImage = systemImage
        self.isEnabled = isEnabled
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: CheddarSpacing.xs) {
                if let icon {
                    CDSIcon(icon, knockout: knockout)
                } else if let systemImage {
                    Image(systemName: systemImage)
                        .font(.system(size: 15, weight: .semibold))
                }
                Text(label)
            }
            .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
            .frame(maxWidth: .infinity)
            .frame(minHeight: size == .large ? 66 : 44)
            .padding(.horizontal, size == .large ? CheddarSpacing.xl : CheddarSpacing.l)
            .foregroundStyle(foreground)
            .background(background)
            .overlay {
                if variant != .primary {
                    Capsule().stroke(border, lineWidth: 1)
                }
            }
            .clipShape(Capsule())
        }
        .disabled(!isEnabled)
        .opacity(isEnabled ? 1 : 0.4)
    }

    private var foreground: Color {
        switch variant {
        case .primary: CheddarColors.shell.bgOnBrand
        case .secondary: CheddarColors.shell.bgBrandSecondary
        case .secondaryReverse: CheddarColors.shell.foregroundOnReverse
        }
    }

    private var background: Color {
        variant == .primary ? CheddarColors.shell.foregroundBrandPrimary : .clear
    }

    private var border: Color {
        switch variant {
        case .primary: .clear
        case .secondary: CheddarColors.shell.foregroundBrandPrimary
        case .secondaryReverse: CheddarColors.shell.foregroundOnReverse
        }
    }

    /// Two-tone glyphs knock their detail out to whatever the button sits on: the
    /// fill for a primary button, the canvas showing through an outlined one.
    private var knockout: Color {
        switch variant {
        case .primary: CheddarColors.shell.foregroundBrandPrimary
        case .secondary: CheddarColors.shell.backgroundDefault
        case .secondaryReverse: CheddarColors.shell.bgBrandSecondary
        }
    }
}
