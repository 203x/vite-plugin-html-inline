import { parse } from 'node-html-parser'

const htmlinline = () => {
  return {
    name: 'vite-plugin-html-inline',
    transformIndexHtml(html, { path, filename, server, bundle, chunk }) {
      const root = parse(html)

      for (const key in bundle) {
        if (Object.prototype.hasOwnProperty.call(bundle, key)) {
          if (bundle[key].fileName.endsWith('.css')) {
            for (const el of root.getElementsByTagName('link')) {
              if (el.getAttribute('href').endsWith(bundle[key].fileName)) {
                el.replaceWith(`<style>${bundle[key].source.trim()}</style>`)
                delete bundle[key]
              }
            }
          } else if (bundle[key].fileName.endsWith('.js')) {
            for (const el of root.getElementsByTagName('script')) {
              if (el.getAttribute('src').endsWith(bundle[key].fileName)) {
                el.removeAttribute('src')
                el.removeAttribute('crossorigin')
                el.set_content(bundle[key].code.trim())
                delete bundle[key]
              }
            }
          }
        }
      }
      return root.toString()
    },
  }
}

export { htmlinline as default }
