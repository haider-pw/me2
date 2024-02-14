<template>
  <div class="relative px-4 sm:px-8 lg:px-12">
    <div class="mx-auto max-w-2xl lg:max-w-5xl">
      <div class="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div class="lg:pl-20">
          <div class="max-w-xs px-2.5 lg:max-w-none">
            <img alt=""
                 src="https://spotlight.tailwindui.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fportrait.79754e9e.jpg&w=1080&q=75"
                 style="color: transparent;">
          </div>
        </div>
        <div class="lg:order-first lg:row-span-2">
          <ContentDoc path="/about" v-slot="{doc}">
            <article class="prose max-w-none">
              <ContentRenderer :value="doc"/>
            </article>
          </ContentDoc>
        </div>
        <div class="lg:pl-20">
          <ul role="list">
            <!--            <li class="flex"><a-->
            <!--                class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"-->
            <!--                href="#">-->
            <!--              <IconTwitter/>-->
            <!--              <span class="ml-4">Follow on X</span></a></li>-->
            <!--            <li class="mt-4 flex"><a-->
            <!--                class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"-->
            <!--                href="#">-->
            <!--              <IconInstagram/>-->
            <!--              <span class="ml-4">Follow on Instagram</span></a></li>-->
            <li class="mt-4 flex">
              <a
                  class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
                  href="https://github.com/haider-pw">
                <IconGithub/>
                <span class="ml-4">Follow on GitHub</span></a>
            </li>
            <li class="mt-4 flex">
              <a
                  class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
                  href="https://www.linkedin.com/in/haider-pw/">
                <IconLinkedin/>
                <span class="ml-4">Follow on LinkedIn</span>
              </a>
            </li>
            <li class="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40 flex">
              <a
                  class="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
                  href="mailto:spencer@planetaria.tech">
                <IconEmail/>
                <span class="ml-4">haideritx@gmail.com</span></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
img {
  display: inline-block;
  margin-right: 2px;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>
