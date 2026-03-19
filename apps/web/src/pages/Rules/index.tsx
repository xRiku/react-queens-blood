import { useNavigate } from 'react-router-dom'

export default function Rules() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center w-full mt-8 xl:mt-12 2xl:mt-16 px-6 pb-12 overflow-y-auto max-h-[calc(100vh-120px)]">
      <div className="p-8 xl:p-10 w-full max-w-3xl">
        <h2 className="text-2xl xl:text-3xl font-title mb-6 text-center">How to Play</h2>

        <div className="flex flex-col gap-6 text-sm xl:text-base">
          <section>
            <h3 className="text-lg xl:text-xl font-semibold mb-2">The Board</h3>
            <p>
              The board consists of 3 rows and 5 columns. Player 1 starts on the left side
              and Player 2 on the right. Each cell on the board has a pawn level ranging from 0 to 3.
            </p>
          </section>

          <section>
            <h3 className="text-lg xl:text-xl font-semibold mb-2">Pawns</h3>
            <p>
              At the start of the game, each player has pawns placed on their starting columns.
              You can only play a card on a cell where you own a pawn. The cell's pawn level
              must be equal to or greater than the card's rank.
            </p>
          </section>

          <section>
            <h3 className="text-lg xl:text-xl font-semibold mb-2">Playing Cards</h3>
            <p>
              Each card has a <strong>rank</strong> (its cost to play), a <strong>power</strong> value
              (how many points it contributes), and a <strong>placement pattern</strong> that
              affects surrounding cells when the card is placed.
            </p>
            <p className="mt-2">
              When you play a card, its placement pattern may add pawns to nearby cells (expanding
              your territory) or remove enemy pawns (disrupting your opponent).
            </p>
          </section>

          <section>
            <h3 className="text-lg xl:text-xl font-semibold mb-2">Turns</h3>
            <p>
              Players alternate turns. On your turn you may either place a card from your hand
              onto a valid cell, or skip your turn. Once both players skip consecutively, the
              game ends.
            </p>
          </section>

          <section>
            <h3 className="text-lg xl:text-xl font-semibold mb-2">Scoring</h3>
            <p>
              Each row is scored independently. The total power of your cards in a row is compared
              against your opponent's total. The player with the higher sum wins that row. Ties
              result in neither player winning the row.
            </p>
            <p className="mt-2">
              Win <strong>2 out of 3 rows</strong> to win the game.
            </p>
          </section>

          <section>
            <h3 className="text-lg xl:text-xl font-semibold mb-2">Strategy Tips</h3>
            <ul className="list-disc list-inside flex flex-col gap-1">
              <li>Expand your pawns into the center and enemy territory early</li>
              <li>Use placement patterns to deny your opponent key cells</li>
              <li>Focus on winning 2 rows rather than all 3</li>
              <li>Sometimes skipping is the best move if your opponent still has cards to waste</li>
            </ul>
          </section>
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
