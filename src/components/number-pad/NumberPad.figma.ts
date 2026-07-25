// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=7041-13264
// source=src/components/number-pad/NumberPad.tsx
// component=NumberPad
import figma from 'figma'

// Figma models the keypad as 12 instances of a single `Numpad Key` component set
// (96 uses across the amount-entry screens); there is no published component for
// the pad itself, only a `Drawer` frame holding the rows.
//
// We deliberately map the key set to the whole `NumberPad` rather than exposing a
// key as public API: selecting any key in Figma should tell a developer how to
// render the control it belongs to. The `Type` property is read so the snippet can
// note which key was selected.
const instance = figma.selectedInstance
const keyType = instance.getEnum('Type', {
  Number: 'number',
  Decimal: 'decimal',
  Backspace: 'backspace',
})

export default {
  id: 'number-pad',
  imports: ['import { NumberPad } from "@screentime/cheddar-ds"'],
  example: figma.code`{/* Selected key type: ${keyType}. NumberPad renders the full 3x4 pad. */}
<NumberPad value={amount} onValueChange={setAmount} label="Amount" />`,
}
