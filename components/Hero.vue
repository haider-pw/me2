<template>
  <div class="sm:px-4 md:px-0 mt-9">
    <div class="mx-auto w-full max-w-7xl">
      <div class="relative px-4">
        <div class="mx-auto max-w-none">
          <div class="max-w-2xl">
            <h1 class="text-base font-semibold text-primary md:text-xl">
              Hello Everyone 👋, I am
              <span class="mt-1 block text-4xl font-bold text-zinc-800 dark:text-white lg:text-5xl">
                Syed Haider Hassan
              </span>
            </h1>
            <h2 class="mb-5 text-lg text-secondary lg:text-2xl text-gray-600 mt-5 font-bold"> Full Stack
              Developer </h2>
            <p class="mt-6 text-base text-zinc-600 dark:text-zinc-400">I’m Haider, a forward-thinking developer from
              Islamabad, Pakistan. With 12+ years' experience in PHP, Laravel, Vue.js, and more, I create apps users
              love. Passionate about innovation and quality, I actively contribute to diverse projects, ensuring
              excellence throughout.</p>

            <div class="mt-6 flex items-center justify-between flex-col sm:flex-row">
              <div class="flex items-center gap-6 mb-5 sm:mb-0">
                <a class="group -m-1 p-1" aria-label="Follow on X" href="#">
                  <IconTwitter/>
                </a>
                <a class="group -m-1 p-1" aria-label="Follow on Instagram" href="#">
                  <IconInstagram/>
                </a>
                <a class="group -m-1 p-1" aria-label="Follow on GitHub" href="#">
                  <IconGithub/>
                </a>
                <a class="group -m-1 p-1" aria-label="Follow on LinkedIn" href="#">
                  <IconLinkedin/>
                </a>
              </div>
              <a href="/resume.pdf" target="_blank" class="inline-flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-800 hover:text-white font-mono py-0 px-4 rounded">
                Download Resume <IconDownload class="text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
</script>
