import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [
      '.next/**',
      'dist/**',
      'node_modules/**',
      'public/**',
      'content/**',
      'helper_scripts/**',
      'api/**',
      '__misc__/**',
      'src/components/common/**', // local, untracked experiments
      'next-env.d.ts',
    ],
  },
]

export default eslintConfig
