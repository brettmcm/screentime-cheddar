import CheddarDS
import SwiftUI

private let brandOptions: [(brand: Brand, description: String)] = [
    (.magenta, "Deep burgundy · Magenta accents"),
    (.blue, "Deep cobalt · Cyan accents"),
    (.green, "Deep forest · Lime accents"),
    (.purple, "Deep violet · Lavender accents"),
]

private let modeOptions: [(mode: Mode, label: String, description: String)] = [
    (.dark, "Dark", "Saturated brand canvas"),
    (.light, "Light", "Bright canvas, same accents"),
]

struct ThemeSettingsScreen: View {
    @EnvironmentObject private var app: AppState
    @Environment(\.cheddarPalette) private var palette

    var body: some View {
        AppScreen {
            CDSPageHeader("Theme Settings", align: .center, onBack: app.back)

            Text("Choose a color theme for your entire Cheddar experience.")
                .foregroundStyle(palette.foregroundSecondary)

            VStack(spacing: CheddarSpacing.gapS) {
                ForEach(brandOptions, id: \.brand) { option in
                    // Each card previews the brand it offers, in the mode now in force.
                    ThemeOption(
                        label: option.brand.label,
                        description: option.description,
                        isSelected: app.brand == option.brand,
                        onSelect: { app.setBrand(option.brand) }
                    ) {
                        swatches
                    }
                    .cheddarTheme(brand: option.brand, mode: app.mode)
                }
            }

            Text("Appearance").cdsType(CheddarType.bodySmall)
                .foregroundStyle(palette.foregroundSecondary)

            VStack(spacing: CheddarSpacing.gapS) {
                ForEach(modeOptions, id: \.mode) { option in
                    ThemeOption(
                        label: option.label,
                        description: option.description,
                        isSelected: app.mode == option.mode,
                        onSelect: { app.setMode(option.mode) }
                    ) {
                        ModeChip().cheddarTheme(brand: app.brand, mode: option.mode)
                    }
                }
            }

            Text("Preview").cdsType(CheddarType.bodySmall)
                .foregroundStyle(palette.foregroundSecondary)

            // Canvas and card together, so the mode reads as more than an accent swap.
            preview
        }
    }

    /// The three steps a swatch row shows: canvas, accent, and the pale tint.
    private var swatches: some View {
        CheddarThemeReader { palette in
            HStack(spacing: 6) {
                ForEach([palette.ramp.step100, palette.ramp.step400, palette.ramp.step600], id: \.self) { color in
                    Circle().fill(color).frame(width: 30, height: 30)
                }
            }
        }
    }

    private var preview: some View {
        CheddarThemeReader { canvas in
            CDSPanel(spacing: CheddarSpacing.gapS) {
                // The card is a DS surface, so everything in it reads the light island's
                // palette rather than the canvas the card is standing on.
                CheddarThemeReader { palette in
                    VStack(alignment: .leading, spacing: CheddarSpacing.gapS) {
                        HStack(spacing: CheddarSpacing.gapS) {
                            Circle().fill(palette.ramp.step400).frame(width: 44, height: 44)
                            VStack(spacing: 6) {
                                line(palette, width: nil)
                                line(palette, width: 0.45)
                            }
                        }

                        // A progress track at rest, so the preview shows a data mark as well
                        // as type.
                        GeometryReader { geometry in
                            ZStack(alignment: .leading) {
                                Capsule().fill(palette.trackDefault)
                                Capsule()
                                    .fill(palette.foregroundBrandPrimary)
                                    .frame(width: geometry.size.width * 0.62)
                            }
                        }
                        .frame(height: 8)

                        HStack(spacing: CheddarSpacing.gapS) {
                            CDSButton("Deposit", variant: .secondary, size: .small) {}
                            CDSButton("Save", size: .small) {}
                        }
                    }
                }
            }
            .padding(CheddarSpacing.m)
            .background(canvas.backgroundDefault)
            .clipShape(RoundedRectangle(
                cornerRadius: CheddarSpacing.cornerLarge,
                style: .continuous
            ))
        }
        .cheddarTheme(brand: app.brand, mode: app.mode)
    }

    private func line(_ palette: CheddarPalette, width: CGFloat?) -> some View {
        Capsule()
            .fill(palette.foregroundBrandPrimary)
            .frame(height: 8)
            .frame(maxWidth: .infinity, alignment: .leading)
            .scaleEffect(x: width ?? 1, anchor: .leading)
            .opacity(width == nil ? 1 : 0.45)
    }
}

/// A whole card acting as one radio; the card itself is the affordance, so only the chosen
/// one is badged.
private struct ThemeOption<Visual: View>: View {
    @Environment(\.cheddarPalette) private var palette

    let label: String
    let description: String
    let isSelected: Bool
    let onSelect: () -> Void
    @ViewBuilder let visual: Visual

    var body: some View {
        Button(action: onSelect) {
            HStack(spacing: CheddarSpacing.gapM) {
                visual

                VStack(alignment: .leading, spacing: 2) {
                    Text(label).cdsType(CheddarType.bodyLargeStrong)
                    Text(description)
                        .cdsType(CheddarType.bodySmall)
                        // `foreground-secondary` is rated against the canvas, and these
                        // cards sit a step above it on a brand tint where every brand lands
                        // just under 4.5:1. Dimming the primary foreground toward the card's
                        // own fill keeps the hierarchy on all four ramps.
                        .foregroundStyle(palette.foregroundPrimary.opacity(0.8))
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                check
            }
            .padding(CheddarSpacing.m)
            .foregroundStyle(palette.foregroundPrimary)
            .cdsCard(
                background: palette.bgBrandTertiary,
                border: isSelected ? palette.borderStrong : .clear
            )
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(label)
        .accessibilityHint(description)
        .accessibilityAddTraits(isSelected ? [.isSelected] : [])
    }

    private var check: some View {
        ZStack {
            if isSelected {
                Circle().fill(palette.foregroundBrandPrimary)
                CDSIcon(.check, size: 14)
                    .foregroundStyle(palette.bgOnBrand)
            } else {
                Circle().strokeBorder(palette.borderDefault, lineWidth: CheddarSpacing.border)
            }
        }
        .frame(width: 24, height: 24)
    }
}

/// A canvas-over-card sliver standing in for the whole shell. The ring keeps the card
/// readable in light mode, where a white card on a near-white canvas would otherwise vanish.
private struct ModeChip: View {
    @Environment(\.cheddarPalette) private var palette

    var body: some View {
        Capsule()
            .fill(palette.backgroundSurface)
            .frame(height: 10)
            .overlay { Capsule().strokeBorder(palette.borderDefault, lineWidth: CheddarSpacing.border) }
            .padding(6)
            .frame(width: 34, height: 34)
            .background(palette.backgroundDefault)
            .clipShape(Circle())
            .overlay { Circle().strokeBorder(palette.borderDefault, lineWidth: CheddarSpacing.border) }
    }
}
