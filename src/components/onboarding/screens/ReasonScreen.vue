<template>
  <div class="reason-screen">
    <v-card-title class="text-center text-h5 font-weight-bold pb-2">
      ¿Que  te motiva??
    </v-card-title>

    <v-card-text>
      <v-radio-group
        v-model="reason"
        class="mt-4"
        @update:model-value="onReasonChange"
      >
        <v-radio
          value="weight-loss"
          label="Pérdida de peso"
        ></v-radio>

        <v-radio
          value="metabolic-syndrome"
          label="Síndrome metabólico"
        ></v-radio>

        <v-radio
          value="diabetes-control"
          label="Control de diabetes"
        ></v-radio>

        <v-radio
          value="nutrition-advice"
          label="Cambio estilo de vida"
        ></v-radio>

        <v-radio
          value="other"
          label="Otro"
        ></v-radio>

        <v-text-field
          v-if="reason === 'other'"
          v-model="otherReason"
          label="Por favor especifica"
          variant="outlined"
          density="compact"
          class="mt-2"
          @update:model-value="onOtherReasonChange"
        ></v-text-field>
      </v-radio-group>
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
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ReasonScreen'
})
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineOptions({
  name: 'ReasonScreen'
})

const emit = defineEmits(['update:reason', 'continue'])

const reason = ref('')
const otherReason = ref('')

const isValid = computed(() => {
  if (reason.value === 'other') {
    return otherReason.value.trim().length > 0
  }
  return reason.value !== ''
})

const onReasonChange = (value: string) => {
  if (value === 'other') {
    emit('update:reason', otherReason.value || 'Otro')
  } else {
    emit('update:reason', value)
  }
}

const onOtherReasonChange = (value: string) => {
  emit('update:reason', value)
}

const validateAndContinue = () => {
  if (isValid.value) {
    emit('continue')
  }
}
</script>

<style scoped>
.reason-screen {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}
</style>
