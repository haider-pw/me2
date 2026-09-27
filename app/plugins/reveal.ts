import type { Directive } from 'vue'

/**
 * v-reveal — fades/slides an element in the first time it scrolls into view.
 *   <div v-reveal>…</div>
 *   <div v-reveal="150">…</div>   (delay in ms, handy for staggering)
 *
 * Content is always rendered visible on the server, so the first paint never
 * waits for JavaScript. After hydration, only elements that are still below
 * the fold are hidden and animated in on scroll. Styles live in main.css
 * under [data-reveal]; prefers-reduced-motion disables the effect.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    nuxtApp.vueApp.directive('reveal', { getSSRProps: () => ({}) })
    return
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Reveals hidden elements as they scroll into view.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-reveal', 'visible')
          revealObserver.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )

  // First pass: IntersectionObserver reports asynchronously whether each element is
  // already on screen, so this never forces a synchronous layout (no reflow).
  // On-screen elements stay as rendered; the rest are hidden and animated on scroll.
  const initialObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      initialObserver.unobserve(entry.target)
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) continue
      entry.target.setAttribute('data-reveal', '')
      revealObserver.observe(entry.target)
    }
  })

  const reveal: Directive<HTMLElement, number | undefined> = {
    mounted(el, binding) {
      if (reduceMotion) return
      if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      initialObserver.observe(el)
    },
    unmounted(el) {
      initialObserver.unobserve(el)
      revealObserver.unobserve(el)
    },
  }

  nuxtApp.vueApp.directive('reveal', reveal)
})
