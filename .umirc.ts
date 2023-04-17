import { defineConfig } from 'umi'

export default defineConfig({
  mpa: {
    template: 'index.html',
    layout: '@/layouts/mpa/index.tsx'
  },
  npmClient: 'yarn',
  copy: [
    {
      from: 'manifest.json',
      to: 'dist'
    },
    {
      from: 'src/assets/imgs/logo',
      to: 'dist/logo'
    }
  ],
  chainWebpack(memo) {
    memo
    .entry('content')
      .add('./src/scripts/content')
      .end()
    .entry('background')
      .add('./src/scripts/background')
      .end()
    return memo
  },
  theme: {
    '@bg-gray': 'rgb(241, 243, 244)',
    '@text-gray': 'rgb(96, 99, 103)',
    '@border-color': 'rgb(203, 205, 209)',
  }
})
