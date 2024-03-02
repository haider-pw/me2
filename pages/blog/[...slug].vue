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

// TODO: i would like to bring all the articles from dev.to
//https://dev.to/api/articles?username=yuridevat

const isBlogOverview = computed(() => route.fullPath === '/blog' || route.fullPath === '/blog/');
const slug = computed(() => {
  return route.fullPath.split('/').pop();
});
// Component selection logic
let selectedComponent = computed(() => isBlogOverview.value ? 'blog' : 'post');

const fetchPostsOrPost = async (isOverview, postSlug) => {
  console.log('isOverview', isOverview)
  console.log('postSlug', postSlug)
  if (isOverview) {
    // Fetch all posts for the blog overview
    const url = `https://dev.to/api/articles?username=${$blog.user}`;

    return $fetch(url)
    // Your fetch logic here
  } else {
    // Fetch a single post by slug
    // Adjust the endpoint as necessary. This is just a placeholder.
    return $fetch(`https://dev.to/api/articles/${$blog.user}/${postSlug}`)
    // Your fetch logic here
  }
};

const formatDateTime = (timestamp) => {
  try {
    const dateObj = new Date(timestamp);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }

    // Extracting the date in YYYY-MM-DD format
    const date = dateObj.toISOString().split('T')[0];

    // Extracting the year
    const year = dateObj.getFullYear();

    return {date, year};
  } catch (error) {
    console.error("Error parsing timestamp:", error.message);
    // Return null or some default value to indicate failure
    return {date: null, year: null};
  }
}


const {
  data,
  pending,
  error
} = await useAsyncData('postsOrPost', async () => await fetchPostsOrPost(isBlogOverview.value, slug.value), {
  transform: (data) => {
    if (Array.isArray(data)) {
      return data.map((post) => {
        return {
          ...post,
          slug: post.path.split('/').pop(),
          publishedDateTime: formatDateTime(post.published_timestamp)
        }
      })
    }
    return data;
  }
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


console.log('something', route, route.fullPath);
console.log('dataAndError', data.value, error);
console.log('slug', slug.value);
console.log('selectedPost', data.value);

</script>
