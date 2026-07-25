import SwiftUI

public enum CDSNotificationVariant {
    case standard
    case trend
    case opportunity

    var title: String {
        switch self {
        case .standard: "Nice!"
        case .trend: "New trend"
        case .opportunity: "Watch out!"
        }
    }

    /// The trend copy highlights the category, so it is assembled rather than a plain string.
    var defaultMessage: Text {
        switch self {
        case .standard:
            Text("You’re saving 20% more than you usually are by this point each month.")
        case .trend:
            Text("You’re spending more on ")
                + Text("Travel").font(CheddarFonts.font(for: CheddarType.bodyMediumStrong))
                + Text(" this month than you usually do.")
        case .opportunity:
            Text("You’re spending 35% more than you usually are by this point each month.")
        }
    }
}

/// One of the surfaces the design system pins to the light palette, so it reads as a light
/// island on the branded canvas rather than a tinted panel.
public struct CDSNotification<Illustration: View>: View {
    private let variant: CDSNotificationVariant
    private let title: String?
    private let message: Text?
    private let linkLabel: String
    private let illustration: Illustration
    private var onDismiss: (() -> Void)?
    private var onLinkTapped: (() -> Void)?

    public init(
        variant: CDSNotificationVariant,
        title: String? = nil,
        message: Text? = nil,
        linkLabel: String = "Learn more",
        onDismiss: (() -> Void)? = nil,
        onLinkTapped: (() -> Void)? = nil,
        @ViewBuilder illustration: () -> Illustration
    ) {
        self.variant = variant
        self.title = title
        self.message = message
        self.linkLabel = linkLabel
        self.onDismiss = onDismiss
        self.onLinkTapped = onLinkTapped
        self.illustration = illustration()
    }

    public var body: some View {
        HStack(alignment: .top, spacing: CheddarSpacing.m) {
            illustration
                .aspectRatio(contentMode: .fit)
                .frame(width: 72, height: 72)
                .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium, style: .continuous))

            VStack(alignment: .leading, spacing: CheddarSpacing.xxs) {
                Text(title ?? variant.title)
                    .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
                    .foregroundStyle(CheddarColors.surface.foregroundPrimary)

                (message ?? variant.defaultMessage)
                    .font(CheddarFonts.font(for: CheddarType.bodyMedium))
                    .foregroundStyle(CheddarColors.surface.foregroundSecondary)

                if let onLinkTapped {
                    Button(action: onLinkTapped) {
                        HStack(spacing: 2) {
                            Text(linkLabel)
                            Image(systemName: "chevron.right")
                                .font(.system(size: 10, weight: .semibold))
                        }
                        .font(CheddarFonts.font(for: CheddarType.bodyMediumStrong))
                        .foregroundStyle(CheddarColors.surface.foregroundBrandPrimary)
                    }
                    .buttonStyle(.plain)
                }
            }

            Spacer(minLength: 0)

            if let onDismiss {
                Button(action: onDismiss) {
                    Image(systemName: "xmark")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundStyle(CheddarColors.surface.foregroundSecondary)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Dismiss")
            }
        }
        .padding(CheddarSpacing.m)
        .background(CheddarColors.surface.bgBrandPrimary)
        .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous)
                .stroke(CheddarColors.surface.borderDefault, lineWidth: 1)
        }
    }
}

public extension CDSNotification where Illustration == CDSResourceImage {
    /// The trend variant ships its illustration with the design system.
    init(
        variant: CDSNotificationVariant = .trend,
        onDismiss: (() -> Void)? = nil,
        onLinkTapped: (() -> Void)? = nil
    ) {
        self.init(
            variant: variant,
            onDismiss: onDismiss,
            onLinkTapped: onLinkTapped
        ) {
            CDSResourceImage("trend-chart.png")
        }
    }
}
