import {
  ArticleCard,
  IconButton,
  PageHeader,
  Search,
  SectionHeader,
  TextLink,
} from '@screentime/cheddar-ds'
import { useMemo, useState } from 'react'
import { Screen } from '../components'
import { articles } from '../state/data'
import type { Article } from '../state/model'

export function LearnScreen() {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<Article>()

  const matches = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return articles
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(term) ||
        article.description.toLowerCase().includes(term) ||
        article.category.includes(term),
    )
  }, [query])

  if (selected) return <ArticleDetail article={selected} onBack={() => setSelected(undefined)} />

  // Guides are a 270px scrolling row in the App Flow; tips and stories are 187px grids.
  const groups = [
    { title: 'Guides', layout: 'card-carousel', category: 'guide' },
    { title: 'Tips & Tricks', layout: 'card-grid', category: 'tip' },
    { title: 'Customer Stories', layout: 'card-grid', category: 'story' },
  ].map((group) => ({
    ...group,
    items: matches.filter((article) => article.category === group.category),
  }))
  const empty = matches.length === 0

  return (
    <Screen nav className="learn-screen">
      {/* Search collapses to its icon in the header and expands on demand. */}
      <PageHeader
        title="Learn"
        align="left"
        showBack={false}
        trailing={
          <IconButton
            icon="search"
            variant="ghost"
            label={searching ? 'Hide search' : 'Search articles'}
            aria-expanded={searching}
            onClick={() => {
              setSearching((open) => !open)
              if (searching) setQuery('')
            }}
          />
        }
      />
      {searching ? (
        <Search
          value={query}
          label="Search articles"
          placeholder="Search anything"
          onValueChange={setQuery}
        />
      ) : null}

      {empty ? <p className="learn-empty">No articles match &ldquo;{query}&rdquo;</p> : null}

      {groups.map(({ title, layout, items }) =>
        items.length ? (
          <section key={title} className="learn-section">
            <SectionHeader
              title={title}
              as="h2"
              trailing={<TextLink onClick={() => setQuery('')}>View all</TextLink>}
            />
            <div className={layout}>
              {items.map((article) => (
                <ArticleCard
                  key={article.id}
                  {...articleShape(article)}
                  onClick={() => setSelected(article)}
                />
              ))}
            </div>
          </section>
        ) : null,
      )}
    </Screen>
  )
}

/** The three Learn groups are the three flat/media article shapes in Figma. */
function articleShape(article: Article) {
  if (article.category === 'guide') {
    return {
      size: 'small',
      eyebrow: 'Guide',
      title: article.title,
      description: article.description,
      readTime: article.readTime,
    } as const
  }

  if (article.category === 'story') {
    // `media="photo"` masks the photo into the brand shape and leaves the
    // accent tile visible around it, which is what makes these cards read.
    return {
      size: 'small',
      media: 'photo',
      title: article.title,
      readTime: article.readTime,
      accent: article.accent,
      image: article.image,
      showFavorite: false,
    } as const
  }

  return {
    size: 'small',
    title: article.title,
    readTime: article.readTime,
    accent: article.accent,
    image: article.image,
    showFavorite: true,
  } as const
}

function ArticleDetail({ article, onBack }: { article: Article; onBack: () => void }) {
  return (
    <Screen nav className="article-screen">
      {article.image ? (
        <img className="article-hero" src={article.image} alt="" />
      ) : null}
      <TextLink icon="arrow-left" iconPosition="leading" onClick={onBack}>
        Back to Learn
      </TextLink>
      <h1 className="article-title">{article.title}</h1>
      <p className="article-read-time">{article.readTime} read</p>
      <p className="article-body">{article.body}</p>
      <section className="article-takeaways">
        <h2>Key takeaways</h2>
        <ul>
          <li>Start small and stay consistent</li>
          <li>Automate savings when possible</li>
          <li>Track your progress regularly</li>
        </ul>
      </section>
    </Screen>
  )
}
