// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=4456-1568
// source=src/components/cards/SpendingChartPanel.tsx
// component=SpendingChartPanel
import figma from 'figma'

const instance = figma.selectedInstance
// Figma's `Segmented Bar` is our `bar` layout; `Pie` is the donut.
const type = instance.getEnum('Type', {
  'Segmented Bar': 'bar',
  Pie: 'pie',
})

export default {
  id: 'spending-chart-panel',
  imports: ['import { SpendingChartPanel } from "@screentime/cheddar-ds"'],
  example: figma.code`<SpendingChartPanel
  type="${type}"
  title="Total savings"
  segments={[
    { label: 'Trips', amount: 212.2, accent: 'green' },
    { label: 'Entertainment', amount: 56.1, accent: 'blue' },
    { label: 'Food', amount: 29.34, accent: 'magenta' },
    { label: 'Clothes', amount: 27.24, accent: 'purple' },
  ]}
/>`,
}
