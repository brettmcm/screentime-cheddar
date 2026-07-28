// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5207-13538
// source=src/components/cards/TotalSavingsCard.tsx
// component=TotalSavingsCard
import figma from 'figma'

// Previously mapped to `<Card variant="total-savings" />`, which baked in the
// amount. TotalSavingsCard takes it as a prop.
const instance = figma.selectedInstance
const amountHandle = instance.findText('Amount')
const amount = amountHandle.type === 'TEXT' ? amountHandle.textContent : '$194.70'

export default {
  id: 'total-savings-card',
  imports: ['import { TotalSavingsCard } from "@screentime/cheddar-ds"'],
  example: figma.code`<TotalSavingsCard
  amount="${amount}"
  showLogo
  actions={[
    { label: 'Deposit', icon: 'deposit', onClick: () => {} },
    { label: 'Transfer', icon: 'transfer', onClick: () => {} },
  ]}
/>`,
}
