import SwiftUI

/// Both marks are drawn from their vector paths, so a fill colour is what themes them. The
/// wordmark paints itself `brand-400` — the semantic ramp stop, not the raw magenta primitive
/// — so it retints with the active brand; the logo mark inherits the surrounding foreground
/// instead, since its callers set the colour from whatever it is sitting on.
public struct CDSWordmark: View {
    @Environment(\.cheddarPalette) private var palette

    /// The artwork is 189x47; the DS never scales it down.
    private static let aspectRatio: CGFloat = 189 / 47

    private let height: CGFloat
    private let color: Color?

    public init(height: CGFloat = 47, color: Color? = nil) {
        self.height = height
        self.color = color
    }

    public var body: some View {
        CDSVectorShape("wordmark")
            .fill(color ?? palette.ramp.step400)
            .frame(width: height * Self.aspectRatio, height: height)
            .accessibilityLabel("Cheddar")
    }
}

public struct CDSLogoMark: View {
    /// The artwork is 57.334x43.
    private static let aspectRatio: CGFloat = 57.334 / 43

    private let height: CGFloat

    public init(height: CGFloat = 21) {
        self.height = height
    }

    public var body: some View {
        CDSVectorShape("logo-mark")
            .frame(width: height * Self.aspectRatio, height: height)
            .accessibilityLabel("Cheddar logo")
    }
}
