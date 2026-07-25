import Foundation
import CheddarDS

enum DemoData {
    static let userName = "Jamie"
    static let totalSavings = "$194.70"

    /// Mirrors `spendingCategories` in the web app's `state/data.ts`; the panel derives the
    /// total and each segment's share from these amounts.
    static let spendingSegments: [CDSSpendingSegment] = [
        .init(label: "Trips", amount: 212.20, accent: .green),
        .init(label: "Entertainment", amount: 56.10, accent: .blue),
        .init(label: "Food", amount: 29.34, accent: .magenta),
        .init(label: "Clothes", amount: 27.24, accent: .purple),
    ]

    static var goals: [CDSGoal] = [
        CDSGoal(
            id: "headphones",
            name: "Headphones",
            target: 280,
            saved: 76.5,
            accent: CheddarColors.brand300,
            imageAsset: "goal-headphones",
            iconName: "headphones"
        ),
        CDSGoal(
            id: "sneakers",
            name: "Sneakers",
            target: 120,
            saved: 100,
            accent: CheddarColors.purple300,
            imageAsset: "goal-sneakers",
            iconName: "shoe.fill"
        ),
        CDSGoal(
            id: "trip",
            name: "Freshman Trip",
            target: 500,
            saved: 18.2,
            accent: CheddarColors.green300,
            imageAsset: "goal-goggles",
            iconName: "snowflake"
        ),
    ]

    static let streakDays: [CDSStreakDay] = [
        .init(label: "S", name: "Sunday", isComplete: true),
        .init(label: "M", name: "Monday", isComplete: true),
        .init(label: "T", name: "Tuesday", isComplete: true),
        .init(label: "W", name: "Wednesday", isComplete: false),
        .init(label: "T", name: "Thursday", isComplete: true),
        .init(label: "F", name: "Friday", isComplete: true),
        .init(label: "S", name: "Saturday", isComplete: false),
    ]

    struct Badge: Identifiable {
        let id: String
        let title: String
        let caption: String
        /// Percent complete, 0–100.
        let progress: Double
        let accent: CDSAccent
        let systemImage: String
    }

    static let badges: [Badge] = [
        .init(
            id: "finance-nerd",
            title: "Finance Nerd",
            caption: "8 of 10 Articles read",
            progress: 80,
            accent: .green,
            systemImage: "book.fill"
        ),
        .init(
            id: "double-down",
            title: "Double Down",
            caption: "1 of 2 goals this month",
            progress: 50,
            accent: .blue,
            systemImage: "bolt.fill"
        ),
    ]

    static let stackMasterTarget: Decimal = 500

    struct Account: Identifiable {
        let id: String
        let name: String
        let subtitle: String
        let amount: Decimal
        let meta: String
    }

    static let accounts: [Account] = [
        .init(
            id: "starter",
            name: "Starter Account",
            subtitle: "Checking ••••0999",
            amount: 1020.22,
            meta: "1 day ago"
        ),
    ]

    static let activities: [(CDSActivityType, String, String)] = [
        (.deposit, "Today, 1:34pm", "20.00"),
        (.deposit, "Today, 11:17am", "45.00"),
        (.withdrawal, "Mon, 8:22am", "13.75"),
        (.deposit, "Sat, 11:00am", "16.00"),
        (.withdrawal, "Thu, 1:15pm", "7.00"),
        (.deposit, "Wed, 9:02am", "25.00"),
        (.deposit, "Tue, 4:15pm", "32.00"),
    ]
}
