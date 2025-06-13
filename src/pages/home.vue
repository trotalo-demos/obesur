<template>
  <v-container class="home-page" fluid>
    <!-- Tabs de navegación superior -->
    <v-tabs v-model="activeTab" bg-color="surface" class="mb-4">
      <v-tab value="hoy" class="text-subtitle-1 font-weight-bold">HOY</v-tab>
      <v-tab value="completadas" class="text-subtitle-1 font-weight-bold">COMPLETADAS</v-tab>
    </v-tabs>

    <v-window v-model="activeTab">
      <!-- Pestaña HOY -->
      <v-window-item value="hoy">
        <v-row>
          <v-col cols="12">
            <!-- Tarjeta de progreso -->
            <v-card class="mb-4" rounded="lg">
              <v-card-text class="d-flex">
                <div v-if="userData && userData.selfiePhoto" class="user-avatar-circle mr-4">
                  <img alt="Tu selfie" class="user-selfie" :src="userData.selfiePhoto">
                </div>
                <!-- <v-avatar v-else class="mr-4" size="80">
                  <v-img src="/avatars/default-avatar.svg" alt="Avatar"></v-img>
                </v-avatar> -->
                <div>
                  <h2 class="text-h5 font-weight-bold">¡Bien hecho!</h2>
                  <p class="text-subtitle-1">Has completado {{ completedTasksCount }} de {{ totalTasks }} tareas</p>
                </div>
              </v-card-text>
            </v-card>

            <!-- Lista de tareas -->
            <v-card v-for="(task, index) in todayTasks" :key="index" class="mb-4" rounded="lg" variant="outlined">
              <v-card-text class="d-flex align-center justify-space-between py-4">
                <div class="d-flex align-center">
                  <v-avatar class="mr-4" size="60" color="grey-lighten-3">
                    <v-icon :icon="task.icon" size="32"></v-icon>
                  </v-avatar>
                  <div>
                    <h3 class="text-h6">{{ task.title }}</h3>
                    <p v-if="task.subtitle" class="text-subtitle-2">{{ task.subtitle }}</p>
                  </div>
                </div>
                <v-checkbox v-model="task.completed" color="success" hide-details></v-checkbox>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Pestaña COMPLETADAS -->
      <v-window-item value="completadas">
        <v-row>
          <v-col cols="12">
            <v-card v-for="(task, index) in completedTasks" :key="index" class="mb-4" rounded="lg" variant="outlined">
              <v-card-text class="d-flex align-center justify-space-between py-4">
                <div class="d-flex align-center">
                  <v-avatar class="mr-4" size="60" color="grey-lighten-3">
                    <v-icon :icon="task.icon" size="32"></v-icon>
                  </v-avatar>
                  <div>
                    <h3 class="text-h6">{{ task.title }}</h3>
                    <p v-if="task.subtitle" class="text-subtitle-2">{{ task.subtitle }}</p>
                    <p class="text-caption text-grey">Completado: {{ task.completedAt }}</p>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </v-container>

  <!-- Footer con navegación -->
  <v-bottom-navigation bg-color="surface">
    <v-btn value="cirugia">
      <v-icon>mdi-hospital-box</v-icon>
      MEDICINA
    </v-btn>

    <v-btn value="nutricion">
      <v-icon>mdi-food-apple</v-icon>
      NUTRICIÓN
    </v-btn>

    <v-btn value="psicologia">
      <v-icon>mdi-brain</v-icon>
      PSICOLOGÍA
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFirebaseStore } from '../stores/firebase'

defineOptions({
  name: 'HomePage'
})

// Store de Firebase centralizado
const firebaseStore = useFirebaseStore()

// Usuario y datos
const userData = ref(null)

// Datos de debuggeo
const debugInfo = ref('')

// Estado de la aplicación
const activeTab = ref('hoy')

// Tareas del día
const todayTasks = ref([
  { id: 1, title: 'Actividad física diaria', description: '30 minutos', completed: false },
  { id: 2, title: 'Registro de alimentos', description: 'Desayuno, comida, cena', completed: true },
  { id: 3, title: 'Control de agua', description: '2 litros', completed: false },
  { id: 4, title: 'Lectura educativa', description: 'Artículo nutrición', completed: false }
])

// Lista de tareas completadas
const completedTasks = ref([
  {
    title: 'Beber 2L de agua',
    subtitle: '',
    icon: 'mdi-water',
    completedAt: 'Hoy, 10:30'
  },
  {
    title: 'Registrar peso',
    subtitle: '78.5kg',
    icon: 'mdi-scale-bathroom',
    completedAt: 'Ayer, 08:15'
  }
])

// Contar tareas completadas y totales
const totalTasks = computed(() => todayTasks.value.length)
const completedTasksCount = computed(() => todayTasks.value.filter(task => task.completed).length)

onMounted(async () => {
  console.log('Home - Iniciando carga de datos desde el store centralizado')
  
  try {
    // Cargar datos del usuario usando el store centralizado
    await firebaseStore.loadUserData()
    
    if (firebaseStore.userData) {
      userData.value = firebaseStore.userData
      console.log('Home - Datos cargados correctamente desde el store centralizado:', userData.value)
    } else {
      console.log('Home - No se encontraron datos de usuario en el store centralizado')
      
      // Fallback a localStorage (solo para compatibilidad durante la migración)
      const localUserData = localStorage.getItem('userData')
      if (localUserData) {
        try {
          userData.value = JSON.parse(localUserData)
          console.log('Home - Datos recuperados del fallback (localStorage):', userData.value)
        } catch (error) {
          console.error('Home - Error al procesar datos del fallback:', error)
        }
      }
    }
  } catch (error) {
    console.error('Home - Error al cargar datos desde el store:', error)
  }
})
</script>

<style scoped>
.home-page {
  padding-bottom: 64px; /* Espacio para el bottom navigation */
}

.v-bottom-navigation {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1;
}

.v-avatar {
  border: 1px solid rgba(0,0,0,0.1);
}

.user-avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #4caf50;
}

.user-selfie {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
