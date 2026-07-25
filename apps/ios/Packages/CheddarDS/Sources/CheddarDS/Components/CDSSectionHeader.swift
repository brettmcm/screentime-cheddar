import SwiftUI

public struct CDSSectionHeader: View {
    let title: String
    var actionTitle: String = "View all"
    var action: (() -> Void)?

    public init(title: String, actionTitle: String = "View all", action: (() -> Void)? = nil) {
        self.title = title
        self.actionTitle = actionTitle
        self.action = action
    }

    public var body: some View {
        HStack {
            CheddarTypography.sectionTitle(title)
                .foregroundStyle(CheddarColors.shell.foregroundPrimary)
            Spacer()
            if let action {
                Button(action: action) {
                    HStack(spacing: CheddarSpacing.xs) {
                        CheddarTypography.bodyLarge(actionTitle)
                            .foregroundStyle(CheddarColors.shell.foregroundBrandPrimary)
                        Image(systemName: "chevron.right")
                            .font(CheddarFonts.monaSans(size: 14, weight: .semibold))
                            .foregroundStyle(CheddarColors.shell.foregroundBrandPrimary)
                    }
                }
                .buttonStyle(.plain)
            }
        }
    }
}
