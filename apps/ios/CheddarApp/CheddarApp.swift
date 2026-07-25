import SwiftUI
import CheddarDS

@main
struct CheddarApp: App {
    @StateObject private var appState = AppState()

    init() {
        CheddarFontRegistration.registerFontsIfNeeded()
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(appState)
                .preferredColorScheme(.light)
        }
    }
}
