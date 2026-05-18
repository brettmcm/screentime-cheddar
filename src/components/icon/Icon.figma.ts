// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5141-9595
// source=src/components/icon/Icon.tsx
// component=Icon
import figma from 'figma'

const instance = figma.selectedInstance
const name = instance.getEnum('Icon', {
  Home: 'home',
  Settings: 'settings',
  Piggybank: 'piggybank',
  Wallet: 'wallet',
  Learn: 'learn',
  Profile: 'profile',
  Message: 'message',
  Deposit: 'deposit',
  Withdraw: 'withdraw',
  X: 'x',
  Close: 'x',
  Plus: 'plus',
  'Caret Left': 'caret-left',
  'Icon-Caret Left': 'caret-left',
  'Caret Right': 'caret-right',
  'Caret Down': 'caret-down',
  'Icon-Caret Down': 'caret-down',
  'Arrow Left': 'arrow-left',
  'Arrow Up': 'arrow-up',
  'Arrow Down': 'arrow-down',
  'Arrow Right': 'arrow-right',
  Notification: 'notification',
  Edit: 'edit',
  Send: 'send',
  Transfer: 'transfer',
  Receive: 'receive',
  Guide: 'guide',
  'Heart Outline': 'heart-outline',
  'Heart Fill': 'heart-fill',
  Search: 'search',
  Chart: 'chart',
}) || 'home'
const isBrand = instance.getBoolean('Color')

export default {
  id: 'icon',
  imports: ['import { Icon } from "./src/components/icon/Icon"'],
  example: figma.code`<Icon name="${name}" ${isBrand ? 'tone="brand"' : ''} />`,
  metadata: {
    nestable: true,
    props: { name },
  },
}
