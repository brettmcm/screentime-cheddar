import SwiftUI

public struct CDSPageHeader: View {
    let title: String
    var showsBack: Bool = false
    var backAction: (() -> Void)?

    public init(title: String, showsBack: Bool = false, backAction: (() -> Void)? = nil) {
        self.title = title
        self.showsBack = showsBack
        self.backAction = backAction
    }

    public var body: some View {
        HStack(spacing: CheddarSpacing.s) {
            if showsBack {
                Button(action: { backAction?() }) {
                    Image(systemName: "chevron.left")
                        .font(CheddarFonts.monaSans(size: 18, weight: .semibold))
                        .foregroundStyle(CheddarColors.shell.foregroundPrimary)
                }
                .buttonStyle(.plain)
            }
            CheddarTypography.heading(title)
                .foregroundStyle(CheddarColors.shell.foregroundPrimary)
            Spacer()
        }
    }
}
