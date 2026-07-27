import CheddarDS
import SwiftUI
import UIKit

private let toastDuration: TimeInterval = 2.2

/// Money is held in dollars, so every arithmetic result is re-rounded to cents.
private func toCents(_ value: Decimal) -> Decimal {
    var input = value
    var rounded = Decimal()
    NSDecimalRound(&rounded, &input, 2, .plain)
    return rounded
}

@MainActor
final class AppState: ObservableObject {
    @Published private(set) var screen: AppScreenID = .stack(.landing)
    @Published private(set) var activeTab: MainTab = .home
    @Published private(set) var selectedGoalID: String?
    @Published private(set) var goals = DemoData.goals
    @Published private(set) var completedGoals = DemoData.completedGoals
    @Published private(set) var activities = DemoData.activities
    @Published private(set) var profile = Profile(name: "Jamie K.", handle: "@jamieh")
    @Published private(set) var brand: Brand = .magenta
    @Published private(set) var mode: Mode = .dark
    @Published private(set) var toast: String?

    private var toastTask: Task<Void, Never>?
    private var activitySequence = 0

    /// The screenshot harness's way in: `CHEDDAR_START_SCREEN` says which screen the app opens
    /// on, `CHEDDAR_START_SHEET` opens the money sheet over it.
    let startMoneyMode: MoneySheetMode?

    init() {
        let env = ProcessInfo.processInfo.environment
        startMoneyMode = env["CHEDDAR_START_SHEET"].flatMap(MoneySheetMode.init(rawValue:))
        guard let start = env["CHEDDAR_START_SCREEN"] else { return }
        switch start {
        case "home": screen = .tab(.home)
        case "savings": screen = .tab(.savings); activeTab = .savings
        case "learn": screen = .tab(.learn); activeTab = .learn
        case "profile": screen = .tab(.profile); activeTab = .profile
        case "add-goal": screen = .stack(.addGoal)
        case "goal-detail": screen = .stack(.goalDetail); selectedGoalID = "headphones"
        case "goal-reached": screen = .stack(.goalReached); selectedGoalID = "sneakers"
        case "theme-settings": screen = .stack(.themeSettings)
        default: break
        }
    }

    var theme: CheddarTheme { CheddarTheme(brand: brand, mode: mode) }

    var totalSavings: Decimal {
        toCents(goals.reduce(0) { $0 + $1.saved })
    }

    // MARK: - Navigation

    func goTab(_ tab: MainTab) {
        activeTab = tab
        screen = .tab(tab)
        selectedGoalID = nil
    }

    func push(_ next: StackScreen, goalID: String? = nil) {
        selectedGoalID = goalID
        screen = .stack(next)
    }

    /// Stack screens never change the active tab, so returning is always to that tab.
    func back() {
        selectedGoalID = nil
        screen = .tab(activeTab)
    }

    func goal(id: String?) -> Goal? {
        goals.first { $0.id == id } ?? completedGoals.first { $0.id == id }
    }

    // MARK: - Money

    func addGoal(name: String, target: Decimal, saved: Decimal, illustration: GoalIllustration, accent: CDSAccent) {
        let id = "goal-\(Date().timeIntervalSince1970)"
        goals.append(
            Goal(id: id, name: name, target: target, saved: saved, illustration: illustration, accent: accent)
        )
        if saved > 0 { addActivity(.deposit, amount: saved, goalID: id) }
        showToast("Goal added")
        goTab(.home)
    }

    /// Returns the id of a goal that reached its target, if this deposit finished one.
    @discardableResult
    func deposit(goalID: String, amount: Decimal) -> String? {
        guard let index = goals.firstIndex(where: { $0.id == goalID }), amount > 0 else { return nil }
        var updated = goals[index]
        updated.saved = toCents(updated.saved + amount)
        addActivity(.deposit, amount: amount, goalID: goalID)

        if updated.saved >= updated.target {
            goals.remove(at: index)
            completedGoals.insert(updated, at: 0)
            showToast("Goal reached!")
            return goalID
        }

        goals[index] = updated
        showToast("Deposit added")
        return nil
    }

    /// Moves money between two goals. Never routes through `deposit`.
    @discardableResult
    func transfer(from fromGoalID: String, to toGoalID: String, amount: Decimal) -> String? {
        guard
            let fromIndex = goals.firstIndex(where: { $0.id == fromGoalID }),
            let toIndex = goals.firstIndex(where: { $0.id == toGoalID }),
            fromGoalID != toGoalID,
            amount > 0
        else { return nil }

        let moved = min(amount, goals[fromIndex].saved)
        guard moved > 0 else { return nil }

        var debited = goals[fromIndex]
        var credited = goals[toIndex]
        debited.saved = toCents(debited.saved - moved)
        credited.saved = toCents(credited.saved + moved)

        activities.insert(contentsOf: [
            makeActivity(.deposit, amount: moved, goalID: credited.id),
            makeActivity(.withdrawal, amount: moved, goalID: debited.id),
        ], at: 0)

        if credited.saved >= credited.target {
            goals[fromIndex] = debited
            goals.removeAll { $0.id == credited.id }
            completedGoals.insert(credited, at: 0)
            showToast("Goal reached!")
            return credited.id
        }

        goals[fromIndex] = debited
        goals[toIndex] = credited
        showToast("Transferred to \(credited.name)")
        return nil
    }

    // MARK: - Profile and theme

    func updateProfile(name: String, handle: String) {
        let trimmedName = name.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedHandle = handle.trimmingCharacters(in: .whitespacesAndNewlines)
        profile = Profile(
            name: trimmedName.isEmpty ? profile.name : trimmedName,
            handle: trimmedHandle.isEmpty ? profile.handle : trimmedHandle
        )
        showToast("Profile updated")
    }

    func shareProfile() {
        UIPasteboard.general.string = "I'm saving with Cheddar!"
        showToast("Copied to clipboard")
    }

    func setBrand(_ next: Brand) {
        brand = next
        showToast("\(next.label) theme selected")
    }

    func setMode(_ next: Mode) {
        mode = next
        showToast(next == .dark ? "Dark mode on" : "Light mode on")
    }

    // MARK: - Toast

    func showToast(_ message: String) {
        toastTask?.cancel()
        toast = message
        toastTask = Task { [weak self] in
            try? await Task.sleep(for: .seconds(toastDuration))
            guard !Task.isCancelled else { return }
            self?.toast = nil
        }
    }

    // MARK: - Activity

    private func addActivity(_ type: CDSActivityType, amount: Decimal, goalID: String) {
        activities.insert(makeActivity(type, amount: amount, goalID: goalID), at: 0)
    }

    private func makeActivity(_ type: CDSActivityType, amount: Decimal, goalID: String) -> Activity {
        activitySequence += 1
        let time = Date().formatted(.dateTime.hour(.defaultDigits(amPM: .abbreviated)).minute())
        return Activity(
            id: "activity-\(activitySequence)",
            type: type,
            amount: amount,
            time: "Today, \(time.lowercased().replacingOccurrences(of: " ", with: ""))",
            goalID: goalID
        )
    }
}
