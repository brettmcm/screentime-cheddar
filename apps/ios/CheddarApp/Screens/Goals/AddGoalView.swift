import SwiftUI
import CheddarDS

struct AddGoalView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var appState: AppState

    @State private var step = 0
    @State private var goalName = ""
    @State private var selectedIcon: GoalIconChoice = .headphones
    @State private var targetAmount = ""
    @State private var startingAmount = ""
    @State private var activeAmount: AmountField = .target

    var body: some View {
        VStack(spacing: 0) {
            CDSPageHeader(title: "Add Goal", showsBack: true) {
                if step == 0 {
                    dismiss()
                } else {
                    withAnimation { step = 0 }
                }
            }
            .padding(.horizontal, CheddarSpacing.l)
            .padding(.top, CheddarSpacing.l)

            if step == 0 {
                detailsStep
                    .transition(.move(edge: .leading).combined(with: .opacity))
            } else {
                amountStep
                    .transition(.move(edge: .trailing).combined(with: .opacity))
            }
        }
        .background(CheddarColors.shell.backgroundDefault.ignoresSafeArea())
    }

    private var detailsStep: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.l) {
            VStack(alignment: .leading, spacing: CheddarSpacing.xs) {
                Text("Goal name")
                    .font(CheddarFonts.monaSans(size: 14, weight: .medium))
                    .foregroundStyle(CheddarColors.shell.foregroundSecondary)
                TextField("e.g. New Shoes, Birthday Trip…", text: $goalName)
                    .font(CheddarFonts.monaSans(size: 16, weight: .medium))
                    .padding(CheddarSpacing.m)
                    .background(CheddarColors.surface.backgroundSurface)
                    .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium))
                    .textInputAutocapitalization(.words)
            }

            VStack(alignment: .leading, spacing: CheddarSpacing.s) {
                Text("Choose an icon")
                    .font(CheddarFonts.monaSans(size: 14, weight: .medium))
                    .foregroundStyle(CheddarColors.shell.foregroundSecondary)
                HStack(spacing: CheddarSpacing.s) {
                    ForEach(GoalIconChoice.allCases) { choice in
                        Button {
                            selectedIcon = choice
                        } label: {
                            CDSGoalArtwork(goal: choice.previewGoal, size: 64)
                                .overlay {
                                    RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium)
                                        .stroke(
                                            selectedIcon == choice
                                                ? CheddarColors.shell.foregroundBrandPrimary
                                                : .clear,
                                            lineWidth: 3
                                        )
                                }
                        }
                        .buttonStyle(.plain)
                        .accessibilityLabel(choice.label)
                    }
                }
            }

            Spacer()

            CDSButton(
                "Next: Set amount",
                isEnabled: !goalName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            ) {
                withAnimation { step = 1 }
            }
        }
        .padding(CheddarSpacing.l)
    }

    private var amountStep: some View {
        VStack(spacing: CheddarSpacing.m) {
            VStack(spacing: CheddarSpacing.xs) {
                amountButton(
                    title: "Goal amount",
                    value: targetAmount,
                    field: .target,
                    prominent: true
                )
                amountButton(
                    title: "Starting saved amount (optional)",
                    value: startingAmount,
                    field: .starting,
                    prominent: false
                )
            }

            CDSAmountKeypad(value: activeAmount == .target ? $targetAmount : $startingAmount)

            CDSButton(
                "Add Goal: \(goalName)",
                isEnabled: parsedTarget > 0
            ) {
                appState.addGoal(
                    name: goalName.trimmingCharacters(in: .whitespacesAndNewlines),
                    target: parsedTarget,
                    startingSaved: min(parsedStarting, parsedTarget),
                    icon: selectedIcon.systemImage,
                    imageAsset: selectedIcon.imageAsset,
                    accent: selectedIcon.accent
                )
                dismiss()
            }
        }
        .padding(CheddarSpacing.l)
    }

    private func amountButton(
        title: String,
        value: String,
        field: AmountField,
        prominent: Bool
    ) -> some View {
        Button {
            activeAmount = field
        } label: {
            VStack(spacing: CheddarSpacing.xxs) {
                Text(title)
                    .font(CheddarFonts.monaSans(size: 14, weight: .medium))
                    .foregroundStyle(CheddarColors.shell.foregroundSecondary)
                Text(value.isEmpty ? "$0" : "$\(value)")
                    .font(
                        prominent
                            ? CheddarFonts.oswald(size: 64, weight: .semibold)
                            : CheddarFonts.monaSans(size: 24, weight: .medium)
                    )
                    .foregroundStyle(
                        activeAmount == field
                            ? CheddarColors.shell.foregroundBrandPrimary
                            : CheddarColors.shell.foregroundPrimary
                    )
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, CheddarSpacing.s)
            .background(
                activeAmount == field
                    ? CheddarColors.surface.backgroundSurface.opacity(0.75)
                    : .clear
            )
            .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium))
        }
        .buttonStyle(.plain)
    }

    private var parsedTarget: Decimal { Decimal(string: targetAmount) ?? 0 }
    private var parsedStarting: Decimal { Decimal(string: startingAmount) ?? 0 }
}

private enum AmountField {
    case target
    case starting
}

private enum GoalIconChoice: String, CaseIterable, Identifiable {
    case headphones
    case sneakers
    case trip
    case generic

    var id: String { rawValue }

    var label: String {
        switch self {
        case .headphones: "Headphones"
        case .sneakers: "Sneakers"
        case .trip: "Trip"
        case .generic: "Something else"
        }
    }

    var imageAsset: String? {
        switch self {
        case .headphones: "goal-headphones"
        case .sneakers: "goal-sneakers"
        case .trip: "goal-goggles"
        case .generic: nil
        }
    }

    var systemImage: String {
        switch self {
        case .headphones: "headphones"
        case .sneakers: "shoe.fill"
        case .trip: "airplane"
        case .generic: "star.fill"
        }
    }

    var accent: Color {
        switch self {
        case .headphones: CheddarColors.brand300
        case .sneakers: CheddarColors.purple300
        case .trip: CheddarColors.green300
        case .generic: CheddarColors.blue400
        }
    }

    var previewGoal: CDSGoal {
        CDSGoal(
            id: rawValue,
            name: label,
            target: 1,
            saved: 0,
            accent: accent,
            imageAsset: imageAsset,
            iconName: systemImage
        )
    }
}
