import type { Directive } from 'vue'

/**
 * v-reveal — fades/slides an element in the first time it scrolls into view.
 *   <div v-reveal>…</div>
 *   <div v-reveal="150">…</div>   (delay in ms, handy for staggering)
 *
 * Styles live in main.css under [data-reveal]. Content is never hidden without
 * JS, and prefers-reduced-motion disables the effect.
 */
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | undefined

  if (import.meta.client) {
    document.documentElement.classList.add('js')
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
  }

  const reveal: Directive<HTMLElement, number | undefined> = {
    getSSRProps: () => ({ 'data-reveal': '' }),
    mounted(el, binding) {
      el.setAttribute('data-reveal', '')
      if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      observer?.observe(el)
    },
    unmounted(el) {
      observer?.unobserve(el)
    },
  }

  nuxtApp.vueApp.directive('reveal', reveal)
})
