<script setup lang="ts">
import { profile } from '~/data/profile'

type Token = [text: string, cls?: string]

const years = yearsSince(profile.careerStart)

// Each line is a list of [text, class] tokens.
const lines: Token[][] = [
  [['const ', 'k'], ['haider', 'v'], [' = ', 'p'], ['{', 'p']],
  [['  role', 'prop'], [': ', 'p'], [`'${profile.currentTitle}'`, 's'], [',', 'p']],
  [['  based', 'prop'], [': ', 'p'], ["'Islamabad, PK'", 's'], [',', 'p']],
  [['  experience', 'prop'], [': ', 'p'], [`'${years}+ years'`, 's'], [',', 'p']],
  [['  stack', 'prop'], [': ', 'p'], ['[', 'p'], ["'Vue'", 's'], [', ', 'p'], ["'Nuxt'", 's'], [', ', 'p'], ["'TS'", 's'], [', ', 'p'], ["'Laravel'", 's'], ['],', 'p']],
  [['  loves', 'prop'], [': ', 'p'], ['[', 'p'], ["'clean code'", 's'], [', ', 'p'], ["'fast UIs'", 's'], ['],', 'p']],
  [['  shipIt', 'fn'], [': ', 'p'], ['() ', 'p'], ['=> ', 'k'], ['true', 'n'], [',', 'p']],
  [['}', 'p']],
]

const totalChars = lines.reduce((sum, line) => sum + line.reduce((s, [t]) => s + t.length, 0) + 1, 0)
const visible = ref(totalChars) // full text on the server / without JS
const typing = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  visible.value = 0
  typing.value = true
  timer = setInterval(() => {
    visible.value += 2
    if (visible.value >= totalChars) {
      visible.value = totalChars
      typing.value = false
      clearInterval(timer)
    }
  }, 22)
})
onBeforeUnmount(() => clearInterval(timer))

/** Tokens of a line, truncated to how many characters have been "typed". */
function visibleTokens(lineIndex: number): { tokens: Token[], done: boolean, active: boolean } {
  let offset = 0
  for (let i = 0; i < lineIndex; i++) offset += lines[i]!.reduce((s, [t]) => s + t.length, 0) + 1
  let remaining = visible.value - offset
  const lineLength = lines[lineIndex]!.reduce((s, [t]) => s + t.length, 0)
  const active = remaining >= 0 && remaining <= lineLength
  const tokens: Token[] = []
  for (const [text, cls] of lines[lineIndex]!) {
    if (remaining <= 0) break
    tokens.push([text.slice(0, remaining), cls])
    remaining -= text.length
  }
  return { tokens, done: remaining > 0, active }
}
</script>

<template>
  <div class="card relative overflow-hidden font-mono text-[12.5px] leading-6 sm:text-[13px]">
    <div class="flex items-center gap-2 border-b border-border bg-surface-2/60 px-4 py-3">
      <span class="size-3 rounded-full bg-[#ff5f57]" />
      <span class="size-3 rounded-full bg-[#febc2e]" />
      <span class="size-3 rounded-full bg-[#28c840]" />
      <span class="ml-3 text-xs text-fg-subtle">haider.ts</span>
      <span class="ml-auto flex items-center gap-1.5 text-[11px] text-fg-subtle">
        <Icon name="simple-icons:typescript" class="size-3" />
        TypeScript
      </span>
    </div>
    <pre class="overflow-x-auto p-4 sm:p-5" aria-label="A code snippet describing Haider"><code><span
      v-for="(_, i) in lines"
      :key="i"
      class="flex"
    ><span class="mr-4 inline-block w-4 shrink-0 text-right text-fg-subtle/60 select-none">{{ i + 1 }}</span><span class="whitespace-pre"><span
      v-for="([text, cls], j) in visibleTokens(i).tokens"
      :key="j"
      :class="cls ? `tok-${cls}` : ''"
    >{{ text }}</span><span
      v-if="typing && visibleTokens(i).active"
      class="ml-px inline-block h-4 w-[7px] translate-y-[3px] animate-blink bg-accent"
    /></span></span></code></pre>
    <div class="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-fg-subtle">
      <span class="flex items-center gap-1.5">
        <span class="size-1.5 rounded-full bg-accent" /> main
      </span>
      <span>UTF-8 · Ln {{ lines.length }}</span>
    </div>
  </div>
</template>

<style scoped>
.tok-k { color: oklch(0.6 0.2 300); }
.tok-v { color: oklch(0.6 0.15 235); }
.tok-prop { color: oklch(0.55 0.14 235); }
.tok-s { color: oklch(0.55 0.14 150); }
.tok-n { color: oklch(0.62 0.17 40); }
.tok-fn { color: oklch(0.6 0.15 260); }
.tok-p { color: var(--fg-muted); }
:global(.dark) .tok-k { color: oklch(0.78 0.14 300); }
:global(.dark) .tok-v { color: oklch(0.8 0.1 235); }
:global(.dark) .tok-prop { color: oklch(0.8 0.1 220); }
:global(.dark) .tok-s { color: oklch(0.82 0.13 150); }
:global(.dark) .tok-n { color: oklch(0.8 0.14 50); }
:global(.dark) .tok-fn { color: oklch(0.8 0.12 260); }
</style>
