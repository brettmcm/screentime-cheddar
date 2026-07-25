// url=https://www.figma.com/design/JZfxpUBr0jz86f8imEBEdC?node-id=5209-18521
// source=src/components/cards/ArticleCard.tsx
// component=ArticleCard
import figma from 'figma'

const instance = figma.selectedInstance
const fallback = {
  title: 'How to choose your first credit card',
  accent: 'green',
  asset: 'articles.creditCard',
}
const article =
  instance.getEnum('Content', {
    Credit: fallback,
    Expenses: {
      title: 'Cut expenses without cutting joy',
      accent: 'magenta',
      asset: 'articles.expenses',
    },
    '50/30': {
      title: 'Save more with the 50/30/20 rule',
      accent: 'blue',
      asset: 'articles.budgeting',
    },
    Emergency: {
      title: 'The importance of an emergency fund',
      accent: 'purple',
      asset: 'articles.emergencyFund',
    },
  }) ?? fallback

export default {
  id: 'article-card-small',
  imports: [
    'import { ArticleCard } from "@screentime/cheddar-ds"',
    'import { demoAssets } from "@screentime/cheddar-ds/demo-assets"',
  ],
  example: figma.code`<ArticleCard
  size="small"
  title="${article.title}"
  readTime="5 min"
  accent="${article.accent}"
  image={demoAssets.${article.asset}}
  showFavorite
  onClick={() => {}}
/>`,
}
