<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="white"
      flat
    >
      <v-avatar
        :color="$vuetify.breakpoint.smAndDown ? 'grey darken-1' : 'transparent'"
        size="32"
      ></v-avatar>

      <v-tabs
        centered
        class="ml-n9"
        color="red darken-1"
      >
        <v-tab
          v-for="link in links"
          :key="link"
        >
          {{ link }}
        </v-tab>
      </v-tabs>

      <v-avatar
        class="hidden-sm-and-down"
        color="grey darken-1 shrink"
        size="32"
      ></v-avatar>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            sm="2"
          >
            <v-sheet
              rounded="lg"
              min-height="268"
            >
            Привет 1
              <!--  -->
            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            sm="8"
          >
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >
              <!--  -->
              <StationList :stations="this.$store.state.stations"/>
            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            sm="2"
          >
            <v-sheet
              rounded="lg"
              min-height="268"
            >
            Привет 3
              <!--  -->
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

import StationList from './components/StationList.vue'

export default {
  name: 'App',

  components: {
    StationList,
  },

  data: () => ({
      links: [
        'Fuel stations',
        'Tankers',
        'Dashboard',
      ],
    }),

  mounted: function () {
    this.$store.commit('setInitState');
    console.log(this.$store.state.stations);
  }, 

  computed: {
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    }
  },

  methods: {
    plus: function () {
      this.a++
    }
  }
  

};
</script>
