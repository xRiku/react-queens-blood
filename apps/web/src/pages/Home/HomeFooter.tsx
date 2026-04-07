export default function HomeFooter() {
  return (
    <footer className="fixed left-1/2 -translate-x-1/2 bottom-16 sm:bottom-4 z-40 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs text-gray-600 shadow-sm backdrop-blur">
      <span>Made by</span>
      <a
        href="https://x.com/philipe_marques"
        target="_blank"
        rel="noreferrer"
        className="font-medium text-gray-700 hover:text-gray-900"
      >
        @philipe_marques
      </a>
      <span aria-hidden="true">&middot;</span>
      <a
        href="mailto:contact@phmarques.com"
        className="font-medium text-gray-700 hover:text-gray-900"
      >
        contact@phmarques.com
      </a>
      <span aria-hidden="true">&middot;</span>
      <a
        href="https://github.com/xRiku/react-queens-blood"
        target="_blank"
        rel="noreferrer"
        className="font-medium text-gray-700 hover:text-gray-900"
      >
        GitHub
      </a>
    </footer>
  )
}
