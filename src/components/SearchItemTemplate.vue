<template>
  <div>
    <b>#{{ item.city_id }}</b>
    <span>{{ item.city_name }}</span>
  </div>
</template>

<script>
  export default {
    props: {
      item: { required: true },
    },
  };
</script>