import SwiftUI
import CheddarDS

enum MoneyMovementMode: String, Identifiable {
    case deposit
    case transfer

    var id: String { rawValue }

    var title: String {
        switch self {
        case .deposit: "Deposit"
        case .transfer: "Transfer"
        }
    }

    var buttonTitle: String {
        switch self {
        case .deposit: "Confirm deposit"
        case .transfer: "Confirm transfer"
        }
    }

    var amountCaption: String {
        switch self {
        case .deposit: "Amount to add"
        case .transfer: "Amount to move"
        }
    }
}

/// Sheets are one of the surfaces the design system pins to the light palette, so this reads
/// from `CheddarColors.surface` throughout.
struct MoneyMovementSheet: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var appState: AppState

    let mode: MoneyMovementMode
    let fixedGoalID: String?
    var onCompleted: ((String, Bool) -> Void)?

    /// The goal money moves *into*.
    @State private var selectedGoalID: String?
    /// Transfers also need a funding goal.
    @State private var sourceGoalID: String?
    @State private var amount = ""

    init(
        mode: MoneyMovementMode,
        goalID: String? = nil,
        onCompleted: ((String, Bool) -> Void)? = nil
    ) {
        self.mode = mode
        fixedGoalID = goalID
        self.onCompleted = onCompleted
        // A goal screen fixes one end of the move: the source to send from for a transfer,
        // the destination to top up otherwise. The other end is chosen in the sheet.
        _sourceGoalID = State(initialValue: mode == .transfer ? goalID : nil)
        _selectedGoalID = State(initialValue: mode == .transfer ? nil : goalID)
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: CheddarSpacing.l) {
                    header

                    if mode == .transfer {
                        goalPicker(
                            title: "From",
                            selection: $sourceGoalID,
                            excluding: selectedGoalID
                        )
                        goalPicker(
                            title: "To",
                            selection: $selectedGoalID,
                            excluding: sourceGoalID
                        )
                    } else if fixedGoalID == nil {
                        goalPicker(
                            title: "Choose a goal",
                            selection: $selectedGoalID,
                            excluding: nil
                        )
                    } else if let goal = targetGoal {
                        fixedGoalRow(goal)
                    }

                    VStack(spacing: CheddarSpacing.xxs) {
                        Text(displayAmount)
                            .font(CheddarFonts.font(for: CheddarType.displayLarge))
                            .tracking(CheddarType.displayLarge.tracking)
                            .foregroundStyle(CheddarColors.surface.foregroundBrandPrimary)
                        Text(mode.amountCaption)
                            .font(CheddarFonts.font(for: CheddarType.bodyMedium))
                            .foregroundStyle(CheddarColors.surface.foregroundSecondary)
                    }
                    .frame(maxWidth: .infinity)

                    CDSAmountKeypad(value: $amount)

                    CDSButton(mode.buttonTitle, isEnabled: canSubmit) {
                        submit()
                    }
                }
                .padding(CheddarSpacing.l)
            }
            .background(CheddarColors.surface.backgroundDefault.ignoresSafeArea())
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
    }

    private var header: some View {
        HStack {
            Text(mode.title)
                .font(CheddarFonts.font(for: CheddarType.displaySmall))
                .tracking(CheddarType.displaySmall.tracking)
                .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
            Spacer()
            Button {
                dismiss()
            } label: {
                Image(systemName: "xmark")
                    .font(.system(size: 15, weight: .bold))
                    .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
                    .frame(width: 32, height: 32)
                    .background(CheddarColors.surface.backgroundSurface)
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Close")
        }
    }

    private func fixedGoalRow(_ goal: CDSGoal) -> some View {
        HStack(spacing: CheddarSpacing.s) {
            CDSGoalArtwork(goal: goal, size: 48)
            VStack(alignment: .leading, spacing: 2) {
                Text(goal.name)
                    .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
                    .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
                Text("\(AppState.currency(goal.saved)) saved")
                    .font(CheddarFonts.font(for: CheddarType.bodyMedium))
                    .foregroundStyle(CheddarColors.surface.foregroundSecondary)
            }
            Spacer()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func goalPicker(
        title: String,
        selection: Binding<String?>,
        excluding excludedID: String?
    ) -> some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.s) {
            Text(title)
                .font(CheddarFonts.font(for: CheddarType.bodyMedium))
                .foregroundStyle(CheddarColors.surface.foregroundSecondary)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: CheddarSpacing.xs) {
                    ForEach(appState.goals.filter { $0.id != excludedID }) { goal in
                        Button {
                            selection.wrappedValue = goal.id
                        } label: {
                            VStack(spacing: CheddarSpacing.xs) {
                                CDSGoalArtwork(goal: goal, size: 48)
                                Text(goal.name)
                                    .font(CheddarFonts.font(for: CheddarType.bodySmallStrong))
                                    .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
                                    .lineLimit(1)
                                Text(AppState.currency(goal.saved))
                                    .font(CheddarFonts.font(for: CheddarType.bodySmall))
                                    .foregroundStyle(CheddarColors.surface.foregroundSecondary)
                            }
                            .padding(CheddarSpacing.s)
                            .frame(width: 112)
                            .background(CheddarColors.surface.backgroundSurface)
                            .overlay {
                                RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium)
                                    .stroke(
                                        selection.wrappedValue == goal.id
                                            ? CheddarColors.surface.foregroundBrandPrimary
                                            : CheddarColors.surface.borderDefault,
                                        lineWidth: selection.wrappedValue == goal.id ? 2 : 1
                                    )
                            }
                            .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium))
                        }
                        .buttonStyle(.plain)
                        .accessibilityAddTraits(selection.wrappedValue == goal.id ? [.isSelected] : [])
                    }
                }
            }
        }
    }

    private var targetGoal: CDSGoal? {
        selectedGoalID.flatMap(appState.goal(id:))
    }

    private var sourceGoal: CDSGoal? {
        sourceGoalID.flatMap(appState.goal(id:))
    }

    private var decimalAmount: Decimal {
        Decimal(string: amount) ?? 0
    }

    private var displayAmount: String {
        amount.isEmpty ? "$0" : "$\(amount)"
    }

    private var canSubmit: Bool {
        guard decimalAmount > 0 else { return false }
        switch mode {
        case .deposit:
            return selectedGoalID != nil
        case .transfer:
            guard let source = sourceGoal, let target = targetGoal, source.id != target.id else {
                return false
            }
            return decimalAmount <= source.saved
        }
    }

    private func submit() {
        guard canSubmit, let goalID = selectedGoalID else { return }
        let reached: Bool
        switch mode {
        case .deposit:
            reached = appState.deposit(decimalAmount, into: goalID)
        case .transfer:
            guard let sourceID = sourceGoalID else { return }
            reached = appState.transfer(decimalAmount, from: sourceID, to: goalID)
        }
        onCompleted?(goalID, reached)
        dismiss()
    }
}
