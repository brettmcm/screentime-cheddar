import SwiftUI

/// `ProfileCard` — the profile header.
///
/// Follows the shell rather than pinning to light: it is a brand-tinted panel with reversed
/// type, the same treatment as `TotalSavingsCard`.
public struct CDSProfileCard: View {
    @Environment(\.cheddarPalette) private var palette

    private let name: String
    private let handle: String
    private let avatarAsset: String?
    private let actions: [CDSCardAction]

    public init(
        name: String,
        handle: String,
        avatarAsset: String? = nil,
        actions: [CDSCardAction] = []
    ) {
        self.name = name
        self.handle = handle
        self.avatarAsset = avatarAsset
        self.actions = actions
    }

    public var body: some View {
        VStack(spacing: CheddarSpacing.xs) {
            // A 96pt brand-300 disc with the 40pt avatar centred in it — the DS sizes the
            // ring and the portrait independently.
            CDSAvatar(size: .large, asset: avatarAsset, name: name)
                .frame(width: 96, height: 96)
                .background(palette.ramp.step300)
                .clipShape(Circle())

            Text(name)
                .cdsType(CheddarType.displayMedium)
                .padding(.top, CheddarSpacing.xs)
            Text(handle)
                .cdsType(CheddarType.bodyLarge)
                .foregroundStyle(palette.foregroundOnReverseSecondary)

            if !actions.isEmpty {
                HStack(spacing: CheddarSpacing.xs) {
                    ForEach(actions) { action in
                        CDSCardActionButton(
                            action.label,
                            icon: action.icon,
                            knockout: palette.bgBrandSecondary,
                            action: action.action
                        )
                    }
                }
                .padding(.top, CheddarSpacing.xs)
            }
        }
        .multilineTextAlignment(.center)
        .padding(CheddarSpacing.m)
        .frame(maxWidth: .infinity)
        // `box-sizing: border-box`: the floor covers the padding rather than sitting inside it.
        .frame(minHeight: 310)
        .foregroundStyle(palette.foregroundOnReverse)
        .cdsCard(background: palette.bgBrandSecondary, border: palette.borderDefault)
        .cheddarIconKnockout(palette.bgBrandSecondary)
    }
}

public struct CDSStreakDay: Identifiable {
    public let id = UUID()
    public let label: String
    public let name: String
    public let isComplete: Bool

    public init(label: String, name: String, isComplete: Bool) {
        self.label = label
        self.name = name
        self.isComplete = isComplete
    }
}

/// `SavingsStreak` — a week of marks, one per day.
public struct CDSSavingsStreak: View {
    @Environment(\.cheddarTheme) private var theme

    private let title: String
    private let days: [CDSStreakDay]

    public init(title: String = "Savings streak", days: [CDSStreakDay]) {
        self.title = title
        self.days = days
    }

