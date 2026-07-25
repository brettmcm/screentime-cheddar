import { demoAssets } from '@screentime/cheddar-ds/demo-assets'
import type {
  Account,
  Activity,
  Article,
  Badge,
  Goal,
  SpendingCategory,
  StreakDay,
} from './model'

export const initialGoals: Goal[] = [
  { id: 'headphones', name: 'Headphones', target: 280, saved: 76.5, illustration: 'headphones', accent: 'magenta' },
  { id: 'sneakers', name: 'Sneakers', target: 120, saved: 100, illustration: 'sneakers', accent: 'purple' },
  { id: 'trip', name: 'Freshman Trip', target: 500, saved: 18.2, illustration: 'goggles', accent: 'green' },
]

export const initialCompletedGoals: Goal[] = [
  { id: 'skateboard', name: 'Skateboard', target: 120, saved: 120, illustration: 'skateboard', accent: 'magenta' },
  { id: 'camera', name: 'Camera', target: 260, saved: 260, illustration: 'camera', accent: 'blue' },
]

export const initialActivities: Activity[] = [
  { id: 'a1', type: 'deposit', amount: 20, time: 'Today, 1:34pm', goalId: 'sneakers' },
  { id: 'a2', type: 'deposit', amount: 45, time: 'Today, 11:17am', goalId: 'headphones' },
  { id: 'a3', type: 'withdrawal', amount: 13.75, time: 'Mon, 8:22am' },
  { id: 'a4', type: 'deposit', amount: 16, time: 'Sat, 11:00am', goalId: 'trip' },
  { id: 'a5', type: 'withdrawal', amount: 7, time: 'Thu, 1:15pm' },
]

export const spendingCategories: SpendingCategory[] = [
  { label: 'Trips', amount: 212.2, accent: 'green' },
  { label: 'Entertainment', amount: 56.1, accent: 'blue' },
  { label: 'Food', amount: 29.34, accent: 'magenta' },
  { label: 'Clothes', amount: 27.24, accent: 'purple' },
]

export const streakDays: StreakDay[] = [
  { label: 'S', name: 'Sunday', complete: true },
  { label: 'M', name: 'Monday', complete: true },
  { label: 'T', name: 'Tuesday', complete: true },
  { label: 'W', name: 'Wednesday', complete: false },
  { label: 'T', name: 'Thursday', complete: true },
  { label: 'F', name: 'Friday', complete: true },
  { label: 'S', name: 'Saturday', complete: false },
]

export const accounts: Account[] = [
  {
    id: 'starter',
    name: 'Starter Account',
    subtitle: 'Checking ••••0999',
    amount: 1020.22,
    meta: '1 day ago',
  },
]

/**
 * `Stack Master` tracks total savings, so its caption and progress are derived
 * per render rather than stored here.
 */
export const staticBadges: Badge[] = [
  { id: 'finance-nerd', title: 'Finance Nerd', caption: '8 of 10 Articles read', progress: 80, icon: 'learn', accent: 'green' },
  { id: 'double-down', title: 'Double Down', caption: '1 of 2 goals this month', progress: 50, icon: 'piggybank', accent: 'blue' },
]

export const stackMasterTarget = 500

export const featuredArticle = {
  title: 'How to decide what to save for',
  description:
    "With so much noise, figure out what's actually worth saving and what you can let go of.",
  image: demoAssets.articles.piggyBank,
  actionLabel: 'Read more',
}

export const articles: Article[] = [
  {
    id: 'savings-101',
    title: 'Savings 101',
    description: 'Learn how to get started with simple savings techniques.',
    readTime: '20 min',
    category: 'guide',
    accent: 'magenta',
    body: 'Saving money is one of the most important financial skills you can develop. Start small — even $5 a week adds up over time. The key is consistency. Set up automatic transfers so you never forget. Think of saving as paying your future self first.',
  },
  {
    id: 'investing',
    title: 'Guide to Investing',
    description: "Investing can be hard — let's make it a little easier.",
    readTime: '20 min',
    category: 'guide',
    accent: 'blue',
    body: 'Investing is how your money grows over time. Start with index funds to spread your risk. Time in the market beats timing the market, and small amounts can grow through compound interest.',
  },
  {
    id: 'credit-card',
    title: 'How to choose your first credit card',
    description: 'Picking the right card for your lifestyle.',
    readTime: '5 min',
    category: 'tip',
    accent: 'green',
    image: demoAssets.articles.creditCard,
    body: 'Look for cards with no annual fee and a low credit limit. Always pay your full balance each month to avoid interest charges.',
  },
  {
    id: 'emergency-fund',
    title: 'The importance of an emergency fund',
    description: 'Why you need one and how to build it.',
    readTime: '5 min',
    category: 'tip',
    accent: 'purple',
    image: demoAssets.articles.emergencyFund,
    body: 'An emergency fund is your financial safety net. Aim for three to six months of living expenses and reserve it for genuine emergencies.',
  },
  {
    id: 'cut-expenses',
    title: 'Cut expenses without cutting joy',
    description: 'Small changes, big savings.',
    readTime: '5 min',
    category: 'tip',
    accent: 'magenta',
    image: demoAssets.articles.expenses,
    body: "You don't have to give up everything you love. Track spending, cancel subscriptions you do not use, and look for free activities.",
  },
  {
    id: 'budget-rule',
    title: 'Save more with the 50/30/20 rule',
    description: 'A simple budgeting framework.',
    readTime: '5 min',
    category: 'tip',
    accent: 'blue',
    image: demoAssets.articles.budgeting,
    body: 'Spend 50% on needs, 30% on wants, and save 20%. Adjust the percentages to fit your life — the important thing is having a system.',
  },
  {
    id: 'first-card-story',
    title: 'How I handled my first credit card',
    description: 'A real story from a real teen.',
    readTime: '5 min',
    category: 'story',
    accent: 'green',
    image: demoAssets.articles.customerStory,
    body: 'I made every mistake with my first card. Now I know: pay in full every month, with no exceptions. Your future self will thank you.',
  },
  {
    id: 'friends-saving',
    title: 'Friends who started saving together',
    description: 'Community savings stories.',
    readTime: '7 min',
    category: 'story',
    accent: 'purple',
    image: demoAssets.articles.communityStory,
    body: 'My friends and I started a savings challenge together. Accountability made all the difference, and six months later we all reached our goals.',
  },
]
