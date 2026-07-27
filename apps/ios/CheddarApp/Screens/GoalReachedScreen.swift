import CheddarDS
import SwiftUI

private let unlockMax: Double = 100

struct GoalReachedScreen: View {
    @EnvironmentObject private var app: AppState
    @Environment(\.cheddarPalette) private var palette

    /// The slider re-arms `onComplete` whenever the value falls back under the threshold, so
    /// the latch lives here: unlocking is a one-way transition.
    @State private var isUnlocked = false

    var body: some View {
        if let goal = app.goal(id: app.selectedGoalID) {
            AppScreen(alignment: .center, fillsViewport: true) {
                Text("Goal Reached")
                    .cdsType(CheddarType.displayMedium)
                    .foregroundStyle(palette.foregroundBrandPrimary)

                CDSBrandIllustration {
                    CDSResourceImage("celebration-goal-reached.png").scaledToFit()
                }

                Text("You saved \(CDSCurrency.format(goal.target)) for \(goal.name)")
                    .foregroundStyle(palette.foregroundBrandPrimary)

                Spacer(minLength: 0)

                CDSSlider(
                    label: "Slide to continue",
                    range: 0...unlockMax,
                    initialValue: 0,
                    snapOnComplete: true,
                    showsValue: false,
                    onComplete: unlock
                )
                .disabled(isUnlocked)
            }
            .multilineTextAlignment(.center)
        }
    }

    private func unlock() {
        guard !isUnlocked else { return }
        isUnlocked = true
        Task {
            try? await Task.sleep(for: .milliseconds(250))
            app.goTab(.home)
        }
    }
}
