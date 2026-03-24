import { describe, it, expect } from 'vitest'
import {
  createInitialBoard,
  canAddCardToPosition,
  mapPawns,
  shuffleDeck,
  drawCards,
} from '../gameLogic'
import type { CardInfo, Tile } from '../types'

// -- helpers --

function makeTile(overrides: Partial<Tile> = {}): Tile {
  return {
    playerOnePoints: 0,
    playerTwoPoints: 0,
    playerOnePawns: 0,
    playerTwoPawns: 0,
    card: null,
    ...overrides,
  }
}

const simpleCard: CardInfo = {
  name: 'Test Card',
  pawnsPositions: [[0, 1], [0, -1]],
  points: 3,
  pawnsCost: 1,
  description: 'This card has no abilities.',
}

// -- createInitialBoard --

describe('createInitialBoard', () => {
  it('returns a 3x5 grid', () => {
    const board = createInitialBoard()
    expect(board).toHaveLength(3)
    board.forEach(row => expect(row).toHaveLength(5))
  })

  it('has player-one pawns only in column 0', () => {
    const board = createInitialBoard()
    for (let r = 0; r < 3; r++) {
      expect(board[r][0].playerOnePawns).toBe(1)
      for (let c = 1; c < 5; c++) {
        expect(board[r][c].playerOnePawns).toBe(0)
      }
    }
  })

  it('has player-two pawns only in column 4', () => {
    const board = createInitialBoard()
    for (let r = 0; r < 3; r++) {
      expect(board[r][4].playerTwoPawns).toBe(1)
      for (let c = 0; c < 4; c++) {
        expect(board[r][c].playerTwoPawns).toBe(0)
      }
    }
  })

  it('starts with all tiles having zero points and no card', () => {
    const board = createInitialBoard()
    for (const row of board) {
      for (const tile of row) {
        expect(tile.playerOnePoints).toBe(0)
        expect(tile.playerTwoPoints).toBe(0)
        expect(tile.card).toBeNull()
      }
    }
  })
})

// -- canAddCardToPosition --

describe('canAddCardToPosition', () => {
  it('returns false when card is null', () => {
    const tile = makeTile({ playerOnePawns: 1 })
    expect(canAddCardToPosition(null, tile, true)).toBe(false)
  })

  it('returns false when player has no pawns on tile', () => {
    const tile = makeTile({ playerOnePawns: 0 })
    expect(canAddCardToPosition(simpleCard, tile, true)).toBe(false)
  })

  it('returns false when pawns are less than card cost', () => {
    const costlyCard: CardInfo = { ...simpleCard, pawnsCost: 2 }
    const tile = makeTile({ playerOnePawns: 1 })
    expect(canAddCardToPosition(costlyCard, tile, true)).toBe(false)
  })

  it('returns true when player has enough pawns', () => {
    const tile = makeTile({ playerOnePawns: 1 })
    expect(canAddCardToPosition(simpleCard, tile, true)).toBe(true)
  })

  it('uses playerTwoPawns when isPlayerOne is false', () => {
    const tile = makeTile({ playerTwoPawns: 1 })
    expect(canAddCardToPosition(simpleCard, tile, false)).toBe(true)
  })

  it('returns false for player two when only player one has pawns', () => {
    const tile = makeTile({ playerOnePawns: 1, playerTwoPawns: 0 })
    expect(canAddCardToPosition(simpleCard, tile, false)).toBe(false)
  })
})

// -- mapPawns --

describe('mapPawns', () => {
  it('places a card on the target tile and marks it with -1 pawns', () => {
    const board = createInitialBoard()
    // player one places on row 1, col 0 (which has 1 pawn)
    const result = mapPawns(board, simpleCard, 1, 0, true)

    const tile = result[1][0]
    expect(tile.card).not.toBeNull()
    expect(tile.card!.name).toBe('Test Card')
    expect(tile.card!.placedByPlayerOne).toBe(true)
    expect(tile.playerOnePawns).toBe(-1)
    expect(tile.playerTwoPawns).toBe(-1)
    expect(tile.playerOnePoints).toBe(simpleCard.points)
  })

  it('expands pawns to adjacent tiles based on pawnsPositions', () => {
    const board = createInitialBoard()
    // Security Officer has pawnsPositions [[0,1],[1,0],[-1,0],[0,-1]]
    const securityOfficer: CardInfo = {
      name: 'Security Officer',
      pawnsPositions: [[0, 1], [1, 0], [-1, 0], [0, -1]],
      points: 1,
      pawnsCost: 1,
      description: 'This card has no abilities.',
    }
    const result = mapPawns(board, securityOfficer, 1, 0, true)

    // tile to the right (row 1, col 1) should have gained a pawn for player one
    expect(result[1][1].playerOnePawns).toBeGreaterThan(0)
  })

  it('converts enemy pawns when expanding into enemy-occupied tile', () => {
    // Set up a board where player two has a pawn at (1,1)
    const board = createInitialBoard()
    board[1][1].playerTwoPawns = 1

    // pawnsPositions [1, 0] from (row=1, col=0) for player one targets (1, 1)
    // because: newRow = rowIndex - pawnPos[1] = 1 - 0 = 1
    //          newCol = colIndex + pawnPos[0] = 0 + 1 = 1
    const card: CardInfo = {
      name: 'Expander',
      pawnsPositions: [[1, 0]],
      points: 2,
      pawnsCost: 1,
      description: 'This card has no abilities.',
    }
    const result = mapPawns(board, card, 1, 0, true)

    // player one should have taken over the enemy pawn value
    expect(result[1][1].playerOnePawns).toBe(1)
    expect(result[1][1].playerTwoPawns).toBe(0)
  })

  it('does not mutate the original board', () => {
    const board = createInitialBoard()
    const original = JSON.parse(JSON.stringify(board))
    mapPawns(board, simpleCard, 1, 0, true)
    expect(board).toEqual(original)
  })

  it('places card for player two correctly', () => {
    const board = createInitialBoard()
    const result = mapPawns(board, simpleCard, 1, 4, false)

    const tile = result[1][4]
    expect(tile.card!.placedByPlayerOne).toBe(false)
    expect(tile.playerTwoPoints).toBe(simpleCard.points)
  })
})

