<template>
    <v-list rounded bordered>
      <v-subheader>Stations` List</v-subheader>
      <v-list-item-group
        v-model="selectedItem"
        color="red"
        class="justify-start"
      >
        <v-list-item
          v-for="(item, i) in stations"
          :key="i"
        >
          <v-list-item-icon>
            <v-icon v-text="'mdi-gas-station'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="`Fuel station ${i+1}`"></v-list-item-title>
          </v-list-item-content>
          
            <v-chip class="ma-2" color="red" text-color="white">
              Workspaces
              <v-avatar right class="red darken-4">
                {{item.placesCount}}
              </v-avatar>
            </v-chip>

            <v-chip class="ma-2" color="red" text-color="white">
              Fuel left
              <v-avatar right class="red darken-4">
                {{item.storage}}
              </v-avatar>
            </v-chip>
          
          <v-list-item-content class="mr-2 ml-2 col-3">
            <v-chip dark color="red accent-2" class="justify-center">Fuel left:{{' '+item.storage}}</v-chip>
          </v-list-item-content>

          




        </v-list-item>
      </v-list-item-group>
    </v-list>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'StationList',
  components: { },
  props: ['stations'],

  data: () => ({
      selectedItem: 0,
      items: [
        { text: 'Real-Time', icon: 'mdi-gas-station' },
        { text: 'Audience', icon: 'mdi-account' },
        { text: 'Conversions', icon: 'mdi-flag' },
      ],
    }),
}
</script>
