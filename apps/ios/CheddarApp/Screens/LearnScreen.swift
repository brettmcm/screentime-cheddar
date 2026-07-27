import CheddarDS
import SwiftUI

struct LearnScreen: View {
    @Environment(\.cheddarPalette) private var palette

    @State private var query = ""
    @State private var isSearching = false
    @State private var selected: Article?

    private var matches: [Article] {
        let term = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard !term.isEmpty else { return DemoData.articles }
        return DemoData.articles.filter {
            $0.title.lowercased().contains(term)
                || $0.description.lowercased().contains(term)
                || $0.category.rawValue.contains(term)
        }
    }

    /// Guides are a scrolling row in the App Flow; tips and stories are grids.
    private var groups: [(title: String, category: ArticleCategory, isCarousel: Bool)] {
        [
            ("Guides", .guide, true),
            ("Tips & Tricks", .tip, false),
            ("Customer Stories", .story, false),
        ]
    }

    var body: some View {
        if let selected {
            ArticleDetail(article: selected) { self.selected = nil }
        } else {
            list
        }
    }

    private var list: some View {
        AppScreen(nav: true) {
            // Search collapses to its icon in the header and expands on demand.
            CDSPageHeader("Learn", showBack: false) {
                CDSIconButton(
                    .search,
                    label: isSearching ? "Hide search" : "Search articles",
                    variant: .ghost
                ) {
                    if isSearching { query = "" }
                    isSearching.toggle()
                }
            }

            if isSearching {
                CDSSearch(text: $query, label: "Search articles")
            }

            if matches.isEmpty {
                Text("No articles match “\(query)”")
                    .foregroundStyle(palette.foregroundSecondary)
            }

            ForEach(groups, id: \.title) { group in
                let items = matches.filter { $0.category == group.category }
                if !items.isEmpty {
                    VStack(alignment: .leading, spacing: CheddarSpacing.gapM) {
                        CDSSectionHeader(group.title) {
                            CDSTextLink("View all") { query = "" }
                        }

                        if group.isCarousel {
                            CardCarousel {
                                ForEach(items) { article in
                                    tile(for: article)
                                }
                            }
                        } else {
                            CardGrid(items: items) { article in
                                tile(for: article)
                            }
                        }
                    }
                }
            }
        }
    }

    /// The three Learn groups are the three flat and media article shapes in Figma.
    @ViewBuilder
    private func tile(for article: Article) -> some View {
        switch article.category {
        case .guide:
            CDSArticleCard(
                size: .small,
                media: .none,
                eyebrow: "Guide",
                title: article.title,
                description: article.description,
                readTime: article.readTime,
                onTap: { selected = article }
            )
        case .story:
            // `photo` masks the photograph into the brand shape and leaves the accent tile
            // visible around it, which is what makes these cards read.
            CDSArticleCard(
                size: .small,
                media: .photo,
                title: article.title,
                readTime: article.readTime,
                imageAsset: article.imageAsset,
                accent: article.accent,
                showFavorite: false,
                onTap: { selected = article }
            )
        case .tip:
            CDSArticleCard(
                size: .small,
                title: article.title,
                readTime: article.readTime,
                imageAsset: article.imageAsset,
                accent: article.accent,
                showFavorite: true,
                onTap: { selected = article }
            )
        }
    }
}

/// Two tiles to a row, the Learn tile rhythm.
///
/// Rows of `HStack` rather than a `LazyVGrid`: the grid decides a row's height before it
/// knows how wide a column will be, then clips the tile whose title turns out to take a
/// third line. Stacking the rows keeps each tile at its own height, which is what
/// `align-items: start` gives the grid on the web.
struct CardGrid<Item: Identifiable, Content: View>: View {
    let items: [Item]
    @ViewBuilder var content: (Item) -> Content

    private var rows: [[Item]] {
        stride(from: 0, to: items.count, by: 2).map { Array(items[$0 ..< min($0 + 2, items.count)]) }
    }

    var body: some View {
        VStack(spacing: CheddarSpacing.gapS) {
            ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
                HStack(alignment: .top, spacing: CheddarSpacing.gapS) {
                    ForEach(row) { content($0).frame(maxWidth: .infinity) }
                    // A lone tile keeps its column rather than spreading across the row.
                    if row.count == 1 { Color.clear.frame(maxWidth: .infinity) }
                }
            }
        }
    }
}

private struct ArticleDetail: View {
    @Environment(\.cheddarTheme) private var theme
    @Environment(\.cheddarPalette) private var palette

    let article: Article
    let onBack: () -> Void

    var body: some View {
        AppScreen(nav: true) {
            if let imageAsset = article.imageAsset {
                CDSResourceImage(imageAsset)
                    .scaledToFill()
                    .frame(height: 240)
                    .frame(maxWidth: .infinity)
                    .background(palette.bgBrandShade)
                    .clipShape(RoundedRectangle(
                        cornerRadius: CheddarSpacing.cornerLarge,
                        style: .continuous
                    ))
            }

            CDSTextLink("Back to Learn", icon: .arrowLeft, iconPosition: .leading, action: onBack)

            Text(article.title).cdsType(CheddarType.displayMedium)

            Text("\(article.readTime) read")
                .foregroundStyle(palette.foregroundSecondary)

            // The body runs looser than the ramp's own leading — `line-height: 1.6`.
            Text(article.body)
                .cdsType(CheddarType.bodyLarge, lineHeight: CheddarType.bodyLarge.size * 1.6)

            takeaways
        }
    }

    private var takeaways: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.gapS) {
            Text("Key takeaways").cdsType(CheddarType.bodyLargeStrong)
            VStack(alignment: .leading, spacing: CheddarSpacing.gapXs) {
                bullet("Start small and stay consistent")
                bullet("Automate savings when possible")
                bullet("Track your progress regularly")
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(CheddarSpacing.m)
        .foregroundStyle(theme.island.foregroundOnSurface)
        .background(theme.island.backgroundSurface)
        .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous))
        .cheddarIsland()
    }

    private func bullet(_ text: String) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: CheddarSpacing.xs) {
            Text("•")
            Text(text)
        }
        .padding(.leading, CheddarSpacing.m)
    }
}
