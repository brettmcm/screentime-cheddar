import SwiftUI

/// `Slider` — the slide-to-confirm control on the goal-reached screen.
///
/// A brand-400 pill with a 96pt disc that carries the logo mark. Dragging past `completeAt`
/// fires `onComplete`; with `snapOnComplete` the thumb finishes the trip on its own.
public struct CDSSlider: View {
    @Environment(\.cheddarPalette) private var palette
    /// The label takes the screen's text alignment, the way the web's inherits `text-align`.
    @Environment(\.multilineTextAlignment) private var textAlignment

    private let label: String
    private let range: ClosedRange<Double>
    private let completeAt: Double?
    private let snapOnComplete: Bool
    private let showsValue: Bool
    private let onComplete: (() -> Void)?

    @State private var value: Double
    @State private var hasCompleted = false

    public init(
        label: String = "Monthly savings goal",
        range: ClosedRange<Double> = 0...1000,
        initialValue: Double = 420,
        completeAt: Double? = nil,
        snapOnComplete: Bool = false,
        showsValue: Bool = true,
        onComplete: (() -> Void)? = nil
    ) {
        self.label = label
        self.range = range
        self.completeAt = completeAt
        self.snapOnComplete = snapOnComplete
        self.showsValue = showsValue
        self.onComplete = onComplete
        _value = State(initialValue: initialValue)
    }

    private let thumbSize: CGFloat = 96

    public var body: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.xs) {
            Text(label)
                .cdsType(CheddarType.bodyMediumStrong)
                .frame(maxWidth: .infinity, alignment: labelAlignment)

            track

            // The bounds are the raw numbers on the web; only the reading between them is
            // money.
            HStack(spacing: CheddarSpacing.gapS) {
                Text(bound(range.lowerBound))
                if showsValue {
                    Spacer(minLength: 0)
                    Text(CDSCurrency.format(Decimal(value)))
                        .cdsType(CheddarType.bodyMediumStrong)
                }
                Spacer(minLength: 0)
                Text(bound(range.upperBound))
            }
            .cdsType(CheddarType.bodyMedium)
            .foregroundStyle(palette.foregroundSecondary)
        }
        .frame(maxWidth: 360)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(label)
        .accessibilityValue(CDSCurrency.format(Decimal(value)))
        .accessibilityAdjustableAction { direction in
            let step = (range.upperBound - range.lowerBound) / 10
            value = min(max(value + (direction == .increment ? step : -step), range.lowerBound), range.upperBound)
            complete()
        }
    }

    private var track: some View {
        GeometryReader { geometry in
            let travel = max(geometry.size.width - thumbSize, 1)
            thumb
                .offset(x: travel * fraction)
                .gesture(
                    DragGesture(minimumDistance: 0)
                        .onChanged { drag in
                            update(to: drag.location.x - thumbSize / 2, travel: travel)
                        }
                        .onEnded { _ in complete() }
                )
        }
        .frame(height: thumbSize)
        .padding(12)
        .frame(maxWidth: .infinity)
        .background(palette.ramp.step400)
        .clipShape(Capsule())
    }

    private var labelAlignment: Alignment {
        switch textAlignment {
        case .leading: .leading
        case .center: .center
        case .trailing: .trailing
        }
    }

    private func bound(_ value: Double) -> String {
        value == value.rounded() ? String(Int(value)) : String(value)
    }

    private var thumb: some View {
        ZStack {
            Circle().fill(palette.bgBrandPrimary)
            CDSLogoMark(height: 43)
                .foregroundStyle(palette.foregroundBrandPrimary)
        }
        .frame(width: thumbSize, height: thumbSize)
        .cdsShadowControlRaised()
    }

    private var fraction: CGFloat {
        let span = range.upperBound - range.lowerBound
        guard span > 0 else { return 0 }
        return CGFloat((value - range.lowerBound) / span)
    }

    private func update(to x: CGFloat, travel: CGFloat) {
        let ratio = min(max(x / travel, 0), 1)
        value = range.lowerBound + Double(ratio) * (range.upperBound - range.lowerBound)
        if value < (completeAt ?? range.upperBound) { hasCompleted = false }
    }

    private func complete() {
        guard !hasCompleted, value >= (completeAt ?? range.upperBound) else {
            if snapOnComplete, !hasCompleted {
                withAnimation(.spring(response: 0.3, dampingFraction: 0.9)) {
                    value = range.lowerBound
                }
            }
            return
        }
        hasCompleted = true
        if snapOnComplete {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.9)) {
                value = range.upperBound
            }
        }
        onComplete?()
    }
}
