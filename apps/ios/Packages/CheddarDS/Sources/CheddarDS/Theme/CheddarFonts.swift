import CoreText
import SwiftUI
import UIKit

public enum CheddarFontRegistration {
    private static var didRegister = false

    /// Registers DS fonts from the CheddarDS resource bundle.
    /// SPM flattens `Resources/Fonts/*.ttf` into the bundle root (no `Fonts/` subdirectory).
    public static func registerFontsIfNeeded() {
        guard !didRegister else { return }
        didRegister = true

        var urls: [URL] = []
        // Prefer subdirectory if present, then fall back to bundle root.
        if let nested = Bundle.module.urls(forResourcesWithExtension: "ttf", subdirectory: "Fonts") {
            urls.append(contentsOf: nested)
        }
        if let root = Bundle.module.urls(forResourcesWithExtension: "ttf", subdirectory: nil) {
            urls.append(contentsOf: root)
        }

        var seen = Set<String>()
        for url in urls {
            let key = url.lastPathComponent
            guard seen.insert(key).inserted else { continue }
            var error: Unmanaged<CFError>?
            if !CTFontManagerRegisterFontsForURL(url as CFURL, .process, &error) {
                // Already registered is fine.
                if let error {
                    let msg = CFErrorCopyDescription(error.takeUnretainedValue()) as String? ?? ""
                    if !msg.lowercased().contains("already") {
                        print("CheddarDS font registration failed for \(key): \(msg)")
                    }
                }
            }
        }

        #if DEBUG
        let expected = [
            "MonaSans-Medium", "MonaSans-SemiBold", "MonaSans-Bold",
            "Oswald-Regular", "Oswald-Medium", "Oswald-SemiBold",
        ]
        for name in expected {
            if UIFont(name: name, size: 12) == nil {
                print("CheddarDS warning: font not available after registration: \(name)")
            }
        }
        #endif
    }
}

public enum CheddarFonts {
    public static let monaMedium = "MonaSans-Medium"
    public static let monaSemiBold = "MonaSans-SemiBold"
    public static let monaBold = "MonaSans-Bold"
    public static let oswaldRegular = "Oswald-Regular"
    public static let oswaldMedium = "Oswald-Medium"
    public static let oswaldSemiBold = "Oswald-SemiBold"

    public static func monaSans(size: CGFloat, weight: Font.Weight = .medium) -> Font {
        Font.custom(monaPostScriptName(for: weight), size: size)
    }

    public static func oswald(size: CGFloat, weight: Font.Weight = .medium) -> Font {
        Font.custom(oswaldPostScriptName(for: weight), size: size)
    }

    /// Resolves a design system text style against the bundled faces.
    ///
    /// `CheddarTextStyle.font` cannot be used directly: the DS carries CSS family stacks
    /// (`"Mona Sans Variable"`, `"Oswald"`), while the bundled TTFs register under
    /// PostScript names. Passing the CSS name to `Font.custom` silently falls back to the
    /// system font, so the family is mapped here instead.
    public static func font(for style: CheddarTextStyle) -> Font {
        switch style.family {
        case "Oswald":
            return oswald(size: style.size, weight: style.weight)
        default:
            return monaSans(size: style.size, weight: style.weight)
        }
    }

    private static func monaPostScriptName(for weight: Font.Weight) -> String {
        switch weight {
        case .semibold, .bold, .heavy, .black:
            return weight == .semibold ? monaSemiBold : monaBold
        default:
            return monaMedium
        }
    }

    private static func oswaldPostScriptName(for weight: Font.Weight) -> String {
        switch weight {
        case .semibold, .bold, .heavy, .black:
            return oswaldSemiBold
        case .medium:
            return oswaldMedium
        default:
            return oswaldRegular
        }
    }
}
