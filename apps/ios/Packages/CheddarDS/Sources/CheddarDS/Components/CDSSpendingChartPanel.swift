import SwiftUI

public struct CDSSpendingSegment: Identifiable {
    public let id = UUID()
    public let label: String
    public let amount: Decimal
    public let accent: CDSAccent

    public init(label: String, amount: Decimal, accent: CDSAccent) {
        self.label = label
        self.amount = amount
        self.accent = accent
    }
}

public enum CDSChartType {
    /// A row of proportionally sized columns, each labelled with its own amount.
    case segmented
    /// A single stacked bar under the total.
    case bar
    /// A donut with the total in the hole.
    case pie
}

/// `SpendingChartPanel` — the spending breakdown, in three shapes.
///
/// The chart type drives both the accent step and where the amounts live: `segmented` fills
/// columns with the 500 step and labels them in place, so its legend collapses to an inline
/// key; `bar` and `pie` draw data marks at the 300 step and move the amounts into a stacked
/// legend. One of the always-light components.
public struct CDSSpendingChartPanel<Badge: View>: View {
    @Environment(\.cheddarTheme) private var theme

    private let type: CDSChartType
    private let title: String?
    private let segments: [CDSSpendingSegment]
    private let badge: Badge

    public init(
        type: CDSChartType,
        title: String? = nil,
        segments: [CDSSpendingSegment],
        @ViewBuilder badge: () -> Badge
    ) {
        self.type = type
        self.title = title
        self.segments = segments
        self.badge = badge()
    }

    private var total: Decimal { segments.reduce(0) { $0 + $1.amount } }
    private var hasHeader: Bool { title != nil || Badge.self != EmptyView.self }

    public var body: some View {
        let palette = theme.island

        VStack(alignment: .leading, spacing: type == .segmented ? CheddarSpacing.s : CheddarSpacing.m) {
            if hasHeader {
                HStack(spacing: CheddarSpacing.gapS) {
                    if let title {
                        Text(title).cdsType(CheddarType.bodyLargeStrong)
                    }
                    Spacer(minLength: 0)
                    badge
                }
            }

            switch type {
            case .segmented:
                segmentedChart
            case .bar:
                totalText
                stackedBar(palette: palette)
            case .pie:
                donut
            }

            legend(palette: palette)
        }
        .padding(CheddarSpacing.m)
        .frame(maxWidth: .infinity, alignment: .leading)
        .foregroundStyle(palette.foregroundOnSurface)
        .cdsCard(background: palette.backgroundSurface, border: palette.borderDefault)
        .cheddarIsland()
    }

    private var totalText: some View {
        Text(CDSCurrency.format(total)).cdsType(CheddarType.displaySmall)
    }

    // MARK: - Segmented

    private var segmentedChart: some View {
        GeometryReader { geometry in
            let gaps = CheddarSpacing.gapS * CGFloat(max(0, segments.count - 1))
            let widths = segmentWidths(in: max(0, geometry.size.width - gaps))
            HStack(spacing: CheddarSpacing.gapS) {
                ForEach(Array(segments.enumerated()), id: \.element.id) { index, segment in
                    Text(CDSCurrency.format(segment.amount))
                        .cdsType(CheddarType.bodyMedium)
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                        .foregroundStyle(segment.accent.step100)
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
                        .padding(CheddarSpacing.s)
                        .frame(width: widths[index])
                        .background(segment.accent.step500)
                        .clipShape(RoundedRectangle(
                            cornerRadius: CheddarSpacing.cornerLarge,
                            style: .continuous
                        ))
                }
            }
        }
        .frame(height: 104)
    }

