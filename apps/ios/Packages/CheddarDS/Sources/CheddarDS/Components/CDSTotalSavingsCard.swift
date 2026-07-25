import SwiftUI

public struct CDSTotalSavingsCard: View {
    let balance: String
    var onDeposit: (() -> Void)?
    var onTransfer: (() -> Void)?

    public init(balance: String, onDeposit: (() -> Void)? = nil, onTransfer: (() -> Void)? = nil) {
        self.balance = balance
        self.onDeposit = onDeposit
        self.onTransfer = onTransfer
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.m) {
            HStack(alignment: .top) {
                Text("Total savings")
                    .font(CheddarFonts.font(for: CheddarType.bodyLarge))
                    .foregroundStyle(CheddarColors.shell.foregroundBrandReverseSecondary)
                Spacer()
                    // The mark is a two-tone asset: tinting it as a template would flatten the
                    // sparkle into the pill.
                    CDSResourceImage("logo-mark.png")
                    .aspectRatio(contentMode: .fit)
                    .frame(height: 28)
            }

            balanceText
                .foregroundStyle(CheddarColors.shell.foregroundBrandReverseSecondary)

            HStack(spacing: CheddarSpacing.s) {
                outlineAction("Deposit", icon: .receive) { onDeposit?() }
                outlineAction("Transfer", icon: .send) { onTransfer?() }
            }
        }
        .padding(CheddarSpacing.l)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(CheddarColors.shell.bgBrandSecondary)
        .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous))
    }

    @ViewBuilder
    private var balanceText: some View {
        let parts = splitBalance(balance)
        HStack(alignment: .firstTextBaseline, spacing: 0) {
            Text(parts.main)
                .font(CheddarFonts.font(for: CheddarType.displayLarge))
                .tracking(-2.5)
            Text(parts.cents)
                .font(CheddarFonts.oswald(size: 32, weight: .semibold))
                .baselineOffset(18)
        }
    }

    private func outlineAction(_ title: String, icon: CheddarIconName, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: CheddarSpacing.xs) {
                // The card's own fill is what the glyph's detail is knocked out to.
                CDSIcon(icon, size: 18, knockout: CheddarColors.shell.bgBrandSecondary)
                Text(title)
                    .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
            }
            .foregroundStyle(CheddarColors.shell.foregroundBrandReverseSecondary)
            .frame(maxWidth: .infinity)
            .padding(.vertical, CheddarSpacing.s)
            .overlay {
                Capsule().stroke(CheddarColors.shell.foregroundBrandReverseSecondary, lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
    }

    private func splitBalance(_ value: String) -> (main: String, cents: String) {
        if let dot = value.lastIndex(of: ".") {
            return (String(value[..<dot]), String(value[dot...]))
        }
        return (value, "")
    }
}
