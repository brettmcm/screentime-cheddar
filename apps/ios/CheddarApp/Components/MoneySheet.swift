import CheddarDS
import SwiftUI

enum MoneySheetMode: String, Identifiable {
    case deposit
    case transfer

    var id: String { rawValue }
    var title: String { rawValue.capitalized }
}

/// Amounts never exceed `$9,999,999`, which is nine typed characters.
private let maxAmountLength = 9

/// Moves money into or between goals. Transfer debits a source goal and credits a
/// destination; it is not a deposit with extra copy.
///
/// Each opening starts from a blank form. The sheet is removed from the hierarchy when it
/// closes, so keying the form on what it is editing resets it without an effect.
struct MoneySheet: View {
    @EnvironmentObject private var app: AppState

    let mode: MoneySheetMode
    var fixedGoalID: String?
    let onClose: () -> Void

    // A goal screen fixes one end of the move: the source to send from for a transfer, the
    // destination to top up for a deposit. The other end is chosen.
    @State private var sourceID = ""
    @State private var targetID = ""
    @State private var amount = ""

    private var source: Goal? { app.goals.first { $0.id == sourceID } }
    private var target: Goal? { app.goals.first { $0.id == targetID } }
    private var typedAmount: Decimal { Decimal(string: amount) ?? 0 }
    private var fixedGoal: Goal? { app.goals.first { $0.id == fixedGoalID } }

    private var isValid: Bool {
        guard typedAmount > 0 else { return false }
        switch mode {
        case .deposit:
            return target != nil
        case .transfer:
            guard let source, let target else { return false }
            return source.id != target.id && typedAmount <= source.saved
        }
    }

    var body: some View {
        CDSSheet(title: mode.title, onClose: onClose) {
            if let fixedGoal, mode != .transfer {
                CDSGoalCard(goal: fixedGoal.card)
            }

            if mode == .transfer {
                GoalPicker(legend: "From", goals: app.goals, selectedID: $sourceID)
            }

            if (mode == .deposit && fixedGoal == nil) || mode == .transfer {
                GoalPicker(
                    legend: mode == .transfer ? "To" : "Goal",
                    goals: mode == .transfer ? app.goals.filter { $0.id != sourceID } : app.goals,
                    selectedID: $targetID
                )
            }

            AmountReadout(amount: amount, caption: "Enter amount")

            CDSNumberPad(value: $amount, maxLength: maxAmountLength)
        } footer: {
            CDSButton("Confirm \(mode.rawValue)", isEnabled: isValid, action: submit)
        }
        .onAppear {
            sourceID = mode == .transfer ? (fixedGoalID ?? "") : ""
            targetID = mode == .deposit ? (fixedGoalID ?? "") : ""
        }
    }

    private func submit() {
        guard isValid else { return }
        var completedGoalID: String?

        switch mode {
        case .deposit:
            if let target { completedGoalID = app.deposit(goalID: target.id, amount: typedAmount) }
        case .transfer:
            if let source, let target {
                completedGoalID = app.transfer(from: source.id, to: target.id, amount: typedAmount)
            }
        }

        onClose()
        if let completedGoalID {
            Task {
                try? await Task.sleep(for: .milliseconds(200))
                app.push(.goalReached, goalID: completedGoalID)
            }
        }
    }
}

private struct GoalPicker: View {
    let legend: String
    let goals: [Goal]
    @Binding var selectedID: String

    var body: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.gapS) {
            Text(legend)
                .cdsType(CheddarType.bodyLargeStrong)
                .padding(.bottom, CheddarSpacing.xs)

            ForEach(goals) { goal in
                CDSRadio(
                    label: goal.name,
                    description: "\(CDSCurrency.format(goal.saved)) saved",
                    isSelected: selectedID == goal.id
                ) {
                    selectedID = goal.id
                }
            }
        }
    }
}
