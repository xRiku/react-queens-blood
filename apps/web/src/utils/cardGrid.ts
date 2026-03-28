/**
 * Converts card pawn and effect positions into a flat 25-element array
 * representing a 5×5 grid centered on index 12.
 *
 * Cell values:
 *   0 = empty
 *   1 = pawn only
 *   2 = effect only
 *   3 = pawn + effect
 */
export function fillCardGrid(pawns: number[][], effects?: number[][]): number[] {
  const CENTER = 12
  const positions = new Array(25).fill(0)

  for (const [x, y] of pawns) {
    positions[CENTER + x + -y * 5] = 1
  }

  if (effects) {
    for (const [x, y] of effects) {
      const idx = CENTER + x + -y * 5
      positions[idx] = positions[idx] === 1 ? 3 : 2
    }
  }

  return positions
}
