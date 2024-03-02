<template>
  <!--  <Blog :posts="posts"/>-->
  <component
      v-if="components[selectedComponent]"
      :is="components[selectedComponent].component"
      v-bind="components[selectedComponent].props"
  />
</template>

<script setup>
const route = useRoute()
const $blog = useRuntimeConfig().public.blog;
const isBlogOverview = computed(() => route.fullPath === '/blog' || route.fullPath === '/blog/');
const slug = computed(() => {
  return route.fullPath.split('/').pop();
});
// Component selection logic
let selectedComponent = computed(() => isBlogOverview.value ? 'blog' : 'post');


const {
  data,
  pending,
  error
} = await useAsyncData('postsOrPost', async () => await fetchPostsOrPost({
  isOverview: isBlogOverview.value,
  postSlug: slug.value,
  username: $blog.user
}), {
  transform: transformDevToPostLists
});

const components = {
  blog: {
    component: markRaw(defineAsyncComponent(() => import('~/components/Blog/Index.vue'))),
    props: {posts: data?.value || []}
  },
  post: {
    component: markRaw(defineAsyncComponent(() => import('~/components/Blog/Post/Index.vue'))),
    props: {post: data.value}
  }
}

</script>
