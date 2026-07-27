import SwiftUI

public enum CDSNotificationVariant: Sendable {
    case `default`
    case trend
    case opportunity

    var title: String {
        switch self {
        case .default: "Nice!"
        case .trend: "New trend"
        case .opportunity: "Watch out!"
        }
    }

    var illustration: String {
        switch self {
        case .default: "notification-default.png"
        case .trend: "notification-trend.png"
        case .opportunity: "notification-opportunity.png"
        }
    }

    /// The trend copy emphasises the category, so it is assembled from runs rather than
    /// being a plain string.
    var message: Text {
        switch self {
        case .default:
            Text("You’re saving 20% more than you usually are by this point each month.")
        case .trend:
            Text("You’re spending more on ")
                + Text("Travel").cdsFont(CheddarType.bodyMediumStrong)
                + Text(" this month than you usually do.")
        case .opportunity:
            Text("You’re spending 35% more than you usually are by this point each month.")
        }
    }
}

/// `Notification` — an inline insight card with a dismiss control and a link.
///
/// The DS omits this from its surface list, so on the branded canvas it would inherit the
/// shell and paint white-on-white. The web app re-scopes it to the light island palette until
/// the library catches up; this does the same by applying the island directly.
public struct CDSNotification: View {
    @Environment(\.cheddarTheme) private var theme

    private let variant: CDSNotificationVariant
    private let title: String?
    private let message: Text?
    private let linkLabel: String
    private let showsDismiss: Bool
    private let onDismiss: (() -> Void)?
    private let onLinkTap: (() -> Void)?

    public init(
        variant: CDSNotificationVariant = .default,
        title: String? = nil,
        message: Text? = nil,
        linkLabel: String = "Learn more",
        showsDismiss: Bool = true,
        onDismiss: (() -> Void)? = nil,
        onLinkTap: (() -> Void)? = nil
    ) {
        self.variant = variant
        self.title = title
        self.message = message
        self.linkLabel = linkLabel
        self.showsDismiss = showsDismiss
        self.onDismiss = onDismiss
        self.onLinkTap = onLinkTap
    }

    public var body: some View {
        let palette = theme.island

        HStack(alignment: .center, spacing: CheddarSpacing.xs) {
            CDSResourceImage(variant.illustration)
                .scaledToFit()
                .frame(width: 80, height: 80)
                .accessibilityHidden(true)

            VStack(alignment: .leading, spacing: 2) {
                HStack(alignment: .center, spacing: CheddarSpacing.m) {
                    Text(title ?? variant.title)
                        .font(CheddarFonts.monaSans(size: CheddarSize.fontS, weight: .semibold))
                    Spacer(minLength: 0)
                    if showsDismiss {
                        CDSIconButton(
                            .x,
                            label: "Dismiss",
                            variant: .neutral,
                            size: .small,
                            action: { onDismiss?() }
                        )
                            // `.notification .icon-btn-neutral` swaps the muted fill for the
                            // scrim, which is the one place the neutral button is restyled.
                            .background(palette.bgScrim, in: Circle())
                    }
                }
                .frame(minHeight: 24)

                (message ?? variant.message)
                    .cdsFont(CheddarType.bodyMedium)
                    .fixedSize(horizontal: false, vertical: true)

                if let onLinkTap {
                    Button(action: onLinkTap) {
                        HStack(spacing: CheddarSpacing.gapS) {
                            Text(linkLabel)
                                .font(CheddarFonts.monaSans(size: CheddarSize.fontS, weight: .medium))
                            CDSIcon(.caretRight, size: 8.7)
                        }
                        .foregroundStyle(palette.foregroundBrandPrimary)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(CheddarSpacing.m)
        .frame(maxWidth: .infinity, alignment: .leading)
        .foregroundStyle(palette.foregroundPrimary)
        .cdsCard(background: palette.bgBrandPrimary, border: palette.borderDefault)
        .cheddarIsland()
    }
}
