import CheddarDS
import SwiftUI

struct GoalDetailScreen: View {
    @EnvironmentObject private var app: AppState
    @Environment(\.cheddarPalette) private var palette

    @State private var moneyMode: MoneySheetMode?

    var body: some View {
        if let goal = app.goal(id: app.selectedGoalID) {
            ZStack {
                detail(for: goal)
                if let moneyMode {
                    MoneySheet(mode: moneyMode, fixedGoalID: goal.id) { self.moneyMode = nil }
                        .id(moneyMode)
                }
            }
            .animation(.easeOut(duration: 0.2), value: moneyMode)
            .onAppear { moneyMode = moneyMode ?? app.startMoneyMode }
        } else {
            AppScreen {
                CDSPageHeader("Goal unavailable", onBack: app.back)
            }
        }
    }

    private func detail(for goal: Goal) -> some View {
        AppScreen(fillsViewport: true) {
            CDSPageHeader(goal.name, onBack: app.back)

            price(for: goal)

            CDSBrandIllustration {
                CDSResourceImage(goal.illustration.asset).scaledToFit()
            }
            .frame(maxWidth: .infinity)

            HStack(spacing: CheddarSpacing.gapS) {
                CDSButton("Deposit", variant: .secondary, icon: .receive) { moneyMode = .deposit }
                CDSButton("Transfer", variant: .secondary, icon: .send) { moneyMode = .transfer }
            }

            CDSSectionHeader("Recent activity")
            ActivityFeed(goalID: goal.id)
        }
    }

    /// Figma composes the saved-of-target readout from text, not a component: the amount at
    /// display-large with smaller cents, the target beneath it.
    private func price(for goal: Goal) -> some View {
        let split = CDSCurrency.split(goal.saved)
        return VStack(alignment: .leading, spacing: CheddarSpacing.gapXs) {
            HStack(alignment: .top, spacing: 0) {
                Text(split.major).cdsType(CheddarType.displayLarge)
                Text(split.minor).cdsType(CheddarType.displayMedium)
            }

            Text("/ \(CDSCurrency.format(goal.target))")
        }
        .foregroundStyle(palette.foregroundBrandPrimary)
    }
}
