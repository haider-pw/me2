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
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-reveal', 'visible')
          observer.unobserve(entry.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )

  const reveal: Directive<HTMLElement, number | undefined> = {
    mounted(el, binding) {
      if (reduceMotion) return
      // Batch the layout read with the next frame so it doesn't force a reflow mid-hydration.
      requestAnimationFrame(() => {
        if (el.getBoundingClientRect().top < window.innerHeight) return // already on screen
        if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
        el.setAttribute('data-reveal', '')
        observer.observe(el)
      })
    },
    unmounted(el) {
      observer.unobserve(el)
    },
  }

  nuxtApp.vueApp.directive('reveal', reveal)
})
