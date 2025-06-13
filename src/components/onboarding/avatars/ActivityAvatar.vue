<template>
  <div class="activity-avatar">
    <img alt="Avatar de actividad" class="avatar-image" :src="activityAvatarSrc">
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  defineOptions({
    name: 'ActivityAvatar',
  })

  // Props para recibir el nivel de actividad
  const props = defineProps({
    activityLevel: {
      type: String,
      required: true,
      validator: function (value: string) {
        return ['sedentary', 'occasional', 'active'].includes(value)
      },
    },
  })

  // Seleccionar la ruta de imagen adecuada según el nivel de actividad con imágenes profesionales de Unsplash
  const activityAvatarSrc = computed(() => {
    switch (props.activityLevel) {
      case 'active': {
        // Persona activa haciendo ejercicio
        return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
      case 'occasional': {
        // Persona con actividad moderada
        return 'https://images.unsplash.com/photo-1579126038374-6064e9370f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
      default: {
        // Persona con estilo de vida sedentario
        return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    }
  })
</script>

<style scoped>
  .activity-avatar {
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
