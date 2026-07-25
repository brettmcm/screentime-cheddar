import SwiftUI
import CheddarDS

struct ThemeSettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var appState: AppState

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: CheddarSpacing.l) {
                CDSPageHeader(title: "Theme Settings", showsBack: true) {
                    dismiss()
                }

                Text("Choose a color theme for your Cheddar experience.")
                    .font(CheddarFonts.monaSans(size: 14, weight: .medium))
                    .foregroundStyle(CheddarColors.shell.foregroundSecondary)

                ForEach(CheddarThemeName.allCases) { theme in
                    themeRow(theme)
                }

                Text("Preview")
                    .font(CheddarFonts.monaSans(size: 14, weight: .medium))
                    .foregroundStyle(CheddarColors.shell.foregroundSecondary)
                preview
            }
            .padding(CheddarSpacing.l)
        }
        .background(CheddarColors.shell.backgroundDefault.ignoresSafeArea())
    }

    private func themeRow(_ theme: CheddarThemeName) -> some View {
        let colors = swatches(for: theme)
        return Button {
            appState.selectedTheme = theme
            appState.showToast("\(theme.rawValue) theme selected")
        } label: {
            HStack(spacing: CheddarSpacing.m) {
                HStack(spacing: 6) {
                    ForEach(Array(colors.enumerated()), id: \.offset) { _, color in
                        Circle()
                            .fill(color)
                            .frame(width: 28, height: 28)
                    }
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text(theme.rawValue)
                        .font(CheddarFonts.monaSans(size: 16, weight: .semibold))
                    Text(description(for: theme))
                        .font(CheddarFonts.monaSans(size: 12, weight: .medium))
                        .foregroundStyle(CheddarColors.shell.foregroundSecondary)
                }
                Spacer()
                if appState.selectedTheme == theme {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(colors[1])
                }
            }
            .padding(CheddarSpacing.m)
            .background(CheddarColors.surface.backgroundSurface)
            .overlay {
                RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge)
                    .stroke(
                        appState.selectedTheme == theme ? colors[1] : .clear,
                        lineWidth: 2
                    )
            }
            .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge))
        }
        .buttonStyle(.plain)
    }

    private var preview: some View {
        let colors = swatches(for: appState.selectedTheme)
        return VStack(spacing: CheddarSpacing.m) {
            HStack {
                RoundedRectangle(cornerRadius: CheddarSpacing.cornerSmall)
                    .fill(colors[1])
                    .frame(width: 48, height: 48)
                VStack(alignment: .leading, spacing: 6) {
                    Capsule().fill(colors[0]).frame(width: 100, height: 12)
                    Capsule().fill(colors[0].opacity(0.35)).frame(width: 70, height: 8)
                }
                Spacer()
            }
            GeometryReader { proxy in
                ZStack(alignment: .leading) {
                    Capsule().fill(Color.black.opacity(0.1))
                    Capsule().fill(colors[1]).frame(width: proxy.size.width * 0.68)
                }
            }
            .frame(height: 8)
            HStack {
                Text("Deposit")
                    .frame(maxWidth: .infinity)
                    .frame(height: 46)
                    .overlay { Capsule().stroke(colors[0], lineWidth: 1) }
                Text("Save")
                    .frame(maxWidth: .infinity)
                    .frame(height: 46)
                    .background(colors[1])
                    .clipShape(Capsule())
            }
            .font(CheddarFonts.monaSans(size: 14, weight: .semibold))
            .foregroundStyle(colors[0])
        }
        .padding(CheddarSpacing.m)
        .background(colors[2])
        .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerLarge))
    }

    private func swatches(for theme: CheddarThemeName) -> [Color] {
        switch theme {
        case .berry:
            [Color(hex: "#64002D"), Color(hex: "#FF91F2"), Color(hex: "#FFEBFD"), Color(hex: "#850056")]
        case .blue:
            [Color(hex: "#001845"), Color(hex: "#56D7FF"), Color(hex: "#CCE8FF"), Color(hex: "#003399")]
        case .green:
            [Color(hex: "#0A2A00"), Color(hex: "#B0FE00"), Color(hex: "#D4FF72"), Color(hex: "#1A5C00")]
        case .purple:
            [Color(hex: "#1A0040"), Color(hex: "#AA8BFF"), Color(hex: "#EDDEFF"), Color(hex: "#32008F")]
        }
    }

    private func description(for theme: CheddarThemeName) -> String {
        switch theme {
        case .berry: "Deep burgundy · Magenta accents"
        case .blue: "Deep cobalt · Cyan accents"
        case .green: "Deep forest · Lime accents"
        case .purple: "Deep violet · Lavender accents"
        }
    }
}
