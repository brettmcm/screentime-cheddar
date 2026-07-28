import type { ComponentType } from 'react'
import type { Appearance } from '../../components'
import { ButtonsBody, IconButtonsBody, TagsBody, TextLinkBody } from './Actions'
import { AppShellBody } from './AppShell'
import { CardsBody, PanelsBody } from './Cards'
import { ActivityBody, AvatarBody, NotificationBody, StatusBody } from './Feedback'
import {
  BrandBody,
  ColorBody,
  DemoAssetsBody,
  IconsBody,
  TypographyBody,
} from './Foundations'
import {
  FormFieldsBody,
  NumberPadBody,
  SelectionControlsBody,
  SliderBody,
} from './Forms'
import { NavBody, PageHeaderBody, SheetBody } from './Navigation'
import { ThemingBody } from './Theming'

export type GallerySectionMeta = {
  /** Rendered as `id="section-{id}"` and `data-gallery-section="{id}"`. */
  id: string
  title: string
  note?: string
  /** Pins the surface treatment instead of following the gallery control. */
  appearance?: Appearance
  Body: ComponentType
}

/**
 * The gallery, in render order. Foundations first, then the app-shell
 * composition, then one section per component in alphabetical order.
 */
export const gallerySections: readonly GallerySectionMeta[] = [
  {
    id: 'typography',
    title: 'Typography',
    note: 'Every --cds-type-* preset from the Figma type styles.',
    Body: TypographyBody,
  },
  {
    id: 'color',
    title: 'Color',
    note: 'Primitive ramps, then every semantic --cds-color-* token the three theming axes re-point.',
    Body: ColorBody,
  },
  {
    id: 'theming',
    title: 'Theming — brand × scheme × appearance',
    note: 'Each tile is the same markup; only the ThemeScope wrapper differs. appearance is the v1.2.0 axis: the branded app canvas that used to be faked with scheme="dark".',
    Body: ThemingBody,
  },
  {
    id: 'app-shell',
    title: 'App shell composition',
    note: 'PageHeader + content + Nav on a real screen. Tap the nav, the goal cards, the back control and the number pad — the two phones are the same component tree under a different appearance.',
    Body: AppShellBody,
  },
  {
    id: 'activity',
    title: 'ActivityItem and ActivityCard',
    Body: ActivityBody,
  },
  {
    id: 'avatar',
    title: 'Avatar',
    note: 'src, then initials derived from name, then the bundled artwork.',
    Body: AvatarBody,
  },
  {
    id: 'brand',
    title: 'Brand — Logo and Wordmark',
    Body: BrandBody,
  },
  {
    id: 'buttons',
    title: 'Button',
    Body: ButtonsBody,
  },
  {
    id: 'cards',
    title: 'Cards',
    note: 'The prop-driven card set. Content comes from the published demo asset manifest (@screentime/cheddar-ds/demo-assets).',
    Body: CardsBody,
  },
  {
    id: 'form-fields',
    title: 'InputField, Textarea and Search',
    note: 'Including native attribute passthrough and the error/invalid states added in v1.2.0.',
    Body: FormFieldsBody,
  },
  {
    id: 'icon-buttons',
    title: 'IconButton',
    Body: IconButtonsBody,
  },
  {
    id: 'icons',
    title: 'Icon',
    note: 'All 30 glyphs, each in mono and brand tone.',
    Body: IconsBody,
  },
  {
    id: 'nav',
    title: 'Nav',
    Body: NavBody,
  },
  {
    id: 'notification',
    title: 'Notification',
    Body: NotificationBody,
  },
  {
    id: 'number-pad',
    title: 'NumberPad',
    Body: NumberPadBody,
  },
  {
    id: 'page-header',
    title: 'PageHeader',
    Body: PageHeaderBody,
  },
  {
    id: 'panels',
    title: 'Panels — chart, streak and section headers',
    Body: PanelsBody,
  },
  {
    id: 'selection-controls',
    title: 'Checkbox, Radio and SwitchField',
    Body: SelectionControlsBody,
  },
  {
    id: 'sheet',
    title: 'Sheet',
    note: 'Opens in a portal on document.body, so it sits outside this section in the DOM.',
    Body: SheetBody,
  },
  {
    id: 'slider',
    title: 'Slider',
    Body: SliderBody,
  },
  {
    id: 'status',
    title: 'Toast and EmptyState',
    Body: StatusBody,
  },
  {
    id: 'tags',
    title: 'Tag',
    Body: TagsBody,
  },
  {
    id: 'text-link',
    title: 'TextLink',
    Body: TextLinkBody,
  },
  {
    id: 'demo-assets',
    title: 'Demo assets',
    note: 'The typed manifest exported as @screentime/cheddar-ds/demo-assets. Not part of the themed API — components take images as props.',
    Body: DemoAssetsBody,
  },
]
