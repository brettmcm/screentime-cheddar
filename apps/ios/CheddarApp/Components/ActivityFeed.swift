import CheddarDS
import SwiftUI

/// The library deprecated its activity card and asks callers to compose `ActivityItem` on a
/// surface instead. `CDSPanel` is that surface: under the brand appearance it re-scopes its
/// subtree to light tokens, which a hand-rolled equivalent could not do for the rows nested
/// inside it.
struct ActivityFeed: View {
    @EnvironmentObject private var app: AppState
    @Environment(\.cheddarTheme) private var theme

    var goalID: String?
    var limit: Int?

    private var rows: [Activity] {
        let matching = app.activities.filter { goalID == nil || $0.goalID == goalID }
        guard let limit else { return matching }
        return Array(matching.prefix(limit))
    }

    var body: some View {
        if rows.isEmpty {
            Text("No activity yet")
                .frame(maxWidth: .infinity)
                .padding(CheddarSpacing.m)
                .multilineTextAlignment(.center)
                .foregroundStyle(theme.island.foregroundSecondary)
                .cdsCard(
                    background: theme.island.backgroundSurface,
                    border: theme.island.borderDefault
                )
                .cheddarIsland()
        } else {
            CDSPanel(spacing: CheddarSpacing.gapM) {
                ForEach(rows) { item in
                    // ActivityItem draws the minus for a withdrawal itself.
                    CDSActivityItem(
                        type: item.type,
                        time: item.time,
                        amount: CDSCurrency.format(item.amount)
                    )
                }
            }
        }
    }
}
