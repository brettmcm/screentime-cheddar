import SwiftUI

/// Landing hero illustration — composite export from Figma Intro Illustration.
public struct CDSIntroIllustration: View {
    public init() {}

    public var body: some View {
            CDSResourceImage("intro-illustration.png")
            .scaledToFit()
            .frame(maxWidth: 362)
            .frame(height: 370)
            .accessibilityHidden(true)
    }
}
