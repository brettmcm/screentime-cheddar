import SwiftUI

public extension CheddarTextStyle {
    /// Letter spacing for the display styles. The design system expresses tracking in `em`,
    /// which the Swift token export drops, so resolve it back to points here.
    var tracking: CGFloat {
        if self == CheddarType.displayMedium { return size * -0.03 }
        let widelyTracked = [
            CheddarType.displayXlarge,
            CheddarType.displayLarge,
            CheddarType.displaySmall,
            CheddarType.displayXsmall,
        ]
        return widelyTracked.contains(self) ? size * -0.04 : 0
    }
}

public enum CheddarTypography {
    public static func displayLarge(_ text: String) -> some View {
        Text(text)
            .font(CheddarFonts.font(for: CheddarType.displayLarge))
            .tracking(CheddarType.displayLarge.tracking)
            .lineLimit(nil)
            .multilineTextAlignment(.center)
    }

    public static func displayMedium(_ text: String) -> some View {
        Text(text)
            .font(CheddarFonts.font(for: CheddarType.displayMedium))
            .tracking(CheddarType.displayMedium.tracking)
    }

    public static func heading(_ text: String) -> some View {
        Text(text)
            .font(CheddarFonts.font(for: CheddarType.heading))
            .lineSpacing(4)
    }

    public static func bodyLarge(_ text: String) -> some View {
        Text(text)
            .font(CheddarFonts.font(for: CheddarType.bodyLarge))
    }

    public static func bodyLargeStrong(_ text: String) -> some View {
        Text(text)
            .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
    }

    public static func bodyMedium(_ text: String) -> some View {
        Text(text)
            .font(CheddarFonts.font(for: CheddarType.bodyMedium))
    }

    public static func sectionTitle(_ text: String) -> some View {
        Text(text)
            .font(CheddarFonts.font(for: CheddarType.bodyLarge))
    }
}
