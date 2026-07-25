import SwiftUI
import CheddarDS

struct MainTabView: View {
    @EnvironmentObject private var appState: AppState

    var body: some View {
        ZStack(alignment: .top) {
            VStack(spacing: 0) {
                tabContent
                CDSNavBar(activeItem: $appState.selectedTab) {
                    appState.showAddGoal = true
                }
            }
            if let toast = appState.toastMessage {
                CDSToast(toast)
                    .padding(.top, CheddarSpacing.s)
                    .transition(.move(edge: .top).combined(with: .opacity))
                    .zIndex(10)
            }
        }
        .animation(.spring(response: 0.3), value: appState.toastMessage)
        .sheet(isPresented: $appState.showAddGoal) {
            AddGoalView()
        }
        .sheet(item: $appState.selectedGoal) { goal in
            GoalDetailView(goalID: goal.id)
        }
    }

    @ViewBuilder
    private var tabContent: some View {
        switch appState.selectedTab {
        case .home:
            HomeView()
        case .wallet:
            SavingsView()
        case .learn:
            LearnView()
        case .profile:
            ProfileView()
        }
    }
}
