<template>
  <vue-suggestion
    :items="items"
    v-model="item"
    :setLabel="setLabel"
    :SearchItemTemplate="SearchItemTemplate"
    @changed="inputChange"
    @selected="itemSelected"
  >
  </vue-suggestion>
</template>

<script>
  import SearchItemTemplate from './SearchItemTemplate.vue';
  export default {
    name: 'SearchAutocomplete',
  /*  props: {
      items: {
        type: Array,
        required: false,
        default: () => [],
      }
    },*/
    data() {
      return {
        item: {},
        items: [
           {"city_id":3451190,"city_name":"Rio de Janeiro"}, 
           {"city_id":1816670,"city_name":"Beijing"}, 
           {"city_id":5344994,"city_name":"East Los Angeles"}
        ], 
        SearchItemTemplate,
      };
    },
    methods: {
      itemSelected(item) {
        this.item = item;
      },
      setLabel(item) {
        return item.city_name;
      },
      inputChange(text) {
        // your search method
        this.items = this.items.filter((item) => item.city_name.indexOf(text) > -1);
        // now `items` will be showed in the suggestion list
      },
    },
  }
</script>