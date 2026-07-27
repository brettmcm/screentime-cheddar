import SwiftUI

/// `Tag` — a small pill label.
///
/// The fills come off the raw primitives rather than the active brand, and the label is
/// always black: these have to stay legible on whatever card they land on. Magenta alone
/// takes the 400 step; the other three take 500.
public struct CDSTag: View {
    public enum Color_: String, CaseIterable, Sendable {
        case green
        case blue
        case magenta
        case purple

        var background: Color {
            switch self {
            case .green: CheddarPrimitives.green500.color
            case .blue: CheddarPrimitives.blue500.color
            case .magenta: CheddarPrimitives.brand400.color
            case .purple: CheddarPrimitives.purple500.color
            }
        }
    }

    private let label: String
    private let color: Color_
    private let isDismissible: Bool
    private let onDismiss: (() -> Void)?

    /// Tags carry their own dismiss control and their own visibility: dismissing one removes
    /// it whether or not the caller is listening.
    @State private var isVisible = true

    public init(
        _ label: String,
        color: Color_ = .green,
        isDismissible: Bool = true,
        onDismiss: (() -> Void)? = nil
    ) {
        self.label = label
        self.color = color
        self.isDismissible = isDismissible
        self.onDismiss = onDismiss
    }

    public var body: some View {
        if isVisible {
            HStack(spacing: CheddarSpacing.xs) {
                Text(label)
                    .font(CheddarFonts.monaSans(size: CheddarSize.fontS, weight: .medium))
                    .lineLimit(1)
                if isDismissible {
                    Button {
                        isVisible = false
                        onDismiss?()
                    } label: {
                        CDSIcon(.x, size: 12)
                            .frame(width: CheddarSpacing.iconSmall, height: CheddarSpacing.iconSmall)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Remove \(label)")
                }
            }
            .foregroundStyle(CheddarColors.black100)
            .padding(.vertical, 6)
            .padding(.horizontal, CheddarSpacing.xs)
            .background(color.background)
            .clipShape(Capsule())
        }
    }
}
