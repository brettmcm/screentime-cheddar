import CheddarDS
import SwiftUI

/// The typed amount, as Figma composes it: text rather than a component, the figure at
/// display-large in the brand foreground over a muted caption.
///
/// A border rather than a fill marks the active one — `background-muted` is light enough
/// under the brand appearance to drop the caption below contrast.
struct AmountReadout: View {
    @Environment(\.cheddarPalette) private var palette

    let amount: String
    let caption: String
    /// The money sheet leads with the figure; the add-goal steps lead with the caption.
    var captionFirst = false
    var isActive: Bool?
    var onTap: (() -> Void)?

    var body: some View {
        let readout = VStack(spacing: CheddarSpacing.gapXs) {
            if captionFirst { captionText }
            Text("$\(amount.isEmpty ? "0" : amount)")
                .cdsType(CheddarType.displayLarge)
                .foregroundStyle(palette.foregroundBrandPrimary)
            if !captionFirst { captionText }
        }
        .frame(maxWidth: .infinity)
        .multilineTextAlignment(.center)
        .padding(CheddarSpacing.s)
        .overlay {
            RoundedRectangle(cornerRadius: CheddarSpacing.cornerMedium, style: .continuous)
                .strokeBorder(
                    isActive == true ? palette.borderStrong : .clear,
                    lineWidth: CheddarSpacing.border
                )
        }

        if let onTap {
            Button(action: onTap) { readout.contentShape(Rectangle()) }
                .buttonStyle(.plain)
                .accessibilityAddTraits(isActive == true ? [.isSelected] : [])
        } else {
            readout
        }
    }

    private var captionText: some View {
        Text(caption).foregroundStyle(palette.foregroundSecondary)
    }
}
