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
            <v-card v-for="(task, index) in todayTasks" :key="index" class="mb-4" rounded="lg" variant="outlined" @click="handleTaskClick(task)">
              <v-card-text class="d-flex align-center justify-space-between py-4">
                <div class="d-flex align-center">
                  <v-avatar class="mr-4" size="60" color="grey-lighten-3">
                    <v-icon :icon="task.icon" size="32"></v-icon>
                  </v-avatar>
                  <div>
                    <h3 class="text-h6">{{ task.title }}</h3>
                    <p v-if="task.description" class="text-subtitle-2">{{ task.description }}</p>
                  </div>
                </div>
                <v-checkbox v-model="task.completed" color="success" hide-details @click.stop></v-checkbox>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-window-item>

      <!-- Pestaña COMPLETADAS -->
      <v-window-item value="completadas">
        <v-row>
          <v-col cols="12">
            <!-- Tareas completadas -->
            <h2 class="text-h6 mb-3">Tareas Completadas</h2>
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

            <!-- Registros de alimentos -->
            <div v-if="foodRegistry && foodRegistry.length > 0">
              <h2 class="text-h6 mt-6 mb-3">Historial de Alimentos</h2>
              <v-card v-for="(food, index) in foodRegistry" :key="'food-'+index" class="mb-4" rounded="lg">
                <v-card-text class="py-4">
                  <div class="d-flex">
                    <!-- Imagen del alimento -->
                    <div class="food-image-container mr-4">
                      <img :src="food.imageUrl" alt="Imagen de comida" class="food-image">
                    </div>

                    <!-- Detalles del alimento -->
                    <div>
                      <h3 class="text-h6">{{ formatDate(food.timestamp) }}</h3>
                      <v-chip-group
                        v-if="food.results.items"
                        class="mb-2"
                      >
                        <v-chip v-for="(item, i) in food.results.items.slice(0, 3)" :key="i" size="small" color="primary" class="mr-1">
                          {{ item.name }}
                        </v-chip>
                        <v-chip v-if="food.results.items.length > 3" size="small">+{{ food.results.items.length - 3 }} más</v-chip>
                      </v-chip-group>

                      <!-- Información nutricional resumida -->
                      <div class="d-flex flex-wrap nutrition-summary">
                        <div class="nutrition-item">
                          <span class="font-weight-bold">{{ food.results.nutrition.calories }}</span> kcal
                        </div>
                        <div class="nutrition-item">
                          <span class="font-weight-bold">{{ food.results.nutrition.protein }}</span> g prot
                        </div>
                        <div class="nutrition-item">
                          <span class="font-weight-bold">{{ food.results.nutrition.carbs }}</span> g carbs
                        </div>
                        <div class="nutrition-item">
                          <span class="font-weight-bold">{{ food.results.nutrition.fats }}</span> g grasas
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <!-- Mensaje si no hay registros -->
            <div v-else class="text-center py-8">
              <v-icon icon="mdi-food-off" size="64" color="grey-lighten-2" class="mb-4"></v-icon>
              <p class="text-body-1">Aún no has registrado ningún alimento</p>
              <v-btn color="primary" class="mt-4" @click="openFoodRegisterModal">Registrar alimento</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-window-item>
    </v-window>
  </v-container>

  <!-- Modal para registro de alimentos -->
  <FoodRegisterModal ref="foodRegisterModal" @save="handleFoodRegistration" />

  <!-- Modal para registro de peso -->
  <WeightRegisterModal
    ref="weightRegisterModal"
    @weight-updated="handleWeightRegistration"
  />

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
import FoodRegisterModal from '../components/home/FoodRegisterModal.vue'
import WeightRegisterModal from '../components/home/WeightRegisterModal.vue'

defineOptions({
  name: 'HomePage'
})

// Store de Firebase centralizado
const firebaseStore = useFirebaseStore()

// Usuario y datos
const userData = ref(null)

// Estado de la aplicación
const activeTab = ref('hoy')

