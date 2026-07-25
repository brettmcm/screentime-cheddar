import SwiftUI
import CheddarDS

struct SavingsView: View {
    @EnvironmentObject private var appState: AppState
    @State private var reachedGoal: CDSGoal?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: CheddarSpacing.l) {
                CDSPageHeader(title: "Savings")

                CDSSpendingChartPanel(
                    type: .pie,
                    title: "Total savings",
                    segments: DemoData.spendingSegments
                ) {
                    CDSTag("Mar 2–Mar 29")
                }

                CDSNotification(
                    variant: .opportunity,
                    onLinkTapped: { appState.selectedTab = .learn }
                ) {
                    CDSResourceImage.app("watch-out")
                }

                CDSSectionHeader(title: "Your goals", actionTitle: "")
                ForEach(appState.goals) { goal in
                    Button {
                        appState.openGoal(goal)
                    } label: {
                        CDSGoalCard(goal: goal)
                    }
                    .buttonStyle(.plain)
                }

                if !appState.completedGoals.isEmpty {
                    CDSSectionHeader(title: "Completed goals", actionTitle: "")
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: CheddarSpacing.xs) {
                            ForEach(Array(appState.completedGoals.enumerated()), id: \.element.id) { index, goal in
                                completedCard(goal, index: index)
                            }
                        }
                    }
                }
            }
            .padding(CheddarSpacing.l)
        }
        .background(CheddarColors.shell.backgroundDefault)
        .sheet(item: $reachedGoal) { goal in
            GoalReachedView(goal: goal)
        }
    }

    private func completedCard(_ goal: CDSGoal, index: Int) -> some View {
        Button {
            reachedGoal = goal
        } label: {
            VStack(alignment: .leading, spacing: 0) {
                CDSResourceImage.app(completedImage(index))
                    .scaledToFit()
                    .frame(width: 159, height: 125)
                    .background(goal.accent)
                VStack(alignment: .leading, spacing: 2) {
                    Text(goal.name)
                        .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
                        .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
                    Text(AppState.currency(goal.target))
                        .font(CheddarFonts.font(for: CheddarType.bodyMedium))
                        .foregroundStyle(CheddarColors.surface.foregroundOnSurfaceSecondary)
                }
                .padding(CheddarSpacing.m)
            }
            .frame(width: 159)
            .background(CheddarColors.surface.backgroundSurface)
            .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge))
        }
        .buttonStyle(.plain)
    }

    private func completedImage(_ index: Int) -> String {
        ["completed-skateboard", "completed-camera", "completed-trip"][index % 3]
    }
}
