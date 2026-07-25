import Foundation
import SwiftUI
import CheddarDS

struct AppActivity: Identifiable {
    let id: String
    let type: CDSActivityType
    let amount: Decimal
    let date: String
    let time: String
    let goalID: String?

    var timestamp: String { "\(date), \(time)" }
}

struct UserProfile {
    var name: String
    var handle: String
}

enum CheddarThemeName: String, CaseIterable, Identifiable {
    case berry = "Berry"
    case blue = "Blue"
    case green = "Green"
    case purple = "Purple"

    var id: String { rawValue }
}

@MainActor
final class AppState: ObservableObject {
    enum Route: Equatable {
        case landing
        case main
    }

    @Published var route: Route = .landing
    @Published var selectedTab: CDSNavItem = .home
    @Published var showAddGoal = false
    @Published var selectedGoal: CDSGoal?
    @Published var showTrendNotification = true
    @Published var goals: [CDSGoal] = DemoData.goals
    @Published var completedGoals: [CDSGoal] = [
        CDSGoal(
            id: "skateboard",
            name: "Skateboard",
            target: 120,
            saved: 120,
            accent: CheddarColors.brand300,
            iconName: "figure.skating"
        ),
        CDSGoal(
            id: "camera",
            name: "Camera",
            target: 260,
            saved: 260,
            accent: CheddarColors.blue400,
            iconName: "camera.fill"
        ),
    ]
    @Published var activities: [AppActivity] = [
        AppActivity(id: "a1", type: .deposit, amount: 20, date: "Today", time: "1:34pm", goalID: "sneakers"),
        AppActivity(id: "a2", type: .deposit, amount: 45, date: "Today", time: "11:17am", goalID: "headphones"),
        AppActivity(id: "a3", type: .withdrawal, amount: 13.75, date: "Mon", time: "8:22am", goalID: nil),
        AppActivity(id: "a4", type: .deposit, amount: 16, date: "Sat", time: "11:00am", goalID: "trip"),
        AppActivity(id: "a5", type: .withdrawal, amount: 7, date: "Thu", time: "1:15pm", goalID: nil),
        AppActivity(id: "a6", type: .deposit, amount: 25, date: "Wed", time: "9:02am", goalID: "sneakers"),
        AppActivity(id: "a7", type: .deposit, amount: 32, date: "Tue", time: "4:15pm", goalID: "headphones"),
    ]
    @Published var profile = UserProfile(name: "Jamie K.", handle: "@jamieh")
    @Published var selectedTheme: CheddarThemeName = .berry
    @Published var toastMessage: String?

    init() {
        #if DEBUG
        // Lets the snapshot tooling open a tab directly, the way the web app's test routes do.
        if let screen = ProcessInfo.processInfo.environment["CHEDDAR_UI_SCREEN"] {
            route = .main
            switch screen {
            case "savings": selectedTab = .wallet
            case "learn": selectedTab = .learn
            case "profile": selectedTab = .profile
            case "goal":
                selectedTab = .wallet
                selectedGoal = goals.first
            default: selectedTab = .home
            }
        }
        #endif
    }

    var totalSavings: Decimal {
        goals.reduce(Decimal.zero) { $0 + $1.saved }
    }

    var totalSavingsText: String {
        Self.currency(totalSavings)
    }

    var firstName: String {
        profile.name.split(separator: " ").first.map(String.init) ?? profile.name
    }

    func signUp() {
        route = .main
    }

    func signIn() {
        route = .main
    }

    func openGoal(_ goal: CDSGoal) {
        selectedGoal = goal
    }

    func goal(id: String) -> CDSGoal? {
        goals.first(where: { $0.id == id })
            ?? completedGoals.first(where: { $0.id == id })
    }

    func activities(for goalID: String) -> [AppActivity] {
        activities.filter { $0.goalID == goalID }
    }

    func addGoal(
        name: String,
        target: Decimal,
        startingSaved: Decimal,
        icon: String,
        imageAsset: String?,
        accent: Color
    ) {
        let goal = CDSGoal(
            id: "goal-\(UUID().uuidString)",
            name: name,
            target: target,
            saved: min(startingSaved, target),
            accent: accent,
            imageAsset: imageAsset,
            iconName: icon
        )
        goals.append(goal)
        if startingSaved > 0 {
            activities.insert(
                makeActivity(type: .deposit, amount: min(startingSaved, target), goalID: goal.id),
                at: 0
            )
        }
        showToast("Goal added")
    }

