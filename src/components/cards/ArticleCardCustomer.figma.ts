// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5209-18225
// source=src/components/cards/ArticleCard.tsx
// component=ArticleCard
import figma from 'figma'

const instance = figma.selectedInstance
const fallback = {
  title: 'Paying down credit card debt',
  tag: 'Credit Card',
  accent: 'magenta',
  asset: 'articles.customerStory',
}
const story =
  instance.getEnum('Content', {
    'Credit Card': fallback,
    Friends: {
      title: 'Splitting expenses with friends',
      tag: 'Friends',
      accent: 'blue',
      asset: 'articles.communityStory',
    },
  }) ?? fallback

export default {
  id: 'article-card-customer',
  imports: [
    'import { ArticleCard } from "@screentime/cheddar-ds"',
    'import { demoAssets } from "@screentime/cheddar-ds/demo-assets"',
  ],
  example: figma.code`<ArticleCard
  size="large"
  eyebrow="Customer Story"
  title="${story.title}"
  tag="${story.tag}"
  accent="${story.accent}"
  image={demoAssets.${story.asset}}
  onClick={() => {}}
/>`,
}
