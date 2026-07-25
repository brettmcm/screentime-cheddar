import SwiftUI
import CheddarDS

struct LandingView: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        ZStack(alignment: .bottom) {
            CheddarColors.shell.backgroundDefault
                .ignoresSafeArea()

            VStack(spacing: 0) {
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        CDSWordmark(height: 24)
                            .padding(.top, CheddarSpacing.m)
                            .padding(.bottom, CheddarSpacing.m)

                        CheddarTypography.displayLarge("Save. Unlock.\nRepeat")
                            .foregroundStyle(CheddarColors.shell.foregroundBrandPrimary)
                            .padding(.top, CheddarSpacing.xl)
                            .padding(.bottom, CheddarSpacing.xxl)

                        CDSIntroIllustration()
                            .padding(.bottom, CheddarSpacing.l)

                        CheddarTypography.heading("Let's get started on your personal savings journey.")
                            .foregroundStyle(CheddarColors.shell.foregroundPrimary)
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: 364)
                    }
                    .padding(.horizontal, CheddarSpacing.l)
                    .padding(.bottom, 120)
                }

                HStack(spacing: CheddarSpacing.xs) {
                    CDSButton("Sign in", variant: .secondary) {
                        appState.signIn()
                    }
                    CDSButton("Sign up", variant: .primary) {
                        appState.signUp()
                    }
                }
                .padding(.horizontal, CheddarSpacing.l)
                .padding(.top, CheddarSpacing.m)
                .padding(.bottom, CheddarSpacing.l)
                .background(CheddarColors.shell.backgroundDefault)
            }
        }
    }
}

#Preview {
    LandingView()
        .environmentObject(AppState())
}
