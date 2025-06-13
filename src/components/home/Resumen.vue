<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4 resumen-card" elevation="3" rounded="lg">
          <div class="text-center mb-4">
            <h1 class="text-h4 font-weight-bold">¡Bienvenido a Obesur!</h1>
            <p class="text-subtitle-1">{{ greeting }}</p>
          </div>

          <!-- Avatar display area -->
          <div class="avatar-container text-center my-6">
            <user-avatar :user-data="userData" />
          </div>

          <!-- User Summary -->
          <v-card class="user-summary mb-4" variant="outlined">
            <v-card-title class="text-h6 pb-0">Tus datos</v-card-title>
            <v-card-text class="pt-2">
              <div class="d-flex justify-space-between">
                <span class="text-body-1">Nombre:</span>
                <span class="font-weight-medium">{{ userData.name }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-body-1">Sexo:</span>
                <span class="font-weight-medium">{{ userData.sex === 'male' ? 'Masculino' : 'Femenino' }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-body-1">Motivo:</span>
                <span class="font-weight-medium">{{ userData.reason }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-body-1">Peso:</span>
                <span class="font-weight-medium">{{ userData.weight }} kg</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-body-1">Actividad física:</span>
                <span class="font-weight-medium">{{ formatActivityLevel }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <span class="text-body-1">Experiencia fitness:</span>
                <span class="font-weight-medium">{{ formatFitnessExperience }}</span>
              </div>
            </v-card-text>
          </v-card>

          <!-- Actions -->
          <v-card class="motivation-card mb-4" color="primary" variant="tonal">
            <v-card-text class="text-center">
              <p class="text-h6 mb-2">Tu progreso</p>
              <v-progress-circular
                :model-value="20"
                color="white"
                size="100"
                width="12"
                class="mb-4"
              >20%</v-progress-circular>
              <p class="text-subtitle-1">¡Excelente comienzo!</p>
            </v-card-text>
          </v-card>

          <!-- Next Steps -->
          <v-card class="mb-4">
            <v-card-title class="text-h6">Próximos pasos</v-card-title>
            <v-list density="compact" lines="two">
              <v-list-item prepend-icon="mdi-calendar">
                <v-list-item-title>Agendar cita</v-list-item-title>
                <v-list-item-subtitle>Programa tu consulta médica</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-food-apple">
                <v-list-item-title>Plan nutricional</v-list-item-title>
                <v-list-item-subtitle>Descarga tu plan personalizado</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-run">
                <v-list-item-title>Rutina de ejercicios</v-list-item-title>
                <v-list-item-subtitle>Accede a tu programa recomendado</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>

          <v-btn block color="success" size="large" class="mt-4" @click="startProgram">
            Comenzar mi programa
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getDatabase, ref as dbRef, onValue } from 'firebase/database'
import { useRouter } from 'vue-router'
import UserAvatar from './UserAvatar.vue'

defineOptions({
  name: 'ResumenComponent'
})

const router = useRouter()

// User data structure
const userData = ref({
  name: '',
  sex: '',
  reason: '',
  weight: 0,
  bodyType: '',
  activityLevel: '',
  fitnessExperience: '',
  sessionId: '',
  createdAt: ''
})

// Welcome greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '¡Buenos días!'
  if (hour < 18) return '¡Buenas tardes!'
  return '¡Buenas noches!'
})

// Format activity level for display
const formatActivityLevel = computed(() => {
  switch (userData.value.activityLevel) {
    case 'sedentary': return 'Sedentario'
    case 'occasional': return 'Ocasional'
    case 'active': return 'Activo'
    default: return 'No especificado'
  }
})

// Format fitness experience for display
const formatFitnessExperience = computed(() => {
  switch (userData.value.fitnessExperience) {
    case 'beginner': return 'Principiante'
    case 'intermediate': return 'Intermedio'
    case 'advanced': return 'Avanzado'
    default: return 'No especificado'
  }
})

// Navigate to main home screen
const startProgram = () => {
  router.push('/home')
}

onMounted(async () => {
  // Get session ID from localStorage (saved during onboarding)
  const sessionId = localStorage.getItem('obesurSessionId')
  
  if (sessionId) {
    // Connect to Firebase and get user data
    const database = getDatabase()
    const userDataRef = dbRef(database, `users/${sessionId}`)
    
    onValue(userDataRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        userData.value = data
      }
    })
  }
})
</script>

<style scoped>
.resumen-card {
  max-width: 100%;
  margin: 0 auto;
}

.avatar-container {
  height: 150px;
}

.user-summary {
  background-color: rgba(var(--v-theme-surface-variant), 0.4);
}
</style>
