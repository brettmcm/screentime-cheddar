import Foundation

/// Money formatting, matching the web's `Intl.NumberFormat('en-US', { style: 'currency',
/// currency: 'USD' })`.
///
/// The locale is pinned rather than taken from the device: the design's amounts are dollars
/// with grouping separators, and a card's layout is built around that width.
public enum CDSCurrency {
    private static let formatter: NumberFormatter = {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "USD"
        formatter.locale = Locale(identifier: "en_US")
        formatter.minimumFractionDigits = 2
        formatter.maximumFractionDigits = 2
        return formatter
    }()

    public static func format(_ amount: Decimal) -> String {
        formatter.string(from: amount as NSDecimalNumber) ?? "$0.00"
    }

    /// Splits `$1,020.22` into `$1,020` and `.22` so the cents can be set smaller — the
    /// treatment the savings card and the goal readout both use.
    public static func split(_ amount: Decimal) -> (major: String, minor: String) {
        let text = format(amount)
        guard let separator = text.lastIndex(of: ".") else { return (text, "") }
        return (String(text[..<separator]), String(text[separator...]))
    }
}
