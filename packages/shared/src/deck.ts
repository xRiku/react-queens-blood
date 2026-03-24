import type { CardInfo } from './types'

export const allCards: CardInfo[] = [
  {
    name: "Security Officer",
    pawnsPositions: [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ],
    points: 1,
    pawnsCost: 1,
    description: 'This card has no abilities.',
  },
  {
    name: "Riot Trooper",
    pawnsPositions: [
      [0, 2],
      [0, 1],
      [1, 0],
      [0, -1],
      [0, -2],
    ],
    points: 3,
    pawnsCost: 2,
    description: 'This card has no abilities.',
  },
  {
    name: "J-Unit Sweeper",
    pawnsPositions: [
      [0, 1],
      [1, 1],
      [0, -1],
      [1, -1],
    ],
    points: 2,
    pawnsCost: 2,
    description: 'This card has no abilities.',
  },
  {
    name: "Queen Bee",
    pawnsPositions: [
      [0, 2],
      [0, -2],
    ],
    points: 1,
    pawnsCost: 1,
    description: 'This card has no abilities.',
  },
  {
    name: "Levrikon",
    pawnsPositions: [
      [1, 0],
      [0, -1],
    ],
    points: 2,
    pawnsCost: 1,
    description: 'This card has no abilities.',
  },
  {
    name: "Grasslands Wolf",
    pawnsPositions: [
      [1, 0],
      [0, 1],
    ],
    points: 2,
    pawnsCost: 1,
    description: 'This card has no abilities.',
  },
  {
    name: "Elphadunk",
    pawnsPositions: [
      [0, 1],
      [-1, 0],
      [0, -1],
    ],
    points: 4,
    pawnsCost: 2,
    description: 'This card has no abilities.',
  },
  {
    name: "Quetzalcoatl",
    pawnsPositions: [
      [0, 2],
      [1, 1],
      [1, -1],
      [0, -2],
    ],
    points: 3,
    pawnsCost: 2,
    description: 'This card has no abilities.',
  },
  {
    name: "Zu",
    pawnsPositions: [
      [-1, 1],
      [1, 1],
      [-1, -1],
      [1, -1],
    ],
    points: 2,
    pawnsCost: 2,
    description: 'This card has no abilities.',
  },
  {
    name: "Devil Rider",
    pawnsPositions: [
      [-2, 1],
      [-2, 0],
      [-1, 0],
      [-2, -1],
    ],
    points: 4,
    pawnsCost: 2,
    description: 'This card has no abilities.',
  },
  {
    name: "Flan",
    pawnsPositions: [
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ],
    points: 2,
    pawnsCost: 1,
    description: 'This card has no abilities.',
  },
  {
    name: "Crawler",
    pawnsPositions: [
      [-1, 1],
      [0, 1],
      [-1, -1],
      [0, -1],
    ],
    points: 2,
    pawnsCost: 1,
    description: 'This card has no abilities.',
  },
  {
    name: "Fleetwing",
    pawnsPositions: [
      [-2, 2],
      [-1, 1],
      [-1, -1],
      [-2, -2],
    ],
    points: 3,
    pawnsCost: 1,
    description: 'This card has no abilities.',
  },
  {
    name: "Thug",
    pawnsPositions: [
      [1, 2],
      [-1, 0],
      [1, 0],
      [1, -2],
    ],
    points: 4,
    pawnsCost: 2,
    description: 'This card has no abilities.',
  },
  {
    name: "Screamer",
    pawnsPositions: [
      [-1, 1],
      [0, 1],
      [1, 1],
      [-1, 0],
      [1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ],
    points: 1,
    pawnsCost: 3,
    description: 'This card has no abilities.',
  },
  {
    name: "Ogre",
    pawnsPositions: [
      [0, 2],
      [1, 2],
      [0, -2],
      [1, -2],
    ],
    points: 5,
    pawnsCost: 2,
    description: 'This card has no abilities.',
  },
  {
    name: "Crystalline Crab",
    pawnsPositions: [
      [-1, 0],
      [0, 1],
      [1, 0],
    ],
    points: 1,
    pawnsCost: 1,
    description: 'Raise the power of allied cards on affected tiles by 2 while this card is in play.',
    effect: { type: 'buff', value: 2, target: 'ally' },
    effectPositions: [
      [0, 1],
    ],
  },
  {
    name: "Mu",
    pawnsPositions: [
      [1, 1],
      [1, 0],
    ],
    points: 1,
    pawnsCost: 2,
    description: 'Raise the power of allied cards on affected tiles by 1 while this card is in play.',
    effect: { type: 'buff', value: 1, target: 'ally' },
    effectPositions: [
      [0, -1],
    ],
  },
]

function findCard(name: string): CardInfo {
  const card = allCards.find(c => c.name === name)
  if (!card) throw new Error(`Card not found: ${name}`)
  return card
}

export const deckCards: CardInfo[] = [
  findCard("Grasslands Wolf"),
  findCard("Grasslands Wolf"),
  findCard("Security Officer"),
  findCard("Security Officer"),
  findCard("Queen Bee"),
  findCard("Queen Bee"),
  findCard("Levrikon"),
  findCard("Flan"),
  findCard("Levrikon"),
  findCard("Quetzalcoatl"),
  findCard("Crystalline Crab"),
  findCard("Mu"),
  findCard("Ogre"),
  findCard("Riot Trooper"),
  findCard("Riot Trooper"),
]
