import rocketseat from '@rocketseat/eslint-config/react.mjs'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  ...rocketseat.map((config) => {
    // Override the canary react-hooks plugin with a stable version
    if (config.plugins?.['react-hooks']) {
      return {
        ...config,
        plugins: { ...config.plugins, 'react-hooks': reactHooks },
      }
    }
    return config
  }),
  {
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  { ignores: ['dist'] },
]
