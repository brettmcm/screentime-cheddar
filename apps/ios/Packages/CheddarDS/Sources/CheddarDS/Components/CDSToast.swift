import SwiftUI

/// `Toast` — a transient confirmation pill.
///
/// It inverts by painting `foreground-primary` and writing in `background-surface`. Under the
/// branded shell both resolve to white, so the message would disappear into its own pill; the
/// web app re-points the label to `foreground-on-surface` there and this does the same.
public struct CDSToast: View {
    @Environment(\.cheddarTheme) private var theme
    @Environment(\.cheddarPalette) private var palette

    private let message: String

    public init(_ message: String) {
        self.message = message
    }

    public var body: some View {
        Text(message)
            .cdsType(CheddarType.bodyMedium)
            .lineLimit(1)
            .padding(.vertical, 12)
            .padding(.leading, CheddarSpacing.m)
            .padding(.trailing, 20)
            .foregroundStyle(foreground)
            .background(palette.foregroundPrimary)
            .clipShape(Capsule())
            .accessibilityElement(children: .combine)
            .accessibilityAddTraits(.updatesFrequently)
    }

    private var foreground: Color {
        theme.mode == .dark ? palette.foregroundOnSurface : palette.backgroundSurface
    }
}
