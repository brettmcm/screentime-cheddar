import SwiftUI

/// `NumberPad` — the keypad behind the add-money flow.
///
/// Figma draws the keys as bare numerals on the branded canvas, so these are deliberately not
/// buttons in the DS sense: no fill, no border, no pill.
public struct CDSNumberPad: View {
    @Environment(\.cheddarPalette) private var palette

    @Binding private var value: String
    private let allowsDecimal: Bool
    private let decimalPlaces: Int
    private let maxLength: Int?

    public init(
        value: Binding<String>,
        allowsDecimal: Bool = true,
        decimalPlaces: Int = 2,
        maxLength: Int? = nil
    ) {
        _value = value
        self.allowsDecimal = allowsDecimal
        self.decimalPlaces = decimalPlaces
        self.maxLength = maxLength
    }

    private let columns = Array(
        repeating: GridItem(.flexible(), spacing: CheddarSpacing.gapXs),
        count: 3
    )

    public var body: some View {
        LazyVGrid(columns: columns, spacing: CheddarSpacing.gapS) {
            ForEach(1...9, id: \.self) { digit in
                key(String(digit))
            }
            key(".", isEnabled: allowsDecimal, label: "Decimal point")
            key("0")
            Button {
                apply(.backspace)
            } label: {
                CDSIcon(.caretLeft, size: CheddarSpacing.iconLarge)
                    .foregroundStyle(palette.iconPrimary)
                    .frame(maxWidth: .infinity, minHeight: 72)
                    .contentShape(Rectangle())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("Backspace")
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel("Number pad")
    }

    private func key(_ character: String, isEnabled: Bool = true, label: String? = nil) -> some View {
        Button {
            apply(.character(character))
        } label: {
            Text(character)
                .cdsType(CheddarType.displayXsmall)
                .foregroundStyle(isEnabled ? palette.foregroundPrimary : palette.foregroundTertiary)
                .frame(maxWidth: .infinity, minHeight: 72)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        // A spent key states itself in `foreground-tertiary`, so it does not want the extra
        // fade `.disabled` puts over a control's label as well.
        .allowsHitTesting(isEnabled)
        .accessibilityLabel(label ?? character)
    }

    private enum Press {
        case character(String)
        case backspace
    }

    private func apply(_ press: Press) {
        switch press {
        case .backspace:
            value = String(value.dropLast())
        case .character("."):
            guard allowsDecimal, !value.contains(".") else { return }
            value = limited(value.isEmpty ? "0." : value + ".")
        case let .character(digit):
            // A second decimal place is the last one that fits, so anything past it is
            // dropped rather than truncating the whole entry.
            if let fraction = value.split(separator: ".", maxSplits: 1).dropFirst().first,
               fraction.count >= decimalPlaces {
                return
            }
            value = limited(value + digit)
        }
    }

    private func limited(_ candidate: String) -> String {
        guard let maxLength, candidate.count > maxLength else { return candidate }
        return value
    }
}
