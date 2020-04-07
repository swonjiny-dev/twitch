<template>
  <v-footer absolute class="font-weight-medium">
    <v-col
        class="text-center"
        cols="12"
       
      >
    <div @click="clickevent" style="cursor:pointer;">
        <v-icon>mdi-copyright</v-icon> swonjiny.dev@gmail.com 2020.04
    </div>

    </v-col>
  </v-footer>
</template>

<script>
export default {
    methods: {
       clickevent(){
           location.href = "mailto:swonjiny.dev@gmail.com";
        } 
    },
    
}
</script>

<style>

</style>