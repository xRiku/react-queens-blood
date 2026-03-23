export function calcPlayerScores(
  p1Points: number[],
  p2Points: number[],
  amIP1: boolean,
): [number, number] {
  let p1Total = 0
  let p2Total = 0

  for (let i = 0; i < p1Points.length; i++) {
    if (p1Points[i] > p2Points[i]) {
      p1Total += p1Points[i]
    } else if (p1Points[i] < p2Points[i]) {
      p2Total += p2Points[i]
    }
  }

  return amIP1 ? [p1Total, p2Total] : [p2Total, p1Total]
}