    public var body: some View {
        let palette = theme.island
        VStack(alignment: .leading, spacing: CheddarSpacing.s) {
            Text(title)
                .cdsType(CheddarType.bodyLargeStrong)
                .foregroundStyle(palette.foregroundOnSurface)

            HStack(spacing: CheddarSpacing.gapXs) {
                ForEach(days) { day in
                    VStack(spacing: CheddarSpacing.gapXs) {
                        mark(for: day, palette: palette)
                        Text(day.label)
                            .cdsType(CheddarType.bodySmall)
                            .foregroundStyle(palette.foregroundSecondary)
                    }
                    .frame(maxWidth: .infinity)
                    .accessibilityElement(children: .ignore)
                    .accessibilityLabel("\(day.name): \(day.isComplete ? "saved" : "not saved")")
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(CheddarSpacing.s)
        .cdsCard(background: palette.backgroundSurface, border: palette.borderDefault)
        .cheddarIsland()
    }

    private func mark(for day: CDSStreakDay, palette: CheddarPalette) -> some View {
        ZStack {
            if day.isComplete {
                Circle().fill(palette.bgBrandPrimary)
                CDSIcon(.check, size: CheddarSpacing.iconMedium)
                    .foregroundStyle(palette.foregroundBrandPrimary)
            } else {
                Circle().strokeBorder(palette.borderStrong, lineWidth: CheddarSpacing.border)
            }
        }
        .frame(width: 32, height: 32)
    }
}

/// `BadgeCard` — an achievement with its progress toward the next step.
public struct CDSBadgeCard: View {
    @Environment(\.cheddarTheme) private var theme

    private let title: String
    private let caption: String
    /// Percent complete, 0–100.
    private let progress: Double
    private let icon: CheddarIconName
    private let accent: CDSAccent

    public init(
        title: String,
        caption: String,
        progress: Double,
        icon: CheddarIconName,
        accent: CDSAccent
    ) {
        self.title = title
        self.caption = caption
        self.progress = progress
        self.icon = icon
        self.accent = accent
    }

    public var body: some View {
        let palette = theme.island
        HStack(spacing: CheddarSpacing.s) {
            CDSIcon(icon, size: CheddarSpacing.iconLarge, knockout: accent.step500)
                .foregroundStyle(palette.foregroundPrimary)
                .frame(width: 64, height: 64)
                .background(accent.step500)
                .clipShape(RoundedRectangle(
                    cornerRadius: CheddarSpacing.cornerXsmall,
                    style: .continuous
                ))

            VStack(alignment: .leading, spacing: CheddarSpacing.xxs) {
                Text(title)
                    .cdsType(CheddarType.bodyLarge)
                    .foregroundStyle(palette.foregroundOnSurface)
                CDSProgressTrack(progress: progress / 100, fill: accent.step300)
                Text(caption)
                    .cdsType(CheddarType.bodyLarge)
                    .foregroundStyle(palette.foregroundSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
            // `flex: 1` — the column takes the rest of the row outright. A trailing spacer
            // would cost it the stack's gap and wrap the caption a word early.
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(CheddarSpacing.s)
        .frame(maxWidth: .infinity, minHeight: 111)
        .cdsCard(background: palette.backgroundSurface, border: palette.borderDefault)
        .cheddarIsland()
    }
}

/// `AccountCard` — a linked bank account and its balance.
public struct CDSAccountCard: View {
    @Environment(\.cheddarTheme) private var theme

    private let name: String
    private let subtitle: String
    private let amount: Decimal
    private let meta: String
    private let icon: CheddarIconName
    private let accent: CDSAccent

    public init(
        name: String,
        subtitle: String,
        amount: Decimal,
        meta: String,
        icon: CheddarIconName = .wallet,
        accent: CDSAccent = .magenta
    ) {
        self.name = name
        self.subtitle = subtitle
        self.amount = amount
        self.meta = meta
        self.icon = icon
        self.accent = accent
    }

    public var body: some View {
        let palette = theme.island
        HStack(spacing: CheddarSpacing.xs) {
            CDSIcon(icon, size: CheddarSpacing.iconLarge, knockout: accent.step500)
                .foregroundStyle(accent.step300)
                .frame(width: 40, height: 40)
                .background(accent.step500)
                .clipShape(RoundedRectangle(
                    cornerRadius: CheddarSpacing.cornerXsmall,
                    style: .continuous
                ))

            VStack(alignment: .leading, spacing: 2) {
                Text(name).cdsType(CheddarType.bodyLargeStrong)
                Text(subtitle)
                    .cdsType(CheddarType.bodyLarge)
                    .foregroundStyle(palette.foregroundSecondary)
            }
            // `flex: 1`, which is what pushes the balance to the trailing edge.
            .frame(maxWidth: .infinity, alignment: .leading)

            VStack(alignment: .trailing, spacing: 2) {
                Text(CDSCurrency.format(amount)).cdsType(CheddarType.bodyLargeStrong)
                Text(meta)
                    .cdsType(CheddarType.bodyLarge)
                    .foregroundStyle(palette.foregroundSecondary)
            }
        }
        .padding(CheddarSpacing.s)
        .frame(maxWidth: .infinity, minHeight: 75)
        .foregroundStyle(palette.foregroundOnSurface)
        .cdsCard(background: palette.backgroundSurface, border: palette.borderDefault)
        .cheddarIsland()
    }
}

public struct CDSGoalSummaryItem: Identifiable {
    public let id: String
    public let label: String
    public let amount: Decimal

    public init(id: String, label: String, amount: Decimal) {
        self.id = id
        self.label = label
        self.amount = amount
    }
}

/// `GoalSummaryCard` — every goal's balance with a ruled total beneath.
public struct CDSGoalSummaryCard: View {
    @Environment(\.cheddarTheme) private var theme

    private let title: String?
    private let items: [CDSGoalSummaryItem]
    private let totalLabel: String
    private let total: Decimal

    public init(
        title: String? = nil,
        items: [CDSGoalSummaryItem],
        totalLabel: String = "Total savings",
        total: Decimal
    ) {
        self.title = title
        self.items = items
        self.totalLabel = totalLabel
        self.total = total
    }

    public var body: some View {
        let palette = theme.island
        VStack(alignment: .leading, spacing: CheddarSpacing.xs) {
            if let title {
                Text(title).cdsType(CheddarType.bodyLargeStrong)
            }

            VStack(alignment: .leading, spacing: CheddarSpacing.xxs) {
                ForEach(items) { item in
                    HStack(spacing: CheddarSpacing.xs) {
                        Text(item.label).cdsType(CheddarType.bodyLarge)
                        Spacer(minLength: 0)
                        Text(CDSCurrency.format(item.amount))
                            .cdsType(CheddarType.bodyLargeStrong)
                    }
                }
            }

            Divider()
                .overlay(palette.borderDefault)
                .padding(.top, CheddarSpacing.xs)

            HStack(spacing: CheddarSpacing.xs) {
                Text(totalLabel)
                Spacer(minLength: 0)
                Text(CDSCurrency.format(total))
            }
            .cdsType(CheddarType.bodyLargeStrong)
        }
        .padding(CheddarSpacing.s)
        .frame(maxWidth: .infinity, minHeight: 164, alignment: .topLeading)
        .foregroundStyle(palette.foregroundOnSurface)
        .cdsCard(background: palette.backgroundSurface, border: palette.borderDefault)
        .cheddarIsland()
    }
}
