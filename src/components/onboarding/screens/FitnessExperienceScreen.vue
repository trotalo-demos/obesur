<template>
  <div class="fitness-experience-screen">
    <v-card-title class="text-center text-h5 font-weight-bold pb-2">
      ¿Cuál es tu experiencia entrenando?
    </v-card-title>

    <v-card-text>
      <div class="d-flex flex-column">
        <v-btn
          block
          :color="fitnessExperience === 'basic' ? 'primary' : 'grey-lighten-3'"
          :variant="fitnessExperience === 'basic' ? 'elevated' : 'outlined'"
          class="my-2 pa-3 text-body-1"
          height="70"
          @click="selectFitnessExperience('basic')"
        >
          <div class="d-flex align-left justify-start w-100">
            <v-icon size="large" class="mr-4">mdi-human</v-icon>
            <div class="text-start">
              <div>Básico</div>
              <div class="text-caption">Poca o ninguna experiencia previa con entrenamiento</div>
            </div>
          </div>
        </v-btn>

        <v-btn
          block
          :color="fitnessExperience === 'intermediate' ? 'primary' : 'grey-lighten-3'"
          :variant="fitnessExperience === 'intermediate' ? 'elevated' : 'outlined'"
          class="my-2 pa-3 text-body-1"
          height="70"
          @click="selectFitnessExperience('intermediate')"
        >
          <div class="d-flex align-center justify-start w-100">
            <v-icon size="large" class="mr-4">mdi-human-handsup</v-icon>
            <div class="text-start">
              <div>Intermedio</div>
              <div class="text-caption">Experiencia moderada con entrenamiento regular</div>
            </div>
          </div>
        </v-btn>

        <v-btn
          block
          :color="fitnessExperience === 'advanced' ? 'primary' : 'grey-lighten-3'"
          :variant="fitnessExperience === 'advanced' ? 'elevated' : 'outlined'"
          class="my-2 pa-3 text-body-1"
          height="70"
          @click="selectFitnessExperience('advanced')"
        >
          <div class="d-flex align-center justify-start w-100">
            <v-icon size="large" class="mr-4">mdi-weight-lifter</v-icon>
            <div class="text-start">
              <div>Avanzado</div>
              <div class="text-caption">Alta experiencia con entrenamiento regular e intenso</div>
            </div>
          </div>
        </v-btn>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        size="large"
        rounded
        variant="elevated"
        :disabled="!isValid"
        @click="validateAndContinue"
      >
        Finalizar
        <v-icon end>mdi-check</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

defineOptions({
  name: 'FitnessExperienceScreen'
})

const emit = defineEmits(['update:fitnessExperience', 'continue'])

const fitnessExperience = ref('')

const isValid = computed(() => {
  return fitnessExperience.value !== ''
})

watch(fitnessExperience, (newValue) => {
  emit('update:fitnessExperience', newValue)
})

const selectFitnessExperience = (level: string) => {
  fitnessExperience.value = level
}

const validateAndContinue = () => {
  if (isValid.value) {
    emit('continue')
  }
}
</script>

<style scoped>
/* Sobrescribir estilos de Vuetify para los botones */
.fitness-experience-screen :deep(.v-btn) {
  justify-content: flex-start;
}

.fitness-experience-screen {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
</style>
