<script setup lang="ts">
import { profile } from '~/data/profile'
import { projects } from '~/data/projects'

interface Command {
  id: string
  label: string
  group: 'Pages' | 'Actions' | 'Projects' | 'Posts' | 'Links'
  icon: string
  hint?: string
  keywords?: string
  run: () => void
}

const { open, hide, toggle } = useCommandPalette()
const { navigation } = useNavigation()
const colorMode = useColorMode()
const { copy, copied } = useClipboard({ copiedDuring: 1500 })

const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement>()
const listRef = ref<HTMLElement>()
const posts = ref<BlogPostSummary[]>([])
let lastFocused: HTMLElement | null = null

function go(path: string) {
  hide()
  navigateTo(path)
}

function external(url: string) {
  hide()
  window.open(url, '_blank', 'noopener')
}

const commands = computed<Command[]>(() => [
  ...navigation.map(item => ({
    id: `page:${item.to}`,
    label: item.label,
    group: 'Pages' as const,
    icon: item.icon,
    run: () => go(item.to),
  })),
  {
    id: 'action:theme',
    label: colorMode.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
    group: 'Actions',
    icon: colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon',
    keywords: 'theme dark light mode appearance',
    run: () => { colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark' },
  },
  {
    id: 'action:system',
    label: 'Use system theme',
    group: 'Actions',
    icon: 'lucide:monitor',
    keywords: 'theme auto system appearance',
    run: () => { colorMode.preference = 'system' },
  },
  {
    id: 'action:email',
    label: copied.value ? 'Copied!' : 'Copy email address',
    hint: profile.email,
    group: 'Actions',
    icon: copied.value ? 'lucide:check' : 'lucide:copy',
    keywords: 'contact mail',
    run: () => copy(profile.email),
  },
  {
    id: 'action:resume',
    label: 'Download résumé',
    group: 'Actions',
    icon: 'lucide:file-down',
    keywords: 'cv resume pdf',
    run: () => external(profile.resumeUrl),
  },
  ...profile.socials.map(social => ({
    id: `link:${social.name}`,
    label: social.name,
    hint: social.handle,
    group: 'Links' as const,
    icon: social.icon,
    run: () => external(social.url),
  })),
  ...projects.map(project => ({
    id: `project:${project.slug}`,
    label: project.title,
    hint: project.company,
    group: 'Projects' as const,
    icon: 'lucide:folder-code',
    keywords: project.stack.join(' '),
    run: () => go(`/projects#${project.slug}`),
  })),
  ...posts.value.map(post => ({
    id: `post:${post.slug}`,
    label: post.title,
    group: 'Posts' as const,
    icon: 'lucide:file-text',
    keywords: post.tags.join(' '),
    run: () => go(`/blog/${post.slug}`),
  })),
])

/** Loose subsequence match, with a bonus for plain substring matches. */
function score(cmd: Command, q: string): number {
  const haystack = `${cmd.label} ${cmd.hint ?? ''} ${cmd.keywords ?? ''} ${cmd.group}`.toLowerCase()
  if (haystack.includes(q)) return 2
  let i = 0
  for (const char of haystack) {
    if (char === q[i]) i++
    if (i === q.length) return 1
  }
  return 0
}

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  const list = q
    ? commands.value.map(cmd => ({ cmd, s: score(cmd, q) })).filter(r => r.s > 0).sort((a, b) => b.s - a.s).map(r => r.cmd)
    : commands.value.filter(c => c.group !== 'Posts' && c.group !== 'Projects')
  return list.slice(0, 40)
})

const grouped = computed(() => {
  const groups = new Map<string, { cmd: Command, index: number }[]>()
  results.value.forEach((cmd, index) => {
    if (!groups.has(cmd.group)) groups.set(cmd.group, [])
    groups.get(cmd.group)!.push({ cmd, index })
  })
  return [...groups.entries()]
})

watch(query, () => { activeIndex.value = 0 })

