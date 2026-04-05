import { useNavigate } from 'react-router-dom'

type PatchEntry = {
  version: string
  date: string
  title: string
  highlights: string[]
  changes: {
    category: string
    items: string[]
  }[]
}

const patches: PatchEntry[] = [
  {
    version: '0.5.0',
    date: 'March 2026',
    title: 'Card Effects & Polish',
    highlights: [
      'Card buff/debuff effects are here — Crystalline Crab, Mu, Cactuar, and Archdragon each change the game',
      'Persistent tile-level indicators show active buffs and debuffs at a glance',
    ],
    changes: [
      {
        category: 'Gameplay',
        items: [
          'Added card buff/debuff effects (Crystalline Crab & Mu)',
          'Added non-destructive effects, card destruction (Cactuar & Archdragon)',
          'Added persistent tile-level buff/debuff indicators',
          'Fixed endgame effects preserved correctly through rematch',
        ],
      },
      {
        category: 'UI & Polish',
        items: [
          'Redesigned Open Graph card to match game aesthetic',
          'Fixed deck builder empty slot layout shifts',
          'Fixed rematch animation overlap on new matches',
          'Reduced mobile border radius for placed board cards',
        ],
      },
      {
        category: 'Infrastructure',
        items: [
          'Bumped Fastify to 5.8.3',
          'Refreshed README with current gameplay and visuals',
        ],
      },
    ],
  },
  {
    version: '0.4.0',
    date: 'February 2026',
    title: 'Multiplayer Overhaul & Deck Builder',
    highlights: [
      'Kahoot-style 6-digit room codes replace long UUIDs — easy to share with friends',
      'New ready room lets both players confirm before the match starts',
      'Full deck builder and card catalog pages for exploring and customizing your deck',
    ],
    changes: [
      {
        category: 'Multiplayer',
        items: [
          'Replaced UUID game IDs with Kahoot-style 6-digit codes',
          'Added ready room confirmation before multiplayer games start',
          'Fixed player identity in ready room, allow toggling ready status',
          'Handled Render cold start timeout when creating/joining rooms',
          'Added server logging for create-game and client-side name validation',
          'Prevented joiner from briefly seeing game code copy UI',
        ],
      },
      {
        category: 'New Pages',
        items: [
          'Added deck builder page with mobile-responsive 5×3 grid',
          'Added cards catalog page to browse all available cards',
          'Added OpenGraph image and meta tags for social sharing',
        ],
      },
      {
        category: 'UX & Accessibility',
        items: [
          'Improved accessibility score from 94 to 99 (react-doctor audit)',
          'Added server health banner with eager backend wake-up on page load',
          'Moved server status to fixed bottom-right pill, always visible',
          'Fixed layout shift on connecting/error messages',
          'Centered home page content on mobile',
        ],
      },
    ],
  },
  {
    version: '0.3.0',
    date: 'January 2026',
    title: 'Sound, Previews & Mobile',
    highlights: [
      'Full sound system — card flicks, hover effects, turn alerts, and a synth game-start chord',
      'Card placement preview shows the result before you commit',
      'Mobile-responsive layout with tap-to-place flow',
    ],
    changes: [
      {
        category: 'Gameplay',
        items: [
          'Added card placement preview on tile hover',
          'Added valid tile highlighting with green ring when card is selected',
          'Added easy bot mode with random move selection',
          'Added rematch dialog with animated hourglass and status tracking',
        ],
      },
      {
        category: 'Sound',
        items: [
          'Added global sound system with mute toggle and localStorage persistence',
          'Added placement and invalid move sound effects via Web Audio API',
          'Overhauled sound effects and improved mute button UI',
        ],
      },
      {
        category: 'Responsive',
        items: [
          'Added desktop responsive scaling for 1280×800 through 1920×1080',
          'Added mobile-responsive layout with tap-to-place card flow',
          'Improved mobile UI proportions and styling',
        ],
      },
      {
        category: 'UI',
        items: [
          'Redesigned home page as single-column lobby layout',
          'Added deck viewer page',
          'Replaced string interpolation with tailwind-merge',
        ],
      },
    ],
  },
  {
    version: '0.2.0',
    date: 'January 2026',
    title: 'Foundation',
    highlights: [
      'Migrated to Turborepo monorepo — shared game logic, separate client and server',
      'Deployed on Vercel + Render — play without setting up a local environment',
      'Server-side validation with optimistic updates for a snappy, cheat-resistant experience',
    ],
    changes: [
      {
        category: 'Architecture',
        items: [
          'Migrated to Turborepo monorepo structure',
          'Extracted shared game logic into packages/shared',
          'Added server-side validation with optimistic updates',
          'Moved bot game logic from server to client',
        ],
      },
      {
        category: 'Deployment',
        items: [
          'Added deployment config for Vercel (client) and Render (server)',
        ],
      },
      {
        category: 'Security',
        items: [
          'Added input validation, rate limiting, and CORS hardening',
        ],
      },
    ],
  },
]

export default function PatchNotes() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center w-full mt-8 xl:mt-12 2xl:mt-16 px-6 pb-12 overflow-y-auto max-h-[calc(100vh-120px)]">
      <div className="p-8 xl:p-10 w-full max-w-3xl">
        <h2 className="text-2xl xl:text-3xl font-title mb-8 text-center">
          Patch Notes
        </h2>

        <div className="flex flex-col gap-10">
          {patches.map((patch) => (
            <section
              key={patch.version}
              className="border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="text-xl xl:text-2xl font-semibold">
                  {patch.title}
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  v{patch.version}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">{patch.date}</p>

              {patch.highlights.length > 0 && (
                <div className="bg-gray-50 rounded-md p-4 mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Highlights
                  </p>
                  <ul className="flex flex-col gap-1.5 text-sm">
                    {patch.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-gray-400 select-none">-</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {patch.changes.map((group) => (
                  <div key={group.category}>
                    <p className="text-sm font-semibold mb-1.5">
                      {group.category}
                    </p>
                    <ul className="flex flex-col gap-1 text-sm text-gray-600">
                      {group.items.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-gray-300 select-none">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="rounded-md w-48 px-4 py-2 border text-black border-black hover:bg-gray-700 hover:border-gray-700 group active:translate-y-2"
          >
            <span className="text-xl font-medium text-black group-hover:text-white">
              Back
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
