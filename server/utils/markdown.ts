import MarkdownItFactory from 'markdown-it'
import type { MarkdownIt } from 'markdown-it'
import hljs from 'highlight.js/lib/common'

/**
 * Renders dev.to markdown to HTML on the server so markdown-it and
 * highlight.js never ship to the browser.
 */

const md: MarkdownIt = new MarkdownItFactory({
  // Raw HTML stays escaped: posts come from a third-party API.
  html: false,
  linkify: true,
  typographer: true,
  highlight(code, lang) {
    const language = lang && hljs.getLanguage(lang) ? lang : null
    const highlighted = language
      ? hljs.highlight(code, { language, ignoreIllegals: true }).value
      : md.utils.escapeHtml(code)
    const label = language ? md.utils.escapeHtml(language) : 'text'
    return `<pre class="hljs" data-lang="${label}"><code>${highlighted}</code></pre>`
  },
})

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// External links open in a new tab.
const defaultLinkOpen = md.renderer.rules.link_open
  ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]!
  const href = String(token.attrGet('href') ?? '')
  if (/^https?:\/\//.test(href)) {
    token.attrSet('target', '_blank')
    token.attrSet('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen(tokens, idx, options, env, self)
}

// Images lazy-load.
const defaultImage = md.renderer.rules.image!
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  tokens[idx]!.attrSet('loading', 'lazy')
  tokens[idx]!.attrSet('decoding', 'async')
  return defaultImage(tokens, idx, options, env, self)
}

/**
 * dev.to supports Liquid tags ({% embed … %}, {% youtube … %}, …) that
 * markdown-it does not understand. Convert the common ones, drop the rest.
 */
function preprocessLiquid(source: string): string {
  return source.replace(/\{%\s*(\w+)\s+([^%]*?)\s*%\}/g, (_match, tag: string, arg: string) => {
    const value = arg.trim().replace(/^["']|["']$/g, '')
    switch (tag.toLowerCase()) {
      case 'youtube': {
        const id = value.split(/\s+/)[0]
        return id && /^[\w-]+$/.test(id)
          ? `\n\n[▶ Watch on YouTube](https://www.youtube.com/watch?v=${id})\n\n`
          : ''
      }
      case 'embed':
      case 'link':
      case 'github':
      case 'codepen':
      case 'codesandbox':
      case 'stackblitz':
      case 'twitter':
      case 'tweet': {
        const url = /^https?:\/\//.test(value)
          ? value.split(/\s+/)[0]
          : tag === 'github'
            ? `https://github.com/${value.split(/\s+/)[0]}`
            : null
        return url ? `\n\n<${url}>\n\n` : ''
      }
      default:
        return ''
    }
  })
}

export interface RenderedMarkdown {
  html: string
  headings: BlogHeading[]
}

export function renderMarkdown(source: string): RenderedMarkdown {
  const tokens = md.parse(preprocessLiquid(source), {})
  const headings: BlogHeading[] = []
  const used = new Map<string, number>()

  tokens.forEach((token, i) => {
    if (token.type !== 'heading_open') return
    const level = Number(token.tag.slice(1))
    const inline = tokens[i + 1]
    const text = inline?.children?.filter(t => t.type === 'text' || t.type === 'code_inline').map(t => t.content).join('') ?? ''
    let id = slugify(text) || `section-${i}`
    const count = used.get(id) ?? 0
    used.set(id, count + 1)
    if (count) id = `${id}-${count}`
    token.attrSet('id', id)
    if (level === 2 || level === 3) headings.push({ id, text, level })
  })

  return { html: md.renderer.render(tokens, md.options, {}), headings }
}
