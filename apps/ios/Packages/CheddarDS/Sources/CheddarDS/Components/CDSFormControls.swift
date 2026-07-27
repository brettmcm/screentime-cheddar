import SwiftUI

/// `Search` — the collapsible search field on the Learn screen. A DS surface, so it re-scopes
/// to the light island palette and stays a white pill on the branded canvas.
public struct CDSSearch: View {
    @Environment(\.cheddarTheme) private var theme

    @Binding private var text: String
    private let placeholder: String
    private let label: String

    public init(text: Binding<String>, label: String = "Search", placeholder: String = "Search anything") {
        _text = text
        self.label = label
        self.placeholder = placeholder
    }

    public var body: some View {
        let palette = theme.island

        HStack(spacing: CheddarSpacing.xs) {
            CDSIcon(.search, size: CheddarSpacing.iconMedium)
                .foregroundStyle(palette.foregroundSecondary)
            TextField(
                "",
                text: $text,
                prompt: Text(placeholder).foregroundColor(palette.foregroundSecondary)
            )
            .font(CheddarFonts.monaSans(size: CheddarSize.fontS, weight: .medium))
            .foregroundStyle(palette.foregroundPrimary)
            .textInputAutocapitalization(.never)
            .autocorrectionDisabled()
            .accessibilityLabel(label)
        }
        .padding(.horizontal, CheddarSpacing.m)
        .frame(height: 48)
        .background(palette.backgroundSurface)
        .clipShape(Capsule())
        .overlay {
            Capsule().strokeBorder(palette.borderStrong, lineWidth: CheddarSpacing.border)
        }
        .cheddarIsland()
    }
}

/// `InputField` — a labelled text input.
///
/// Not one of the DS surfaces, so it follows whatever it is nested in: white inside a sheet,
/// brand-100 when it sits straight on the shell as it does on the add-goal screen.
public struct CDSInputField: View {
    @Environment(\.cheddarPalette) private var palette

    @Binding private var text: String
    private let label: String
    private let placeholder: String
    private let description: String?
    private let textContentType: UITextContentType?

    public init(
        label: String,
        text: Binding<String>,
        placeholder: String = "",
        description: String? = nil,
        textContentType: UITextContentType? = nil
    ) {
        self.label = label
        _text = text
        self.placeholder = placeholder
        self.description = description
        self.textContentType = textContentType
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.xxs) {
            Text(label)
                .font(CheddarFonts.monaSans(size: CheddarSize.fontS, weight: .semibold))
                .foregroundStyle(palette.foregroundPrimary)

            TextField(
                "",
                text: $text,
                prompt: Text(placeholder).foregroundColor(palette.foregroundSecondary)
            )
            .font(CheddarFonts.monaSans(size: CheddarSize.fontS, weight: .medium))
            .foregroundStyle(palette.foregroundPrimary)
            .textContentType(textContentType)
            // The input carries the text ramp's 1.3 line box, which is taller than the field
            // a bare `TextField` asks for.
            .frame(minHeight: CheddarSize.fontS * 1.3)
            .padding(CheddarSpacing.s)
            .background(palette.bgOnBrand)
            .clipShape(RoundedRectangle(
                cornerRadius: CheddarSpacing.cornerXsmall,
                style: .continuous
            ))
            .overlay {
                RoundedRectangle(cornerRadius: CheddarSpacing.cornerXsmall, style: .continuous)
                    .strokeBorder(palette.borderStrong, lineWidth: CheddarSpacing.border)
            }
            .accessibilityLabel(label)

            if let description {
                Text(description)
                    .font(CheddarFonts.monaSans(size: CheddarSize.fontS, weight: .medium))
                    .foregroundStyle(palette.foregroundSecondary)
            }
        }
    }
}

/// `Radio` — a labelled circular choice with an optional description beneath.
public struct CDSRadio: View {
    @Environment(\.cheddarPalette) private var palette

    private let label: String
    private let description: String?
    private let isSelected: Bool
    private let onSelect: () -> Void

    public init(
        label: String,
        description: String? = nil,
        isSelected: Bool,
        onSelect: @escaping () -> Void
    ) {
        self.label = label
        self.description = description
        self.isSelected = isSelected
        self.onSelect = onSelect
    }

    public var body: some View {
        Button(action: onSelect) {
            VStack(alignment: .leading, spacing: CheddarSpacing.xxs) {
                HStack(spacing: CheddarSpacing.xs) {
                    indicator
                    Text(label)
                        .font(CheddarFonts.monaSans(size: CheddarSize.fontS, weight: .semibold))
                        .foregroundStyle(palette.foregroundPrimary)
                    Spacer(minLength: 0)
                }
                if let description {
                    Text(description)
                        .font(CheddarFonts.monaSans(size: CheddarSize.fontS, weight: .medium))
                        .foregroundStyle(palette.foregroundSecondary)
                        // Indents past the 20pt mark and its 8pt gap, so the description
                        // lines up with the label rather than the control.
                        .padding(.leading, 28)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(isSelected ? [.isSelected] : [])
    }

    private var indicator: some View {
        ZStack {
            if isSelected {
                Circle().fill(palette.foregroundBrandPrimary)
                Circle().fill(palette.bgOnBrand).frame(width: 10, height: 10)
            } else {
                Circle().strokeBorder(palette.foregroundBrandPrimary, lineWidth: 1.25)
            }
        }
        .frame(width: 20, height: 20)
    }
}
