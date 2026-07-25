import SwiftUI

public struct CDSAvatar: View {
    public enum Size {
        /// The profile header treatment, which the design system draws at 96pt.
        case xlarge
        case large, medium, small

        var dimension: CGFloat {
            switch self {
            case .xlarge: 96
            case .large: 40
            case .medium: 32
            case .small: 24
            }
        }

        var assetName: String {
            switch self {
            case .xlarge, .large: "avatar-40"
            case .medium: "avatar-32"
            case .small: "avatar-24"
            }
        }
    }

    let size: Size

    public init(size: Size = .medium) {
        self.size = size
    }

    public var body: some View {
            CDSResourceImage("\(size.assetName).png")
            .scaledToFill()
            .frame(width: size.dimension, height: size.dimension)
            .clipShape(Circle())
            .accessibilityHidden(true)
    }
}
