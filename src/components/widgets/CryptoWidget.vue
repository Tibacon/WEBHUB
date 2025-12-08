<template>
  <div class="crypto-widget">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      Chargement des prix...
    </div>

    <div v-else-if="error" class="error-state">
      {{ error }}
    </div>

    <div v-else class="crypto-list">
      <div
        v-for="crypto in cryptoData"
        :key="crypto.id"
        class="crypto-item"
      >
        <div class="crypto-info">
          <div class="crypto-symbol">{{ crypto.symbol }}</div>
          <div class="crypto-name">{{ crypto.name }}</div>
        </div>
        <div class="crypto-price">
          <div class="price">${{ formatPrice(crypto.price) }}</div>
          <div
            class="change"
            :class="{ positive: crypto.change >= 0, negative: crypto.change < 0 }"
          >
            {{ crypto.change >= 0 ? '+' : '' }}{{ crypto.change.toFixed(2) }}%
          </div>
        </div>
      </div>
    </div>

    <button @click="refreshCrypto" class="refresh-btn" :disabled="loading">
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
const cryptoData = ref([])
const loading = ref(false)
const error = ref(null)

// Top cryptos à suivre
const CRYPTO_IDS = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana']

onMounted(() => {
  // Charger depuis le cache si disponible
  if (props.widget.data?.crypto && props.widget.data?.lastUpdate) {
    const lastUpdate = new Date(props.widget.data.lastUpdate)
    const now = new Date()
    const diffMinutes = (now - lastUpdate) / 1000 / 60

    if (diffMinutes < 5) {
      cryptoData.value = props.widget.data.crypto
      return
    }
  }

  fetchCrypto()
})

async function fetchCrypto() {
  loading.value = true
  error.value = null

  try {
    // CoinGecko API (gratuite, pas de clé requise)
    const ids = CRYPTO_IDS.join(',')
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
    )

    if (!response.ok) throw new Error('Erreur de chargement')

    const data = await response.json()

    // Mapping des noms complets
    const nameMap = {
      bitcoin: { name: 'Bitcoin', symbol: 'BTC' },
      ethereum: { name: 'Ethereum', symbol: 'ETH' },
      binancecoin: { name: 'BNB', symbol: 'BNB' },
      cardano: { name: 'Cardano', symbol: 'ADA' },
      solana: { name: 'Solana', symbol: 'SOL' }
    }

    cryptoData.value = Object.entries(data).map(([id, values]) => ({
      id,
      name: nameMap[id].name,
      symbol: nameMap[id].symbol,
      price: values.usd,
      change: values.usd_24h_change || 0
    }))

    // Sauvegarder dans le cache
    widgetsStore.updateWidgetData(props.widget.id, {
      crypto: cryptoData.value,
      lastUpdate: new Date().toISOString()
    })
  } catch (err) {
    console.error('Error fetching crypto:', err)
    error.value = 'Impossible de charger les prix'
  } finally {
    loading.value = false
  }
}

function refreshCrypto() {
  fetchCrypto()
}

function formatPrice(price) {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { maximumFractionDigits: 0 })
  } else if (price >= 1) {
    return price.toLocaleString('en-US', { maximumFractionDigits: 2 })
  } else {
    return price.toLocaleString('en-US', { maximumFractionDigits: 4 })
  }
}
</script>

<style scoped>
.crypto-widget {
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

.crypto-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.crypto-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.crypto-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--border-hover);
}

.crypto-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.crypto-symbol {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.crypto-name {
  color: var(--text-tertiary);
  font-size: 11px;
}

.crypto-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.price {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.change {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
}

.change.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.change.negative {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
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
.crypto-widget::-webkit-scrollbar {
  width: 6px;
}

.crypto-widget::-webkit-scrollbar-track {
  background: transparent;
}

.crypto-widget::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.crypto-widget::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
