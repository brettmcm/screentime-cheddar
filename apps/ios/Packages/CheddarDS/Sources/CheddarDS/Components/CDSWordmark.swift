import SwiftUI

public struct CDSWordmark: View {
    public var height: CGFloat = 24

    public init(height: CGFloat = 24) {
        self.height = height
    }

    public var body: some View {
        CDSResourceImage("wordmark.png", renderingMode: .template)
            .foregroundStyle(CheddarColors.shell.foregroundBrandPrimary)
            .aspectRatio(contentMode: .fit)
            .frame(height: height)
            .accessibilityLabel("Cheddar")
    }
}

public struct CDSLogoMark: View {
    public var height: CGFloat = 28

    public init(height: CGFloat = 28) {
        self.height = height
    }

    public var body: some View {
        CDSResourceImage("logo-mark.png", renderingMode: .template)
            .foregroundStyle(CheddarColors.shell.foregroundBrandPrimary)
            .aspectRatio(contentMode: .fit)
            .frame(height: height)
            .accessibilityLabel("Cheddar logo")
    }
}
