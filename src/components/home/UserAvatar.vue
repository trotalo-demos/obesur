<template>
  <div class="user-avatar">
    <!-- Avatar dinámico basado en los datos del usuario usando imágenes profesionales -->
    <img v-if="userData" alt="Avatar personalizado" class="avatar-image" :src="getUserAvatar">
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  defineOptions({
    name: 'UserAvatar',
  })

  // Props para recibir los datos del usuario
  const props = defineProps({
    userData: {
      type: Object,
      required: true,
    },
  })

  // Retorna una URL de imagen basada en las características del usuario
  const getUserAvatar = computed(() => {
    if (!props.userData) {
      return ''
    }

    // Imagen base por sexo
    const isFemale = props.userData.sex === 'female'

    // Seleccionar imagen según nivel de actividad y sexo
    if (props.userData.activityLevel === 'active') {
      return isFemale
        ? 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' // Mujer activa
        : 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' // Hombre activo
    } else if (props.userData.activityLevel === 'occasional') {
      return isFemale
        ? 'https://images.unsplash.com/photo-1579126038374-6064e9370f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' // Mujer moderada
        : 'https://images.unsplash.com/photo-1560233026-ad254fa8da63?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' // Hombre moderado
    } else {
      return isFemale
        ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' // Mujer sedentaria
        : 'https://images.unsplash.com/photo-1580465446361-8aae5321522b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' // Hombre sedentario
    }
  })
</script>

<style scoped>
.user-avatar {
  display: inline-block;
  text-align: center;
}

.avatar-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