// -- shuffleDeck --

describe('shuffleDeck', () => {
  it('returns an array of the same length', () => {
    const deck: CardInfo[] = [simpleCard, { ...simpleCard, name: 'B' }, { ...simpleCard, name: 'C' }]
    const shuffled = shuffleDeck(deck)
    expect(shuffled).toHaveLength(deck.length)
  })

  it('contains the same cards', () => {
    const deck: CardInfo[] = [simpleCard, { ...simpleCard, name: 'B' }]
    const shuffled = shuffleDeck(deck)
    const names = shuffled.map(c => c.name).sort()
    expect(names).toEqual(['B', 'Test Card'])
  })

  it('does not mutate the original deck', () => {
    const deck: CardInfo[] = [simpleCard, { ...simpleCard, name: 'B' }]
    const original = [...deck]
    shuffleDeck(deck)
    expect(deck).toEqual(original)
  })
})

// -- drawCards --

describe('drawCards', () => {
  it('draws the requested number of cards', () => {
    const deck: CardInfo[] = Array.from({ length: 5 }, (_, i) => ({
      ...simpleCard,
      name: `Card ${i}`,
    }))
    const { drawn, remaining, nextId } = drawCards(deck, 3, 0)
    expect(drawn).toHaveLength(3)
    expect(remaining).toHaveLength(2)
    expect(nextId).toBe(3)
  })

  it('assigns sequential ids starting from startId', () => {
    const deck: CardInfo[] = [simpleCard, { ...simpleCard, name: 'B' }]
    const { drawn } = drawCards(deck, 2, 10)
    const ids = drawn.map(c => c.id).sort((a, b) => a - b)
    expect(ids).toEqual([10, 11])
  })

  it('draws fewer cards when deck is smaller than count', () => {
    const deck: CardInfo[] = [simpleCard]
    const { drawn, remaining } = drawCards(deck, 5, 0)
    expect(drawn).toHaveLength(1)
    expect(remaining).toHaveLength(0)
  })

  it('does not mutate the original deck', () => {
    const deck: CardInfo[] = [simpleCard, { ...simpleCard, name: 'B' }]
    const original = [...deck]
    drawCards(deck, 1, 0)
    expect(deck).toEqual(original)
  })
})

// -- applyCardEffects (tested via mapPawns) --

