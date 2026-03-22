import { useNavigate } from 'react-router-dom'
import { allCards } from '@queens-blood/shared'
import type { CardInfo } from '@queens-blood/shared'
import { useShallow } from 'zustand/react/shallow'
import MiniCard from '../../components/MiniCard'
import DeckBuilderCard from '../../components/DeckBuilderCard'
import useDeckStore from '../../store/DeckStore'
import { cn } from '../../utils/cn'

type DeckEntry = { card: CardInfo; count: number }

function deduplicateDeck(deck: CardInfo[]): DeckEntry[] {
  const map = new Map<string, DeckEntry>()
  for (const card of deck) {
    const existing = map.get(card.name)
    if (existing) {
      existing.count++
    } else {
      map.set(card.name, { card, count: 1 })
    }
  }
  return Array.from(map.values())
}

export default function DeckBuilder() {
  const navigate = useNavigate()
  const { deck, addCard, removeCard, resetToDefault } = useDeckStore(
    useShallow((s) => ({
      deck: s.deck,
      addCard: s.addCard,
      removeCard: s.removeCard,
      resetToDefault: s.resetToDefault,
    })),
  )

  const deckEntries = deduplicateDeck(deck)
  const deckFull = deck.length >= 15

  function getCountInDeck(cardName: string): number {
    return deck.filter((c) => c.name === cardName).length
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] px-6 pt-2 overflow-hidden">
      <div className="w-full mx-auto flex flex-col h-full min-h-0">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h2 className="text-xl xl:text-2xl font-title">Deck Builder</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefault}
              className="text-xs text-gray-500 hover:text-black underline underline-offset-2"
            >
              Reset
            </button>
            <span
              className={cn(
                'text-sm font-semibold px-2.5 py-0.5 rounded border',
                deck.length === 15
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-yellow-500 text-yellow-600 bg-yellow-50',
              )}
            >
              {deck.length}/15
            </span>
          </div>
        </div>

        {/* Selected Deck - 15-column grid, single row */}
        <div className="border border-gray-300 rounded-lg p-4 mb-3 bg-gray-50 shrink-0 min-h-[140px]">
          <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5">
            {Array.from({ length: 15 }).map((_, i) => {
              const entry = i < deckEntries.length ? deckEntries[i] : null
              return (
                <div key={i}>
                  {entry ? (
                    <button
                      onClick={() => removeCard(entry.card.name)}
                      className="group cursor-pointer w-full flex flex-col items-center"
                      title={`Remove ${entry.card.name}`}
                    >
                      <div className="w-full aspect-[2/3] border border-gray-700 rounded overflow-hidden group-hover:opacity-60 transition-opacity">
                        <MiniCard card={entry.card} />
                      </div>
                      <span className="mt-1 bg-black text-yellow-400 border border-yellow-400 rounded-full px-1.5 text-[8px] font-semibold leading-relaxed whitespace-nowrap">
                        ×{entry.count}
                      </span>
                    </button>
                  ) : (
                    <div className="w-full aspect-[2/3] border border-dashed border-gray-300 rounded" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Cards Available header */}
        <h3 className="text-sm xl:text-base font-title mb-2 text-gray-600 shrink-0">
          Cards Available
        </h3>

        {/* Scrollable card gallery */}
        <div className="flex-1 overflow-y-auto min-h-0 pb-2">
          <div className="grid grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2.5">
            {allCards.map((card) => {
              const count = getCountInDeck(card.name)
              const maxed = count >= 2
              const disabled = maxed || deckFull

              return (
                <DeckBuilderCard
                  key={card.name}
                  card={card}
                  count={count}
                  disabled={disabled}
                  onClick={() => addCard(card)}
                />
              )
            })}
          </div>
        </div>

        {/* Bottom button */}
        <div className="flex justify-center py-2 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="rounded-md px-6 py-1.5 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-0.5"
          >
            <span className="text-base font-medium text-black group-hover:text-white">
              Back
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
