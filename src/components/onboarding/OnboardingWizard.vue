<template>
  <v-container class="onboarding-wizard fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4" elevation="3" rounded="lg">
          <!-- Avatar display area -->
          <div class="avatar-container text-center mb-6 pt-4">
            <component :is="currentAvatarComponent" />
          </div>

          <!-- Wizard steps -->
          <v-window v-model="step">
            <!-- Welcome Screen -->
            <v-window-item :value="1">
              <welcome-screen @continue="nextStep" />
            </v-window-item>

            <!-- Name and Sex Screen -->
            <v-window-item :value="2">
              <name-sex-screen 
                @continue="nextStep"
                @update:name="userData.name = $event"
                @update:sex="userData.sex = $event"
              />
            </v-window-item>

            <!-- Reason Screen -->
            <v-window-item :value="3">
              <reason-screen 
                @continue="nextStep"
                @update:reason="userData.reason = $event"
              />
            </v-window-item>

            <!-- Weight Screen -->
            <v-window-item :value="4">
              <weight-screen 
                @continue="nextStep"
                @update:weight="userData.weight = $event"
              />
            </v-window-item>

            <!-- Activity Level Screen -->
            <v-window-item :value="5">
              <activity-level-screen 
                @continue="nextStep"
                @update:activityLevel="userData.activityLevel = $event"
              />
            </v-window-item>

            <!-- Body Type Screen -->
            <v-window-item :value="6">
              <body-type-screen 
                @continue="nextStep"
                @update:bodyType="userData.bodyType = $event"
              />
            </v-window-item>

            <!-- Fitness Experience Screen -->
            <v-window-item :value="7">
              <fitness-experience-screen 
                @continue="completeOnboarding"
                @update:fitnessExperience="userData.fitnessExperience = $event"
              />
            </v-window-item>
          </v-window>

          <!-- Progress indicator -->
          <div class="mt-6">
            <v-progress-linear
              v-model="progressPercentage"
              height="8"
              rounded
              color="primary"
            ></v-progress-linear>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref as dbRef, set } from 'firebase/database'

defineOptions({
  name: 'OnboardingWizard'
})

// Import screen components
import WelcomeScreen from './screens/WelcomeScreen.vue'
import NameSexScreen from './screens/NameSexScreen.vue'
import ReasonScreen from './screens/ReasonScreen.vue'
import WeightScreen from './screens/WeightScreen.vue'
import ActivityLevelScreen from './screens/ActivityLevelScreen.vue'
import BodyTypeScreen from './screens/BodyTypeScreen.vue'
import FitnessExperienceScreen from './screens/FitnessExperienceScreen.vue'

// Import avatar components
import DefaultAvatar from './avatars/DefaultAvatar.vue'
import ActivityAvatar from './avatars/ActivityAvatar.vue'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrHjFMunMYu6o2Fd8pE0b7Lz6myGMSR4U",
  authDomain: "trotalodev-c281e.firebaseapp.com",
  databaseURL: "https://obesur.firebaseio.com/",
  projectId: "trotalodev-c281e",
  storageBucket: "trotalodev-c281e.firebasestorage.app",
  messagingSenderId: "882002321764",
  appId: "1:882002321764:web:c8665e14f4ed33bcdada71"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)



const router = useRouter()
const step = ref(1)
const totalSteps = 7

// User data store
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

// Generate a session ID when the component is mounted
onMounted(() => {
  userData.value.sessionId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  userData.value.createdAt = new Date().toISOString()
})

// Calculate progress percentage
const progressPercentage = computed(() => {
  return ((step.value - 1) / (totalSteps - 1)) * 100
})

// Determine which avatar component to show based on current step and user data
const currentAvatarComponent = computed(() => {
  // Activity screen - show activity avatar with correct level
  if (step.value === 5) {
    return ActivityAvatar
  }
  
  // For other screens, return DefaultAvatar with appropriate properties
  return DefaultAvatar
})

// Navigate to next step
const nextStep = () => {
  if (step.value < totalSteps) {
    step.value++
    saveDataToFirebase()
  }
}

// Save current data to Firebase
const saveDataToFirebase = () => {
  const userRef = dbRef(database, `users/${userData.value.sessionId}`)
  set(userRef, userData.value)
    .catch((error) => {
      console.error('Error saving user data: ', error)
    })
}

// Complete onboarding process
const completeOnboarding = () => {
  // Guardar el ID de sesión en localStorage para recuperarlo en la página de inicio
  localStorage.setItem('obesurSessionId', userData.value.sessionId)
  
  // Guardar los datos en Firebase
  saveDataToFirebase()
  
  // Redireccionar a la página de resumen
  router.push('/resumen')
}
</script>

<style scoped>
.onboarding-wizard {
  min-height: 100vh;
}

.avatar-container {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