describe('applyCardEffects', () => {
  it('buff increases ally card points on effect tile', () => {
    const board = createInitialBoard()

    // Place a simple card at (1, 0) for player one
    const allyCard: CardInfo = {
      name: 'Ally',
      pawnsPositions: [],
      points: 3,
      pawnsCost: 1,
      description: 'This card has no abilities.',
    }
    let result = mapPawns(board, allyCard, 1, 0, true)
    expect(result[1][0].playerOnePoints).toBe(3)

    // Give player one a pawn at (1, 1) so we can place there
    result[1][1].playerOnePawns = 1

    // Place buff card at (1, 1) with effectPositions targeting left [-1, 0]
    const buffCard: CardInfo = {
      name: 'Buff Card',
      pawnsPositions: [],
      points: 1,
      pawnsCost: 1,
      description: 'Test buff card.',
      effect: { type: 'buff', value: 2, target: 'ally' },
      effectPositions: [[-1, 0]],
    }
    result = mapPawns(result, buffCard, 1, 1, true)

    // The ally card at (1, 0) should have been buffed by +2
    expect(result[1][0].playerOnePoints).toBe(5)
  })

  it('debuff decreases enemy card points on effect tile', () => {
    const board = createInitialBoard()

    // Place a card for player two at (1, 4)
    const enemyCard: CardInfo = {
      name: 'Enemy',
      pawnsPositions: [],
      points: 3,
      pawnsCost: 1,
      description: 'This card has no abilities.',
    }
    let result = mapPawns(board, enemyCard, 1, 4, false)
    expect(result[1][4].playerTwoPoints).toBe(3)

    // Give player one a pawn at (1, 3)
    result[1][3].playerOnePawns = 1

    // Place debuff card at (1, 3) with effectPositions targeting right [1, 0]
    const debuffCard: CardInfo = {
      name: 'Debuff Card',
      pawnsPositions: [],
      points: 1,
      pawnsCost: 1,
      description: 'Test debuff card.',
      effect: { type: 'debuff', value: -1, target: 'enemy' },
      effectPositions: [[1, 0]],
    }
    result = mapPawns(result, debuffCard, 1, 3, true)

    // The enemy card at (1, 4) should have been debuffed by -1
    expect(result[1][4].playerTwoPoints).toBe(2)
  })

  it('buff does not affect enemy cards', () => {
    const board = createInitialBoard()

    // Place a card for player two at (1, 4)
    const enemyCard: CardInfo = {
      name: 'Enemy',
      pawnsPositions: [],
      points: 3,
      pawnsCost: 1,
      description: 'This card has no abilities.',
    }
    let result = mapPawns(board, enemyCard, 1, 4, false)

    // Give player one a pawn at (1, 3)
    result[1][3].playerOnePawns = 1

    // Place a buff card for player one at (1, 3) targeting right [1, 0]
    const buffCard: CardInfo = {
      name: 'Buff Card',
      pawnsPositions: [],
      points: 1,
      pawnsCost: 1,
      description: 'Test buff card.',
      effect: { type: 'buff', value: 1, target: 'ally' },
      effectPositions: [[1, 0]],
    }
    result = mapPawns(result, buffCard, 1, 3, true)

    // Enemy card should be unchanged (buff only affects allies)
    expect(result[1][4].playerTwoPoints).toBe(3)
  })

  it('points cannot go below zero from debuff', () => {
    const board = createInitialBoard()

    // Place a 1-point card for player two at (1, 4)
    const enemyCard: CardInfo = {
      name: 'Weak Enemy',
      pawnsPositions: [],
      points: 1,
      pawnsCost: 1,
      description: 'This card has no abilities.',
    }
    let result = mapPawns(board, enemyCard, 1, 4, false)

    // Give player one a pawn at (1, 3)
    result[1][3].playerOnePawns = 1

    // Place a heavy debuff card targeting right [1, 0]
    const debuffCard: CardInfo = {
      name: 'Heavy Debuff',
      pawnsPositions: [],
      points: 1,
      pawnsCost: 1,
      description: 'Test debuff card.',
      effect: { type: 'debuff', value: -5, target: 'enemy' },
      effectPositions: [[1, 0]],
    }
    result = mapPawns(result, debuffCard, 1, 3, true)

    expect(result[1][4].playerTwoPoints).toBe(0)
  })

  it('card without effectPositions applies no effects', () => {
    const board = createInitialBoard()

    // Place a card at (1, 0) for player one
    const allyCard: CardInfo = {
      name: 'Ally',
      pawnsPositions: [],
      points: 3,
      pawnsCost: 1,
      description: 'This card has no abilities.',
    }
    let result = mapPawns(board, allyCard, 1, 0, true)

    result[1][1].playerOnePawns = 1

    // Card has effect but NO effectPositions — should not apply
    const noPositionsCard: CardInfo = {
      name: 'No Positions',
      pawnsPositions: [],
      points: 1,
      pawnsCost: 1,
      description: 'Test card.',
      effect: { type: 'buff', value: 5, target: 'ally' },
    }
    result = mapPawns(result, noPositionsCard, 1, 1, true)

    expect(result[1][0].playerOnePoints).toBe(3)
  })

  it('effect only applies to effectPositions, not adjacent tiles', () => {
    const board = createInitialBoard()

    // Place ally cards at (1, 0) and (0, 1) for player one
    const allyCard: CardInfo = {
      name: 'Ally',
      pawnsPositions: [],
      points: 3,
      pawnsCost: 1,
      description: 'This card has no abilities.',
    }
    let result = mapPawns(board, allyCard, 1, 0, true)
    result = mapPawns(result, { ...allyCard, name: 'Ally2' }, 0, 1, true)

    result[1][1].playerOnePawns = 1

    // Buff card at (1, 1) with effectPositions targeting only left [-1, 0]
    // The card at (0, 1) is adjacent (above) but NOT in effectPositions
    const buffCard: CardInfo = {
      name: 'Selective Buff',
      pawnsPositions: [],
      points: 1,
      pawnsCost: 1,
      description: 'Test buff card.',
      effect: { type: 'buff', value: 2, target: 'ally' },
      effectPositions: [[-1, 0]],
    }
    result = mapPawns(result, buffCard, 1, 1, true)

    // (1, 0) should be buffed
    expect(result[1][0].playerOnePoints).toBe(5)
    // (0, 1) should NOT be buffed (adjacent but not in effectPositions)
    expect(result[0][1].playerOnePoints).toBe(3)
  })
})