watch(open, async (isOpen) => {
  if (isOpen) {
    lastFocused = document.activeElement as HTMLElement | null
    query.value = ''
    activeIndex.value = 0
    await nextTick()
    inputRef.value?.focus()
    if (!posts.value.length) {
      posts.value = await $fetch<BlogPostSummary[]>('/api/blog').catch(() => [])
    }
  }
  else {
    lastFocused?.focus?.()
  }
})

function move(delta: number) {
  const count = results.value.length
  if (!count) return
  activeIndex.value = (activeIndex.value + delta + count) % count
  nextTick(() => {
    listRef.value?.querySelector(`[data-index="${activeIndex.value}"]`)?.scrollIntoView({ block: 'nearest' })
  })
}

function runActive() {
  results.value[activeIndex.value]?.run()
}

onKeyStroke(['k', 'K'], (e) => {
  if (e.metaKey || e.ctrlKey) {
    e.preventDefault()
    toggle()
  }
})
onKeyStroke('/', (e) => {
  const target = e.target as HTMLElement
  if (open.value || ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) return
  e.preventDefault()
  open.value = true
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[100] flex items-start justify-center bg-bg/60 px-4 pt-[12vh] backdrop-blur-sm" @mousedown.self="hide()">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          class="palette card w-full max-w-xl overflow-hidden !shadow-2xl"
          @keydown.down.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.enter.prevent="runActive"
          @keydown.esc.prevent="hide()"
          @keydown.tab.prevent
        >
          <div class="flex items-center gap-3 border-b border-border px-4">
            <Icon name="lucide:search" class="size-4 shrink-0 text-fg-subtle" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Search pages, projects, posts or actions…"
              class="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-fg-subtle"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              :aria-activedescendant="results[activeIndex] ? `cmd-${activeIndex}` : undefined"
              autocomplete="off"
              spellcheck="false"
            >
            <kbd class="rounded-md border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">ESC</kbd>
          </div>

          <div id="palette-list" ref="listRef" role="listbox" class="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain p-2">
            <p v-if="!results.length" class="px-3 py-10 text-center text-sm text-fg-muted">
              No results for “{{ query }}”
            </p>
            <div v-for="[group, items] in grouped" :key="group" class="mb-1 last:mb-0" role="group" :aria-label="group">
              <p class="px-3 pt-2 pb-1.5 font-mono text-[10px] tracking-widest text-fg-subtle uppercase">
                {{ group }}
              </p>
              <button
                v-for="{ cmd, index } in items"
                :id="`cmd-${index}`"
                :key="cmd.id"
                type="button"
                role="option"
                :aria-selected="index === activeIndex"
                :data-index="index"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                :class="index === activeIndex ? 'bg-surface-2 text-fg' : 'text-fg-muted'"
                @mousemove="activeIndex = index"
                @click="cmd.run()"
              >
                <Icon :name="cmd.icon" class="size-4 shrink-0" :class="index === activeIndex ? 'text-accent' : ''" />
                <span class="truncate">{{ cmd.label }}</span>
                <span v-if="cmd.hint" class="ml-auto shrink-0 truncate font-mono text-xs text-fg-subtle">{{ cmd.hint }}</span>
                <Icon v-else-if="index === activeIndex" name="lucide:corner-down-left" class="ml-auto size-3.5 shrink-0 text-fg-subtle" />
              </button>
            </div>
          </div>

          <div class="hidden items-center gap-4 border-t border-border px-4 py-2.5 font-mono text-[10px] text-fg-subtle sm:flex">
            <span class="flex items-center gap-1"><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> navigate</span>
            <span class="flex items-center gap-1"><kbd class="kbd">↵</kbd> select</span>
            <span class="ml-auto flex items-center gap-1"><kbd class="kbd">/</kbd> or <kbd class="kbd">⌘K</kbd> to open</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.palette {
  animation: palette-in 0.35s var(--ease-out-expo);
}
.kbd {
  @apply rounded border border-border bg-surface-2 px-1 py-px;
}
@keyframes palette-in {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
  to { opacity: 1; transform: none; }
}
</style>
