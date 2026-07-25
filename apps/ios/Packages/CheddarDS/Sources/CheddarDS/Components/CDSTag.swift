import SwiftUI

public enum CDSTagAccent {
    case green
    case blue
    case magenta
    case purple

    var background: Color {
        switch self {
        case .green: CheddarColors.green500
        case .blue: CheddarColors.blue500
        case .magenta: CheddarColors.brand400
        case .purple: CheddarColors.purple500
        }
    }
}

public struct CDSTag: View {
    let label: String
    var accent: CDSTagAccent = .green
    var onDismiss: (() -> Void)?

    public init(_ label: String, accent: CDSTagAccent = .green, onDismiss: (() -> Void)? = nil) {
        self.label = label
        self.accent = accent
        self.onDismiss = onDismiss
    }

    public var body: some View {
        HStack(spacing: CheddarSpacing.xs) {
            Text(label)
                .font(CheddarFonts.monaSans(size: 14, weight: .medium))
            if let onDismiss {
                Button(action: onDismiss) {
                    Image(systemName: "xmark")
                        .font(.system(size: 10, weight: .bold))
                        .frame(width: 16, height: 16)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("Dismiss \(label)")
            }
        }
        .foregroundStyle(CheddarColors.black100)
        .padding(.vertical, 6)
        .padding(.horizontal, CheddarSpacing.xs)
        .background(accent.background)
        .clipShape(Capsule())
    }
}
