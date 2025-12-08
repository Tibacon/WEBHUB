<template>
  <div class="news-widget">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      Chargement des actualités...
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else class="news-list">
      <a
        v-for="article in newsItems"
        :key="article.url"
        :href="article.url"
        target="_blank"
        rel="noopener noreferrer"
        class="news-item"
      >
        <div class="news-content">
          <div class="news-title">{{ article.title }}</div>
          <div class="news-meta">
            <span class="news-source">{{ article.source }}</span>
            <span class="news-time">{{ formatTime(article.publishedAt) }}</span>
          </div>
        </div>
      </a>
    </div>

    <button @click="refreshNews" class="refresh-btn" :disabled="loading">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
      </svg>
      Actualiser
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWidgetsStore } from '../../stores/widgetsStore'

const props = defineProps({
  widget: {
    type: Object,
    required: true
  }
})

const widgetsStore = useWidgetsStore()
const newsItems = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(() => {
  // Charger depuis le cache si disponible
  if (props.widget.data?.news && props.widget.data?.lastUpdate) {
    const lastUpdate = new Date(props.widget.data.lastUpdate)
    const now = new Date()
    const diffMinutes = (now - lastUpdate) / 1000 / 60

    if (diffMinutes < 30) {
      newsItems.value = props.widget.data.news
      return
    }
  }

  fetchNews()
})

async function fetchNews() {
  loading.value = true
  error.value = null

  try {
    // Utiliser l'API Hacker News (gratuite, pas de clé requise)
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    if (!response.ok) throw new Error('Erreur de chargement')

    const storyIds = await response.json()
    const topStories = storyIds.slice(0, 10)

    const articles = await Promise.all(
      topStories.map(async (id) => {
        const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        return storyRes.json()
      })
    )

    newsItems.value = articles
      .filter(article => article && article.title && article.url)
      .map(article => ({
        title: article.title,
        url: article.url,
        source: new URL(article.url).hostname.replace('www.', ''),
        publishedAt: new Date(article.time * 1000).toISOString()
      }))

    // Sauvegarder dans le cache
    widgetsStore.updateWidgetData(props.widget.id, {
      news: newsItems.value,
      lastUpdate: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error fetching news:', err)
    error.value = 'Impossible de charger les actualités'
  } finally {
    loading.value = false
  }
}

function refreshNews() {
  fetchNews()
}

function formatTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  return `${diffDays}j`
}
</script>

<style scoped>
.news-widget {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow-y: auto;
  min-height: 0;
  padding: 4px;
}

.loading-state,
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px;
  color: var(--text-secondary);
  font-size: 14px;
}

.error-state {
  color: #ef4444;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.news-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  flex-shrink: 0;
}

.news-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-hover);
  transform: translateX(4px);
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.news-title {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.news-source {
  color: var(--text-tertiary);
}

.news-time {
  color: var(--text-tertiary);
}

.news-time::before {
  content: '•';
  margin-right: 8px;
  color: var(--border-hover);
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: auto;
  flex-shrink: 0;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent);
  color: var(--accent);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-btn svg {
  transition: transform 0.3s;
}

.refresh-btn:hover:not(:disabled) svg {
  transform: rotate(180deg);
}

/* Scrollbar styling */
.news-widget::-webkit-scrollbar {
  width: 6px;
}

.news-widget::-webkit-scrollbar-track {
  background: transparent;
}

.news-widget::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.news-widget::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
