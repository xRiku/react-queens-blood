import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { allCards } from '@queens-blood/shared'
import type { CardInfo } from '@queens-blood/shared'
import { useShallow } from 'zustand/react/shallow'
import MiniCard from '../../components/MiniCard'
import DeckBuilderCard from '../../components/DeckBuilderCard'
import CardDetailPanel from '../../components/CardDetailPanel'
import useDeckStore from '../../store/DeckStore'
import { cn } from '../../utils/cn'
import { useIsMobile } from '../../hooks/useIsMobile'

type DeckEntry = { card: CardInfo; count: number }
type MobileSelectionOrigin = 'available' | 'deck'

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
  const [inspectedCard, setInspectedCard] = useState<CardInfo | null>(null)
  const [mobileSelectionOrigin, setMobileSelectionOrigin] =
    useState<MobileSelectionOrigin | null>(null)
  const deckEntries = deduplicateDeck(deck)
  const deckFull = deck.length >= 15
  const deckSlotCount = isMobile && deckEntries.length < 11
    ? 10
    : 15
  const selectedCount = inspectedCard
    ? getCountInDeck(inspectedCard.name)
    : 0
  const selectedMaxed = selectedCount >= 2
  const selectedCanAdd = Boolean(inspectedCard && !deckFull && !selectedMaxed)

  function selectMobileCard(card: CardInfo, origin: MobileSelectionOrigin) {
    setInspectedCard(card)
    setMobileSelectionOrigin(origin)
  }

  function inspectDesktopCard(card: CardInfo) {
    setInspectedCard(card)
    setMobileSelectionOrigin(null)
  }

  function handleClearDeck() {
    clearDeck()
    setInspectedCard(null)
    setMobileSelectionOrigin(null)
  }

  function getCountInDeck(cardName: string): number {
    return deck.filter((c) => c.name === cardName).length
  }

  return (
    <div className="w-full flex flex-col h-[calc(100vh-80px)] px-3 md:px-6 pt-2 overflow-hidden">
      <div className="w-full mx-auto flex flex-col h-full min-h-0">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label="Back to home"
              className="-ml-2 inline-flex size-10 items-center justify-center rounded-full text-2xl leading-none text-black transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 md:hidden"
            >
              &larr;
            </button>
            <h2 className="text-xl xl:text-2xl font-title">Deck Builder</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearDeck}
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
            'shrink-0',
            isMobile
              ? 'mb-5 pb-1'
              : 'border border-gray-300 rounded-lg px-4 py-3 bg-gray-50',
          )}
        >
          <div
            className={cn(
              isMobile
                ? 'grid grid-cols-5 gap-x-2 gap-y-3'
                : 'grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5',
            )}
          >
            {Array.from({ length: deckSlotCount }).map((_, i) => {
              const entry = i < deckEntries.length
                ? deckEntries[i]
                : null

              return (
                <div
                  key={i}
                  role={entry
                    ? 'button'
                    : undefined}
                  tabIndex={entry
                    ? 0
                    : undefined}
                  onClick={entry
                    ? () => {
                        if (isMobile) {
                          selectMobileCard(entry.card, 'deck')
                        } else {
                          removeCard(entry.card.name)
                        }
                      }
                    : undefined}
                  onMouseEnter={entry
                    ? () => inspectDesktopCard(entry.card)
                    : undefined}
                  onMouseLeave={entry && !isMobile
                    ? () => setInspectedCard(null)
                    : undefined}
                  onFocus={entry
                    ? () => inspectDesktopCard(entry.card)
                    : undefined}
                  onBlur={entry && !isMobile
                    ? () => setInspectedCard(null)
                    : undefined}
                  onKeyDown={entry
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          if (isMobile) {
                            selectMobileCard(entry.card, 'deck')
                          } else {
                            removeCard(entry.card.name)
                          }
                        }
                      }
                    : undefined}
                  title={entry
                    ? isMobile
                      ? `Select ${entry.card.name}`
                      : `Remove ${entry.card.name}`
                    : undefined}
                  className={cn(
                    'w-full flex flex-col items-center',
                    entry && 'group cursor-pointer',
                  )}
                >
                  <div
                    className={cn(
                      'w-full aspect-[2/3] rounded overflow-hidden border',
                      entry
                        ? 'border-gray-700 bg-white transition-[border-color,box-shadow,opacity] group-hover:opacity-60'
                        : 'border-dashed border-gray-300 bg-gray-50',
                      entry && inspectedCard && entry.card.name === inspectedCard.name &&
                      'border-amber-400 shadow-[0_0_0_2px_rgba(250,204,21,0.45)]',
                    )}
                  >
                    {entry
                      ? (
                        <MiniCard card={entry.card} />
                        )
                      : (
                        <div className="h-full w-full" />
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
        <div className="mb-2 flex shrink-0 items-end justify-between gap-3">
          <h3 className="text-sm font-title text-gray-700 xl:text-base">
            Cards Available
          </h3>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 md:inline">
            Hover to inspect
          </span>
        </div>

        {isMobile && inspectedCard && (
          <div className="mb-2 shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] md:hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-title leading-tight text-black">
                  {inspectedCard.name}
                </h3>
              </div>
              <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-gray-600">
                <span className="rounded-full border border-yellow-400 bg-white px-2 py-1 text-black">
                  {inspectedCard.points} pts
                </span>
                <span className="rounded-full border border-gray-300 bg-gray-50 px-2 py-1">
                  {selectedCount}/2
                </span>
              </div>
            </div>
            <div className="mt-1.5 flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm leading-snug text-gray-700">
                  {inspectedCard.description}
                </p>
                {mobileSelectionOrigin === 'available' && deckFull && (
                  <p className="mt-1 text-xs font-medium text-gray-500">
                    Remove a card to add this one.
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={mobileSelectionOrigin === 'available' && !selectedCanAdd}
                onClick={() => {
                  if (mobileSelectionOrigin === 'deck') {
                    removeCard(inspectedCard.name)
                    if (selectedCount <= 1) {
                      setInspectedCard(null)
                      setMobileSelectionOrigin(null)
                    }
                    return
                  }

                  if (selectedCanAdd) {
                    addCard(inspectedCard)
                  }
                }}
                className={cn(
                  'shrink-0 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
                  mobileSelectionOrigin === 'deck'
                    ? 'border-red-600 bg-red-600 text-white hover:bg-red-700'
                    : selectedCanAdd
                      ? 'border-black bg-black text-yellow-400 hover:bg-gray-900'
                      : 'cursor-not-allowed border-gray-300 bg-gray-100 text-gray-500',
                )}
              >
                {mobileSelectionOrigin === 'deck'
                  ? 'Remove'
                  : deckFull
                    ? 'Full'
                    : selectedMaxed
                      ? 'Maxed'
                      : 'Add'}
              </button>
            </div>
          </div>
        )}

        {/* Scrollable card gallery */}
        <div className="grid flex-1 min-h-0 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="min-h-0 overflow-y-auto pb-2 pr-0 md:pr-1">
            <div className="grid grid-cols-3 gap-2 min-[480px]:grid-cols-4 md:grid-cols-5 md:gap-2.5 xl:grid-cols-6 2xl:grid-cols-7">
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
                    selected={inspectedCard?.name === card.name && (!isMobile || mobileSelectionOrigin === 'available')}
                    onInspectStart={() => inspectDesktopCard(card)}
                    onInspectEnd={() => {
                      if (!isMobile) setInspectedCard(null)
                    }}
                    onClick={() => {
                      if (isMobile) {
                        selectMobileCard(card, 'available')
                        return
                      }

                      if (!disabled) {
                        inspectDesktopCard(card)
                        addCard(card)
                      }
                    }}
                  />
                )
              })}
            </div>
          </div>

          <div className="hidden min-h-0 md:block">
            <div className="sticky top-0">
              <CardDetailPanel
                card={inspectedCard}
                emptyLabel="Hover or focus any card to inspect its official Queen's Blood ability text."
              />
            </div>
          </div>
        </div>

        {/* Bottom button */}
        <div className="hidden justify-center py-2 shrink-0 md:flex">
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
