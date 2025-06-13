<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title class="text-h5">
        Registro de Alimentos
      </v-card-title>

      <v-card-text>
        <v-container>
          <div v-if="!imageUrl && !analyzing && !results">
            <div class="text-center mb-4">
              Toma una foto de tu comida para analizarla
            </div>

            <v-row justify="center">
              <v-col cols="12" class="text-center">
                <v-btn
                  color="primary"
                  size="large"
                  rounded
                  @click="captureImage"
                >
                  <v-icon left>mdi-camera</v-icon>
                  Tomar Foto
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <div v-else-if="imageUrl && !analyzing && !results" class="text-center">
            <v-img
              :src="imageUrl"
              max-height="300"
              contain
              class="mb-4"
            ></v-img>

            <v-row>
              <v-col cols="6">
                <v-btn
                  color="error"
                  block
                  @click="resetImage"
                >
                  Tomar otra
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  color="success"
                  block
                  @click="analyzeImage"
                >
                  Analizar
                </v-btn>
              </v-col>
            </v-row>
          </div>

          <div v-else-if="analyzing" class="text-center py-8">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
            ></v-progress-circular>
            <div class="mt-4">
              Analizando la imagen con IA...
            </div>
          </div>

          <div v-else-if="results" class="mt-4">
            <h3 class="text-h6 mb-3">Alimentos detectados:</h3>
            <v-list>
              <v-list-item v-for="(item, i) in results.items" :key="i">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Cantidad: {{ item.quantity }}
                    <span v-if="item.estimatedGrams">
                      ({{ item.estimatedGrams }} g aprox.)
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <h3 class="text-h6 mt-4 mb-3">Información Nutricional (estimada):</h3>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>Nutriente</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Calorías</td>
                    <td>{{ results.nutrition.calories }} kcal</td>
                  </tr>
                  <tr>
                    <td>Proteínas</td>
                    <td>{{ results.nutrition.protein }} g</td>
                  </tr>
                  <tr>
                    <td>Carbohidratos</td>
                    <td>{{ results.nutrition.carbs }} g</td>
                  </tr>
                  <tr>
                    <td>Grasas</td>
                    <td>{{ results.nutrition.fats }} g</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="closeDialog"
        >
          Cerrar
        </v-btn>
        <v-btn
          v-if="results"
          color="success"
          @click="saveAndClose"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal de la cámara -->
  <v-dialog v-model="showCamera" max-width="600">
    <v-card>
      <v-card-title class="text-center">
        Captura tu comida
      </v-card-title>
      <v-card-text class="text-center">
        <video ref="videoElement" class="video-capture" autoplay playsinline></video>
        <canvas ref="canvasElement" style="display: none;"></canvas>
        <p class="text-caption mt-2">
          Toma la foto desde un ángulo que muestre bien todos los alimentos.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="takePicture">
          Tomar foto
          <v-icon end>mdi-camera</v-icon>
        </v-btn>
        <v-btn color="error" @click="closeCamera">
          Cancelar
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { useFirebaseStore } from '../../stores/firebase'
import OpenAI from 'openai'

const dialog = ref(false)
const imageUrl = ref('')
const analyzing = ref(false)
const results = ref(null)
const imageData = ref('')

// Referencias y estados para la cámara
const showCamera = ref(false)
const videoElement = ref<HTMLVideoElement | null>(null)
const canvasElement = ref<HTMLCanvasElement | null>(null)
let mediaStream: MediaStream | null = null

const emit = defineEmits(['save', 'close'])
const firebaseStore = useFirebaseStore()

// Función para abrir el diálogo
const open = () => {
  dialog.value = true
}

// Función para cerrar el diálogo
const closeDialog = () => {
  if (!analyzing.value) {
    resetForm()
    dialog.value = false
    emit('close')
  }
}

// Función para abrir la cámara
const captureImage = async () => {
  showCamera.value = true

  try {
    // Usar cámara trasera para mejor foto de comida
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })

    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream
    }
  } catch (error) {
    console.error('Error accediendo a la cámara:', error)
    showCamera.value = false
    alert('No se pudo acceder a la cámara. Por favor, verifica que has dado los permisos necesarios.')
  }
}

