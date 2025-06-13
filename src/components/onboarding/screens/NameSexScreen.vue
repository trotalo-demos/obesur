<template>
  <div class="name-sex-screen">
    <v-card-title class="text-center text-h5 font-weight-bold pb-2">
      Cuéntanos sobre ti
    </v-card-title>
    
    <v-card-text>
      <v-form ref="form" @submit.prevent="validateAndContinue">
        <v-text-field
          v-model="name"
          label="¿Cómo te llamas?"
          variant="outlined"
          :rules="nameRules"
          required
          class="mb-4"
        ></v-text-field>

        <v-card-subtitle class="text-subtitle-1 px-0">
          Selecciona tu sexo biológico
        </v-card-subtitle>

        <div class="d-flex justify-space-between my-4">
          <v-btn
            :color="sex === 'male' ? 'primary' : 'grey-lighten-3'"
            :variant="sex === 'male' ? 'elevated' : 'outlined'"
            rounded
            height="80"
            width="45%"
            @click="selectSex('male')"
            class="pa-2 text-body-1"
          >
            <div class="d-flex flex-column align-center">
              <v-icon size="x-large" class="mb-1">mdi-human-male</v-icon>
              Hombre
            </div>
          </v-btn>
          
          <v-btn
            :color="sex === 'female' ? 'primary' : 'grey-lighten-3'"
            :variant="sex === 'female' ? 'elevated' : 'outlined'"
            rounded
            height="80"
            width="45%"
            @click="selectSex('female')"
            class="pa-2 text-body-1"
          >
            <div class="d-flex flex-column align-center">
              <v-icon size="x-large" class="mb-1">mdi-human-female</v-icon>
              Mujer
            </div>
          </v-btn>
        </div>
      </v-form>
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

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

defineOptions({
  name: 'NameSexScreen'
})

const emit = defineEmits(['update:name', 'update:sex', 'continue'])

const name = ref('')
const sex = ref('')
const form = ref(null)

const nameRules = [
  (v: string) => !!v || 'El nombre es requerido',
  (v: string) => v.length >= 2 || 'El nombre debe tener al menos 2 caracteres'
]

const isValid = computed(() => {
  return name.value.length >= 2 && !!sex.value
})

watch(name, (newValue) => {
  emit('update:name', newValue)
})

watch(sex, (newValue) => {
  emit('update:sex', newValue)
})

const selectSex = (value: string) => {
  sex.value = value
}

const validateAndContinue = async () => {
  if (isValid.value) {
    emit('continue')
  }
}
</script>

<style scoped>
  .name-sex-screen {
    min-height: 400px;
    display: flex;
    flex-direction: column;
  }
</style>
