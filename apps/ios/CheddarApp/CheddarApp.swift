import CheddarDS
import SwiftUI

@main
struct CheddarApp: App {
    @StateObject private var appState = AppState()

    init() {
        CheddarFontRegistration.registerFontsIfNeeded()
    }

    var body: some Scene {
        WindowGroup {
            AppRoot().environmentObject(appState)
        }
    }
}
