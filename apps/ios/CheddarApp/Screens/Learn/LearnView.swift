import SwiftUI
import CheddarDS

struct LearnView: View {
    @State private var search = ""
    @State private var selectedArticle: LearnArticle?

    var body: some View {
        Group {
            if let selectedArticle {
                articleDetail(selectedArticle)
            } else {
                articleList
            }
        }
        .background(CheddarColors.shell.backgroundDefault)
    }

    private var articleList: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: CheddarSpacing.l) {
                CDSPageHeader(title: "Learn")
                CDSSearchField(text: $search, placeholder: "Search anything")

                if !guides.isEmpty {
                    CDSSectionHeader(title: "Guides", actionTitle: "View all") {
                        search = ""
                    }
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: CheddarSpacing.xs) {
                            ForEach(guides) { article in
                                guideCard(article)
                            }
                        }
                    }
                }

                if !tips.isEmpty {
                    CDSSectionHeader(title: "Tips & Tricks", actionTitle: "View all") {
                        search = ""
                    }
                    LazyVGrid(
                        columns: [GridItem(.flexible()), GridItem(.flexible())],
                        spacing: CheddarSpacing.xs
                    ) {
                        ForEach(tips) { article in
                            smallArticleCard(article)
                        }
                    }
                }

                if !stories.isEmpty {
                    CDSSectionHeader(title: "Customer Stories", actionTitle: "View all") {
                        search = ""
                    }
                    HStack(alignment: .top, spacing: CheddarSpacing.xs) {
                        ForEach(stories) { article in
                            smallArticleCard(article)
                        }
                    }
                }

                if filteredArticles.isEmpty {
                    ContentUnavailableView.search(text: search)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, CheddarSpacing.xxl)
                }
            }
            .padding(CheddarSpacing.l)
        }
    }

    /// The flat guide card is one of the article variants that follows the branded shell
    /// rather than being pinned to the light palette.
    private func guideCard(_ article: LearnArticle) -> some View {
        Button {
            selectedArticle = article
        } label: {
            VStack(alignment: .leading, spacing: CheddarSpacing.s) {
                Text("Guide")
                    .font(CheddarFonts.font(for: CheddarType.bodyMediumStrong))
                    .foregroundStyle(CheddarColors.shell.foregroundOnReverseSecondary)
                Text(article.title)
                    .font(CheddarFonts.oswald(size: 42, weight: .medium))
                    .tracking(-1.3)
                    .foregroundStyle(CheddarColors.shell.foregroundBrandReverseSecondary)
                    .multilineTextAlignment(.leading)
                    .lineLimit(3)
                    .minimumScaleFactor(0.8)
                Spacer()
                Text(article.description)
                    .font(CheddarFonts.font(for: CheddarType.bodyMediumStrong))
                    .foregroundStyle(CheddarColors.shell.foregroundOnReverse)
                    .multilineTextAlignment(.leading)
                HStack {
                    Text(article.readTime)
                        .font(CheddarFonts.font(for: CheddarType.bodyMedium))
                        .foregroundStyle(CheddarColors.shell.foregroundOnReverseSecondary)
                    Spacer()
                    Image(systemName: "heart")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(CheddarColors.shell.foregroundOnReverseSecondary)
                }
            }
            .padding(CheddarSpacing.m)
            .frame(width: 270, height: 270, alignment: .leading)
            .background(CheddarColors.shell.bgBrandSecondary)
            .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge))
        }
        .buttonStyle(.plain)
    }

    private func smallArticleCard(_ article: LearnArticle) -> some View {
        Button {
            selectedArticle = article
        } label: {
            VStack(alignment: .leading, spacing: 0) {
                ZStack {
                    article.accent.step500
                    CDSResourceImage.app(article.image)
                        .scaledToFit()
                        .padding(CheddarSpacing.xs)
                }
                .frame(height: article.category == .story ? 170 : 136)
                VStack(alignment: .leading, spacing: CheddarSpacing.xs) {
                    Text(article.title)
                        .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
                        .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
                        .multilineTextAlignment(.leading)
                    Text(article.readTime)
                        .font(CheddarFonts.font(for: CheddarType.bodyMedium))
                        .foregroundStyle(CheddarColors.surface.foregroundSecondary)
                }
                .padding(CheddarSpacing.m)
            }
            .background(CheddarColors.surface.backgroundSurface)
            .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge))
        }
        .buttonStyle(.plain)
    }

    private func articleDetail(_ article: LearnArticle) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: CheddarSpacing.l) {
                ZStack {
                    article.accent.step500
                    CDSResourceImage.app(article.image)
                        .scaledToFit()
                        .padding(CheddarSpacing.l)
                }
                .frame(height: 220)
                .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge))

                Button {
                    selectedArticle = nil
                } label: {
                    Label("Back to Learn", systemImage: "arrow.left")
                        .font(CheddarFonts.monaSans(size: 16, weight: .semibold))
                        .foregroundStyle(CheddarColors.shell.foregroundBrandPrimary)
                }
                .buttonStyle(.plain)

                Text(article.title)
                    .font(CheddarFonts.oswald(size: 38, weight: .semibold))
                    .tracking(-1.2)
                Text("\(article.readTime) read")
                    .font(CheddarFonts.monaSans(size: 14, weight: .medium))
                    .foregroundStyle(CheddarColors.shell.foregroundSecondary)
                Text(article.body)
                    .font(CheddarFonts.monaSans(size: 16, weight: .medium))
                    .lineSpacing(6)

                VStack(alignment: .leading, spacing: CheddarSpacing.xs) {
                    Text("Key takeaways")
                        .font(CheddarFonts.monaSans(size: 16, weight: .semibold))
                    Text("• Start small and stay consistent\n• Automate your savings when possible\n• Track your progress regularly")
                        .font(CheddarFonts.monaSans(size: 14, weight: .medium))
                        .foregroundStyle(CheddarColors.shell.foregroundSecondary)
                        .lineSpacing(5)
                }
                .padding(CheddarSpacing.m)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(CheddarColors.surface.backgroundSurface)
                .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium))
            }
            .padding(CheddarSpacing.l)
        }
    }

    private var filteredArticles: [LearnArticle] {
        guard !search.isEmpty else { return LearnArticle.all }
        return LearnArticle.all.filter {
            $0.title.localizedCaseInsensitiveContains(search)
                || $0.category.rawValue.localizedCaseInsensitiveContains(search)
        }
    }

    private var guides: [LearnArticle] { filteredArticles.filter { $0.category == .guide } }
    private var tips: [LearnArticle] { filteredArticles.filter { $0.category == .tip } }
    private var stories: [LearnArticle] { filteredArticles.filter { $0.category == .story } }
}

