import CheddarDS
import SwiftUI

struct ProfileScreen: View {
    @EnvironmentObject private var app: AppState

    @State private var isEditing = false

    var body: some View {
        ZStack {
            AppScreen(nav: true) {
                CDSPageHeader("Profile", showBack: false) {
                    HStack(spacing: CheddarSpacing.gapXs) {
                        CDSIconButton(.settings, label: "Theme settings", variant: .ghost, size: .small) {
                            app.push(.themeSettings)
                        }
                        CDSIconButton(.notification, label: "Notifications", variant: .ghost, size: .small) {
                            app.showToast("You're all caught up")
                        }
                    }
                }

                CDSProfileCard(
                    name: app.profile.name,
                    handle: app.profile.handle,
                    avatarAsset: "avatar-large.png",
                    actions: [
                        CDSCardAction(label: "Edit", icon: .edit) { isEditing = true },
                        CDSCardAction(label: "Share", icon: .send) { app.shareProfile() },
                    ]
                )

                CDSSavingsStreak(title: "Savings Streak", days: DemoData.streakDays)

                CDSSectionHeader("Badges")
                CardStack {
                    ForEach(DemoData.staticBadges) { badge in
                        CDSBadgeCard(
                            title: badge.title,
                            caption: badge.caption,
                            progress: badge.progress,
                            icon: badge.icon,
                            accent: badge.accent
                        )
                    }
                    CDSBadgeCard(
                        title: "Stack Master",
                        caption: "\(CDSCurrency.format(app.totalSavings)) of \(CDSCurrency.format(DemoData.stackMasterTarget)) total savings",
                        progress: stackMasterProgress,
                        icon: .chart,
                        accent: .magenta
                    )
                }

                CDSSectionHeader("Accounts")
                CardStack {
                    ForEach(DemoData.accounts) { account in
                        CDSAccountCard(
                            name: account.name,
                            subtitle: account.subtitle,
                            amount: account.amount,
                            meta: account.meta,
                            icon: .wallet
                        )
                    }
                }

                CDSSectionHeader("Goal summary")
                CDSGoalSummaryCard(
                    items: app.goals.map {
                        CDSGoalSummaryItem(id: $0.id, label: $0.name, amount: $0.saved)
                    },
                    totalLabel: "Total savings",
                    total: app.totalSavings
                )
            }

            if isEditing {
                EditProfileSheet(onClose: { isEditing = false }, onSave: app.updateProfile)
            }
        }
        .animation(.easeOut(duration: 0.2), value: isEditing)
    }

    private var stackMasterProgress: Double {
        let ratio = (app.totalSavings / DemoData.stackMasterTarget) * 100
        return min(100, NSDecimalNumber(decimal: ratio).doubleValue)
    }
}

private struct EditProfileSheet: View {
    @EnvironmentObject private var app: AppState

    let onClose: () -> Void
    let onSave: (String, String) -> Void

    @State private var name = ""
    @State private var handle = ""

    var body: some View {
        CDSSheet(title: "Edit Profile", onClose: onClose) {
            CDSInputField(label: "Display name", text: $name, textContentType: .name)
            CDSInputField(label: "Handle", text: $handle, textContentType: .nickname)
        } footer: {
            CDSButton("Save changes") {
                onSave(name, handle)
                onClose()
            }
        }
        .onAppear {
            name = app.profile.name
            handle = app.profile.handle
        }
    }
}
