import SwiftUI

/// `ArticleCard` — the Learn tiles and the home screen's featured article.
///
/// One component, four shapes, and the difference is not cosmetic:
///
/// - **large + media** — the featured hero. Illustration resting on the brand lobe, centred
///   copy, a full-width action pinned to the bottom.
/// - **small + media** — the 187pt tip tile. Illustration on an accent field, favourite
///   toggle in the footer.
/// - **small + photo** — the customer story. Same tile, but the photograph is masked into the
///   brand lobe and the accent shows around it.
/// - **small + flat** — the Guide. No artwork at all: a brand tile with the copy pinned to
///   the bottom.
///
/// The two brand-filled shapes (large/media and small/flat) follow the shell; the other two
/// are always-light cards.
public struct CDSArticleCard: View {
    public enum Size {
        case large
        case small
    }

    public enum Media {
        case illustration
        case photo
        /// No artwork — the Guide shape.
        case none
    }

    @Environment(\.cheddarTheme) private var theme

    private let size: Size
    private let media: Media
    private let eyebrow: String?
    private let title: String
    private let description: String?
    private let readTime: String?
    private let imageAsset: String?
    private let accent: CDSAccent
    private let actionLabel: String?
    private let showFavorite: Bool
    private let onAction: (() -> Void)?
    private let onTap: (() -> Void)?

    @State private var isFavorite = false

    public init(
        size: Size,
        media: Media = .illustration,
        eyebrow: String? = nil,
        title: String,
        description: String? = nil,
        readTime: String? = nil,
        imageAsset: String? = nil,
        accent: CDSAccent = .magenta,
        actionLabel: String? = nil,
        showFavorite: Bool? = nil,
        onAction: (() -> Void)? = nil,
        onTap: (() -> Void)? = nil
    ) {
        self.size = size
        self.media = media
        self.eyebrow = eyebrow
        self.title = title
        self.description = description
        self.readTime = readTime
        self.imageAsset = imageAsset
        self.accent = accent
        self.actionLabel = actionLabel
        // Every small tile carries the toggle unless a caller says otherwise, the Guide
        // included; only the hero leaves it off.
        self.showFavorite = showFavorite ?? (size == .small)
        self.onAction = onAction
        self.onTap = onTap
    }

    /// The brand-filled shapes stay on the shell; the plain tiles pin to light.
    private var followsShell: Bool {
        (size == .large && media != .none) || media == .none
    }

    private var palette: CheddarPalette { followsShell ? theme.canvas : theme.island }

    public var body: some View {
        Group {
            switch (size, media) {
            case (.large, _): largeCard
            case (.small, .none): guideCard
            case (.small, _): smallCard
            }
        }
        .modifier(CDSArticleCardTap(onTap: onTap, label: title))
    }

    // MARK: - Large / media

    private var largeCard: some View {
        VStack(spacing: CheddarSpacing.s) {
            ZStack {
                CDSBrandLobe()
                    .fill(palette.foregroundBrandReverseTertiary)
                if let imageAsset {
                    CDSResourceImage(imageAsset).scaledToFit()
                }
            }
            .frame(width: 200, height: 200)

            VStack(spacing: CheddarSpacing.s) {
                CDSDisplayText(
                    title,
                    style: CheddarType.displayMedium,
                    wrapWidth: 320,
                    alignment: .center
                )
                .foregroundStyle(palette.foregroundBrandReverseSecondary)
                if let description {
                    Text(description)
                        .cdsType(CheddarType.bodyLargeStrong)
                        .foregroundStyle(palette.foregroundOnReverse)
                        .frame(maxWidth: 320)
                }
            }
            .multilineTextAlignment(.center)
            .frame(maxWidth: .infinity)

            Spacer(minLength: 0)

            if let actionLabel {
                CDSButton(actionLabel, variant: .primary, size: .large) { onAction?() }
            }
        }
        .padding(.top, CheddarSpacing.l)
        .padding(.horizontal, CheddarSpacing.m)
        .padding(.bottom, CheddarSpacing.m)
        .frame(maxWidth: .infinity)
        .frame(minHeight: 535)
        .foregroundStyle(palette.foregroundOnReverse)
        .cdsCard(background: palette.bgBrandSecondary, border: palette.borderDefault)
        .cheddarIconKnockout(palette.bgBrandSecondary)
    }

    // MARK: - Small / media + photo

    private var smallCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            mediaFrame
            VStack(alignment: .leading, spacing: CheddarSpacing.s) {
                if let eyebrow {
                    Text(eyebrow)
                        .cdsType(CheddarType.bodySmall)
                        .foregroundStyle(palette.foregroundSecondary)
                }
                Text(title)
                    .cdsType(CheddarType.bodyLargeStrong)
                footer(color: palette.foregroundSecondary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(CheddarSpacing.s)
        }
        .frame(maxWidth: .infinity)
        .frame(minHeight: media == .photo ? 287 : 260, alignment: .top)
        .foregroundStyle(palette.foregroundOnSurface)
        .cdsCard(background: palette.backgroundSurface, border: palette.borderDefault)
        .cheddarIsland()
    }

