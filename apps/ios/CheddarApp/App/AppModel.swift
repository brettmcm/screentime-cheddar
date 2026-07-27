import CheddarDS
import Foundation

/// The four main tabs.
enum MainTab: String {
    case home
    case savings
    case learn
    case profile
}

/// Screens pushed over a tab. They leave the active tab untouched.
enum StackScreen: Hashable {
    case landing
    case addGoal
    case goalDetail
    case goalReached
    case themeSettings
}

enum AppScreenID: Hashable {
    case tab(MainTab)
    case stack(StackScreen)
}

/// How a brand is presented. `dark` is the library's brand appearance — a saturated brand
/// canvas carrying light cards, which is what the App Flow draws. `light` is the ordinary
/// light scheme with the same brand accents.
typealias Brand = CheddarBrand
typealias Mode = CheddarMode

/// The illustrations a goal can be given, keyed by subject rather than by file.
enum GoalIllustration: String, CaseIterable, Identifiable {
    case headphones
    case sneakers
    case travel
    case goggles
    case skateboard
    case camera

    var id: String { rawValue }

    var label: String {
        switch self {
        case .headphones: "Headphones"
        case .sneakers: "Sneakers"
        case .travel: "Trip"
        case .goggles: "Ski trip"
        case .skateboard: "Skateboard"
        case .camera: "Camera"
        }
    }

    var asset: String { "goal-\(rawValue).png" }
}

struct Goal: Identifiable, Equatable {
    let id: String
    var name: String
    var target: Decimal
    var saved: Decimal
    var illustration: GoalIllustration
    var accent: CDSAccent

    /// The design system carries its own goal type; the app's adds the illustration key it
    /// resolves the artwork from.
    var card: CDSGoal {
        CDSGoal(
            id: id,
            name: name,
            target: target,
            saved: saved,
            accent: accent,
            imageAsset: illustration.asset
        )
    }
}

struct Activity: Identifiable, Equatable {
    let id: String
    let type: CDSActivityType
    let amount: Decimal
    let time: String
    var goalID: String?
}

enum ArticleCategory: String {
    case guide
    case tip
    case story
}

struct Article: Identifiable, Equatable {
    let id: String
    let title: String
    let description: String
    let readTime: String
    let category: ArticleCategory
    let body: String
    let accent: CDSAccent
    /// Guides render as the flat Guide shape and carry no artwork.
    var imageAsset: String?
}

struct SpendingCategory {
    let label: String
    let amount: Decimal
    let accent: CDSAccent
}

struct Badge: Identifiable {
    let id: String
    let title: String
    let caption: String
    let progress: Double
    let icon: CheddarIconName
    let accent: CDSAccent
}

struct Account: Identifiable {
    let id: String
    let name: String
    let subtitle: String
    let amount: Decimal
    let meta: String
}

struct Profile: Equatable {
    var name: String
    var handle: String
}

extension Brand {
    var label: String {
        switch self {
        case .magenta: "Berry"
        case .blue: "Blue"
        case .green: "Green"
        case .purple: "Purple"
        }
    }
}
