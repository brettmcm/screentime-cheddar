import CoreGraphics

public enum CheddarSpacing {
    public static let xxxs = CheddarSize.paddingXxxs
    public static let xxs = CheddarSize.paddingXxs
    public static let xs = CheddarSize.paddingXs
    public static let s = CheddarSize.paddingS
    public static let m = CheddarSize.paddingM
    public static let l = CheddarSize.paddingL
    public static let xl = CheddarSize.paddingXl
    public static let xxl = CheddarSize.paddingXxl

    /// The design system keeps gaps on their own scale; it happens to line up with padding
    /// today, but components should say which one they mean.
    public static let gapXs = CheddarSize.gapXs
    public static let gapS = CheddarSize.gapS
    public static let gapM = CheddarSize.gapM
    public static let gapL = CheddarSize.gapL

    public static let cornerXxsmall = CheddarSize.cornerXxsmall
    public static let cornerXsmall = CheddarSize.cornerXsmall
    public static let cornerSmall = CheddarSize.cornerSmall
    public static let cornerMedium = CheddarSize.cornerMedium
    public static let cornerLarge = CheddarSize.cornerLarge
    public static let cornerXlarge = CheddarSize.cornerXlarge
    public static let cornerFull = CheddarSize.cornerFull

    public static let border = CheddarSize.border

    public static let iconSmall = CheddarSize.iconSmall
    public static let iconMedium = CheddarSize.iconMedium
    public static let iconLarge = CheddarSize.iconLarge
}
