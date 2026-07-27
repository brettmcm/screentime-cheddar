import SwiftUI

public enum CDSActivityType: Sendable {
    case deposit
    case withdrawal

    var label: String {
        switch self {
        case .deposit: "Deposit"
        case .withdrawal: "Withdrawal"
        }
    }

    var icon: CheddarIconName {
        switch self {
        case .deposit: .arrowUp
        case .withdrawal: .arrowDown
        }
    }
}

/// `ActivityItem` — one row of the activity feed.
///
/// A deposit's amount sits in a tinted chip; a withdrawal's is plain text with a bolder minus
/// in front of it. The component draws that minus itself, so callers pass the bare amount.
public struct CDSActivityItem: View {
    @Environment(\.cheddarPalette) private var palette

    private let type: CDSActivityType
    private let time: String
    private let amount: String

    public init(type: CDSActivityType, time: String, amount: String) {
        self.type = type
        self.time = time
        self.amount = amount
    }

    public var body: some View {
        HStack(spacing: CheddarSpacing.xs) {
            CDSIcon(type.icon, size: CheddarSpacing.iconLarge, knockout: palette.bgBrandPrimary)
                .frame(width: 48, height: 48)
                .foregroundStyle(palette.foregroundBrandPrimary)
                .background(palette.bgBrandPrimary)
                .clipShape(Circle())

            HStack(alignment: .center, spacing: CheddarSpacing.gapS) {
                VStack(alignment: .leading, spacing: CheddarSpacing.xxs) {
                    Text(type.label)
                        .cdsType(CheddarType.bodyLarge)
                        .foregroundStyle(palette.foregroundPrimary)
                    Text(time)
                        .cdsType(CheddarType.bodyMedium)
                        .foregroundStyle(palette.foregroundSecondary)
                }
                Spacer(minLength: 0)
                amountView
            }
        }
        .accessibilityElement(children: .combine)
    }

    @ViewBuilder
    private var amountView: some View {
        switch type {
        case .deposit:
            Text(amount)
                .cdsType(CheddarType.bodyLarge)
                .lineLimit(1)
                .padding(.vertical, 2)
                .padding(.horizontal, CheddarSpacing.xxs)
                .foregroundStyle(palette.foregroundBrandPrimary)
                .background(palette.bgBrandPrimary)
                .clipShape(RoundedRectangle(
                    cornerRadius: CheddarSpacing.cornerXsmall,
                    style: .continuous
                ))
        case .withdrawal:
            HStack(spacing: 2) {
                Text("-").cdsType(CheddarType.bodyLargeStrong)
                Text(amount).cdsType(CheddarType.bodyLarge)
            }
            .lineLimit(1)
            .foregroundStyle(palette.foregroundPrimary)
        }
    }
}
