import SwiftUI
import CheddarDS

struct HomeView: View {
    @EnvironmentObject private var appState: AppState
    @State private var moneyMode: MoneyMovementMode?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: CheddarSpacing.l) {
                HStack {
                    CheddarTypography.heading("Hi, \(appState.firstName)")
                        .foregroundStyle(CheddarColors.shell.foregroundPrimary)
                    Spacer()
                    CDSAvatar(size: .medium)
                }

                CDSTotalSavingsCard(
                    balance: appState.totalSavingsText,
                    onDeposit: { moneyMode = .deposit },
                    onTransfer: { moneyMode = .transfer }
                )

                CDSSectionHeader(title: "Recent spending") {
                    appState.selectedTab = .wallet
                }
                CDSSpendingChartPanel(type: .segmented, segments: DemoData.spendingSegments)

                if appState.showTrendNotification {
                    CDSNotification(
                        variant: .trend,
                        onDismiss: {
                            withAnimation { appState.showTrendNotification = false }
                        },
                        onLinkTapped: {
                            appState.selectedTab = .learn
                        }
                    )
                }

                CDSSectionHeader(title: "Goals") {
                    appState.selectedTab = .wallet
                }
                VStack(spacing: CheddarSpacing.xs) {
                    ForEach(appState.goals) { goal in
                        Button {
                            appState.openGoal(goal)
                        } label: {
                            CDSGoalCard(goal: goal)
                        }
                        .buttonStyle(.plain)
                    }
                }

                CDSArticleFeatureCard {
                    appState.selectedTab = .learn
                }

                CDSSectionHeader(title: "Recent activity") {
                    appState.selectedTab = .wallet
                }
                CDSActivityFeedCard {
                    ForEach(appState.activities.prefix(5)) { item in
                        CDSActivityItem(
                            type: item.type,
                            time: item.timestamp,
                            amount: NSDecimalNumber(decimal: item.amount).stringValue
                        )
                    }
                }
            }
            .padding(.horizontal, CheddarSpacing.l)
            .padding(.vertical, CheddarSpacing.l)
        }
        .background(CheddarColors.shell.backgroundDefault)
        .sheet(item: $moneyMode) { mode in
            MoneyMovementSheet(mode: mode)
                .environmentObject(appState)
        }
    }
}
