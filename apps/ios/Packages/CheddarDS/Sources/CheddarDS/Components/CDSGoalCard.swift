import SwiftUI

public struct CDSGoal: Identifiable {
    public let id: String
    public let name: String
    public let target: Decimal
    public let saved: Decimal
    public let accent: Color
    public let imageAsset: String?

    public init(
        id: String,
        name: String,
        target: Decimal,
        saved: Decimal,
        accent: Color,
        imageAsset: String? = nil,
        iconName: String = "star.fill"
    ) {
        self.id = id
        self.name = name
        self.target = target
        self.saved = saved
        self.accent = accent
        self.imageAsset = imageAsset
        self.iconName = iconName
    }

    public let iconName: String

    public var progress: Double {
        guard target > 0 else { return 0 }
        return min(1, NSDecimalNumber(decimal: saved / target).doubleValue)
    }

    public var remaining: Decimal { max(0, target - saved) }
}

public struct CDSGoalCard: View {
    let goal: CDSGoal

    public init(goal: CDSGoal) {
        self.goal = goal
    }

    public var body: some View {
        HStack(spacing: CheddarSpacing.xs) {
            CDSGoalArtwork(goal: goal, size: 56)
            VStack(alignment: .leading, spacing: CheddarSpacing.xxs) {
                HStack {
                    Text(goal.name)
                        .font(CheddarFonts.monaSans(size: 16, weight: .medium))
                    Spacer()
                    Text(formatCurrency(goal.target))
                        .font(CheddarFonts.monaSans(size: 16, weight: .medium))
                }
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Capsule().fill(CheddarColors.surface.borderDefault)
                        Capsule()
                            .fill(goal.accent)
                            .frame(width: geo.size.width * goal.progress)
                    }
                }
                .frame(height: 8)
                HStack {
                    Text(formatCurrency(goal.saved))
                    Spacer()
                    Text(formatCurrency(goal.remaining))
                }
                .font(CheddarFonts.monaSans(size: 14, weight: .medium))
                .foregroundStyle(CheddarColors.surface.foregroundSecondary)
            }
        }
        .padding(CheddarSpacing.m)
        .background(CheddarColors.surface.backgroundSurface)
        .overlay {
            RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous)
                .stroke(CheddarColors.surface.borderDefault, lineWidth: 1)
        }
        .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous))
    }

    private func formatCurrency(_ value: Decimal) -> String {
        let n = NSDecimalNumber(decimal: value)
        return String(format: "$%.2f", n.doubleValue)
    }
}

public struct CDSGoalArtwork: View {
    private let goal: CDSGoal
    private let size: CGFloat

    public init(goal: CDSGoal, size: CGFloat = 56) {
        self.goal = goal
        self.size = size
    }

    public var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: max(12, size * 0.22), style: .continuous)
                .fill(goal.accent.opacity(0.35))
                .overlay {
                    RoundedRectangle(cornerRadius: max(12, size * 0.22), style: .continuous)
                        .stroke(CheddarColors.surface.borderDefault, lineWidth: 1)
                }
            CDSGoalImage(goal: goal, symbolSize: size * 0.4)
                .padding(size * 0.12)
        }
        .frame(width: size, height: size)
        .accessibilityHidden(true)
    }
}

/// A goal's product shot, falling back to its symbol when there's no asset.
/// Shared by the card thumbnail and the goal detail illustration so the two
/// can't drift.
public struct CDSGoalImage: View {
    private let goal: CDSGoal
    private let symbolSize: CGFloat

    public init(goal: CDSGoal, symbolSize: CGFloat = 40) {
        self.goal = goal
        self.symbolSize = symbolSize
    }

    public var body: some View {
        if let asset = goal.imageAsset {
            CDSResourceImage("\(asset).png")
                .scaledToFit()
        } else {
            Image(systemName: goal.iconName)
                .font(.system(size: symbolSize))
                .foregroundStyle(goal.accent)
        }
    }
}
