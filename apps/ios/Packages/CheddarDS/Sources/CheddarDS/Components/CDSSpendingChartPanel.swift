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
    /// A row of proportionally sized blocks, each labelled with its own amount.
    case segmented
    /// A single stacked bar under the total.
    case bar
    /// A donut with the total in the hole.
    case pie
}

/// The design system's spending panel. It is a light island on the branded canvas, so
/// everything inside reads from `CheddarColors.surface`.
///
/// The chart type drives both the accent step and where amounts live: `segmented` fills
/// blocks with the 500 step and labels them in place, while `bar` and `pie` draw data marks
/// at the 300 step and move amounts into the legend.
public struct CDSSpendingChartPanel<Badge: View>: View {
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
        VStack(alignment: .leading, spacing: type == .segmented ? CheddarSpacing.s : CheddarSpacing.m) {
            if hasHeader {
                HStack(spacing: CheddarSpacing.s) {
                    if let title {
                        Text(title)
                            .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
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
                stackedBar
            case .pie:
                donut
            }

            legend
        }
        .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
        .padding(CheddarSpacing.m)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(CheddarColors.surface.backgroundSurface)
        .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous)
                .stroke(CheddarColors.surface.borderDefault, lineWidth: 1)
        }
    }

    private var totalText: some View {
        Text(formatCurrency(total))
            .font(CheddarFonts.font(for: CheddarType.displaySmall))
            .tracking(CheddarType.displaySmall.tracking)
    }

    private var segmentedChart: some View {
        GeometryReader { geo in
            let gaps = CheddarSpacing.s * CGFloat(max(0, segments.count - 1))
            let widths = segmentWidths(in: max(0, geo.size.width - gaps))
            HStack(spacing: CheddarSpacing.s) {
                ForEach(Array(segments.enumerated()), id: \.element.id) { index, segment in
                    Text(formatCurrency(segment.amount))
                        .font(CheddarFonts.font(for: CheddarType.bodyMedium))
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
                        .padding(CheddarSpacing.xs)
                        .frame(width: widths[index])
                        .background(segment.accent.step500)
                        .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium, style: .continuous))
                }
            }
        }
        .frame(height: 104)
    }

    /// Shares drive the widths, but a small share still has to fit its own amount label —
    /// the web gets this from `min-width: min-content`, so reserve a floor here and take the
    /// difference back from the segments that have room to give.
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

    private var stackedBar: some View {
        GeometryReader { geo in
            HStack(spacing: 0) {
                ForEach(segments) { segment in
                    Rectangle()
                        .fill(segment.accent.step300)
                        .frame(width: geo.size.width * share(of: segment))
                }
            }
        }
        .frame(height: CheddarSpacing.m)
        .background(CheddarColors.surface.trackDefault)
        .clipShape(Capsule())
    }

    private var donut: some View {
        let diameter: CGFloat = 180
        let thickness = diameter * 0.22
        return ZStack {
            ForEach(Array(segments.enumerated()), id: \.element.id) { index, segment in
                Circle()
                    .trim(from: startFraction(before: index), to: startFraction(before: index) + share(of: segment))
                    .stroke(segment.accent.step300, lineWidth: thickness)
                    .rotationEffect(.degrees(-90))
                    .padding(thickness / 2)
            }
            Text(formatCurrency(total))
                .font(CheddarFonts.font(for: CheddarType.displaySmall))
                .tracking(CheddarType.displaySmall.tracking)
        }
        .frame(width: diameter, height: diameter)
        .frame(maxWidth: .infinity)
    }

    @ViewBuilder
    private var legend: some View {
        if type == .segmented {
            // Labels only: the segmented blocks already carry their amounts. The web lets these
            // wrap, so fall back to two rows when four do not fit the narrower phone width.
            ViewThatFits(in: .horizontal) {
                legendRow(Array(segments))
                VStack(alignment: .leading, spacing: CheddarSpacing.xxs) {
                    legendRow(Array(segments.prefix(2)))
                    legendRow(Array(segments.dropFirst(2)))
                }
            }
        } else {
            VStack(spacing: CheddarSpacing.xs) {
                ForEach(segments) { segment in
                    HStack(spacing: CheddarSpacing.xs) {
                        swatch(segment)
                        Text(segment.label)
                            .font(CheddarFonts.font(for: CheddarType.bodyLarge))
                        Spacer(minLength: CheddarSpacing.s)
                        Text(formatCurrency(segment.amount))
                            .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
                    }
                }
            }
        }
    }

    private func legendRow(_ items: [CDSSpendingSegment]) -> some View {
        HStack(spacing: CheddarSpacing.m) {
            ForEach(items) { segment in
                HStack(spacing: CheddarSpacing.xxs) {
                    swatch(segment)
                    Text(segment.label)
                        .font(CheddarFonts.font(for: CheddarType.bodyMedium))
                        .lineLimit(1)
                }
            }
        }
    }

    private func swatch(_ segment: CDSSpendingSegment) -> some View {
        RoundedRectangle(cornerRadius: CheddarSpacing.cornerXxsmall, style: .continuous)
            .fill(type == .segmented ? segment.accent.step500 : segment.accent.step300)
            .frame(width: 12, height: 12)
    }

    private func share(of segment: CDSSpendingSegment) -> CGFloat {
        guard total > 0 else { return 0 }
        return CGFloat(NSDecimalNumber(decimal: segment.amount / total).doubleValue)
    }

    private func startFraction(before index: Int) -> CGFloat {
        segments.prefix(index).reduce(0) { $0 + share(of: $1) }
    }

    private func formatCurrency(_ value: Decimal) -> String {
        String(format: "$%.2f", NSDecimalNumber(decimal: value).doubleValue)
    }
}

public extension CDSSpendingChartPanel where Badge == EmptyView {
    init(type: CDSChartType, title: String? = nil, segments: [CDSSpendingSegment]) {
        self.init(type: type, title: title, segments: segments) { EmptyView() }
    }
}
