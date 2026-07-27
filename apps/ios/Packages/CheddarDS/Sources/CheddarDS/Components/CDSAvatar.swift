import SwiftUI

/// `Avatar` — a circular portrait, falling back to initials and then to the bundled
/// placeholder for its size.
public struct CDSAvatar: View {
    public enum Size: CGFloat {
        case small = 24
        case medium = 32
        case large = 40
        /// The profile header treatment, which the design system draws at 96pt.
        case xlarge = 96

        var dimension: CGFloat { rawValue }

        /// The DS ships a placeholder pre-sized to each avatar box; the 96pt card reuses
        /// the largest one.
        var placeholder: String {
            switch self {
            case .small: "avatar-small.png"
            case .medium: "avatar-medium.png"
            case .large, .xlarge: "avatar-large.png"
            }
        }

        var initialsStyle: CheddarTextStyle {
            switch self {
            case .small: CheddarTextStyle(
                family: "Mona Sans Variable", size: 11, weight: .semibold, lineHeight: 14
            )
            case .large, .xlarge: CheddarType.bodyMediumStrong
            case .medium: CheddarType.bodySmallStrong
            }
        }
    }

    @Environment(\.cheddarPalette) private var palette

    private let size: Size
    private let asset: String?
    private let name: String?

    public init(size: Size = .large, asset: String? = nil, name: String? = nil) {
        self.size = size
        self.asset = asset
        self.name = name
    }

    public var body: some View {
        Group {
            if let asset {
                CDSResourceImage(asset).scaledToFill()
            } else if let initials, !initials.isEmpty {
                Text(initials)
                    .cdsType(size.initialsStyle)
                    .foregroundStyle(palette.foregroundBrandPrimary)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(palette.bgBrandPrimary)
            } else {
                CDSResourceImage(size.placeholder).scaledToFill()
            }
        }
        .frame(width: size.dimension, height: size.dimension)
        .clipShape(Circle())
        .accessibilityLabel(name ?? "")
        .accessibilityHidden(name == nil)
    }

    /// The DS takes the first letter of the first two words, uppercased.
    private var initials: String? {
        guard let name else { return nil }
        return name
            .split(separator: " ")
            .prefix(2)
            .compactMap { $0.first.map(String.init) }
            .joined()
            .uppercased()
    }
}
