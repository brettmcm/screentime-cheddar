import SwiftUI

public struct CDSSearchField: View {
    @Binding private var text: String
    private let placeholder: String

    public init(text: Binding<String>, placeholder: String = "Search") {
        _text = text
        self.placeholder = placeholder
    }

    public var body: some View {
        HStack(spacing: CheddarSpacing.s) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 18, weight: .medium))
                .foregroundStyle(CheddarColors.surface.foregroundSecondary)
            TextField(placeholder, text: $text)
                .font(CheddarFonts.monaSans(size: 16, weight: .medium))
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()
            if !text.isEmpty {
                Button {
                    text = ""
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(CheddarColors.surface.foregroundSecondary)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Clear search")
            }
        }
        .padding(.horizontal, CheddarSpacing.m)
        .frame(height: 48)
        .background(CheddarColors.surface.backgroundSurface)
        .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium, style: .continuous))
    }
}

public struct CDSAmountKeypad: View {
    @Binding private var value: String
    private let allowsDecimal: Bool

    public init(value: Binding<String>, allowsDecimal: Bool = true) {
        _value = value
        self.allowsDecimal = allowsDecimal
    }

    public var body: some View {
        VStack(spacing: CheddarSpacing.xs) {
            ForEach(keys, id: \.self) { row in
                HStack(spacing: CheddarSpacing.xs) {
                    ForEach(row, id: \.self) { key in
                        Button {
                            handle(key)
                        } label: {
                            Group {
                                if key == "⌫" {
                                    Image(systemName: "delete.left")
                                } else {
                                    Text(key)
                                }
                            }
                            .font(CheddarFonts.monaSans(size: 24, weight: .medium))
                            .frame(maxWidth: .infinity)
                            .frame(height: 54)
                            .foregroundStyle(CheddarColors.surface.foregroundPrimary)
                            .background(CheddarColors.surface.backgroundSurface)
                            .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium, style: .continuous))
                        }
                        .buttonStyle(.plain)
                        .disabled(key == "." && !allowsDecimal)
                        .opacity(key == "." && !allowsDecimal ? 0 : 1)
                    }
                }
            }
        }
    }

    private var keys: [[String]] {
        [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], [".", "0", "⌫"]]
    }

    private func handle(_ key: String) {
        if key == "⌫" {
            if !value.isEmpty { value.removeLast() }
            return
        }
        if key == "." {
            guard allowsDecimal, !value.contains(".") else { return }
            value = value.isEmpty ? "0." : value + "."
            return
        }
        guard value.count < 9 else { return }
        if let dot = value.firstIndex(of: "."),
           value.distance(from: dot, to: value.endIndex) > 2 {
            return
        }
        value.append(key)
    }
}

public struct CDSToast: View {
    private let message: String

    public init(_ message: String) {
        self.message = message
    }

    public var body: some View {
        HStack(spacing: CheddarSpacing.xs) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundStyle(CheddarColors.green300)
            Text(message)
                .font(CheddarFonts.monaSans(size: 14, weight: .semibold))
        }
        .padding(.horizontal, CheddarSpacing.m)
        .frame(height: 42)
        .background(CheddarColors.cheddarBlackCherry)
        .foregroundStyle(CheddarColors.white100)
        .clipShape(Capsule())
        .shadow(color: .black.opacity(0.15), radius: 12, y: 6)
        .accessibilityElement(children: .combine)
    }
}
