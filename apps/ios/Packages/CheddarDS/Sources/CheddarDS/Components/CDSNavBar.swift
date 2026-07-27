import SwiftUI

/// The four destinations the tab bar routes to. The design system calls the savings tab
/// "wallet"; the app routes it as savings.
public enum CDSNavItem: String, CaseIterable, Identifiable, Sendable {
    case home
    case wallet
    case learn
    case profile

    public var id: String { rawValue }

    var title: String {
        switch self {
        case .home: "Home"
        case .wallet: "Wallet"
        case .learn: "Learn"
        case .profile: "Profile"
        }
    }

    var icon: CheddarIconName {
        switch self {
        case .home: .home
        case .wallet: .wallet
        case .learn: .learn
        case .profile: .profile
        }
    }
}

/// `Nav` — the bottom tab bar, with the add action sitting in the middle of the run.
///
/// Labels are off by default in the DS and the app does not turn them on, so a tab is a
/// ghost icon button over a 4pt indicator dot. The add action is a filled primary button and
/// carries no dot, since it is not a destination.
///
/// The bar owns no padding of its own on the web — the app insets it to the 16pt gutter and
/// reserves the home indicator's safe area, which together give the 108pt height in Figma.
public struct CDSNavBar: View {
    @Environment(\.cheddarPalette) private var palette

    @Binding private var activeItem: CDSNavItem
    private let addLabel: String
    private let onAddTapped: () -> Void

    public init(
        activeItem: Binding<CDSNavItem>,
        addLabel: String = "Add goal",
        onAddTapped: @escaping () -> Void
    ) {
        _activeItem = activeItem
        self.addLabel = addLabel
        self.onAddTapped = onAddTapped
    }

    public var body: some View {
        HStack(spacing: 0) {
            tab(.home)
            tab(.wallet)
            addButton
            tab(.learn)
            tab(.profile)
        }
    }

    private func tab(_ item: CDSNavItem) -> some View {
        let isActive = activeItem == item
        return VStack(spacing: CheddarSpacing.gapXs) {
            Button { activeItem = item } label: {
                CDSIcon(item.icon, size: CheddarSpacing.iconLarge)
                    .frame(width: 48, height: 48)
                    .foregroundStyle(
                        isActive ? palette.foregroundPrimary : palette.foregroundSecondary
                    )
            }
            .buttonStyle(.plain)
            .accessibilityLabel(item.title)
            .accessibilityAddTraits(isActive ? [.isSelected] : [])

            Circle()
                .fill(palette.ramp.step400)
                .frame(width: 4, height: 4)
                .opacity(isActive ? 1 : 0)
        }
        .frame(maxWidth: .infinity)
    }

    private var addButton: some View {
        VStack(spacing: CheddarSpacing.gapXs) {
            Button(action: onAddTapped) {
                CDSIcon(.plus, size: CheddarSpacing.iconLarge, knockout: palette.foregroundBrandPrimary)
                    .frame(width: 48, height: 48)
                    .foregroundStyle(palette.bgOnBrand)
                    .background(palette.foregroundBrandPrimary)
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel(addLabel)

            // The add action is not a destination, so it reserves the dot's space
            // without ever painting one.
            Color.clear.frame(width: 4, height: 4)
        }
        .frame(maxWidth: .infinity)
    }
}