// Función para tomar la foto
const takePicture = () => {
  if (videoElement.value && canvasElement.value) {
    const video = videoElement.value
    const canvas = canvasElement.value

    // Establecer dimensiones del canvas igual al video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Dibujar la imagen actual del video en el canvas
    const context = canvas.getContext('2d')
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convertir a base64
      const imageDataUrl = canvas.toDataURL('image/jpeg')
      imageUrl.value = imageDataUrl

      // Guardamos la imagen en base64 para enviar a la API
      const base64Image = imageDataUrl.split(',')[1]
      imageData.value = base64Image
    }

    // Cerrar la cámara
    closeCamera()
  }
}

// Función para cerrar la cámara
const closeCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }

  if (videoElement.value) {
    videoElement.value.srcObject = null
  }

  showCamera.value = false
}

// Función para analizar la imagen con OpenAI utilizando el SDK oficial
const analyzeImage = async () => {
  if (!imageData.value) return

  analyzing.value = true
  try {
    // Obtenemos la API key de las variables de entorno
    const apiKey = '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'//import.meta.env.VITE_OPENAI_API_KEY

    // Verificamos que la API key exista
    if (!apiKey) {
      throw new Error('API key de OpenAI no encontrada. Verifica el archivo .env')
    }

    // Creamos una instancia del cliente OpenAI con la API key
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Para uso en el frontend
    })

    // Llamada a la API usando el SDK
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an expert in recognising individual food items and their quantity. Please provide the following information in a JSON format:

              1. Identify all food items in the image
              2. For countable items, give the count (number)
              3. For non-countable items, estimate the quantity in grams
              4. Estimate the nutrition information of all items combined

              Respond in this exact JSON format:
              {
                "items": [
                  {
                    "name": "food item name",
                    "quantity": "count or description",
                    "estimatedGrams": "estimated grams (if applicable)"
                  }
                ],
                "nutrition": {
                  "calories": "estimated total calories",
                  "protein": "estimated grams of protein",
                  "carbs": "estimated grams of carbohydrates",
                  "fats": "estimated grams of fat"
                }
              }`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageData.value}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" }
    })
    console.log(response)
    // Procesamos la respuesta del SDK
    if (response.choices && response.choices[0] && response.choices[0].message) {
      const content = response.choices[0].message.content
      if (content) {
        results.value = JSON.parse(content)
      } else {
        throw new Error('La respuesta no contiene contenido JSON')
      }
    } else {
      throw new Error('No se recibió respuesta válida del API')
    }
  } catch (error) {
    console.error('Error al analizar la imagen:', error)
    alert('Error al analizar la imagen. Por favor intenta nuevamente.')
  } finally {
    analyzing.value = false
  }
}

// Función para guardar los resultados
const saveAndClose = async () => {
  const foodData = {
    imageUrl: imageUrl.value,
    results: results.value,
    timestamp: new Date().toISOString(),
    mealType: 'unclassified' // Por defecto, se puede mejorar más adelante para que el usuario seleccione
  }

  // Guardar en Firebase
  try {
    await firebaseStore.saveFoodRegistry(foodData)
    emit('save', foodData)
    closeDialog()
  } catch (error) {
    console.error('Error al guardar registro de alimentos:', error)
    alert('Error al guardar. Por favor intenta nuevamente.')
  }
}

// Función para restablecer el formulario
const resetForm = () => {
  imageUrl.value = ''
  analyzing.value = false
  results.value = null
  imageData.value = ''
}

// Función para seleccionar otra imagen
const resetImage = () => {
  imageUrl.value = ''
  imageData.value = ''
  captureImage() // Abrimos la cámara nuevamente
}

// Exponemos métodos y propiedades
defineExpose({
  open,
  close: closeDialog,
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FoodRegisterModal',
})
</script>

<style scoped>
.video-capture {
  width: 100%;
  max-height: 50vh;
  border-radius: 8px;
  background-color: #000;
}
</style>
