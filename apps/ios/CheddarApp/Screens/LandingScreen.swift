import CheddarDS
import SwiftUI

struct LandingScreen: View {
    @EnvironmentObject private var app: AppState
    @Environment(\.cheddarPalette) private var palette

    var body: some View {
        AppScreen(alignment: .center, spacing: 0, scrolls: false) {
            CDSWordmark(color: palette.foregroundBrandPrimary)

            // The two lines are set solid here, tighter than the ramp's own leading.
            CDSDisplayText(
                "Save. Unlock.\nRepeat",
                style: CheddarType.displayLarge,
                lineHeight: CheddarType.displayLarge.size,
                alignment: .center
            )
            .foregroundStyle(palette.foregroundBrandPrimary)
                .padding(.top, CheddarSpacing.xl)
                .padding(.bottom, CheddarSpacing.xxl)

            hero

            // SwiftUI pushes a widow word back onto the line above, so this breaks one word
            // earlier than the browser's greedy pass does.
            Text("Let’s get started on your personal savings journey.")
                .fixedSize(horizontal: false, vertical: true)
                .padding(.top, CheddarSpacing.l)

            Spacer(minLength: CheddarSpacing.m)

            HStack(spacing: CheddarSpacing.gapS) {
                CDSButton("Sign in", variant: .secondary) { app.goTab(.home) }
                CDSButton("Sign up") { app.goTab(.home) }
            }
        }
        .multilineTextAlignment(.center)
    }

    /// A soft off-round blob behind the artwork — a single rotated superellipse rather than
    /// the brand lobe, which is the shape the App Flow draws here.
    private var hero: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 130, style: .continuous)
                .fill(palette.bgBrandTertiary)
                .rotationEffect(.degrees(10))
                .frame(width: 300, height: 280)

            CDSResourceImage("brand-hero.png")
                .scaledToFit()
                .frame(width: 240, height: 240)
        }
        .frame(maxWidth: 362)
        .frame(height: 300)
    }
}
