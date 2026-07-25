import SwiftUI
import CheddarDS

struct GoalDetailView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var appState: AppState
    let goalID: String
    @State private var moneyMode: MoneyMovementMode?
    @State private var showReached = false

    var body: some View {
        Group {
            if let goal {
                ScrollView {
                    VStack(alignment: .leading, spacing: CheddarSpacing.l) {
                        CDSPageHeader(title: goal.name, showsBack: true) {
                            dismiss()
                        }

                        HStack(alignment: .firstTextBaseline, spacing: 4) {
                            // The web sets the cents smaller than the dollars.
                            let saved = AppState.splitCurrency(goal.saved)
                            HStack(alignment: .top, spacing: 0) {
                                Text(saved.dollars)
                                    .font(CheddarFonts.oswald(size: 64, weight: .semibold))
                                    .tracking(-2.5)
                                Text(saved.cents)
                                    .font(CheddarFonts.oswald(size: 28, weight: .semibold))
                                    .padding(.top, 6)
                            }
                            .foregroundStyle(CheddarColors.shell.foregroundPrimary)
                            Text("/ \(formatCurrency(goal.target))")
                                .font(CheddarFonts.oswald(size: 24, weight: .medium))
                                .foregroundStyle(CheddarColors.shell.foregroundSecondary)
                        }

                        CDSBrandIllustration(goal: goal, size: 280)
                            .frame(maxWidth: .infinity)

                        VStack(spacing: CheddarSpacing.xxs) {
                            GeometryReader { proxy in
                                ZStack(alignment: .leading) {
                                    Capsule().fill(CheddarColors.shell.borderDefault)
                                    Capsule()
                                        .fill(goal.accent)
                                        .frame(width: proxy.size.width * goal.progress)
                                }
                            }
                            .frame(height: 8)
                            HStack {
                                Text("\(Int(goal.progress * 100))% saved")
                                Spacer()
                                Text("\(formatCurrency(goal.remaining)) to go")
                            }
                            .font(CheddarFonts.monaSans(size: 14, weight: .medium))
                            .foregroundStyle(CheddarColors.shell.foregroundSecondary)
                        }

                        HStack(spacing: CheddarSpacing.xs) {
                            CDSButton("Deposit", variant: .secondary, icon: .receive) {
                                moneyMode = .deposit
                            }
                            CDSButton("Transfer", variant: .secondary, icon: .send) {
                                moneyMode = .transfer
                            }
                        }

                        CDSSectionHeader(title: "Recent activity", actionTitle: "")
                        if goalActivities.isEmpty {
                            Text("No activity yet")
                                .font(CheddarFonts.monaSans(size: 14, weight: .medium))
                                .foregroundStyle(CheddarColors.shell.foregroundSecondary)
                                .frame(maxWidth: .infinity)
                                .padding(CheddarSpacing.xl)
                                .background(CheddarColors.surface.backgroundSurface)
                                .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge))
                        } else {
                            CDSActivityFeedCard {
                                ForEach(goalActivities) { item in
                                    CDSActivityItem(
                                        type: item.type,
                                        time: item.timestamp,
                                        amount: NSDecimalNumber(decimal: item.amount).stringValue
                                    )
                                }
                            }
                        }
                    }
                    .padding(CheddarSpacing.l)
                }
            } else {
                ContentUnavailableView(
                    "Goal unavailable",
                    systemImage: "target",
                    description: Text("This goal may have been removed.")
                )
            }
        }
        .background(CheddarColors.shell.backgroundDefault)
        .sheet(item: $moneyMode) { mode in
            MoneyMovementSheet(mode: mode, goalID: goalID) { _, reached in
                if reached {
                    Task {
                        try? await Task.sleep(for: .milliseconds(350))
                        showReached = true
                    }
                }
            }
            .environmentObject(appState)
        }
        .fullScreenCover(isPresented: $showReached) {
            if let completed = appState.goal(id: goalID) {
                GoalReachedView(goal: completed) {
                    showReached = false
                    dismiss()
                }
            }
        }
    }

    private var goal: CDSGoal? {
        appState.goal(id: goalID)
    }

    private var goalActivities: [AppActivity] {
        appState.activities(for: goalID)
    }

    private func formatCurrency(_ value: Decimal) -> String {
        String(format: "$%.2f", NSDecimalNumber(decimal: value).doubleValue)
    }
}
