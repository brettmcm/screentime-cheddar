import CheddarDS
import SwiftUI

struct HomeScreen: View {
    @EnvironmentObject private var app: AppState

    @State private var moneyMode: MoneySheetMode?
    @State private var showsTrend = true

    var body: some View {
        ZStack {
            AppScreen(nav: true) {
                CDSPageHeader(app.profile.name.split(separator: " ").first.map { "Hi, \($0)" } ?? "Hi", showBack: false) {
                    CDSAvatar(size: .small, asset: "avatar-medium.png", name: app.profile.name)
                }

                CDSTotalSavingsCard(
                    amount: app.totalSavings,
                    showLogo: true,
                    actions: [
                        CDSCardAction(label: "Deposit", icon: .receive) { moneyMode = .deposit },
                        CDSCardAction(label: "Transfer", icon: .send) { moneyMode = .transfer },
                    ]
                )

                CDSSectionHeader("Recent spending") {
                    CDSTextLink("View all") { app.goTab(.savings) }
                }
                CDSSpendingChartPanel(type: .segmented, segments: segments)

                if showsTrend {
                    CDSNotification(
                        variant: .trend,
                        onDismiss: { showsTrend = false },
                        onLinkTap: { app.goTab(.learn) }
                    )
                }

                CDSSectionHeader("Goals") {
                    CDSTextLink("View all") { app.goTab(.savings) }
                }
                CardStack {
                    ForEach(app.goals) { goal in
                        CDSGoalCard(goal: goal.card) { app.push(.goalDetail, goalID: goal.id) }
                    }
                }

                CDSArticleCard(
                    size: .large,
                    title: DemoData.featuredArticle.title,
                    description: DemoData.featuredArticle.description,
                    imageAsset: DemoData.featuredArticle.imageAsset,
                    actionLabel: DemoData.featuredArticle.actionLabel,
                    onAction: { app.goTab(.learn) }
                )

                CDSSectionHeader("Recent activity") {
                    CDSTextLink("View all") { app.goTab(.savings) }
                }
                ActivityFeed(limit: 5)
            }

            if let moneyMode {
                MoneySheet(mode: moneyMode) { self.moneyMode = nil }
                    .id(moneyMode)
            }
        }
        .animation(.easeOut(duration: 0.2), value: moneyMode)
    }

    private var segments: [CDSSpendingSegment] {
        DemoData.spendingCategories.map {
            CDSSpendingSegment(label: $0.label, amount: $0.amount, accent: $0.accent)
        }
    }
}

/// The vertical card rhythm shared by the goal, badge and account lists.
struct CardStack<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        VStack(spacing: CheddarSpacing.gapS) { content }
    }
}
