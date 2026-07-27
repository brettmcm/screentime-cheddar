import SwiftUI

/// `PageHeader` — the title row at the top of every screen.
///
/// Three content-sized slots: a leading control, the title, and a trailing slot. When the
/// title is centred and a slot is empty the DS drops a 32pt spacer in, because a grid with
/// only one populated edge would push the title off centre.
public struct CDSPageHeader<Trailing: View>: View {
    public enum Align {
        case leading
        case center
    }

    @Environment(\.cheddarPalette) private var palette

    private let title: String
    private let align: Align
    private let showBack: Bool?
    private let onBack: (() -> Void)?
    private let trailing: Trailing

    public init(
        _ title: String,
        align: Align = .leading,
        showBack: Bool? = nil,
        onBack: (() -> Void)? = nil,
        @ViewBuilder trailing: () -> Trailing
    ) {
        self.title = title
        self.align = align
        self.showBack = showBack
        self.onBack = onBack
        self.trailing = trailing()
    }

    private var isCentered: Bool { align == .center }

    /// `showBack ?? (hasBack || !isCentered)` — an explicit `false` wins, and a left-aligned
    /// header keeps the disabled control so its title lines up with a screen that has one.
    private var rendersBack: Bool { showBack ?? (onBack != nil || !isCentered) }

    public var body: some View {
        HStack(spacing: CheddarSpacing.gapS) {
            leadingSlot
            Text(title)
                .cdsType(CheddarType.heading)
                .foregroundStyle(palette.foregroundPrimary)
                .frame(maxWidth: .infinity, alignment: isCentered ? .center : .leading)
            trailingSlot
        }
    }

    @ViewBuilder
    private var leadingSlot: some View {
        if rendersBack {
            Button { onBack?() } label: {
                CDSIcon(.caretLeft, size: 17.4)
                    .frame(width: 24, height: 24)
                    .foregroundStyle(palette.foregroundBrandPrimary)
            }
            .buttonStyle(.plain)
            .disabled(onBack == nil)
            .accessibilityLabel("Back")
            .accessibilityHidden(onBack == nil)
        } else if isCentered {
            Color.clear.frame(width: 32, height: 32)
        }
    }

    @ViewBuilder
    private var trailingSlot: some View {
        if Trailing.self != EmptyView.self {
            HStack(spacing: CheddarSpacing.gapXs) { trailing }
        } else if isCentered {
            Color.clear.frame(width: 32, height: 32)
        }
    }
}

public extension CDSPageHeader where Trailing == EmptyView {
    init(
        _ title: String,
        align: Align = .leading,
        showBack: Bool? = nil,
        onBack: (() -> Void)? = nil
    ) {
        self.init(title, align: align, showBack: showBack, onBack: onBack) { EmptyView() }
    }
}

/// `SectionHeader` — a title with an optional trailing affordance.
///
/// The DS ships the `heading` ramp for the title, but the App Flow sets section titles at
/// body-large and reserves `heading` for the page title; the web app corrects this in its own
/// stylesheet. There is no cascade to override it through here, so the app's value is the
/// default and callers that want the DS ramp pass it.
public struct CDSSectionHeader<Trailing: View>: View {
    @Environment(\.cheddarPalette) private var palette

    private let title: String
    private let titleStyle: CheddarTextStyle
    private let trailing: Trailing

    public init(
        _ title: String,
        titleStyle: CheddarTextStyle = CheddarType.bodyLarge,
        @ViewBuilder trailing: () -> Trailing
    ) {
        self.title = title
        self.titleStyle = titleStyle
        self.trailing = trailing()
    }

    public var body: some View {
        HStack(spacing: CheddarSpacing.gapM) {
            Text(title)
                .cdsType(titleStyle)
                .foregroundStyle(palette.foregroundPrimary)
            Spacer(minLength: 0)
            HStack(spacing: CheddarSpacing.gapS) { trailing }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

public extension CDSSectionHeader where Trailing == EmptyView {
    init(_ title: String, titleStyle: CheddarTextStyle = CheddarType.bodyLarge) {
        self.init(title, titleStyle: titleStyle) { EmptyView() }
    }
}
