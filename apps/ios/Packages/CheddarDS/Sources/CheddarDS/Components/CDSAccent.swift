import SwiftUI

/// The four accent ramps content can be tagged with, mirroring the web's `accent` prop.
///
/// Components pick the step rather than the caller: filled blocks take 500, data marks and
/// progress fills take 300.
public enum CDSAccent: String, CaseIterable, Sendable {
    case green
    case blue
    case magenta
    case purple

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
        case .green: CheddarColors.green300
        case .blue: CheddarColors.blue300
        case .magenta: CheddarColors.brand300
        case .purple: CheddarColors.purple300
        }
    }

    public var step500: Color {
        switch self {
        case .green: CheddarColors.green500
        case .blue: CheddarColors.blue500
        case .magenta: CheddarColors.brand500
        case .purple: CheddarColors.purple500
        }
    }
}
