import SwiftUI

/// The profile header card. It follows the branded shell rather than being a light island,
/// so it reads as a tinted panel: brand-secondary fill with reversed type.
public struct CDSProfileCard<Actions: View>: View {
    private let name: String
    private let handle: String
    private let actions: Actions

    public init(name: String, handle: String, @ViewBuilder actions: () -> Actions) {
        self.name = name
        self.handle = handle
        self.actions = actions()
    }

    public var body: some View {
        VStack(spacing: CheddarSpacing.m) {
            CDSAvatar(size: .xlarge)
            Text(name)
                .font(CheddarFonts.font(for: CheddarType.displayMedium))
                .tracking(CheddarType.displayMedium.tracking)
                .foregroundStyle(CheddarColors.shell.foregroundOnReverse)
            Text(handle)
                .font(CheddarFonts.font(for: CheddarType.bodyLarge))
                .foregroundStyle(CheddarColors.shell.foregroundOnReverseSecondary)
            HStack(spacing: CheddarSpacing.xs) {
                actions
            }
        }
        .frame(maxWidth: .infinity)
        .padding(CheddarSpacing.l)
        .background(CheddarColors.shell.bgBrandSecondary)
        .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous)
                .stroke(CheddarColors.shell.borderDefault, lineWidth: 1)
        }
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

public struct CDSSavingsStreak: View {
    private let title: String
    private let days: [CDSStreakDay]

    public init(title: String, days: [CDSStreakDay]) {
        self.title = title
        self.days = days
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.m) {
            Text(title)
                .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
                .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
            HStack(spacing: CheddarSpacing.xs) {
                ForEach(days) { day in
                    VStack(spacing: CheddarSpacing.xxs) {
                        mark(for: day)
                        Text(day.label)
                            .font(CheddarFonts.font(for: CheddarType.bodyMedium))
                            .foregroundStyle(CheddarColors.surface.foregroundSecondary)
                    }
                    .frame(maxWidth: .infinity)
                    .accessibilityElement(children: .ignore)
                    .accessibilityLabel("\(day.name): \(day.isComplete ? "saved" : "no saving")")
                }
            }
        }
        .cdsSurfaceCard()
    }

    private func mark(for day: CDSStreakDay) -> some View {
        Circle()
            .fill(day.isComplete ? CheddarColors.surface.bgBrandPrimary : .clear)
            .frame(width: 32, height: 32)
            .overlay {
                if day.isComplete {
                    Image(systemName: "checkmark")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(CheddarColors.surface.foregroundBrandPrimary)
                } else {
                    Circle().stroke(CheddarColors.surface.borderStrong, lineWidth: 1)
                }
            }
    }
}

public struct CDSBadgeCard: View {
    private let title: String
    private let caption: String
    /// Percent complete, 0–100.
    private let progress: Double
    private let accent: CDSAccent
    private let systemImage: String

    public init(title: String, caption: String, progress: Double, accent: CDSAccent, systemImage: String) {
        self.title = title
        self.caption = caption
        self.progress = progress
        self.accent = accent
        self.systemImage = systemImage
    }

    public var body: some View {
        HStack(spacing: CheddarSpacing.m) {
            Image(systemName: systemImage)
                .font(.system(size: 26))
                .foregroundStyle(CheddarColors.surface.foregroundPrimary)
                .frame(width: 64, height: 64)
                .background(accent.step500)
                .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerXsmall, style: .continuous))

            VStack(alignment: .leading, spacing: CheddarSpacing.xxs) {
                Text(title)
                    .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
                    .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
                CDSProgressTrack(progress: progress / 100, fill: accent.step300)
                Text(caption)
                    .font(CheddarFonts.font(for: CheddarType.bodyLarge))
                    .foregroundStyle(CheddarColors.surface.foregroundSecondary)
            }
            Spacer(minLength: 0)
        }
        .cdsSurfaceCard()
    }
}

public struct CDSAccountCard: View {
    private let name: String
    private let subtitle: String
    private let amount: Decimal
    private let meta: String
    private let accent: CDSAccent

    public init(
        name: String,
        subtitle: String,
        amount: Decimal,
        meta: String,
        accent: CDSAccent = .magenta
    ) {
        self.name = name
        self.subtitle = subtitle
        self.amount = amount
        self.meta = meta
        self.accent = accent
    }

    public var body: some View {
        HStack(spacing: CheddarSpacing.m) {
            Image(systemName: "building.columns.fill")
                .font(.system(size: 18))
                .foregroundStyle(accent.step300)
                .frame(width: 40, height: 40)
                .background(accent.step500)
                .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerXsmall, style: .continuous))

            VStack(alignment: .leading, spacing: 2) {
                Text(name)
                    .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
                    .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
                Text(subtitle)
                    .font(CheddarFonts.font(for: CheddarType.bodyLarge))
                    .foregroundStyle(CheddarColors.surface.foregroundSecondary)
            }

            Spacer(minLength: CheddarSpacing.s)

            VStack(alignment: .trailing, spacing: 2) {
                Text(formatCurrency(amount))
                    .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
                    .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
                Text(meta)
                    .font(CheddarFonts.font(for: CheddarType.bodyLarge))
                    .foregroundStyle(CheddarColors.surface.foregroundSecondary)
            }
        }
        .cdsSurfaceCard()
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

public struct CDSGoalSummaryCard: View {
    private let items: [CDSGoalSummaryItem]
    private let totalLabel: String
    private let total: Decimal

    public init(items: [CDSGoalSummaryItem], totalLabel: String, total: Decimal) {
        self.items = items
        self.totalLabel = totalLabel
        self.total = total
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.xs) {
            VStack(alignment: .leading, spacing: CheddarSpacing.xxs) {
                ForEach(items) { item in
                    HStack {
                        Text(item.label)
                        Spacer(minLength: CheddarSpacing.s)
                        Text(formatCurrency(item.amount))
                    }
                    .font(CheddarFonts.font(for: CheddarType.bodyLarge))
                }
            }

            Divider().overlay(CheddarColors.surface.borderDefault)

            HStack {
                Text(totalLabel)
                Spacer(minLength: CheddarSpacing.s)
                Text(formatCurrency(total))
            }
            .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
        }
        .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
        .cdsSurfaceCard()
    }
}

/// The DS progress track shared by the badge and goal cards.
public struct CDSProgressTrack: View {
    private let progress: Double
    private let fill: Color

    public init(progress: Double, fill: Color) {
        self.progress = progress
        self.fill = fill
    }

    public var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Capsule().fill(CheddarColors.surface.trackDefault)
                Capsule()
                    .fill(fill)
                    .frame(width: geo.size.width * min(1, max(0, progress)))
            }
        }
        .frame(height: 6)
    }
}

private extension View {
    /// The shared recipe for the cards the DS pins to the light palette.
    func cdsSurfaceCard() -> some View {
        padding(CheddarSpacing.m)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(CheddarColors.surface.backgroundSurface)
            .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous)
                    .stroke(CheddarColors.surface.borderDefault, lineWidth: 1)
            }
    }
}

func formatCurrency(_ value: Decimal) -> String {
    String(format: "$%.2f", NSDecimalNumber(decimal: value).doubleValue)
}
