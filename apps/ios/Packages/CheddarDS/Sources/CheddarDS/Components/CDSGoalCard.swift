import SwiftUI

public struct CDSGoal: Identifiable, Equatable {
    public let id: String
    public let name: String
    public let target: Decimal
    public let saved: Decimal
    public let accent: CDSAccent
    /// The goal's product shot, as a resource name in the design system bundle.
    public let imageAsset: String

    public init(
        id: String,
        name: String,
        target: Decimal,
        saved: Decimal,
        accent: CDSAccent,
        imageAsset: String
    ) {
        self.id = id
        self.name = name
        self.target = target
        self.saved = saved
        self.accent = accent
        self.imageAsset = imageAsset
    }

    /// 0–1, clamped: a goal can be over-funded by a transfer without overrunning its track.
    public var progress: Double {
        guard target > 0 else { return 0 }
        return min(1, max(0, NSDecimalNumber(decimal: saved / target).doubleValue))
    }

    public var remaining: Decimal { max(0, target - saved) }

    public func with(saved: Decimal) -> CDSGoal {
        CDSGoal(
            id: id,
            name: name,
            target: target,
            saved: saved,
            accent: accent,
            imageAsset: imageAsset
        )
    }
}

/// A progress track — a rounded rail with an accent fill.
///
/// The goal and badge cards draw the same 6pt bar over `track-default` with the accent's 300
/// step, so they share one view rather than each rebuilding it.
public struct CDSProgressTrack: View {
    @Environment(\.cheddarPalette) private var palette

    private let progress: Double
    private let fill: Color

    public init(progress: Double, fill: Color) {
        self.progress = progress
        self.fill = fill
    }

    public var body: some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                Capsule().fill(palette.trackDefault)
                Capsule()
                    .fill(fill)
                    .frame(width: geometry.size.width * min(1, max(0, progress)))
            }
        }
        .frame(height: 6)
    }
}

/// `GoalCard` — the standard savings-goal row.
///
/// One of the design system's always-light components, so it re-scopes to the island palette
/// and stays a white card whatever the shell is doing.
public struct CDSGoalCard: View {
    @Environment(\.cheddarTheme) private var theme

    private let goal: CDSGoal
    private let onTap: (() -> Void)?

    public init(goal: CDSGoal, onTap: (() -> Void)? = nil) {
        self.goal = goal
        self.onTap = onTap
    }

    public var body: some View {
        let card = content
            .cheddarIsland()

        if let onTap {
            Button(action: onTap) { card }
                .buttonStyle(.plain)
                .accessibilityLabel(accessibilityLabel)
        } else {
            card
        }
    }

    private var content: some View {
        let palette = theme.island
        return HStack(spacing: CheddarSpacing.gapS) {
            CDSResourceImage(goal.imageAsset)
                .scaledToFill()
                .frame(width: 64, height: 64)
                .clipShape(RoundedRectangle(
                    cornerRadius: CheddarSpacing.cornerXsmall,
                    style: .continuous
                ))
                .background(
                    RoundedRectangle(
                        cornerRadius: CheddarSpacing.cornerXsmall,
                        style: .continuous
                    )
                    .fill(goal.accent.step500)
                )
                .overlay {
                    RoundedRectangle(
                        cornerRadius: CheddarSpacing.cornerXsmall,
                        style: .continuous
                    )
                    .strokeBorder(palette.borderDefault, lineWidth: CheddarSpacing.border)
                }

            VStack(alignment: .leading, spacing: 6) {
                HStack(spacing: CheddarSpacing.gapS) {
                    Text(goal.name)
                    Spacer(minLength: 0)
                    Text(CDSCurrency.format(goal.target))
                }
                .cdsType(CheddarType.bodyMediumStrong)

                CDSProgressTrack(progress: goal.progress, fill: goal.accent.step300)

                HStack(spacing: CheddarSpacing.gapS) {
                    Text(CDSCurrency.format(goal.saved))
                    Spacer(minLength: 0)
                    Text(CDSCurrency.format(goal.remaining))
                }
                .cdsType(CheddarType.bodySmall)
                .foregroundStyle(palette.foregroundSecondary)
            }
        }
        .padding(CheddarSpacing.s)
        .frame(maxWidth: .infinity, minHeight: 88)
        .foregroundStyle(palette.foregroundOnSurface)
        .cdsCard(background: palette.backgroundSurface, border: palette.borderDefault)
    }

    private var accessibilityLabel: String {
        let percent = Int((goal.progress * 100).rounded())
        return "\(goal.name), \(CDSCurrency.format(goal.saved)) of \(CDSCurrency.format(goal.target)), \(percent)% saved"
    }
}

/// `CompletedGoalCard` — the 159pt tile in the completed-goals carousel.
///
/// Pinned to the light palette like `GoalCard`, but through the DS surface layer rather than
/// the always-light one; the distinction does not change what it paints.
public struct CDSCompletedGoalCard: View {
    @Environment(\.cheddarTheme) private var theme

    private let goal: CDSGoal
    private let onTap: (() -> Void)?

    public init(goal: CDSGoal, onTap: (() -> Void)? = nil) {
        self.goal = goal
        self.onTap = onTap
    }

    public var body: some View {
        let card = content.cheddarIsland()

        if let onTap {
            Button(action: onTap) { card }
                .buttonStyle(.plain)
                .accessibilityLabel("\(goal.name), \(CDSCurrency.format(goal.target))")
        } else {
            card
        }
    }

    private var content: some View {
        let palette = theme.island
        return VStack(alignment: .leading, spacing: 0) {
            CDSResourceImage(goal.imageAsset)
                .scaledToFit()
                .frame(width: 96, height: 96)
                .frame(maxWidth: .infinity)
                .frame(height: 112)
                .background(goal.accent.step500)

            VStack(alignment: .leading, spacing: 2) {
                Text(goal.name)
                    .cdsType(CheddarType.bodyLargeStrong)
                    .foregroundStyle(palette.foregroundPrimary)
                Text(CDSCurrency.format(goal.target))
                    .cdsType(CheddarType.bodyLarge)
                    .foregroundStyle(palette.foregroundSecondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(CheddarSpacing.s)
        }
        .frame(width: 159)
        .cdsCard(background: palette.backgroundSurface, border: palette.borderDefault)
    }
}
