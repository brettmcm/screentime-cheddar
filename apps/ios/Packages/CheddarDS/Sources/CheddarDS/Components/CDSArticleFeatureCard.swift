import SwiftUI

public struct CDSArticleFeatureCard: View {
    var onReadMore: (() -> Void)?

    public init(onReadMore: (() -> Void)? = nil) {
        self.onReadMore = onReadMore
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.l) {
            CDSResourceImage("article-piggy.png")
                .scaledToFit()
                .frame(maxWidth: .infinity)
                .frame(height: 220)
                .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous))

            VStack(alignment: .leading, spacing: CheddarSpacing.s) {
                Text("How to decide what to save for")
                    .font(CheddarFonts.oswald(size: 32, weight: .semibold))
                    .foregroundStyle(CheddarColors.shell.foregroundBrandReverseSecondary)
                Text("With so much noise, figure out what's actually worth saving and what you can let go of.")
                    .font(CheddarFonts.font(for: CheddarType.bodyLarge))
                    .foregroundStyle(CheddarColors.shell.foregroundOnReverse)
            }
            CDSButton("Read more", variant: .primary, size: .large) {
                onReadMore?()
            }
        }
        .padding(CheddarSpacing.l)
        .background(CheddarColors.shell.bgBrandSecondary)
        .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge, style: .continuous))
    }
}
