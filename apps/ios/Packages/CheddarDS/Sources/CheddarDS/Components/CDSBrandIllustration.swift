import SwiftUI

/// The four-lobed brand shape — a square with bowed sides and pinched corners.
///
/// Traced from Figma's `Illustration / Large` (node 4993:10153), whose master is
/// 370pt square; the path is normalised to that box and scaled into whatever
/// rect it's drawn in. The web carries the same outline as an SVG mask.
public struct CDSBrandLobe: Shape {
    private static let master: CGFloat = 370

    public init() {}

    public func path(in rect: CGRect) -> Path {
        let scale = min(rect.width, rect.height) / Self.master
        let originX = rect.midX - (Self.master * scale) / 2
        let originY = rect.midY - (Self.master * scale) / 2
        func point(_ x: CGFloat, _ y: CGFloat) -> CGPoint {
            CGPoint(x: originX + x * scale, y: originY + y * scale)
        }

        var path = Path()
        path.move(to: point(136.348, 354.409))
        path.addCurve(
            to: point(15.5907, 233.652),
            control1: point(57.0835, 407.892),
            control2: point(-37.8916, 312.917)
        )
        path.addCurve(
            to: point(15.5907, 136.348),
            control1: point(35.4286, 204.251),
            control2: point(35.4287, 165.749)
        )
        path.addCurve(
            to: point(136.348, 15.5907),
            control1: point(-37.8916, 57.0835),
            control2: point(57.0835, -37.8916)
        )
        path.addCurve(
            to: point(233.652, 15.5907),
            control1: point(165.749, 35.4286),
            control2: point(204.251, 35.4286)
        )
        path.addCurve(
            to: point(354.409, 136.348),
            control1: point(312.917, -37.8916),
            control2: point(407.892, 57.0835)
        )
        path.addCurve(
            to: point(354.409, 233.652),
            control1: point(334.571, 165.749),
            control2: point(334.571, 204.251)
        )
        path.addCurve(
            to: point(233.652, 354.409),
            control1: point(407.892, 312.917),
            control2: point(312.917, 407.892)
        )
        path.addCurve(
            to: point(136.348, 354.409),
            control1: point(204.251, 334.571),
            control2: point(165.749, 334.571)
        )
        path.closeSubpath()
        return path
    }
}

/// Figma's `Illustration / Large`: two concentric copies of the brand lobe with
/// the artwork over the top.
///
/// The proportions come straight off the 370pt master — the inner lobe is 273
/// and the artwork 343 — so the whole thing scales from a single `size`. The
/// artwork deliberately overhangs the lobes rather than being clipped to them.
public struct CDSBrandIllustration<Artwork: View>: View {
    @Environment(\.cheddarPalette) private var palette

    private let size: CGFloat
    private let artwork: Artwork

    public init(size: CGFloat = 280, @ViewBuilder artwork: () -> Artwork) {
        self.size = size
        self.artwork = artwork()
    }

    public var body: some View {
        ZStack {
            CDSBrandLobe()
                .fill(palette.bgBrandTertiary)
                .frame(width: size, height: size)
            CDSBrandLobe()
                .fill(palette.bgBrandShade)
                .frame(width: size * (273.0 / 370.0), height: size * (273.0 / 370.0))
            artwork
                .frame(width: size * (343.0 / 370.0), height: size * (343.0 / 370.0))
        }
        .frame(width: size, height: size)
        .accessibilityHidden(true)
    }
}
