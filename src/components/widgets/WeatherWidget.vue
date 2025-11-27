<template>
  <div class="weather-widget">
    <div class="weather-icon">🌤️</div>
    <div class="weather-temp">22°C</div>
    <div class="weather-description">Partiellement nuageux</div>
    <div class="weather-location">Paris, France</div>
  </div>
</template>

<script setup>
// Widget météo - À connecter à une API plus tard
defineProps({
  widget: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.weather-widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
}

.weather-icon {
  font-size: 64px;
}

.weather-temp {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
}

.weather-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.weather-location {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
