import SwiftUI

public enum CDSNavItem: String, CaseIterable, Identifiable {
    case home
    case wallet
    case learn
    case profile

    public var id: String { rawValue }

    var title: String {
        switch self {
        case .home: "Home"
        case .wallet: "Savings"
        case .learn: "Learn"
        case .profile: "Profile"
        }
    }

    var icon: String {
        switch self {
        case .home: "house.fill"
        case .wallet: "banknote.fill"
        case .learn: "book.fill"
        case .profile: "person.fill"
        }
    }
}

public struct CDSNavBar: View {
    @Binding var activeItem: CDSNavItem
    var onAddTapped: () -> Void

    public init(activeItem: Binding<CDSNavItem>, onAddTapped: @escaping () -> Void) {
        _activeItem = activeItem
        self.onAddTapped = onAddTapped
    }

    public var body: some View {
        HStack(spacing: 0) {
            navButton(.home)
            navButton(.wallet)
            addButton
            navButton(.learn)
            navButton(.profile)
        }
        .padding(.horizontal, CheddarSpacing.m)
        .padding(.top, CheddarSpacing.s)
        .padding(.bottom, CheddarSpacing.xs)
        .background(CheddarColors.shell.backgroundDefault)
        .overlay(alignment: .top) {
            Rectangle()
                .fill(CheddarColors.shell.borderDefault)
                .frame(height: 1)
        }
    }

    private func navButton(_ item: CDSNavItem) -> some View {
        Button {
            activeItem = item
        } label: {
            VStack(spacing: 4) {
                Image(systemName: item.icon)
                    .font(.system(size: 22))
                if activeItem == item {
                    Circle()
                        .fill(CheddarColors.shell.foregroundBrandPrimary)
                        .frame(width: 4, height: 4)
                } else {
                    Circle().fill(.clear).frame(width: 4, height: 4)
                }
            }
            .frame(maxWidth: .infinity)
            .foregroundStyle(
                activeItem == item
                    ? CheddarColors.shell.foregroundBrandPrimary
                    : CheddarColors.shell.foregroundSecondary
            )
        }
        .buttonStyle(.plain)
        .accessibilityLabel(item.title)
    }

    private var addButton: some View {
        Button(action: onAddTapped) {
            Image(systemName: "plus")
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(CheddarColors.shell.bgOnBrand)
                .frame(width: 56, height: 56)
                .background(CheddarColors.shell.foregroundBrandPrimary)
                .clipShape(Circle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Add goal")
        .offset(y: -8)
    }
}
