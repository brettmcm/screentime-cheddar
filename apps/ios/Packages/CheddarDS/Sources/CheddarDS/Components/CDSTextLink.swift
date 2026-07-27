import SwiftUI

/// `TextLink` — the Figma `Text Link` component (node 4991:6585).
///
/// Used for the "View all" affordance beside a section header and the article screen's back
/// link. The icon is `icon-small`, deliberately smaller than the label.
public struct CDSTextLink: View {
    public enum Size {
        case medium
        case small
    }

    public enum IconPosition {
        case leading
        case trailing
    }

    @Environment(\.cheddarPalette) private var palette

    private let label: String
    private let size: Size
    private let icon: CheddarIconName?
    private let iconPosition: IconPosition
    private let action: () -> Void

    public init(
        _ label: String,
        size: Size = .medium,
        icon: CheddarIconName? = .caretRight,
        iconPosition: IconPosition = .trailing,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.size = size
        self.icon = icon
        self.iconPosition = iconPosition
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: CheddarSpacing.gapXs) {
                if iconPosition == .leading { glyph }
                Text(label)
                if iconPosition == .trailing { glyph }
            }
            .cdsType(style)
            .foregroundStyle(palette.foregroundBrandPrimary)
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private var glyph: some View {
        if let icon {
            CDSIcon(icon, size: CheddarSpacing.iconSmall)
        }
    }

    private var style: CheddarTextStyle {
        size == .small ? CheddarType.bodySmallStrong : CheddarType.bodyMediumStrong
    }
}
