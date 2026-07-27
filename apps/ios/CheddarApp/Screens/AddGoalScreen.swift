import CheddarDS
import SwiftUI

/// Each illustration carries the accent ramp the new goal's cards will use.
private let choices: [(illustration: GoalIllustration, accent: CDSAccent)] = [
    (.headphones, .magenta),
    (.sneakers, .purple),
    (.travel, .green),
    (.camera, .blue),
]

private let maxAmountLength = 9

struct AddGoalScreen: View {
    @EnvironmentObject private var app: AppState
    @Environment(\.cheddarPalette) private var palette

    private enum Step {
        case details
        case amount
    }

    private enum Field {
        case target
        case starting
    }

    @State private var step: Step = .details
    @State private var name = ""
    @State private var illustration: GoalIllustration = .headphones
    @State private var target = ""
    @State private var starting = ""
    @State private var activeField: Field = .target

    private var accent: CDSAccent {
        choices.first { $0.illustration == illustration }?.accent ?? .magenta
    }

    var body: some View {
        AppScreen(spacing: CheddarSpacing.gapL, fillsViewport: true) {
            CDSPageHeader("Add Goal", align: .center, onBack: {
                if step == .details { app.back() } else { step = .details }
            })

            switch step {
            case .details: detailsStep
            case .amount: amountStep
            }
        }
    }

    private var detailsStep: some View {
        Group {
            CDSInputField(
                label: "Goal name",
                text: $name,
                description: "e.g. New Shoes, Birthday Trip"
            )

            VStack(alignment: .leading, spacing: 0) {
                Text("Choose an illustration")
                    .padding(.bottom, CheddarSpacing.s)
                // Fixed tiles spread across the row, the web's `space-between`.
                HStack(spacing: 0) {
                    ForEach(Array(choices.enumerated()), id: \.element.illustration) { index, choice in
                        if index > 0 { Spacer(minLength: CheddarSpacing.gapS) }
                        illustrationButton(choice.illustration)
                    }
                }
            }

            Spacer(minLength: 0)

            CDSButton("Next: Set amount", isEnabled: !name.trimmed.isEmpty) {
                step = .amount
            }
        }
    }

    private var amountStep: some View {
        Group {
            AmountReadout(
                amount: target,
                caption: "Goal amount",
                captionFirst: true,
                isActive: activeField == .target,
                onTap: { activeField = .target }
            )

            AmountReadout(
                amount: starting,
                caption: "Starting saved amount (optional)",
                captionFirst: true,
                isActive: activeField == .starting,
                onTap: { activeField = .starting }
            )

            CDSNumberPad(
                value: activeField == .target ? $target : $starting,
                maxLength: maxAmountLength
            )

            Spacer(minLength: 0)

            CDSButton("Add Goal: \(name)", isEnabled: targetAmount > 0, action: submit)
        }
        .multilineTextAlignment(.center)
    }

    private func illustrationButton(_ choice: GoalIllustration) -> some View {
        let isSelected = illustration == choice
        return Button {
            illustration = choice
        } label: {
            CDSResourceImage(choice.asset)
                .scaledToFit()
                .frame(width: 72, height: 72)
                .background(palette.bgBrandSecondary)
                .clipShape(RoundedRectangle(
                    cornerRadius: CheddarSpacing.cornerMedium,
                    style: .continuous
                ))
                .overlay {
                    RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium, style: .continuous)
                        .strokeBorder(
                            isSelected ? palette.foregroundBrandPrimary : .clear,
                            lineWidth: 3
                        )
                }
        }
        .buttonStyle(.plain)
        .accessibilityLabel(choice.label)
        .accessibilityAddTraits(isSelected ? [.isSelected] : [])
    }

    private var targetAmount: Decimal { Decimal(string: target) ?? 0 }

    private func submit() {
        app.addGoal(
            name: name.trimmed,
            target: targetAmount,
            saved: min(Decimal(string: starting) ?? 0, targetAmount),
            illustration: illustration,
            accent: accent
        )
    }
}

extension String {
    var trimmed: String { trimmingCharacters(in: .whitespacesAndNewlines) }
}
