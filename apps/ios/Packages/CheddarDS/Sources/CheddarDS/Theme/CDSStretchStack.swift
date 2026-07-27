import SwiftUI

/// A column whose rows share out the height left over above `minHeight` — a CSS grid under
/// `align-content: stretch`, which is how the savings card fills its 255pt floor.
///
/// Every row keeps its own height plus an equal share of the surplus. A flexible SwiftUI
/// frame divides the whole column evenly instead, which starves the tall row and leaves the
/// short one padded out. The floor lives here rather than in an enclosing `frame` because a
/// `frame` never tells its child about the room it reserved, so the rows would have nothing
/// to share.
public struct CDSStretchStack: Layout {
    private let spacing: CGFloat
    private let minHeight: CGFloat

    public init(spacing: CGFloat, minHeight: CGFloat) {
        self.spacing = spacing
        self.minHeight = minHeight
    }

    public func sizeThatFits(
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout Void
    ) -> CGSize {
        let sizes = self.sizes(of: subviews, width: proposal.width)
        let width = sizes.map(\.width).max() ?? 0
        return CGSize(
            width: proposal.width ?? width,
            height: max(content(of: sizes), minHeight)
        )
    }

    public func placeSubviews(
        in bounds: CGRect,
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout Void
    ) {
        let sizes = self.sizes(of: subviews, width: bounds.width)
        let surplus = max(bounds.height - content(of: sizes), 0)
        let share = subviews.isEmpty ? 0 : surplus / CGFloat(subviews.count)

        var y = bounds.minY
        for index in subviews.indices {
            let height = sizes[index].height + share
            subviews[index].place(
                at: CGPoint(x: bounds.minX, y: y),
                anchor: .topLeading,
                proposal: ProposedViewSize(width: bounds.width, height: height)
            )
            y += height + spacing
        }
    }

    private func sizes(of subviews: Subviews, width: CGFloat?) -> [CGSize] {
        subviews.map { $0.sizeThatFits(ProposedViewSize(width: width, height: nil)) }
    }

    private func content(of sizes: [CGSize]) -> CGFloat {
        sizes.map(\.height).reduce(0, +) + spacing * CGFloat(max(0, sizes.count - 1))
    }
}
