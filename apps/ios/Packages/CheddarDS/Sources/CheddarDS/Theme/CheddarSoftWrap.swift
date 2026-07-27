import SwiftUI
import UIKit

/// Wrapping the way a CSS `max-width` on a heading does.
///
/// The design system caps a couple of display headings at a width narrower than the word
/// they contain — the Guide tile's title is held to 120pt inside a 238pt card. On the web
/// that box only decides where the line breaks fall: a word wider than it overflows the box
/// and is drawn in full. SwiftUI has no equivalent, and a `Text` in a 120pt frame breaks the
/// word instead ("Saving" / "s 101"), which is why the break points are resolved here and
/// handed over as hard newlines. The `Text` itself is then left unconstrained, so the long
/// word overflows exactly as far as the card's own clip allows.
///
/// The box also never squeezes below its min-content width: a heading whose longest word is
/// wider than the cap wraps against that word instead, which is why "Guide to Investing"
/// sets as two lines on a 120pt cap rather than three.
enum CheddarSoftWrap {
    static func wrap(_ text: String, style: CheddarTextStyle, maxWidth: CGFloat) -> String {
        let attributes: [NSAttributedString.Key: Any] = [
            .font: CheddarFonts.uiFont(for: style),
            .kern: style.tracking,
        ]
        func width(_ string: String) -> CGFloat {
            (string as NSString).size(withAttributes: attributes).width
        }

        let words = text.split(whereSeparator: \.isWhitespace).map(String.init)
        let box = max(maxWidth, words.map(width).max() ?? 0)

        var lines: [String] = []
        var line = ""
        for word in words {
            if line.isEmpty {
                line = word
            } else if width("\(line) \(word)") <= box {
                line += " \(word)"
            } else {
                lines.append(line)
                line = word
            }
        }
        lines.append(line)
        return lines.joined(separator: "\n")
    }
}
