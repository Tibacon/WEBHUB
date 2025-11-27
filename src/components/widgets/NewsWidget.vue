<template>
  <div class="news-widget">
    <div class="news-item" v-for="news in newsItems" :key="news.id">
      <div class="news-title">{{ news.title }}</div>
      <div class="news-source">{{ news.source }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  widget: {
    type: Object,
    required: true
  }
})

// Données de démonstration
const newsItems = ref([
  { id: 1, title: 'Nouvelle technologie Vue 3.5 annoncée', source: 'Tech News' },
  { id: 2, title: 'Les tendances web design 2025', source: 'Design Weekly' },
  { id: 3, title: 'JavaScript : Les nouveautés', source: 'Dev.to' }
])
</script>

<style scoped>
.news-widget {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow-y: auto;
}

.news-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.news-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.news-title {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.news-source {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
}
</style>
