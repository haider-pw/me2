<template>
  <div>
    selected post, post slug is
    <strong>
       {{route.params.slug}}
    </strong>
  </div>
</template>

<script setup>

const route = useRoute()

console.log('something',route);

</script>
