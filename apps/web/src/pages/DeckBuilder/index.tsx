import { useNavigate } from 'react-router-dom'
import { allCards } from '@queens-blood/shared'
import type { CardInfo } from '@queens-blood/shared'
import { useShallow } from 'zustand/react/shallow'
import MiniCard from '../../components/MiniCard'
import DeckBuilderCard from '../../components/DeckBuilderCard'
import useDeckStore from '../../store/DeckStore'
import { cn } from '../../utils/cn'
import { useIsMobile } from '../../hooks/useIsMobile'

type DeckEntry = { card: CardInfo; count: number }

const emptySlotCard: CardInfo = {
  name: 'Empty slot',
  pawnsPositions: [],
  points: 0,
  pawnsCost: 0,
  description: '',
  effectPositions: [],
}

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
  const { deck, addCard, removeCard, clearDeck } = useDeckStore(
    useShallow((s) => ({
      deck: s.deck,
      addCard: s.addCard,
      removeCard: s.removeCard,
      clearDeck: s.clearDeck,
    })),
  )

  const isMobile = useIsMobile()
  const deckEntries = deduplicateDeck(deck)
  const deckFull = deck.length >= 15

  function getCountInDeck(cardName: string): number {
    return deck.filter((c) => c.name === cardName).length
  }

  return (
    <div className="w-full flex flex-col h-[calc(100vh-80px)] px-3 md:px-6 pt-2 overflow-hidden">
      <div className="w-full mx-auto flex flex-col h-full min-h-0">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h2 className="text-xl xl:text-2xl font-title">Deck Builder</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={clearDeck}
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

        {/* Selected Deck */}
        <div
          className={cn(
            'shrink-0 mb-3',
            isMobile
              ? 'border-b border-gray-300 pb-2'
              : 'border border-gray-300 rounded-lg px-4 py-3 bg-gray-50',
          )}
        >
          <div
            className={cn(
              isMobile
                ? 'grid grid-cols-5 gap-1.5'
                : 'grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5',
            )}
          >
            {Array.from({ length: 15 }).map((_, i) => {
              const entry = i < deckEntries.length ? deckEntries[i] : null

              return (
                <div
                  key={i}
                  role={entry ? 'button' : undefined}
                  tabIndex={entry ? 0 : undefined}
                  onClick={entry ? () => removeCard(entry.card.name) : undefined}
                  onKeyDown={entry ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); removeCard(entry.card.name) } } : undefined}
                  title={entry ? `Remove ${entry.card.name}` : undefined}
                  className={cn(
                    'w-full flex flex-col items-center',
                    entry && 'group cursor-pointer',
                  )}
                >
                  <div
                    className={cn(
                      'w-full aspect-[2/3] rounded overflow-hidden border border-gray-700 bg-white',
                      entry
                        ? 'group-hover:opacity-60 transition-opacity'
                        : 'opacity-70',
                    )}
                  >
                    {entry ? (
                      <MiniCard card={entry.card} />
                    ) : (
                      <MiniCard card={emptySlotCard} className="opacity-70" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-1 rounded-full px-1.5 text-[8px] font-semibold leading-relaxed whitespace-nowrap border',
                      entry
                        ? 'bg-black text-yellow-400 border-yellow-400'
                        : 'border-transparent text-transparent',
                    )}
                  >
                    ×{entry?.count ?? 0}
                  </span>
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
          <div className="grid grid-cols-4 md:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-1.5 md:gap-2.5">
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
