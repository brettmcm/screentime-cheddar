import CheddarDS
import SwiftUI

/// The frame everything is drawn in.
///
/// The web build renders a 430x932 phone on a black stage; on device the phone is the stage,
/// so what carries over is the rest: the theme scope, the canvas fill, and the toast pinned
/// over the top of whichever screen is showing.
struct AppRoot: View {
    @EnvironmentObject private var app: AppState

    var body: some View {
        GeometryReader { proxy in
            ZStack(alignment: .top) {
                CheddarThemeReader { palette in
                    palette.backgroundDefault.ignoresSafeArea()
                }

                screen
                    .padding(.top, max(proxy.safeAreaInsets.top, AppMetrics.minimumSafeTop))

                if let toast = app.toast {
                    CDSToast(toast)
                        .padding(.horizontal, CheddarSpacing.m)
                        .padding(.top, max(proxy.safeAreaInsets.top, AppMetrics.minimumSafeTop) + CheddarSpacing.s)
                        .transition(.move(edge: .top).combined(with: .opacity))
                }
            }
            .environment(\.cheddarSafeBottom, max(proxy.safeAreaInsets.bottom, AppMetrics.minimumSafeBottom))
        }
        .ignoresSafeArea()
        .animation(.spring(response: 0.3), value: app.toast)
        // `body { font: var(--cds-type-body-large) }` — the ramp's base run, which everything
        // that doesn't name its own style inherits.
        .cdsType(CheddarType.bodyLarge)
        .cheddarTheme(app.theme)
        .preferredColorScheme(app.theme.colorScheme)
    }

    @ViewBuilder
    private var screen: some View {
        switch app.screen {
        case .tab(.home): HomeScreen()
        case .tab(.savings): SavingsScreen()
        case .tab(.learn): LearnScreen()
        case .tab(.profile): ProfileScreen()
        case .stack(.landing): LandingScreen()
        case .stack(.addGoal): AddGoalScreen()
        case .stack(.goalDetail): GoalDetailScreen()
        case .stack(.goalReached): GoalReachedScreen()
        case .stack(.themeSettings): ThemeSettingsScreen()
        }
    }
}

enum AppMetrics {
    /// No status bar is drawn; the design's top chrome is safe-area padding, and 50pt is the
    /// floor the web frame reserves when the device reports less.
    static let minimumSafeTop: CGFloat = 50
    /// The design reserves a 32pt home-indicator region and the system draws the bar itself,
    /// so the app owes the remainder.
    static let minimumSafeBottom: CGFloat = 27
}

/// Reads the palette that the enclosing theme resolves to.
///
/// `cheddarTheme` is applied above this view, so a sibling cannot read it with
/// `@Environment` in the same body — this pushes the read one level down.
struct CheddarThemeReader<Content: View>: View {
    @Environment(\.cheddarPalette) private var palette

    @ViewBuilder let content: (CheddarPalette) -> Content

    var body: some View { content(palette) }
}
