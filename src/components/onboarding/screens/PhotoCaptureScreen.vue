<template>
  <div class="photo-capture-screen">
    <v-card-title class="text-center text-h5 font-weight-bold pb-2">
      Necesitamos algunas fotos de referencia
    </v-card-title>

    <v-card-text>
      <p class="text-body-1 text-center mb-4">
        Para que nuestro equipo médico pueda personalizar mejor tu programa, necesitamos algunas fotos de referencia.
      </p>

      <v-row>
        <v-col cols="12" md="6" class="mb-4">
          <v-card class="photo-card" :class="{ 'photo-captured': selfiePhoto }">
            <v-card-title class="text-center">Selfie</v-card-title>
            <v-card-text class="text-center">
              <div class="photo-placeholder" v-if="!selfiePhoto">
                <v-icon size="64" color="grey">mdi-face</v-icon>
                <p class="mt-2">Una foto frontal de tu rostro</p>
              </div>
              <div class="photo-preview" v-else>
                <img :src="selfiePhoto" alt="Selfie capturada" class="captured-photo">
              </div>
              <v-btn
                color="primary"
                class="mt-4"
                @click="capturePhoto('selfie')"
                :disabled="isCapturing"
              >
                {{ selfiePhoto ? 'Tomar otra' : 'Capturar selfie' }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6" class="mb-4">
          <v-card class="photo-card" :class="{ 'photo-captured': fullBodyPhoto }">
            <v-card-title class="text-center">Cuerpo completo</v-card-title>
            <v-card-text class="text-center">
              <div class="photo-placeholder" v-if="!fullBodyPhoto">
                <v-icon size="64" color="grey">mdi-human-full</v-icon>
                <p class="mt-2">Una foto de cuerpo completo</p>
              </div>
              <div class="photo-preview" v-else>
                <img :src="fullBodyPhoto" alt="Foto de cuerpo completo" class="captured-photo">
              </div>
              <v-btn
                color="primary"
                class="mt-4"
                @click="capturePhoto('fullBody')"
                :disabled="isCapturing"
              >
                {{ fullBodyPhoto ? 'Tomar otra' : 'Capturar foto' }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Video capture element (hidden until needed) -->
      <v-dialog v-model="showCamera" max-width="600">
        <v-card>
          <v-card-title class="text-center">
            {{ currentCaptureMode === 'selfie' ? 'Captura tu selfie' : 'Captura cuerpo completo' }}
          </v-card-title>
          <v-card-text class="text-center">
            <video ref="videoElement" class="video-capture" autoplay playsinline></video>
            <canvas ref="canvasElement" style="display: none;"></canvas>
            <p v-if="currentCaptureMode === 'fullBody'" class="text-caption mt-2">
              Para mejor resultado, coloca el celular a distancia o pide a alguien que te ayude.
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

<script lang="ts">
  export default {
    name: 'PhotoCaptureScreen',
  }
</script>

<script setup lang="ts">
  import { computed, onUnmounted, ref } from 'vue'

  defineOptions({
    name: 'PhotoCaptureScreen',
  })

  defineExpose({
    // Propiedades y métodos expuestos si es necesario
  })

  const emit = defineEmits(['update-selfie-photo', 'update-full-body-photo', 'continue'])

  // Estado para las fotos
  const selfiePhoto = ref('')
  const fullBodyPhoto = ref('')
  const showCamera = ref(false)
  const isCapturing = ref(false)
  const currentCaptureMode = ref('selfie') // 'selfie' o 'fullBody'

  // Referencias para elementos del DOM
  const videoElement = ref<HTMLVideoElement | null>(null)
  const canvasElement = ref<HTMLCanvasElement | null>(null)
  let mediaStream: MediaStream | null = null

  // Comprobar si ambas fotos han sido tomadas
  const isValid = computed(() => {
    return selfiePhoto.value !== '' && fullBodyPhoto.value !== ''
  })

  // Capturar una foto (abrir cámara)
  const capturePhoto = async (mode: 'selfie' | 'fullBody') => {
    currentCaptureMode.value = mode
    isCapturing.value = true
    showCamera.value = true

    try {
      // Usar cámara frontal para selfie, y trasera para foto de cuerpo completo si está disponible
      const facingMode = mode === 'selfie' ? 'user' : 'environment'

      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
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
      isCapturing.value = false
      alert('No se pudo acceder a la cámara. Por favor, verifica que has dado los permisos necesarios.')
    }
  }

  // Tomar la foto
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

        // Guardar la imagen según el modo actual
        if (currentCaptureMode.value === 'selfie') {
          selfiePhoto.value = imageDataUrl
          emit('update-selfie-photo', imageDataUrl)
        } else {
          fullBodyPhoto.value = imageDataUrl
          emit('update-full-body-photo', imageDataUrl)
        }
      }

      // Cerrar la cámara
      closeCamera()
    }
  }

  // Cerrar la cámara
  const closeCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
      mediaStream = null
    }

    if (videoElement.value) {
      videoElement.value.srcObject = null
    }

    showCamera.value = false
    isCapturing.value = false
  }

  // Continuar al siguiente paso
  const validateAndContinue = () => {
    if (isValid.value) {
      emit('continue')
    }
  }

  // Limpiar al desmontar
  onUnmounted(() => {
    closeCamera()
  })
</script>

<style scoped>
  .photo-capture-screen {
    min-height: 400px;
  }

  .photo-card {
    height: 100%;
    transition: all 0.3s;
    border: 2px solid transparent;
  }

  .photo-card.photo-captured {
    border: 2px solid #4CAF50;
  }

  .photo-placeholder {
    padding: 20px;
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .photo-preview {
    text-align: center;
    margin-bottom: 16px;
  }

  .captured-photo {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .video-capture {
    width: 100%;
    max-height: 50vh;
    border-radius: 8px;
    background-color: #000;
  }
</style>
