<template>
  <div>
    <article class="prose prose-slate">
      <ContentDoc />
    </article>
  </div>
</template>

<script setup>

const route = useRoute()

// TODO: i would like to bring all the articles from dev.to
//https://dev.to/api/articles?username=yuridevat

console.log('something',route);

</script>
