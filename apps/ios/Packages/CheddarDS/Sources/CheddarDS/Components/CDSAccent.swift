import SwiftUI

/// The four accent ramps content can be tagged with, mirroring the web's `accent` prop.
///
/// Accents are deliberately brand-independent — a list of goals or spending segments has to
/// stay readable whichever brand is active — so these read the raw primitives rather than
/// the active ramp. `magenta` is the `brand-*` primitive family, which is magenta whatever
/// `CheddarTheme.brand` says.
///
/// Components pick the step, not the caller: filled tiles take 500, data marks and progress
/// fills take 300, the photo tile takes 200, and segmented columns label themselves in 100.
public enum CDSAccent: String, CaseIterable, Sendable, Identifiable {
    case green
    case blue
    case magenta
    case purple

    public var id: String { rawValue }

    public var step100: Color {
        switch self {
        case .green: CheddarPrimitives.green100.color
        case .blue: CheddarPrimitives.blue100.color
        case .magenta: CheddarPrimitives.brand100.color
        case .purple: CheddarPrimitives.purple100.color
        }
    }

    public var step200: Color {
        switch self {
        case .green: CheddarPrimitives.green200.color
        case .blue: CheddarPrimitives.blue200.color
        case .magenta: CheddarPrimitives.brand200.color
        case .purple: CheddarPrimitives.purple200.color
        }
    }

    public var step300: Color {
        switch self {
        case .green: CheddarPrimitives.green300.color
        case .blue: CheddarPrimitives.blue300.color
        case .magenta: CheddarPrimitives.brand300.color
        case .purple: CheddarPrimitives.purple300.color
        }
    }

    public var step400: Color {
        switch self {
        case .green: CheddarPrimitives.green400.color
        case .blue: CheddarPrimitives.blue400.color
        case .magenta: CheddarPrimitives.brand400.color
        case .purple: CheddarPrimitives.purple400.color
        }
    }

    public var step500: Color {
        switch self {
        case .green: CheddarPrimitives.green500.color
        case .blue: CheddarPrimitives.blue500.color
        case .magenta: CheddarPrimitives.brand500.color
        case .purple: CheddarPrimitives.purple500.color
        }
    }

    public var step600: Color {
        switch self {
        case .green: CheddarPrimitives.green600.color
        case .blue: CheddarPrimitives.blue600.color
        case .magenta: CheddarPrimitives.brand600.color
        case .purple: CheddarPrimitives.purple600.color
        }
    }

    /// `--accent-fg`: what reads on a filled block of this accent. Green's ramp is light
    /// enough that white would fail on it, so it alone reverses to black.
    public var foreground: Color {
        self == .green ? CheddarColors.black100 : CheddarColors.white100
    }
}
