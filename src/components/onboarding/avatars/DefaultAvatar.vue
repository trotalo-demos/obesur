<template>
  <div class="default-avatar">
    <img alt="Avatar por defecto" class="avatar-image" :src="avatarImage">
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  // Avatar básico para las pantallas iniciales con imagen profesional de Unsplash
  defineOptions({
    name: 'DefaultAvatar',
  })

  // Imagen profesional de Unsplash relacionada con salud y bienestar
  const avatarImage = ref('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80')

  defineExpose({})
</script>

<style scoped>
  .default-avatar {
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
