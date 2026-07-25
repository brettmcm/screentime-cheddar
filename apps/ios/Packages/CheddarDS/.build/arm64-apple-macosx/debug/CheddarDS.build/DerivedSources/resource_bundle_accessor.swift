import Foundation

extension Foundation.Bundle {
    static nonisolated let module: Bundle = {
        let mainPath = Bundle.main.bundleURL.appendingPathComponent("CheddarDS_CheddarDS.bundle").path
        let buildPath = "/Users/cbergman/Developer/screentime-cheddar-app/apps/ios/Packages/CheddarDS/.build/arm64-apple-macosx/debug/CheddarDS_CheddarDS.bundle"

        let preferredBundle = Bundle(path: mainPath)

        guard let bundle = preferredBundle ?? Bundle(path: buildPath) else {
            // Users can write a function called fatalError themselves, we should be resilient against that.
            Swift.fatalError("could not load resource bundle: from \(mainPath) or \(buildPath)")
        }

        return bundle
    }()
}