private struct LearnArticle: Identifiable {
    enum Category: String {
        case guide
        case tip
        case story
    }

    let id: String
    let title: String
    let description: String
    let readTime: String
    let category: Category
    let accent: CDSAccent
    let image: String
    let body: String

    static let all: [LearnArticle] = [
        LearnArticle(
            id: "savings-101",
            title: "Savings 101",
            description: "Learn how to get started with simple savings techniques.",
            readTime: "20 min",
            category: .guide,
            accent: .magenta,
            image: "article-savings",
            body: "Saving money is one of the most important financial skills you can develop. Start small — even $5 a week adds up over time. The key is consistency. Set up automatic transfers to your savings account so you never forget. Think of saving as paying your future self first."
        ),
        LearnArticle(
            id: "investing",
            title: "Guide to Investing",
            description: "Investing can be hard — let's make it a little easier.",
            readTime: "20 min",
            category: .guide,
            accent: .magenta,
            image: "article-investing",
            body: "Investing is how your money grows over time. Start with index funds — they spread your risk across many companies. Time in the market beats timing the market. Even small amounts invested early can grow significantly thanks to compound interest.",
        ),
        LearnArticle(
            id: "credit-card",
            title: "How to choose your first credit card",
            description: "Picking the right card for your lifestyle.",
            readTime: "5 min",
            category: .tip,
            accent: .green,
            image: "article-savings",
            body: "Your first credit card is a big responsibility. Look for cards with no annual fee and a low credit limit. Always pay your full balance each month to avoid interest charges."
        ),
        LearnArticle(
            id: "emergency-fund",
            title: "The importance of an emergency fund",
            description: "Why you need one and how to build it.",
            readTime: "5 min",
            category: .tip,
            accent: .purple,
            image: "article-emergency",
            body: "An emergency fund is your financial safety net. Aim to save 3–6 months of living expenses. Keep it in a high-yield savings account and use it only for real emergencies."
        ),
        LearnArticle(
            id: "cut-expenses",
            title: "Cut expenses without cutting joy",
            description: "Small changes, big savings.",
            readTime: "5 min",
            category: .tip,
            accent: .magenta,
            image: "article-emergency",
            body: "You don't have to give up everything you love to save money. Track spending, cancel subscriptions you don't use, and look for free activities. Small changes add up."
        ),
        LearnArticle(
            id: "budget-rule",
            title: "Save more with the 50/30/20 rule",
            description: "A simple budgeting framework.",
            readTime: "5 min",
            category: .tip,
            accent: .blue,
            image: "article-budget",
            body: "Spend 50% of your income on needs, 30% on wants, and save 20%. Adjust the percentages to fit your life — the important thing is having a system."
        ),
        LearnArticle(
            id: "first-card-story",
            title: "How to choose your first credit card",
            description: "A real story from a real teen.",
            readTime: "5 min",
            category: .story,
            accent: .green,
            image: "story-card",
            body: "I was 16 when I got my first credit card. I made every mistake. Now I know: pay in full, every month, no exceptions. Your future self will thank you."
        ),
        LearnArticle(
            id: "friends-saving",
            title: "Friends who started saving together",
            description: "Community savings stories.",
            readTime: "7 min",
            category: .story,
            accent: .purple,
            image: "story-friends",
            body: "My friends and I started a savings challenge together. Having accountability partners made all the difference. Six months later, all four of us hit our goals."
        ),
    ]
}
