import CheddarDS
import SwiftUI

/// One scrolling column with the tab bar pinned under it.
struct AppScreen<Content: View>: View {
    @Environment(\.cheddarPalette) private var palette

    var nav = false
    var alignment: HorizontalAlignment = .leading
    var spacing: CGFloat = CheddarSpacing.gapL
    /// The landing screen sizes its hero to the space left over instead of scrolling.
    var scrolls = true
    /// Stack screens pin their primary action to the bottom of the viewport, which needs the
    /// column to be at least as tall as the viewport for the trailing spacer to have room.
    var fillsViewport = false

    @ViewBuilder var content: Content

    private let bottomAnchor = "screen-bottom"

    var body: some View {
        VStack(spacing: 0) {
            GeometryReader { proxy in
                if scrolls {
                    ScrollViewReader { scroll in
                        ScrollView {
                            column(minHeight: fillsViewport ? proxy.size.height : nil)
                            Color.clear.frame(height: 0).id(bottomAnchor)
                        }
                        .scrollIndicators(.hidden)
                        .onAppear {
                            guard ProcessInfo.processInfo.environment["CHEDDAR_SCROLL"] == "bottom"
                            else { return }
                            scroll.scrollTo(bottomAnchor, anchor: .bottom)
                        }
                    }
                } else {
                    column(minHeight: proxy.size.height)
                }
            }

            if nav { AppNav() }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .foregroundStyle(palette.foregroundPrimary)
    }

    private func column(minHeight: CGFloat?) -> some View {
        VStack(alignment: alignment, spacing: spacing) {
            content
        }
        .frame(maxWidth: .infinity, alignment: Alignment(horizontal: alignment, vertical: .top))
        .padding(.horizontal, CheddarSpacing.l)
        .padding(.top, CheddarSpacing.l)
        .padding(.bottom, CheddarSpacing.xl)
        .frame(minHeight: minHeight, alignment: .top)
    }
}

/// The design system calls the savings tab "wallet"; the app routes it as `savings`.
struct AppNav: View {
    @EnvironmentObject private var app: AppState
    @Environment(\.cheddarSafeBottom) private var safeBottom

    var body: some View {
        // `Nav` ships its internal gap but no box padding, leaving the tab bar to its
        // container. The 16pt gutter and the home-indicator inset together give the bar
        // height in Figma.
        CDSNavBar(
            activeItem: Binding(
                get: { navItem(for: app.activeTab) },
                set: { app.goTab(tab(for: $0)) }
            ),
            addLabel: "Add goal"
        ) {
            app.push(.addGoal)
        }
        .padding(.horizontal, CheddarSpacing.m)
        .padding(.top, CheddarSpacing.m)
        .padding(.bottom, safeBottom)
    }

    private func navItem(for tab: MainTab) -> CDSNavItem {
        switch tab {
        case .home: .home
        case .savings: .wallet
        case .learn: .learn
        case .profile: .profile
        }
    }

    private func tab(for item: CDSNavItem) -> MainTab {
        switch item {
        case .home: .home
        case .wallet: .savings
        case .learn: .learn
        case .profile: .profile
        }
    }
}