    /// Shares drive the widths, but a small share still has to fit its own amount label — the
    /// web gets that from `min-width: min-content`. Reserve a floor here and take the
    /// difference back from the columns that have room to give.
    private func segmentWidths(in available: CGFloat) -> [CGFloat] {
        let floor: CGFloat = 68
        var widths = segments.map { available * share(of: $0) }
        guard available > floor * CGFloat(segments.count) else {
            return Array(repeating: available / CGFloat(max(1, segments.count)), count: segments.count)
        }
        let deficit = widths.reduce(CGFloat.zero) { $0 + max(0, floor - $1) }
        guard deficit > 0 else { return widths }
        let surplus = widths.reduce(CGFloat.zero) { $0 + max(0, $1 - floor) }
        for index in widths.indices {
            if widths[index] < floor {
                widths[index] = floor
            } else if surplus > 0 {
                widths[index] -= (widths[index] - floor) / surplus * deficit
            }
        }
        return widths
    }

    // MARK: - Bar and donut

    private func stackedBar(palette: CheddarPalette) -> some View {
        GeometryReader { geometry in
            HStack(spacing: 0) {
                ForEach(segments) { segment in
                    Rectangle()
                        .fill(segment.accent.step300)
                        .frame(width: geometry.size.width * share(of: segment))
                }
            }
        }
        .frame(height: CheddarSpacing.m)
        .background(palette.trackDefault)
        .clipShape(Capsule())
    }

    private var donut: some View {
        let diameter: CGFloat = 180
        let thickness = diameter * 0.22
        return ZStack {
            ForEach(Array(segments.enumerated()), id: \.element.id) { index, segment in
                Circle()
                    .trim(
                        from: startFraction(before: index),
                        to: startFraction(before: index) + share(of: segment)
                    )
                    .stroke(segment.accent.step300, lineWidth: thickness)
                    .rotationEffect(.degrees(-90))
                    .padding(thickness / 2)
            }
            Text(CDSCurrency.format(total)).cdsType(CheddarType.displaySmall)
        }
        .frame(width: diameter, height: diameter)
        .frame(maxWidth: .infinity)
    }

    // MARK: - Legend

    @ViewBuilder
    private func legend(palette: CheddarPalette) -> some View {
        if type == .segmented {
            // Labels only: the columns already carry their amounts.
            CDSWrapLayout(spacing: CheddarSpacing.gapM, lineSpacing: CheddarSpacing.gapXs) {
                ForEach(segments) { segment in
                    HStack(spacing: CheddarSpacing.gapXs) {
                        swatch(segment)
                        Text(segment.label).cdsType(CheddarType.bodyMedium)
                    }
                }
            }
        } else {
            VStack(spacing: CheddarSpacing.xs) {
                ForEach(segments) { segment in
                    HStack(spacing: CheddarSpacing.xs) {
                        swatch(segment)
                        Text(segment.label).cdsType(CheddarType.bodyLarge)
                        Spacer(minLength: CheddarSpacing.gapS)
                        Text(CDSCurrency.format(segment.amount))
                            .cdsType(CheddarType.bodyLargeStrong)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func swatch(_ segment: CDSSpendingSegment) -> some View {
        let side = CheddarSpacing.iconSmall
        if type == .segmented {
            Circle().fill(segment.accent.step500).frame(width: side, height: side)
        } else {
            RoundedRectangle(cornerRadius: CheddarSpacing.cornerXxsmall, style: .continuous)
                .fill(segment.accent.step300)
                .frame(width: side, height: side)
        }
    }

    private func share(of segment: CDSSpendingSegment) -> CGFloat {
        guard total > 0 else { return 0 }
        return CGFloat(NSDecimalNumber(decimal: segment.amount / total).doubleValue)
    }

    private func startFraction(before index: Int) -> CGFloat {
        segments.prefix(index).reduce(0) { $0 + share(of: $1) }
    }
}

public extension CDSSpendingChartPanel where Badge == EmptyView {
    init(type: CDSChartType, title: String? = nil, segments: [CDSSpendingSegment]) {
        self.init(type: type, title: title, segments: segments) { EmptyView() }
    }
}
