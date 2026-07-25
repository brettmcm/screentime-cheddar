// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4993-10109
// source=src/components/slider/Slider.tsx
// component=Slider
import figma from 'figma'

export default {
  id: 'slider',
  imports: ['import { Slider } from "@screentime/cheddar-ds"'],
  // `onComplete` fires once on release when the value reaches `completeAt`,
  // which is what the "slide to confirm" screens rely on.
  example: figma.code`<Slider
  label="Monthly savings goal"
  min={0}
  max={1000}
  value={amount}
  onValueChange={setAmount}
  onComplete={() => confirm()}
/>`,
}
