<template>
  <div class="relative flex min-h-dvh flex-col overflow-x-clip">
    <a
      href="#main"
      class="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-fg px-4 py-2 text-sm text-bg transition-transform focus:translate-y-0"
    >
      Skip to content
    </a>
    <AppHeader />
    <main id="main" class="flex-1 pt-24 sm:pt-28">
      <slot />
    </main>
    <AppFooter />
    <CommandPalette />
  </div>
</template>
