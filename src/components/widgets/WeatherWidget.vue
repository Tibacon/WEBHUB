<template>
  <div class="weather-widget">
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="weather" class="weather-content">
      <component :is="getWeatherIcon(weather.weather[0].main)" class="weather-icon" :size="64" :stroke-width="1.5" />
      <div class="weather-temp">{{ Math.round(weather.main.temp) }}°C</div>
      <div class="weather-description">{{ weather.weather[0].description }}</div>
      <div class="weather-details">
        <span class="weather-detail"><Droplets :size="16" /> {{ weather.main.humidity }}%</span>
        <span class="weather-detail"><Wind :size="16" /> {{ Math.round(weather.wind.speed * 3.6) }} km/h</span>
      </div>
      <div class="weather-location">{{ weather.name }}, {{ weather.sys.country }}</div>
    </div>
    <div v-else class="setup">
      <p>Entrez une ville :</p>
      <input
        v-model="cityInput"
        @keyup.enter="fetchWeather"
        placeholder="ex: Paris"
      />
      <button @click="fetchWeather">Rechercher</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWidgetsStore } from '../../stores/widgetsStore'
import { Sun, Cloud, CloudRain, CloudDrizzle, CloudLightning, CloudSnow, CloudFog, Droplets, Wind } from 'lucide-vue-next'

const props = defineProps({
  widget: {
    type: Object,
    required: true
  }
})

const widgetsStore = useWidgetsStore()
const weather = ref(null)
const loading = ref(false)
const error = ref(null)
const cityInput = ref('')

onMounted(() => {
  if (props.widget.data?.city) {
    cityInput.value = props.widget.data.city
    fetchWeather()
  }
})

async function fetchWeather() {
  if (!cityInput.value) return

  loading.value = true
  error.value = null

  try {
    // Utilisation de l'API gratuite wttr.in (pas de clé nécessaire)
    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(cityInput.value)}?format=j1`
    )

    if (!response.ok) throw new Error('Ville non trouvée')

    const data = await response.json()

    // Adapter le format wttr.in au format attendu
    weather.value = {
      name: cityInput.value,
      sys: { country: data.nearest_area[0].country[0].value },
      main: {
        temp: parseFloat(data.current_condition[0].temp_C),
        humidity: parseInt(data.current_condition[0].humidity)
      },
      wind: {
        speed: parseFloat(data.current_condition[0].windspeedKmph) / 3.6
      },
      weather: [{
        main: getConditionFromCode(data.current_condition[0].weatherCode),
        description: data.current_condition[0].weatherDesc[0].value
      }]
    }

    widgetsStore.updateWidgetData(props.widget.id, {
      city: cityInput.value,
      lastUpdate: Date.now()
    })
  } catch (err) {
    error.value = 'Erreur de connexion ou ville non trouvée'
  } finally {
    loading.value = false
  }
}

function getConditionFromCode(code) {
  const conditions = {
    113: 'Clear',
    116: 'Clouds',
    119: 'Clouds',
    122: 'Clouds',
    143: 'Mist',
    176: 'Rain',
    179: 'Snow',
    182: 'Rain',
    185: 'Rain',
    200: 'Thunderstorm',
    227: 'Snow',
    230: 'Snow',
    248: 'Fog',
    260: 'Fog',
    263: 'Drizzle',
    266: 'Drizzle',
    281: 'Rain',
    284: 'Rain',
    293: 'Rain',
    296: 'Rain',
    299: 'Rain',
    302: 'Rain',
    305: 'Rain',
    308: 'Rain',
    311: 'Rain',
    314: 'Rain',
    317: 'Rain',
    320: 'Snow',
    323: 'Snow',
    326: 'Snow',
    329: 'Snow',
    332: 'Snow',
    335: 'Snow',
    338: 'Snow',
    350: 'Rain',
    353: 'Rain',
    356: 'Rain',
    359: 'Rain',
    362: 'Rain',
    365: 'Rain',
    368: 'Snow',
    371: 'Snow',
    374: 'Rain',
    377: 'Rain',
    386: 'Thunderstorm',
    389: 'Thunderstorm',
    392: 'Thunderstorm',
    395: 'Snow'
  }
  return conditions[code] || 'Clouds'
}

function getWeatherIcon(condition) {
  const icons = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
    Drizzle: CloudDrizzle,
    Thunderstorm: CloudLightning,
    Snow: CloudSnow,
    Mist: CloudFog,
    Fog: CloudFog
  }
  return icons[condition] || Cloud
}
</script>

<style scoped>
.weather-widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  overflow: hidden;
}

.weather-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  overflow-y: auto;
}

.weather-icon {
  color: #fbbf24;
}

.weather-temp {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
}

.weather-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: capitalize;
}

.weather-details {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.weather-detail {
  display: flex;
  align-items: center;
  gap: 4px;
}

.weather-location {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.setup {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  overflow-y: auto;
}

.setup p {
  color: var(--text-primary);
  margin: 0;
  font-size: 14px;
}

.setup input {
  padding: 8px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 6px;
  outline: none;
}

.setup input:focus {
  border-color: var(--accent);
}

.setup button {
  padding: 8px 12px;
  background: var(--accent);
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.setup button:hover {
  background: var(--accent-hover);
}

.loading {
  color: var(--text-secondary);
  font-size: 14px;
}

.error {
  color: #ef4444;
  font-size: 14px;
}
</style>
