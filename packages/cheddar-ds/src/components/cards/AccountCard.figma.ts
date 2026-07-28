// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5216-2339
// source=src/components/cards/AccountCard.tsx
// component=AccountCard
import figma from 'figma'

const instance = figma.selectedInstance
const nameHandle = instance.findText('Name')
const name = nameHandle.type === 'TEXT' ? nameHandle.textContent : 'Starter Account'
const amountHandle = instance.findText('Amount')
const amount = amountHandle.type === 'TEXT' ? amountHandle.textContent : '$1,020.22'

export default {
  id: 'account-card',
  imports: ['import { AccountCard } from "@screentime/cheddar-ds"'],
  example: figma.code`<AccountCard
  name="${name}"
  subtitle="Checking ••••0999"
  amount="${amount}"
  meta="1 day ago"
  icon="wallet"
  onClick={() => {}}
/>`,
}
