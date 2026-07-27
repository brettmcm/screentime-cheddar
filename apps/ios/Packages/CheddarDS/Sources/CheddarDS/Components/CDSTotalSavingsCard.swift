import SwiftUI

/// One of the paired actions along the bottom of `TotalSavingsCard` or `ProfileCard`.
public struct CDSCardAction: Identifiable {
    public let id = UUID()
    public let label: String
    public let icon: CheddarIconName
    public let action: () -> Void

    public init(label: String, icon: CheddarIconName, action: @escaping () -> Void) {
        self.label = label
        self.icon = icon
        self.action = action
    }
}

/// `TotalSavingsCard` — the balance hero on the home screen.
///
/// Unlike the goal cards this one follows the shell rather than pinning to light: it is a
/// brand-tinted panel, and its actions take the card's own foreground so the outline and
/// label stay matched when the card flips between the two appearances.
public struct CDSTotalSavingsCard: View {
    @Environment(\.cheddarPalette) private var palette

    private let label: String
    private let amount: Decimal
    private let showLogo: Bool
    private let actions: [CDSCardAction]

    public init(
        label: String = "Total savings",
        amount: Decimal,
        showLogo: Bool = false,
        actions: [CDSCardAction] = []
    ) {
        self.label = label
        self.amount = amount
        self.showLogo = showLogo
        self.actions = actions
    }

    /// `box-sizing: border-box`, so the card's floor covers its padding rather than sitting
    /// inside it. The border is an overlay here and costs the column nothing.
    private static let floor: CGFloat = 255

    public var body: some View {
        let split = CDSCurrency.split(amount)

        // A grid on the web, so the three rows share out the height the card's floor leaves
        // over rather than crowding the top of it.
        CDSStretchStack(spacing: CheddarSpacing.m, minHeight: Self.floor - 2 * CheddarSpacing.m) {
            HStack(alignment: .top, spacing: CheddarSpacing.gapS) {
                Text(label)
                    .cdsType(CheddarType.bodyLarge)
                Spacer(minLength: 0)
                if showLogo { logoBadge }
            }

            // The cents hang off the top of the figure rather than sharing its baseline.
            HStack(alignment: .top, spacing: 0) {
                Text(split.major).cdsType(CheddarType.displayLarge)
                Text(split.minor).cdsType(CheddarType.displayMedium)
            }
            .lineLimit(1)
            .minimumScaleFactor(0.7)

            if !actions.isEmpty {
                HStack(spacing: CheddarSpacing.xs) {
                    ForEach(actions) { action in
                        CDSCardActionButton(
                            action.label,
                            icon: action.icon,
                            knockout: palette.bgBrandSecondary,
                            fillsHeight: true,
                            action: action.action
                        )
                    }
                }
            }
        }
        .padding(CheddarSpacing.m)
        .frame(maxWidth: .infinity, alignment: .leading)
        .foregroundStyle(palette.foregroundBrandReverseSecondary)
        .cdsCard(background: palette.bgBrandSecondary, border: palette.borderDefault)
        .cheddarIconKnockout(palette.bgBrandSecondary)
    }

    private var logoBadge: some View {
        CDSLogoMark(height: 21)
            .frame(width: 50, height: 32)
            .foregroundStyle(palette.ramp.step100)
            .background(palette.ramp.step500)
            .clipShape(Capsule())
    }
}
