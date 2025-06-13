<template>
  <div class="weight-screen">
    <v-card-title class="text-center text-h5 font-weight-bold pb-2">
      ¿Cuál es tu peso actual?
    </v-card-title>
    
    <v-card-text>
      <div class="d-flex align-center justify-center">
        <v-text-field
          v-model="weight"
          label="Peso en kg"
          type="number"
          variant="outlined"
          class="mr-4"
          style="max-width: 150px"
          :rules="weightRules"
          @update:model-value="onWeightChange"
        ></v-text-field>
        
        <span class="text-h6">kg</span>
      </div>
      
      <v-slider
        v-model="weight"
        min="30"
        max="200"
        step="0.5"
        thumb-label="always"
        thumb-size="24"
        class="mt-8"
        @update:model-value="onWeightChange"
      >
        <template v-slot:thumb-label="{ modelValue }">
          {{ modelValue }} kg
        </template>
      </v-slider>
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
  name: 'WeightScreen'
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineOptions({
  name: 'WeightScreen'
})

const emit = defineEmits(['update:weight', 'continue'])

const weight = ref(70)

const weightRules = [
  (v: any) => !!v || 'El peso es requerido',
  (v: any) => (v >= 30 && v <= 200) || 'El peso debe estar entre 30 y 200 kg'
]

const isValid = computed(() => {
  return weight.value >= 30 && weight.value <= 200
})

const onWeightChange = (value: number) => {
  emit('update:weight', value)
}

const validateAndContinue = () => {
  if (isValid.value) {
    emit('continue')
  }
}
</script>

<style scoped>
.weight-screen {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
</style>