    @discardableResult
    func deposit(_ amount: Decimal, into goalID: String) -> Bool {
        guard amount > 0, let current = goals.first(where: { $0.id == goalID }) else {
            return false
        }
        let updated = copy(current, saved: current.saved + amount)
        activities.insert(makeActivity(type: .deposit, amount: amount, goalID: goalID), at: 0)

        if updated.saved >= updated.target {
            goals.removeAll { $0.id == goalID }
            completedGoals.insert(updated, at: 0)
            selectedGoal = updated
            showToast("Goal reached!")
            return true
        }

        replaceGoal(updated)
        selectedGoal = updated
        showToast("Deposit added")
        return false
    }

    /// Moves money between two goals, debiting the source and crediting the target.
    /// Returns whether the transfer completed the target goal.
    @discardableResult
    func transfer(_ amount: Decimal, from sourceID: String, to targetID: String) -> Bool {
        guard
            amount > 0,
            sourceID != targetID,
            let source = goals.first(where: { $0.id == sourceID }),
            let target = goals.first(where: { $0.id == targetID })
        else {
            return false
        }

        let moved = min(amount, source.saved)
        guard moved > 0 else { return false }

        let debited = copy(source, saved: source.saved - moved)
        let credited = copy(target, saved: target.saved + moved)

        activities.insert(makeActivity(type: .withdrawal, amount: moved, goalID: sourceID), at: 0)
        activities.insert(makeActivity(type: .deposit, amount: moved, goalID: targetID), at: 0)

        replaceGoal(debited)

        if credited.saved >= credited.target {
            goals.removeAll { $0.id == targetID }
            completedGoals.insert(credited, at: 0)
            selectedGoal = credited
            showToast("Goal reached!")
            return true
        }

        replaceGoal(credited)
        selectedGoal = credited
        showToast("Transferred to \(credited.name)")
        return false
    }

    func updateProfile(name: String, handle: String) {
        let cleanName = name.trimmingCharacters(in: .whitespacesAndNewlines)
        let cleanHandle = handle.trimmingCharacters(in: .whitespacesAndNewlines)
        profile = UserProfile(
            name: cleanName.isEmpty ? profile.name : cleanName,
            handle: cleanHandle.isEmpty ? profile.handle : cleanHandle
        )
        showToast("Profile updated")
    }

    func showToast(_ message: String) {
        toastMessage = message
        Task {
            try? await Task.sleep(for: .seconds(2))
            if toastMessage == message {
                toastMessage = nil
            }
        }
    }

    static func currency(_ amount: Decimal) -> String {
        String(format: "$%.2f", NSDecimalNumber(decimal: amount).doubleValue)
    }

    /// Splits a formatted amount so callers can set the cents smaller than the dollars.
    static func splitCurrency(_ amount: Decimal) -> (dollars: String, cents: String) {
        let text = currency(amount)
        guard let dot = text.lastIndex(of: ".") else { return (text, "") }
        return (String(text[..<dot]), String(text[dot...]))
    }

    private func replaceGoal(_ updated: CDSGoal) {
        guard let index = goals.firstIndex(where: { $0.id == updated.id }) else { return }
        goals[index] = updated
    }

    private func copy(_ goal: CDSGoal, saved: Decimal) -> CDSGoal {
        CDSGoal(
            id: goal.id,
            name: goal.name,
            target: goal.target,
            saved: saved,
            accent: goal.accent,
            imageAsset: goal.imageAsset,
            iconName: goal.iconName
        )
    }

    private func makeActivity(
        type: CDSActivityType,
        amount: Decimal,
        goalID: String?
    ) -> AppActivity {
        let formatter = DateFormatter()
        formatter.dateFormat = "h:mma"
        return AppActivity(
            id: UUID().uuidString,
            type: type,
            amount: amount,
            date: "Today",
            time: formatter.string(from: Date()).lowercased(),
            goalID: goalID
        )
    }
}
