import CheddarDS
import Foundation

enum DemoData {
    static let goals: [Goal] = [
        Goal(id: "headphones", name: "Headphones", target: 280, saved: 76.5, illustration: .headphones, accent: .magenta),
        Goal(id: "sneakers", name: "Sneakers", target: 120, saved: 100, illustration: .sneakers, accent: .purple),
        Goal(id: "trip", name: "Freshman Trip", target: 500, saved: 18.2, illustration: .goggles, accent: .green),
    ]

    static let completedGoals: [Goal] = [
        Goal(id: "skateboard", name: "Skateboard", target: 120, saved: 120, illustration: .skateboard, accent: .magenta),
        Goal(id: "camera", name: "Camera", target: 260, saved: 260, illustration: .camera, accent: .blue),
    ]

    static let activities: [Activity] = [
        Activity(id: "a1", type: .deposit, amount: 20, time: "Today, 1:34pm", goalID: "sneakers"),
        Activity(id: "a2", type: .deposit, amount: 45, time: "Today, 11:17am", goalID: "headphones"),
        Activity(id: "a3", type: .withdrawal, amount: 13.75, time: "Mon, 8:22am"),
        Activity(id: "a4", type: .deposit, amount: 16, time: "Sat, 11:00am", goalID: "trip"),
        Activity(id: "a5", type: .withdrawal, amount: 7, time: "Thu, 1:15pm"),
    ]

    static let spendingCategories: [SpendingCategory] = [
        SpendingCategory(label: "Trips", amount: 212.2, accent: .green),
        SpendingCategory(label: "Entertainment", amount: 56.1, accent: .blue),
        SpendingCategory(label: "Food", amount: 29.34, accent: .magenta),
        SpendingCategory(label: "Clothes", amount: 27.24, accent: .purple),
    ]

    static let streakDays: [CDSStreakDay] = [
        CDSStreakDay(label: "S", name: "Sunday", isComplete: true),
        CDSStreakDay(label: "M", name: "Monday", isComplete: true),
        CDSStreakDay(label: "T", name: "Tuesday", isComplete: true),
        CDSStreakDay(label: "W", name: "Wednesday", isComplete: false),
        CDSStreakDay(label: "T", name: "Thursday", isComplete: true),
        CDSStreakDay(label: "F", name: "Friday", isComplete: true),
        CDSStreakDay(label: "S", name: "Saturday", isComplete: false),
    ]

    static let accounts: [Account] = [
        Account(
            id: "starter",
            name: "Starter Account",
            subtitle: "Checking ••••0999",
            amount: 1020.22,
            meta: "1 day ago"
        ),
    ]

    /// `Stack Master` tracks total savings, so its caption and progress are derived per
    /// render rather than stored here.
    static let staticBadges: [Badge] = [
        Badge(id: "finance-nerd", title: "Finance Nerd", caption: "8 of 10 Articles read", progress: 80, icon: .learn, accent: .green),
        Badge(id: "double-down", title: "Double Down", caption: "1 of 2 goals this month", progress: 50, icon: .piggybank, accent: .blue),
    ]

    static let stackMasterTarget: Decimal = 500

    static let featuredArticle = (
        title: "How to decide what to save for",
        description: "With so much noise, figure out what's actually worth saving and what you can let go of.",
        imageAsset: "article-piggy-bank.png",
        actionLabel: "Read more"
    )

    static let articles: [Article] = [
        Article(
            id: "savings-101",
            title: "Savings 101",
            description: "Learn how to get started with simple savings techniques.",
            readTime: "20 min",
            category: .guide,
            body: "Saving money is one of the most important financial skills you can develop. Start small — even $5 a week adds up over time. The key is consistency. Set up automatic transfers so you never forget. Think of saving as paying your future self first.",
            accent: .magenta
        ),
        Article(
            id: "investing",
            title: "Guide to Investing",
            description: "Investing can be hard — let's make it a little easier.",
            readTime: "20 min",
            category: .guide,
            body: "Investing is how your money grows over time. Start with index funds to spread your risk. Time in the market beats timing the market, and small amounts can grow through compound interest.",
            accent: .blue
        ),
        Article(
            id: "credit-card",
            title: "How to choose your first credit card",
            description: "Picking the right card for your lifestyle.",
            readTime: "5 min",
            category: .tip,
            body: "Look for cards with no annual fee and a low credit limit. Always pay your full balance each month to avoid interest charges.",
            accent: .green,
            imageAsset: "article-credit-card.png"
        ),
        Article(
            id: "emergency-fund",
            title: "The importance of an emergency fund",
            description: "Why you need one and how to build it.",
            readTime: "5 min",
            category: .tip,
            body: "An emergency fund is your financial safety net. Aim for three to six months of living expenses and reserve it for genuine emergencies.",
            accent: .purple,
            imageAsset: "article-emergency-fund.png"
        ),
        Article(
            id: "cut-expenses",
            title: "Cut expenses without cutting joy",
            description: "Small changes, big savings.",
            readTime: "5 min",
            category: .tip,
            body: "You don't have to give up everything you love. Track spending, cancel subscriptions you do not use, and look for free activities.",
            accent: .magenta,
            imageAsset: "article-expenses.png"
        ),
        Article(
            id: "budget-rule",
            title: "Save more with the 50/30/20 rule",
            description: "A simple budgeting framework.",
            readTime: "5 min",
            category: .tip,
            body: "Spend 50% on needs, 30% on wants, and save 20%. Adjust the percentages to fit your life — the important thing is having a system.",
            accent: .blue,
            imageAsset: "article-budgeting.png"
        ),
        Article(
            id: "first-card-story",
            title: "How I handled my first credit card",
            description: "A real story from a real teen.",
            readTime: "5 min",
            category: .story,
            body: "I made every mistake with my first card. Now I know: pay in full every month, with no exceptions. Your future self will thank you.",
            accent: .green,
            imageAsset: "article-customer-story.jpg"
        ),
        Article(
            id: "friends-saving",
            title: "Friends who started saving together",
            description: "Community savings stories.",
            readTime: "7 min",
            category: .story,
            body: "My friends and I started a savings challenge together. Accountability made all the difference, and six months later we all reached our goals.",
            accent: .purple,
            imageAsset: "article-community-story.jpg"
        ),
    ]
}
