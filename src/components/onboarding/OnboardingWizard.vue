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

            <!-- Photo Capture Screen -->
            <v-window-item :value="4">
              <photo-capture-screen
                @continue="nextStep"
                @update-full-body-photo="userData.fullBodyPhoto = $event"
                @update-selfie-photo="userData.selfiePhoto = $event"
              />
            </v-window-item>

            <!-- Weight Screen -->
            <v-window-item :value="5">
              <weight-screen 
                @continue="nextStep"
                @update:weight="userData.weight = $event"
              />
            </v-window-item>

            <!-- Activity Level Screen -->
            <v-window-item :value="6">
              <activity-level-screen
                @continue="nextStep"
                @update:activityLevel="userData.activityLevel = $event"
              />
            </v-window-item>

            <!-- Body Type Screen -->
            <v-window-item :value="7">
              <body-type-screen 
                @continue="nextStep"
                @update:bodyType="userData.bodyType = $event"
              />
            </v-window-item>

            <!-- Fitness Experience Screen -->
            <v-window-item :value="8">
              <fitness-experience-screen 
                @continue="finishOnboarding"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebaseStore } from '../../stores/firebase'

defineOptions({
  name: 'OnboardingWizard'
})

// Import screen components
import WelcomeScreen from './screens/WelcomeScreen.vue'
import NameSexScreen from './screens/NameSexScreen.vue'
import PhotoCaptureScreen from './screens/PhotoCaptureScreen.vue'
import ReasonScreen from './screens/ReasonScreen.vue'
import WeightScreen from './screens/WeightScreen.vue'
import ActivityLevelScreen from './screens/ActivityLevelScreen.vue'
import BodyTypeScreen from './screens/BodyTypeScreen.vue'
import FitnessExperienceScreen from './screens/FitnessExperienceScreen.vue'

// Import avatar components
import DefaultAvatar from './avatars/DefaultAvatar.vue'
import ActivityAvatar from './avatars/ActivityAvatar.vue'

const firebaseStore = useFirebaseStore()
const router = useRouter()
const step = ref(1)
const totalSteps = 8

// Initialize user data object
const userData = ref({
  name: '',
  sex: '',
  reason: '',
  selfiePhoto: '',
  fullBodyPhoto: '',
  weight: 0,
  activityLevel: '',
  bodyType: '',
  fitnessExperience: '',
  sessionId: '',
  createdAt: ''
})

// Generate a session ID when the component is mounted
// onMounted(() => {
//   userData.value.sessionId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
//   userData.value.createdAt = new Date().toISOString()
// })

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
  }
}

// Save data to Firebase and redirect to summary
const finishOnboarding = () => {
  // Generate a unique session ID or use existing one
  let sessionId = firebaseStore.getSessionId
  if (!sessionId) {
    sessionId = Date.now().toString()
    firebaseStore.setSessionId(sessionId)
  }

  // Save user data to Firebase using the store
  firebaseStore.saveUserData(userData.value).then(() => {
    // Navigate to summary screen
    router.push('/resumen')
  })
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
