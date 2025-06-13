// Firebase store centralizado
import { defineStore } from 'pinia'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref as dbRef, onValue, set } from 'firebase/database'
import { ref, computed } from 'vue'

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

// Initialize Firebase only once
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export const useFirebaseStore = defineStore('firebase', () => {
  // Estado del store
  const userData = ref(null)
  const isUserDataLoaded = ref(false)
  const sessionId = ref(localStorage.getItem('obesurSessionId') || null)
  const foodRegistry = ref([])
  
  // Getters
  const getUserData = computed(() => userData.value)
  const getSessionId = computed(() => sessionId.value)
  const isLoaded = computed(() => isUserDataLoaded.value)
  const getFoodRegistry = computed(() => foodRegistry.value)
  
  // Actions
  function setSessionId(id) {
    sessionId.value = id
    localStorage.setItem('obesurSessionId', id)
  }
  
  async function saveUserData(data) {
    if (!sessionId.value) {
      console.error('No hay sesión activa para guardar datos')
      return false
    }
    
    try {
      await set(dbRef(database, `users/${sessionId.value}`), data)
      userData.value = data
      
      // También guardar en localStorage como respaldo
      localStorage.setItem('userData', JSON.stringify(data))
      
      isUserDataLoaded.value = true
      return true
    } catch (error) {
      console.error('Error al guardar datos:', error)
      return false
    }
  }
  
  async function loadUserData() {
    if (!sessionId.value) {
      console.log('Firebase Store: No hay sesión activa para cargar datos')
      
      // Intentar cargar desde localStorage como fallback
      const localData = localStorage.getItem('userData')
      if (localData) {
        try {
          userData.value = JSON.parse(localData)
          isUserDataLoaded.value = true
          console.log('Firebase Store: Datos cargados desde localStorage')
          return userData.value
        } catch (error) {
          console.error('Error al parsear datos de localStorage:', error)
        }
      }
      return null
    }
    
    return new Promise((resolve) => {
      const userRef = dbRef(database, `users/${sessionId.value}`)
      
      onValue(userRef, (snapshot) => {
        const data = snapshot.val()
        console.log('Firebase Store: Datos recibidos de Firebase:', data)
        
        if (data) {
          userData.value = data
          isUserDataLoaded.value = true
          
          // Actualizar copia en localStorage
          localStorage.setItem('userData', JSON.stringify(data))
        } else {
          console.log('Firebase Store: No hay datos para esta sesión')
          
          // Intentar cargar desde localStorage como fallback
          const localData = localStorage.getItem('userData')
          if (localData) {
            try {
              userData.value = JSON.parse(localData)
              isUserDataLoaded.value = true
              console.log('Firebase Store: Datos cargados desde localStorage')
            } catch (error) {
              console.error('Error al parsear datos de localStorage:', error)
            }
          }
        }
        
        resolve(userData.value)
      })
    })
  }
  
  // Guardar registro de alimentos
  async function saveFoodRegistry(foodData) {
    if (!sessionId.value) {
      console.error('No hay sesión activa para guardar datos de alimentos')
      return false
    }
    
    try {
      // Añadir ID único basado en timestamp
      const foodEntry = {
        ...foodData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      
      // Actualizar el estado local
      if (!foodRegistry.value) foodRegistry.value = []
      foodRegistry.value.push(foodEntry)
      
      // Guardar en Firebase
      await set(dbRef(database, `food/${sessionId.value}/${foodEntry.id}`), foodEntry)
      
      // También guardar en localStorage como respaldo
      localStorage.setItem('foodRegistry', JSON.stringify(foodRegistry.value))
      
      return true
    } catch (error) {
      console.error('Error al guardar datos de alimentos:', error)
      return false
    }
  }
  
  // Cargar registro de alimentos
  async function loadFoodRegistry() {
    if (!sessionId.value) {
      console.log('Firebase Store: No hay sesión activa para cargar datos de alimentos')
      
      // Intentar cargar desde localStorage como fallback
      const localData = localStorage.getItem('foodRegistry')
      if (localData) {
        try {
          foodRegistry.value = JSON.parse(localData)
          console.log('Firebase Store: Datos de alimentos cargados desde localStorage')
          return foodRegistry.value
        } catch (error) {
          console.error('Error al parsear datos de alimentos de localStorage:', error)
        }
      }
      return null
    }
    
    return new Promise((resolve) => {
      const foodRef = dbRef(database, `food/${sessionId.value}`)
      
      onValue(foodRef, (snapshot) => {
        const data = snapshot.val()
        console.log('Firebase Store: Datos de alimentos recibidos de Firebase:', data)
        
        if (data) {
          // Convertir objeto a array
          const foodArray = Object.values(data)
          foodRegistry.value = foodArray
          
          // Actualizar copia en localStorage
          localStorage.setItem('foodRegistry', JSON.stringify(foodArray))
        } else {
          console.log('Firebase Store: No hay datos de alimentos para esta sesión')
          
          // Intentar cargar desde localStorage como fallback
          const localData = localStorage.getItem('foodRegistry')
          if (localData) {
            try {
              foodRegistry.value = JSON.parse(localData)
              console.log('Firebase Store: Datos de alimentos cargados desde localStorage')
            } catch (error) {
              console.error('Error al parsear datos de alimentos de localStorage:', error)
            }
          }
        }
        
        resolve(foodRegistry.value)
      })
    })
  }
  
  // Cargar datos automáticamente al inicializar el store
  if (sessionId.value) {
    loadUserData()
  }

  return {
    // Estado
    userData,
    isUserDataLoaded,
    sessionId,
    foodRegistry,
    
    // Getters
    getUserData,
    getSessionId,
    isLoaded,
    getFoodRegistry,
    
    // Actions
    setSessionId,
    saveUserData,
    loadUserData,
    saveFoodRegistry,
    loadFoodRegistry
  }
})
