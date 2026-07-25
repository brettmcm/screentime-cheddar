import SwiftUI
import CheddarDS

struct GoalReachedView: View {
    @Environment(\.dismiss) private var dismiss
    let goal: CDSGoal
    var onDone: (() -> Void)?

    @State private var sliderOffset: CGFloat = 0
    @State private var unlocked = false

    init(goal: CDSGoal, onDone: (() -> Void)? = nil) {
        self.goal = goal
        self.onDone = onDone
    }

    var body: some View {
        VStack(spacing: CheddarSpacing.l) {
            Spacer()
            CheddarTypography.displayMedium("Goal Reached")
                .foregroundStyle(CheddarColors.shell.foregroundBrandPrimary)
                .multilineTextAlignment(.center)

            CDSBrandIllustration(size: 280) {
                CDSResourceImage.app("goal-reached")
                    .scaledToFit()
            }

            CheddarTypography.heading("You saved \(formatCurrency(goal.target)) for \(goal.name)")
                .multilineTextAlignment(.center)
                .padding(.horizontal, CheddarSpacing.l)

            unlockSlider
                .padding(.horizontal, CheddarSpacing.l)

            Spacer()

            CDSButton("Back to Dashboard", variant: .primary) {
                finish()
            }
            .padding(.horizontal, CheddarSpacing.l)
            .padding(.bottom, CheddarSpacing.l)
        }
        .background(CheddarColors.shell.backgroundDefault)
    }

    private var unlockSlider: some View {
        GeometryReader { proxy in
            let thumb: CGFloat = 76
            let padding: CGFloat = 6
            let maxOffset = max(0, proxy.size.width - thumb - padding * 2)

            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge)
                    .fill(CheddarColors.surface.backgroundSurface)

                Text(unlocked ? "Savings unlocked!" : "Slide to unlock")
                    .font(CheddarFonts.monaSans(size: 16, weight: .semibold))
                    .foregroundStyle(CheddarColors.shell.foregroundPrimary)
                    .frame(maxWidth: .infinity)

                ZStack {
                    Circle()
                        .fill(unlocked ? CheddarColors.green300 : CheddarColors.brand300)
                    Image(systemName: unlocked ? "checkmark" : "sparkle")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundStyle(CheddarColors.white100)
                }
                .frame(width: thumb, height: thumb)
                .offset(x: sliderOffset)
                .padding(padding)
                .gesture(
                    DragGesture()
                        .onChanged { value in
                            guard !unlocked else { return }
                            sliderOffset = min(max(0, value.translation.width), maxOffset)
                        }
                        .onEnded { _ in
                            if sliderOffset > maxOffset * 0.82 {
                                withAnimation(.spring(response: 0.3)) {
                                    sliderOffset = maxOffset
                                    unlocked = true
                                }
                            } else {
                                withAnimation(.spring(response: 0.3)) {
                                    sliderOffset = 0
                                }
                            }
                        }
                )
            }
        }
        .frame(height: 88)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Slide to unlock savings")
        .accessibilityValue(unlocked ? "Unlocked" : "Locked")
        .accessibilityAction {
            withAnimation {
                unlocked = true
            }
        }
    }

    private func finish() {
        if let onDone {
            onDone()
        } else {
            dismiss()
        }
    }

    private func formatCurrency(_ value: Decimal) -> String {
        String(format: "$%.2f", NSDecimalNumber(decimal: value).doubleValue)
    }
}
