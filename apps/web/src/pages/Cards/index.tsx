import { useNavigate } from 'react-router-dom'
import { allCards } from '@queens-blood/shared'
import Card from '../../components/Card'

export default function Cards() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center w-full mt-8 xl:mt-12 2xl:mt-16 px-6 pb-12 overflow-y-auto max-h-[calc(100vh-120px)]">
      <div className="p-8 xl:p-10 w-full max-w-4xl 2xl:max-w-5xl">
        <h2 className="text-2xl xl:text-3xl font-title mb-2 text-center">All Cards</h2>
        <p className="text-sm xl:text-base text-gray-500 text-center mb-6">
          Browse all {allCards.length} available cards.
        </p>

        <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 xl:gap-5">
          {allCards.map((card) => (
            <div key={card.name}>
              <div className="w-full aspect-[3/4] border border-black rounded-lg overflow-hidden">
                <Card card={card} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="rounded-md w-48 px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-0.5"
          >
            <span className="text-xl font-medium text-black group-hover:text-white">Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}