    private var mediaFrame: some View {
        Group {
            switch media {
            case .photo:
                // Figma draws the accent as an overlay with the lobes knocked out of it; the
                // photograph filling the frame and the lobe cropping it composites the same.
                // The knockout is inset an even 16pt either side, so it is sized off the
                // frame's width and left square rather than fitted to the frame.
                GeometryReader { geometry in
                    let inset = CheddarSpacing.m * 2
                    let lobe = max(0, geometry.size.width - inset)
                    if let imageAsset {
                        CDSResourceImage(imageAsset)
                            .scaledToFill()
                            .frame(width: geometry.size.width, height: geometry.size.height)
                            .clipped()
                            .mask {
                                CDSBrandLobe().frame(width: lobe, height: lobe)
                            }
                    }
                }
                .frame(height: 177)
                .background(accent.step200)
            default:
                Group {
                    if let imageAsset {
                        CDSResourceImage(imageAsset)
                            .scaledToFit()
                            .frame(width: 116, height: 116)
                    }
                }
                .frame(maxWidth: .infinity)
                .frame(height: 148)
                .background(accent.step500)
                .overlay(alignment: .bottom) {
                    Rectangle()
                        .fill(palette.borderDefault)
                        .frame(height: CheddarSpacing.border)
                }
            }
        }
    }

    // MARK: - Small / flat (Guide)

    private var guideCard: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.s) {
            if let eyebrow {
                // The DS leaves the eyebrow on the unreversed secondary foreground, which
                // lands at 1.07:1 on this pale tile; the web app reverses it with the rest of
                // the flat card's text and so does this.
                Text(eyebrow)
                    .cdsType(CheddarType.bodySmall)
                    .foregroundStyle(palette.foregroundOnReverse)
            }
            // `max-width: 120px`: the box the line breaks are measured against, not a clip.
            CDSDisplayText(title, style: CheddarType.displayMedium, wrapWidth: 120)
                .foregroundStyle(palette.foregroundBrandReverseSecondary)
                .frame(maxWidth: .infinity, alignment: .leading)

            Spacer(minLength: 0)

            if let description {
                Text(description)
                    .cdsType(CheddarType.bodyLargeStrong)
                    .foregroundStyle(palette.foregroundOnReverse)
                    .fixedSize(horizontal: false, vertical: true)
            }
            footer(color: palette.foregroundOnReverseSecondary)
        }
        .padding(CheddarSpacing.m)
        // `box-sizing: border-box` — the 270pt square is the card, padding included.
        .frame(width: 270, alignment: .leading)
        .frame(minHeight: 270, alignment: .top)
        .cdsCard(background: palette.bgBrandSecondary, border: palette.borderDefault)
    }

    // MARK: - Shared

    /// - Parameter color: The footer's own colour. The toggle takes it too until it is
    ///   pressed — `color: inherit` on the web — and the two tiles it appears on don't agree
    ///   on what that is: secondary on the light tile, reversed secondary on the flat one.
    @ViewBuilder
    private func footer(color: Color) -> some View {
        if readTime != nil || showFavorite {
            HStack(spacing: CheddarSpacing.gapS) {
                Text(readTime ?? "")
                Spacer(minLength: 0)
                if showFavorite {
                    Button { isFavorite.toggle() } label: {
                        CDSIcon(
                            isFavorite ? .heartFill : .heartOutline,
                            size: CheddarSpacing.iconSmall
                        )
                        .frame(width: CheddarSpacing.iconMedium, height: CheddarSpacing.iconMedium)
                    }
                    .buttonStyle(.plain)
                    .foregroundStyle(isFavorite ? palette.foregroundBrandPrimary : color)
                    .accessibilityLabel(
                        isFavorite ? "Remove from favorites" : "Save to favorites"
                    )
                }
            }
            .cdsType(CheddarType.bodyLarge)
            .foregroundStyle(color)
        }
    }
}

/// The card's own affordance. The DS stretches a link over the whole card, so the tap target
/// is the card rather than the title alone; the favourite toggle sits above it and keeps its
/// own hit area, which is why the tap is applied outside rather than wrapping in a `Button`.
private struct CDSArticleCardTap: ViewModifier {
    let onTap: (() -> Void)?
    let label: String

    func body(content: Content) -> some View {
        if let onTap {
            content
                .contentShape(Rectangle())
                .onTapGesture(perform: onTap)
                .accessibilityAddTraits(.isButton)
                .accessibilityLabel(label)
        } else {
            content
        }
    }
}
