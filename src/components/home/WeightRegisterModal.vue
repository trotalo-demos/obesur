<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="text-h5 font-weight-bold">
        Registro de peso
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col cols="12">
              <p class="text-body-1 mb-4">
                Registrar tu peso diario nos ayuda a hacer un mejor seguimiento de tu progreso.
              </p>
              
              <div class="d-flex align-center mb-4">
                <v-text-field
                  v-model="weight"
                  class="mr-4"
                  label="Peso en kg"
                  required
                  style="max-width: 150px"
                  :rules="weightRules"
                  type="number"
                  step="0.1"
                  variant="outlined"
                  @update:model-value="onWeightChange"
                ></v-text-field>
                
                <span class="text-h6">kg</span>
              </div>
              
              <v-slider
                v-model="weight"
                class="mt-2"
                max="200"
                min="30"
                step="0.5"
                thumb-label="always"
                thumb-size="24"
                @update:model-value="onWeightChange"
              >
                <template #thumb-label="{ modelValue }">
                  {{ modelValue }} kg
                </template>
              </v-slider>

              <v-textarea
                v-model="notes"
                label="Notas (opcional)"
                variant="outlined"
                density="comfortable"
                rows="2"
                placeholder="Ej: Antes del desayuno, después de ejercicio, etc."
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="close"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="!valid || isProcessing"
          @click="save"
        >
          <v-icon v-if="isProcessing" icon="mdi-loading" class="mr-2 rotating"></v-icon>
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['weight-updated', 'close'])

const dialog = ref(false)
const valid = ref(false)
const weight = ref('')
const notes = ref('')
const isProcessing = ref(false)

// Validaciones
const weightRules = [
  v => !!v || 'El peso es requerido',
  v => (v && parseFloat(v) > 20 && parseFloat(v) < 300) || 'El peso debe estar entre 20 y 300 kg'
]

const form = ref(null)

  // Métodos
  const onWeightChange = (value: string | number) => {
    // Validar que el peso sea un número válido
    const numValue = Number.parseFloat(value.toString())
    if (!Number.isNaN(numValue) && numValue >= 30 && numValue <= 200) {
      weight.value = numValue.toString()
    }
  }

const open = () => {
  dialog.value = true
  weight.value = ''
  notes.value = ''
  valid.value = false
  if (form.value) {
    form.value.resetValidation()
  }
}

const close = () => {
  dialog.value = false
  emit('close')
}

const save = () => {
  if (!valid.value) return
  
  isProcessing.value = true
  
  // Preparar los datos
  const weightData = {
    value: parseFloat(weight.value),
    notes: notes.value,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('es-ES')
  }
  
  // Emitir evento con los datos
  emit('weight-updated', weightData)
  
  // Cerrar el modal después de un pequeño retraso para mostrar el estado de procesamiento
  setTimeout(() => {
    isProcessing.value = false
    close()
  }, 500)
}

// Exponer métodos para uso externo
defineExpose({
  open
})
</script>

<script lang="ts">
export default {
  name: 'WeightRegisterModal'
}
</script>

<style scoped>
.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
