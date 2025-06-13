<template>
  <div class="welcome-screen">
    <v-card-title class="text-center text-h4 font-weight-bold pb-2">
      ¡Bienvenido/a a ObeSur!
    </v-card-title>
    
    <v-card-text class="text-center pb-4">
      <p class="text-body-1">
        Estamos aquí para acompañarte en tu camino hacia una vida más saludable.
      </p>
      <p class="text-body-1 mt-4">
        Vamos a ayudarte con un seguimiento médico personalizado según tus necesidades específicas.
      </p>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        size="large"
        rounded
        variant="elevated"
        @click="emitContinue"
      >
        Comenzar
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
export default {
  name: 'WelcomeScreen'
}
</script>

<script setup lang="ts">
const emit = defineEmits(['continue'])

const emitContinue = () => {
  emit('continue')
}
</script>

<style scoped>
  .welcome-screen {
    min-height: 300px;
    display: flex;
    flex-direction: column;
  }
</style>
