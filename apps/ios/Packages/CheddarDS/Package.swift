// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CheddarDS",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "CheddarDS", targets: ["CheddarDS"]),
    ],
    targets: [
        .target(name: "CheddarDS", resources: [.process("Resources")]),
    ]
)
