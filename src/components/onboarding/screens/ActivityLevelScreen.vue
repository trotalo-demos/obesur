<template>
  <div class="activity-level-screen">
    <v-card-title class="text-center text-h5 font-weight-bold pb-2">
      ¿Cuál es tu nivel de actividad física?
    </v-card-title>

    <v-card-text>
      <div class="d-flex flex-column">
        <v-btn
          block
          :color="activityLevel === 'sedentary' ? 'primary' : 'grey-lighten-3'"
          :variant="activityLevel === 'sedentary' ? 'elevated' : 'outlined'"
          class="my-2 pa-3 text-body-1"
          height="70"
          @click="selectActivityLevel('sedentary')"
        >
          <div class="d-flex align-center justify-start w-100">
            <v-icon size="large" class="mr-4">mdi-sofa</v-icon>
            <div class="text-start">
              <div>Sedentario</div>
              <div class="text-caption">Poco o nada de actividad física diaria</div>
            </div>
          </div>
        </v-btn>

        <v-btn
          block
          :color="activityLevel === 'occasional' ? 'primary' : 'grey-lighten-3'"
          :variant="activityLevel === 'occasional' ? 'elevated' : 'outlined'"
          class="my-2 pa-3 text-body-1"
          height="70"
          @click="selectActivityLevel('occasional')"
        >
          <div class="d-flex align-center justify-start w-100">
            <v-icon size="large" class="mr-4">mdi-walk</v-icon>
            <div class="text-start">
              <div>Ocasional</div>
              <div class="text-caption">Ejercicio ligero 1-3 veces por semana</div>
            </div>
          </div>
        </v-btn>

        <v-btn
          block
          :color="activityLevel === 'regular' ? 'primary' : 'grey-lighten-3'"
          :variant="activityLevel === 'regular' ? 'elevated' : 'outlined'"
          class="my-2 pa-3 text-body-1"
          height="70"
          @click="selectActivityLevel('regular')"
        >
          <div class="d-flex align-center justify-start w-100">
            <v-icon size="large" class="mr-4">mdi-run</v-icon>
            <div class="text-start">
              <div>Regular</div>
              <div class="text-caption">Ejercicio moderado 3+ veces por semana</div>
            </div>
          </div>
        </v-btn>

        <v-btn
          block
          :color="activityLevel === 'active' ? 'primary' : 'grey-lighten-3'"
          :variant="activityLevel === 'active' ? 'elevated' : 'outlined'"
          class="my-2 pa-3 text-body-1"
          height="70"
          @click="selectActivityLevel('active')"
        >
          <div class="d-flex align-center justify-start w-100">
            <v-icon size="large" class="mr-4">mdi-weight-lifter</v-icon>
            <div class="text-start">
              <div>Activo</div>
              <div class="text-caption">Ejercicio intenso o entrenamiento casi diario</div>
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
        Continuar
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ActivityLevelScreen'
}
</script>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

defineOptions({
  name: 'ActivityLevelScreen'
})

const emit = defineEmits(['update:activityLevel', 'continue'])

const activityLevel = ref('')

const isValid = computed(() => {
  return activityLevel.value !== ''
})

watch(activityLevel, (newValue) => {
  emit('update:activityLevel', newValue)
})

const selectActivityLevel = (level: string) => {
  activityLevel.value = level
}

const validateAndContinue = () => {
  if (isValid.value) {
    emit('continue')
  }
}
</script>

<style scoped>
.activity-level-screen {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

/* Sobrescribir estilos de Vuetify para los botones */
.activity-level-screen :deep(.v-btn) {
  justify-content: flex-start;
}
</style>
