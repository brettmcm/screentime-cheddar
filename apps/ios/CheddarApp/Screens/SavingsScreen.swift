import CheddarDS
import SwiftUI

struct SavingsScreen: View {
    @EnvironmentObject private var app: AppState

    var body: some View {
        AppScreen(nav: true) {
            CDSPageHeader("Savings", showBack: false)

            CDSSpendingChartPanel(type: .pie, title: "Total savings", segments: segments) {
                CDSTag("Mar 2–Mar 29")
            }

            CDSNotification(
                variant: .opportunity,
                title: "Watch out!",
                message: Text("You're spending 35% more than you usually are by this point each month."),
                onLinkTap: { app.goTab(.learn) }
            )

            CDSSectionHeader("Your goals")
            CardStack {
                ForEach(app.goals) { goal in
                    CDSGoalCard(goal: goal.card) { app.push(.goalDetail, goalID: goal.id) }
                }
            }

            CDSSectionHeader("Completed goals")
            CardCarousel {
                ForEach(app.completedGoals) { goal in
                    CDSCompletedGoalCard(goal: goal.card) { app.push(.goalReached, goalID: goal.id) }
                }
            }
        }
    }

    private var segments: [CDSSpendingSegment] {
        DemoData.spendingCategories.map {
            CDSSpendingSegment(label: $0.label, amount: $0.amount, accent: $0.accent)
        }
    }
}

/// A horizontally scrolling row that bleeds to the frame edge so it reads as scrollable.
struct CardCarousel<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        ScrollView(.horizontal) {
            HStack(alignment: .top, spacing: CheddarSpacing.gapS) { content }
                .padding(.trailing, CheddarSpacing.l)
        }
        .scrollIndicators(.hidden)
        .padding(.trailing, -CheddarSpacing.l)
    }
}