// Tareas del día
const todayTasks = ref([
  { id: 1, title: 'Registro de peso', description: 'Tu seguimiento diario', icon: 'mdi-scale', completed: false },
  { id: 2, title: 'Registro de alimentos', description: 'Desayuno, comida, cena', icon: 'mdi-food-apple', completed: false },
  { id: 3, title: 'Control de agua', description: '2 litros', icon: 'mdi-water', completed: false },
  { id: 4, title: 'Lectura educativa', description: 'Artículo nutrición', icon: 'mdi-book-open-page-variant', completed: false }
])

// Lista de tareas completadas
const completedTasks = ref([

])

// Contar tareas completadas y totales
const totalTasks = computed(() => todayTasks.value.length)
const completedTasksCount = computed(() => todayTasks.value.filter(task => task.completed).length)

// Referencias a componentes
const foodRegisterModal = ref(null)
const weightRegisterModal = ref(null)

// Registros de alimentos y peso
const foodRegistry = ref([])
const weightRegistry = ref([])

// Manejar clic en una tarea
const handleTaskClick = (task: any) => {
  // Registrar peso
  if (task.id === 1) {
    openWeightRegisterModal()
  }
  // Registrar alimentos
  else if (task.id === 2) {
    openFoodRegisterModal()
  }
}

// Función para abrir el modal de registro de alimentos
const openFoodRegisterModal = () => {
  foodRegisterModal.value?.open()
}

// Función para abrir el modal de registro de peso
const openWeightRegisterModal = () => {
  weightRegisterModal.value?.open()
}

// Manejar el registro de alimentos
const handleFoodRegistration = (foodData) => {
  // Guardar en Firebase
  firebaseStore.saveFoodRegistry(foodData)
    .then(() => {
      console.log('Registro de alimentos guardado correctamente')

      // Marcar la tarea como completada
      const foodTask = todayTasks.value.find(task => task.id === 2)
      if (foodTask) {
        foodTask.completed = true
      }

      // Añadir a tareas completadas
      completedTasks.value.unshift({
        title: 'Registro de alimentos',
        subtitle: foodData.results.items.map(i => i.name).join(', '),
        icon: 'mdi-food-apple',
        completedAt: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    })
    .catch(error => {
      console.error('Error al guardar registro de alimentos:', error)
    })
}

// Manejar el registro de peso
const handleWeightRegistration = (weightData: any) => {
  // Guardar en Firebase
  firebaseStore.saveWeightRegistry(weightData)
    .then(() => {
      console.log('Registro de peso guardado correctamente')

      // Marcar la tarea como completada
      const weightTask = todayTasks.value.find(task => task.id === 1)
      if (weightTask) {
        weightTask.completed = true
      }

      // Añadir a tareas completadas
      completedTasks.value.unshift({
        title: 'Registro de peso',
        subtitle: `${weightData.value} kg`,
        icon: 'mdi-scale-bathroom',
        completedAt: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })
    })
    .catch(error => {
      console.error('Error al guardar registro de peso:', error)
    })
}

// Formatear fecha y hora
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

onMounted(async () => {
  console.log('Home - Iniciando carga de datos desde el store centralizado')

  try {
    // Cargar datos del usuario usando el store centralizado
    await firebaseStore.loadUserData()

    // Cargar registros de alimentos
    await firebaseStore.loadFoodRegistry()
    if (firebaseStore.foodRegistry) {
      foodRegistry.value = firebaseStore.foodRegistry
      // Ordenar por fecha más reciente
      foodRegistry.value.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }

    // Cargar registros de peso
    await firebaseStore.loadWeightRegistry()
    if (firebaseStore.weightRegistry) {
      weightRegistry.value = firebaseStore.weightRegistry
      // Ordenar por fecha más reciente
      weightRegistry.value.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    }

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

.food-image-container {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.food-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nutrition-summary {
  margin-top: 8px;
}

.nutrition-item {
  margin-right: 16px;
  margin-bottom: 4px;
  color: #666;
  font-size: 0.9rem;
}
</style>
