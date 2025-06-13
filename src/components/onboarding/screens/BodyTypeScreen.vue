<template>
  <div class="body-type-screen">
    <v-card-title class="text-center text-h5 font-weight-bold pb-2">
      ¿Qué tipo de cuerpo tienes?
    </v-card-title>

    <v-card-text>
      <div class="d-flex flex-column">
        <v-row>
          <v-col
            v-for="(type, index) in bodyTypes"
            :key="index"
            cols="6"
            sm="4"
            class="pa-2"
          >
            <v-card
              :color="bodyType === type.value ? 'primary' : 'grey-lighten-4'"
              class="body-type-card"
              :class="{ 'selected': bodyType === type.value }"
              @click="selectBodyType(type.value)"
              height="180"
              width="100%"
            >
              <v-card-item class="text-center pa-2">
                <div class="body-icon mb-3">
                  <img :alt="type.label" class="body-type-image" :src="type.imageUrl">
                </div>
              </v-card-item>
              <v-card-text class="text-center pt-0 pb-2">
                <div class="text-subtitle-1 font-weight-medium">
                  {{ type.label }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

defineOptions({
  name: 'BodyTypeScreen'
})

const emit = defineEmits(['update:bodyType', 'continue'])

const bodyType = ref('')

const bodyTypes = [
  {
    value: 'ectomorph',
    label: 'Ectomorfo',
    imageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    description: 'Delgado, con dificultad para ganar peso'
  },
  {
    value: 'mesomorph',
    label: 'Mesomorfo',
    imageUrl: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    description: 'Atlético, gana y pierde peso fácilmente'
  },
  {
    value: 'endomorph',
    label: 'Endomorfo',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    description: 'Tendencia a acumular grasa, dificultad para perder peso'
  },
  {
    value: 'ecto-meso',
    label: 'Ecto-Meso',
    imageUrl: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    description: 'Mezcla entre ectomorfo y mesomorfo'
  },
  {
    value: 'meso-endo',
    label: 'Meso-Endo',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    description: 'Mezcla entre mesomorfo y endomorfo'
  },
  {
    value: 'not-sure',
    label: 'No estoy seguro',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    description: 'No estoy seguro de mi tipo de cuerpo'
  }
]

const isValid = computed(() => {
  return bodyType.value !== ''
})

watch(bodyType, (newValue) => {
  emit('update:bodyType', newValue)
})

const selectBodyType = (type: string) => {
  bodyType.value = type
}

const validateAndContinue = () => {
  if (isValid.value) {
    emit('continue')
  }
}
</script>

<style scoped>
.body-type-screen {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.body-type-card {
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.body-type-card.selected {
  border: 2px solid #1976D2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.body-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}
</style>
