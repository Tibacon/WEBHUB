<template>
  <div class="quotes-widget">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else class="quote-container">
      <svg class="quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor" opacity="0.2"/>
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h2v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor" opacity="0.2"/>
      </svg>

      <p class="quote-text">{{ quote.content }}</p>

      <div class="quote-author">
        <div class="author-line"></div>
        <span>{{ quote.author }}</span>
      </div>
    </div>

    <button @click="fetchNewQuote" class="refresh-btn" :disabled="loading">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
      </svg>
      Nouvelle citation
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
const quote = ref({ content: '', author: '' })
const loading = ref(false)
const error = ref(null)

onMounted(() => {
  // Charger depuis le cache si disponible
  if (props.widget.data?.quote) {
    quote.value = props.widget.data.quote
  } else {
    fetchNewQuote()
  }
})

// Liste de citations pré-définies comme fallback
const defaultQuotes = [
  { content: "La vie est ce qui arrive pendant que vous êtes occupé à faire d'autres projets.", author: "John Lennon" },
  { content: "Le succès n'est pas final, l'échec n'est pas fatal : c'est le courage de continuer qui compte.", author: "Winston Churchill" },
  { content: "La seule façon de faire du bon travail est d'aimer ce que vous faites.", author: "Steve Jobs" },
  { content: "L'innovation distingue un leader d'un suiveur.", author: "Steve Jobs" },
  { content: "Le futur appartient à ceux qui croient en la beauté de leurs rêves.", author: "Eleanor Roosevelt" },
  { content: "Soyez vous-même ; tous les autres sont déjà pris.", author: "Oscar Wilde" },
  { content: "La meilleure façon de prédire l'avenir est de le créer.", author: "Peter Drucker" },
  { content: "Ce qui ne nous tue pas nous rend plus fort.", author: "Friedrich Nietzsche" },
  { content: "Le changement est la loi de la vie.", author: "John F. Kennedy" },
  { content: "Chaque expert a été un jour un débutant.", author: "Helen Hayes" }
]

async function fetchNewQuote() {
  loading.value = true
  error.value = null

  try {
    const response = await fetch('https://zenquotes.io/api/random')
    if (!response.ok) throw new Error('Erreur de chargement')

    const data = await response.json()
    quote.value = {
      content: data[0].q,
      author: data[0].a
    }

    // Sauvegarder dans le cache
    widgetsStore.updateWidgetData(props.widget.id, {
      quote: quote.value
    })
  } catch (err) {
    console.error('Error fetching quote:', err)
    // Utiliser une citation aléatoire par défaut
    const randomQuote = defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)]
    quote.value = randomQuote

    widgetsStore.updateWidgetData(props.widget.id, {
      quote: quote.value
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.quotes-widget {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 100%;
  padding: 24px;
  text-align: center;
}

.loading-state,
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
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

.quote-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 100%;
}

.quote-icon {
  color: var(--accent);
  opacity: 0.3;
}

.quote-text {
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.6;
  font-weight: 400;
  font-style: italic;
  margin: 0;
}

.quote-author {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
}

.author-line {
  width: 32px;
  height: 1px;
  background: var(--border-hover);
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: auto;
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
</style>
