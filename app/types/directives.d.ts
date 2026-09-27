import type { Directive } from 'vue'

declare module 'vue' {
  interface ComponentCustomProperties {
    vReveal: Directive<HTMLElement, number | undefined>
  }
}

export {}
