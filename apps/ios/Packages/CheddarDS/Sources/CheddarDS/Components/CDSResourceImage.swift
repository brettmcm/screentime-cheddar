import SwiftUI
import UIKit

/// Loads image resources by URL rather than by name.
///
/// Raw resources — whether they ship in the package or as loose files in the app bundle — are
/// not registered with UIKit's named-image cache, so `Image(_:bundle:)` can silently render
/// empty even when the file exists. Resolving the URL first avoids that.
public struct CDSResourceImage: View {
    private let name: String
    private let bundle: Bundle?
    private let renderingMode: Image.TemplateRenderingMode?

    public init(
        _ name: String,
        bundle: Bundle? = nil,
        renderingMode: Image.TemplateRenderingMode? = nil
    ) {
        self.name = name
        self.bundle = bundle
        self.renderingMode = renderingMode
    }

    public var body: some View {
        if let image = loadImage() {
            Image(uiImage: image)
                .renderingMode(renderingMode)
                .resizable()
        } else {
            Color.clear
        }
    }

    private func loadImage() -> UIImage? {
        let parts = name.split(separator: ".", maxSplits: 1).map(String.init)
        let resource = parts[0]
        let fileExtension = parts.count > 1 ? parts[1] : "png"
        let bundle = self.bundle ?? .module
        guard let url = bundle.url(
            forResource: resource,
            withExtension: fileExtension
        ) else {
            return UIImage(named: name, in: bundle, with: nil)
        }
        return UIImage(contentsOfFile: url.path)
    }
}

public extension CDSResourceImage {
    /// Loads an image that ships with the app rather than the design system.
    static func app(_ name: String) -> CDSResourceImage {
        CDSResourceImage(name, bundle: .main)
    }
}
