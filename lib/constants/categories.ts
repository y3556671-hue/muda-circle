export const CATEGORIES = [
  { name: "学习互助", icon: "book-open", slug: "study" },
  { name: "生活资讯", icon: "newspaper", slug: "life" },
  { name: "租房求租", icon: "house", slug: "rent" },
  { name: "二手交易", icon: "shopping-bag", slug: "trade" },
  { name: "活动娱乐", icon: "calendar-heart", slug: "events" },
  { name: "吐槽日常", icon: "message-circle-heart", slug: "rant" },
] as const;

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((category) => [category.slug, category]),
);
