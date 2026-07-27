import SwiftUI

/// `Sheet` — a bottom-anchored dialog over a scrim.
///
/// A DS surface, so it carries the light island palette even when the shell behind it is
/// branded. The web mounts it in a portal and re-reads the theme attributes off the document;
/// here it is an overlay on the app frame that re-declares the island for the same reason.
public struct CDSSheet<Content: View, Footer: View>: View {
    @Environment(\.cheddarTheme) private var theme
    @Environment(\.cheddarSafeBottom) private var safeBottom

    private let title: String?
    private let description: String?
    private let showsClose: Bool
    private let dismissOnScrim: Bool
    private let onClose: () -> Void
    private let content: Content
    private let footer: Footer

    public init(
        title: String? = nil,
        description: String? = nil,
        showsClose: Bool = true,
        dismissOnScrim: Bool = true,
        onClose: @escaping () -> Void,
        @ViewBuilder content: () -> Content,
        @ViewBuilder footer: () -> Footer
    ) {
        self.title = title
        self.description = description
        self.showsClose = showsClose
        self.dismissOnScrim = dismissOnScrim
        self.onClose = onClose
        self.content = content()
        self.footer = footer()
    }

    public var body: some View {
        let palette = theme.island

        ZStack(alignment: .bottom) {
            palette.backgroundOverlay
                .ignoresSafeArea()
                .contentShape(Rectangle())
                .onTapGesture { if dismissOnScrim { onClose() } }

            VStack(alignment: .leading, spacing: CheddarSpacing.gapM) {
                if title != nil || showsClose {
                    HStack(spacing: CheddarSpacing.gapS) {
                        if let title {
                            Text(title).cdsType(CheddarType.heading)
                        }
                        Spacer(minLength: 0)
                        if showsClose {
                            CDSIconButton(.x, label: "Close", variant: .neutral, size: .small, action: onClose)
                        }
                    }
                }

                if let description {
                    Text(description)
                        .cdsType(CheddarType.bodyMedium)
                        .foregroundStyle(palette.foregroundSecondary)
                }

                content

                footer
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(CheddarSpacing.l)
            // The bottom edge takes `padding-xl` over the home indicator instead of the
            // box's own `padding-l`, not on top of it.
            .padding(.bottom, CheddarSpacing.xl - CheddarSpacing.l + safeBottom)
            .foregroundStyle(palette.foregroundOnSurface)
            .background(palette.backgroundSurface)
            .clipShape(
                .rect(
                    topLeadingRadius: CheddarSpacing.cornerLarge,
                    topTrailingRadius: CheddarSpacing.cornerLarge,
                    style: .continuous
                )
            )
            .transition(.move(edge: .bottom))
        }
        .cheddarIsland()
        .accessibilityAddTraits(.isModal)
    }
}

public extension CDSSheet where Footer == EmptyView {
    init(
        title: String? = nil,
        description: String? = nil,
        showsClose: Bool = true,
        dismissOnScrim: Bool = true,
        onClose: @escaping () -> Void,
        @ViewBuilder content: () -> Content
    ) {
        self.init(
            title: title,
            description: description,
            showsClose: showsClose,
            dismissOnScrim: dismissOnScrim,
            onClose: onClose,
            content: content,
            footer: { EmptyView() }
        )
    }
}
