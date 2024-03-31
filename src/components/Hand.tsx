type Card = {
  name: string
  pawnsPositions: number[]
  points: number
  pawnsCost: number
}

type Hand = {
  cards: Card[]
}

export default function Hand() {
  const hand: Hand = {
    cards: [
      {
        name: 'Monster',
        pawnsPositions: fillMonsterPositions([
          [1, 0],
          [0, 1],
        ]),
        points: 2,
        pawnsCost: 1,
      },
      {
        name: 'Soldier',
        pawnsPositions: fillMonsterPositions([
          [0, 1],
          [1, 0],
          [-1, 0],
          [0, -1],
        ]),
        points: 1,
        pawnsCost: 1,
      },
    ],
  }

  function fillMonsterPositions(points: number[][]) {
    const positions: number[] = new Array(25).fill(0)
    const startingNumber = 12

    for (const i in points) {
      const x: number = Number(points[i][0])
      const y: number = Number(points[i][1])
      positions[startingNumber + x + -y * 5] = 1
    }

    return positions
  }

  return (
    <div className="flex w-full items-center justify-center mt-10 ">
      <div className="flex flex-row gap-3 w-10/12">
        {hand.cards.map((card, index) => (
          <div
            className="border-2 border-solid rounded-lg border-black h-72 w-60 flex flex-col justify-between"
            key={index}
          >
            <div className="flex justify-between items-center">
              <span className="p-2 text-3xl">
                {'♟'.repeat(card.pawnsCost)}
              </span>
              <span className="p-2 text-3xl flex items-center justify-center w-14 border border-solid border-yellow-400 rounded-full">
                {card.points}
              </span>
            </div>
            <div className="flex justify-center items-center">
              <div className="grid grid-cols-5 border-black border">
                {card.pawnsPositions.map((pawn, index) => {
                  if (index === 12) {
                    return (
                      <div
                        key={index}
                        className={`h-4 w-4 border-solid border-2 border-black bg-white`}
                      ></div>
                    )
                  }

                  if (pawn === 1) {
                    return (
                      <div
                        key={index}
                        className={`h-4 w-4 border-solid border-2 border-black bg-yellow-400`}
                      ></div>
                    )
                  }

                  return (
                    <div
                      key={index}
                      className={`h-4 w-4 border-solid border-2 border-black bg-gray-400`}
                    ></div>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              {card.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
