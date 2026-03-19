import { useNavigate } from 'react-router-dom'
import { deckCards } from '@queens-blood/shared'
import type { CardInfo } from '../../@types/Card'
import Card from '../../components/Card'

type DeckEntry = { card: CardInfo; count: number }

function deduplicateCards(): DeckEntry[] {
  const map = new Map<string, DeckEntry>()
  for (const card of deckCards) {
    const existing = map.get(card.name)
    if (existing) {
      existing.count++
    } else {
      map.set(card.name, { card, count: 1 })
    }
  }
  return Array.from(map.values())
}

export default function Deck() {
  const navigate = useNavigate()
  const entries = deduplicateCards()

  return (
    <div className="flex flex-col items-center w-full mt-8 xl:mt-12 2xl:mt-16 px-6 pb-12 overflow-y-auto max-h-[calc(100vh-120px)]">
      <div className="p-8 xl:p-10 w-full max-w-4xl 2xl:max-w-5xl">
        <h2 className="text-2xl xl:text-3xl font-title mb-2 text-center">Deck Cards</h2>
        <p className="text-sm xl:text-base text-gray-500 text-center mb-6">
          Every deck has exactly 15 cards. Each card can appear at most twice per deck.
        </p>

        <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 xl:gap-5">
          {entries.map((entry) => (
            <div key={entry.card.name} className="relative">
              <div className="w-full aspect-[3/4] border border-black rounded-lg overflow-hidden">
                <Card card={entry.card} />
              </div>
              {entry.count > 1 && (
                <span className="absolute -top-2 -right-2 bg-black text-yellow-400 border border-yellow-400 rounded-full w-7 h-7 flex items-center justify-center text-sm font-semibold">
                  ×{entry.count}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="rounded-md w-48 px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-2"
          >
            <span className="text-xl font-medium text-black group-hover:text-white">Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}
