import SwiftUI
import CheddarDS

struct ProfileView: View {
    @EnvironmentObject private var appState: AppState
    @State private var showEditProfile = false
    @State private var showThemeSettings = false

    private var stackMasterProgress: Double {
        let saved = NSDecimalNumber(decimal: appState.totalSavings).doubleValue
        let target = NSDecimalNumber(decimal: DemoData.stackMasterTarget).doubleValue
        guard target > 0 else { return 0 }
        return min(100, saved / target * 100)
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: CheddarSpacing.l) {
                HStack {
                    CDSPageHeader(title: "Profile")
                    Spacer()
                    HStack(spacing: CheddarSpacing.m) {
                        Button {
                            showThemeSettings = true
                        } label: {
                            Image(systemName: "gearshape")
                        }
                        .accessibilityLabel("Theme settings")
                        Button {
                            appState.showToast("You're all caught up")
                        } label: {
                            Image(systemName: "bell")
                        }
                        .accessibilityLabel("Notifications")
                    }
                    .foregroundStyle(CheddarColors.shell.foregroundBrandPrimary)
                    .buttonStyle(.plain)
                }

                CDSProfileCard(name: appState.profile.name, handle: appState.profile.handle) {
                    CDSButton("Edit", variant: .secondaryReverse, systemImage: "pencil") {
                        showEditProfile = true
                    }
                    ShareLink(item: "I’m saving with Cheddar!") {
                        HStack(spacing: CheddarSpacing.xs) {
                            Image(systemName: "paperplane.fill")
                                .font(.system(size: 15, weight: .semibold))
                            Text("Share")
                        }
                        .font(CheddarFonts.font(for: CheddarType.bodyLargeStrong))
                        .frame(maxWidth: .infinity)
                        .frame(minHeight: 66)
                        .overlay {
                            Capsule().stroke(CheddarColors.shell.foregroundOnReverse, lineWidth: 1)
                        }
                    }
                    .foregroundStyle(CheddarColors.shell.foregroundOnReverse)
                }

                CDSSavingsStreak(title: "Savings Streak", days: DemoData.streakDays)

                CDSSectionHeader(title: "Badges", actionTitle: "")
                ForEach(DemoData.badges) { badge in
                    CDSBadgeCard(
                        title: badge.title,
                        caption: badge.caption,
                        progress: badge.progress,
                        accent: badge.accent,
                        systemImage: badge.systemImage
                    )
                }
                CDSBadgeCard(
                    title: "Stack Master",
                    caption: "\(appState.totalSavingsText) of \(AppState.currency(DemoData.stackMasterTarget)) total savings",
                    progress: stackMasterProgress,
                    accent: .magenta,
                    systemImage: "chart.bar.fill"
                )

                CDSSectionHeader(title: "Accounts", actionTitle: "")
                ForEach(DemoData.accounts) { account in
                    CDSAccountCard(
                        name: account.name,
                        subtitle: account.subtitle,
                        amount: account.amount,
                        meta: account.meta
                    )
                }

                CDSSectionHeader(title: "Goal summary", actionTitle: "")
                CDSGoalSummaryCard(
                    items: appState.goals.map {
                        CDSGoalSummaryItem(id: $0.id, label: $0.name, amount: $0.saved)
                    },
                    totalLabel: "Total savings",
                    total: appState.totalSavings
                )
            }
            .padding(CheddarSpacing.l)
        }
        .background(CheddarColors.shell.backgroundDefault)
        .sheet(isPresented: $showEditProfile) {
            EditProfileSheet()
                .environmentObject(appState)
        }
        .sheet(isPresented: $showThemeSettings) {
            ThemeSettingsView()
                .environmentObject(appState)
        }
    }
}

private struct EditProfileSheet: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var appState: AppState
    @State private var name = ""
    @State private var handle = ""

    var body: some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.l) {
            HStack {
                Text("Edit Profile")
                    .font(CheddarFonts.font(for: CheddarType.displaySmall))
                    .tracking(CheddarType.displaySmall.tracking)
                    .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
                Spacer()
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark")
                        .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
                        .frame(width: 32, height: 32)
                        .background(CheddarColors.surface.backgroundMuted)
                        .clipShape(Circle())
                }
                .buttonStyle(.plain)
            }

            labelledField("Display name", text: $name, placeholder: "Display name")
                .textInputAutocapitalization(.words)

            labelledField("Handle", text: $handle, placeholder: "@handle")
                .textInputAutocapitalization(.never)
                .autocorrectionDisabled()

            Spacer()

            CDSButton("Save changes") {
                appState.updateProfile(name: name, handle: handle)
                dismiss()
            }
        }
        .padding(CheddarSpacing.l)
        .background(CheddarColors.surface.backgroundDefault.ignoresSafeArea())
        .presentationDetents([.medium])
        .presentationDragIndicator(.visible)
        .onAppear {
            name = appState.profile.name
            handle = appState.profile.handle
        }
    }

    private func labelledField(_ label: String, text: Binding<String>, placeholder: String) -> some View {
        VStack(alignment: .leading, spacing: CheddarSpacing.xs) {
            Text(label)
                .font(CheddarFonts.font(for: CheddarType.bodyMedium))
                .foregroundStyle(CheddarColors.surface.foregroundSecondary)
            TextField(placeholder, text: text)
                .font(CheddarFonts.font(for: CheddarType.bodyLarge))
                .foregroundStyle(CheddarColors.surface.foregroundOnSurface)
                .padding(CheddarSpacing.m)
                .background(CheddarColors.surface.backgroundSurface)
                .clipShape(RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium))
                .overlay {
                    RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium)
                        .stroke(CheddarColors.surface.borderDefault, lineWidth: 1)
                }
        }
    }
}
