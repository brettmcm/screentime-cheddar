// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5209-18225
// source=src/components/cards/ArticleCard.tsx
// component=ArticleCard
import figma from 'figma'

const instance = figma.selectedInstance
// Accent and artwork are not readable off the instance, so they stay keyed to
// the variant; the copy is read from the node so it cannot drift.
const fallback = {
  title: 'How to choose your first credit card',
  readTime: '5 min',
  accent: 'green',
  asset: 'articles.customerStory',
}
const story =
  instance.getEnum('Content', {
    'Credit Card': fallback,
    Friends: {
      title: 'Friends who started saving together',
      readTime: '7 min',
      accent: 'purple',
      asset: 'articles.communityStory',
    },
  }) ?? fallback

const titleHandle = instance.findText('Story Title')
const title = titleHandle.type === 'TEXT' ? titleHandle.textContent : story.title
const readTimeHandle = instance.findText('Story Read Time')
const readTime = readTimeHandle.type === 'TEXT' ? readTimeHandle.textContent : story.readTime

export default {
  id: 'article-card-customer',
  imports: [
    'import { ArticleCard } from "@screentime/cheddar-ds"',
    'import { demoAssets } from "@screentime/cheddar-ds/demo-assets"',
  ],
  example: figma.code`<ArticleCard
  size="small"
  media="photo"
  title="${title}"
  readTime="${readTime}"
  accent="${story.accent}"
  image={demoAssets.${story.asset}}
  onClick={() => {}}
/>`,
}
