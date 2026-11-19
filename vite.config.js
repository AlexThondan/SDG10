
import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'

export default defineConfig({
  server: {
    watch: {
      usePolling: true,
      interval: 500
    }
  },

  plugins: [
    {
      name: 'sdg-json-auto-refresh',

      configureServer(server) {
        const jsonFile = resolve(process.cwd(), 'sdg_data.json')

        server.watcher.add(jsonFile)

        server.watcher.on('change', (file) => {
          if (resolve(file) === jsonFile) {
            console.log('SDG JSON file changed - refreshing browser')
            server.ws.send({ type: 'full-reload' })
          }
        })
      },

      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'sdg_data.json',
          source: readFileSync(resolve(process.cwd(), 'sdg_data.json'), 'utf-8')
        })
      }
    }
  ]
})
