import SwiftUI

public enum CDSActivityType {
    case deposit
    case withdrawal
}

public struct CDSActivityItem: View {
    let type: CDSActivityType
    let time: String
    let amount: String

    public init(type: CDSActivityType, time: String, amount: String) {
        self.type = type
        self.time = time
        self.amount = amount
    }

    public var body: some View {
        HStack(spacing: CheddarSpacing.m) {
            ZStack {
                Circle()
                    .fill(type == .deposit ? CheddarColors.purple300 : CheddarColors.brand100)
                    .frame(width: 40, height: 40)
                Image(systemName: type == .deposit ? "arrow.up" : "arrow.down")
                    .font(CheddarFonts.monaSans(size: 16, weight: .bold))
                    .foregroundStyle(CheddarColors.white100)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(type == .deposit ? "Deposit" : "Withdrawal")
                    .font(CheddarFonts.monaSans(size: 16, weight: .semibold))
                Text(time)
                    .font(CheddarFonts.monaSans(size: 14, weight: .medium))
                    .foregroundStyle(CheddarColors.surface.foregroundSecondary)
            }
            Spacer()
            Text(displayAmount)
                .font(CheddarFonts.monaSans(size: 16, weight: .semibold))
                .foregroundStyle(type == .deposit ? CheddarColors.brand300 : CheddarColors.brand100)
        }
        .padding(.vertical, CheddarSpacing.xs)
    }

    private var displayAmount: String {
        if type == .withdrawal, !amount.hasPrefix("-") {
            return "-$\(amount.replacingOccurrences(of: "$", with: ""))"
        }
        if amount.hasPrefix("$") { return amount }
        return "$\(amount)"
    }
}

public struct CDSActivityFeedCard<Content: View>: View {
    @ViewBuilder let content: Content

    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.l) {
            content
        }
        .padding(CheddarSpacing.m)
        .background(CheddarColors.surface.backgroundSurface)
        .overlay {
            RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous)
                .stroke(CheddarColors.surface.borderDefault, lineWidth: 1)
        }
        .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous))
    }
}
