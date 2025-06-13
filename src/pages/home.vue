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
                <v-avatar class="mr-4" size="80">
                  <v-img src="/avatars/default-avatar.svg" alt="Avatar"></v-img>
                </v-avatar>
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
import { ref, computed } from 'vue'

defineOptions({
  name: 'HomePage'
})

// Tab activa
const activeTab = ref('hoy')

// Lista de tareas de hoy
const todayTasks = ref([
  {
    title: 'Tomar foto del almuerzo',
    subtitle: '',
    icon: 'mdi-food',
    completed: false
  },
  {
    title: 'Caminar 6.000 pasos',
    subtitle: '',
    icon: 'mdi-shoe-print',
    completed: false
  },
  {
    title: 'Hacer ejercicios',
    subtitle: '',
    icon: 'mdi-dumbbell',
    completed: false
  }
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
</style>
