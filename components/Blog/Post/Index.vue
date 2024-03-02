<template>
  <h1 class="text-4xl text-gray-900 font-extrabold leading-none tracking-tight">{{ post.title }}</h1>
  <article class="prose max-w-none mt-10 ml-4" v-html="renderedContent"/>
</template>

<script setup>
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const props = defineProps(['post'])

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true
        }).value}</code></pre>`;
      } catch (__) {
      }
    }

    // Use external default escaping
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  }
});


const renderedContent = computed(() => {
  return props.post ? md.render(props.post.body_markdown) : '';
});
</script>
<style>
@import 'highlight.js/styles/stackoverflow-dark.min.css';
</style>
