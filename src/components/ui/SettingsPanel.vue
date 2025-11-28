<template>
  <div class="settings-panel" :class="{ open: isOpen }">
    <button class="settings-toggle" @click="togglePanel">
      <span v-if="!isOpen">⚙️</span>
      <span v-else>✕</span>
    </button>

    <div v-if="isOpen" class="settings-content">
      <h2>Paramètres</h2>

      <section class="settings-section">
        <h3>Ajouter un widget</h3>
        <div class="widget-buttons">
          <button @click="addWidget('clock')">🕐 Horloge</button>
          <button @click="addWidget('todo')">✓ To-Do</button>
          <button @click="addWidget('notes')">📝 Notes</button>
          <button @click="addWidget('weather')">🌤️ Météo</button>
          <button @click="addWidget('news')">📰 Actualités</button>
          <button @click="addWidget('calendar')">📅 Calendrier</button>
        </div>
      </section>

      <section class="settings-section">
        <h3>Fond d'écran</h3>
        <div class="background-input-group">
          <input
            v-model="backgroundUrl"
            type="text"
            placeholder="URL de l'image..."
            @keyup.enter="applyBackground"
          />
          <button @click="applyBackground" class="apply-btn">Appliquer</button>
        </div>
        <button @click="removeBackground" class="remove-bg-btn">Retirer le fond</button>

        <div class="preset-backgrounds">
          <button
            v-for="preset in presetBackgrounds"
            :key="preset.name"
            @click="setPresetBackground(preset.url)"
            class="preset-btn"
            :style="{ backgroundImage: `url(${preset.url})` }"
          >
            {{ preset.name }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWidgetsStore } from '../../stores/widgetsStore'
import { useThemeStore } from '../../stores/themeStore'

const widgetsStore = useWidgetsStore()
const themeStore = useThemeStore()

const isOpen = ref(false)
const backgroundUrl = ref('')

const presetBackgrounds = [
  {
    name: 'Montagne',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'
  },
  {
    name: 'Océan',
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80'
  },
  {
    name: 'Forêt',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80'
  },
  {
    name: 'Ville',
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80'
  }
]

function togglePanel() {
  isOpen.value = !isOpen.value
}

function addWidget(type) {
  widgetsStore.addWidget(type)
}

function applyBackground() {
  if (backgroundUrl.value) {
    themeStore.setBackground(backgroundUrl.value)
    backgroundUrl.value = ''
  }
}

function setPresetBackground(url) {
  themeStore.setBackground(url)
}

function removeBackground() {
  themeStore.setBackground('')
}
</script>

<style scoped>
.settings-panel {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
}

.settings-toggle {
  position: absolute;
  top: 0;
  right: 0;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 2px 8px var(--shadow);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-toggle:hover {
  background: var(--bg-tertiary);
  border-color: var(--accent);
}

.settings-content {
  position: absolute;
  top: 52px;
  right: 0;
  width: 300px;
  max-height: 80vh;
  overflow-y: auto;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 20px var(--shadow);
}

.settings-content h2 {
  margin: 0 0 16px 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
}

.settings-section {
  margin-bottom: 20px;
}

.settings-section:last-child {
  margin-bottom: 0;
}

.settings-section h3 {
  margin: 0 0 10px 0;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.widget-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.widget-buttons button {
  padding: 10px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
}

.widget-buttons button:hover {
  background: var(--bg-primary);
  border-color: var(--accent);
}

.background-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.background-input-group input {
  flex: 1;
  padding: 10px 12px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 6px;
  outline: none;
  font-size: 13px;
  transition: border-color 0.2s;
}

.background-input-group input:focus {
  border-color: var(--accent);
}

.background-input-group input::placeholder {
  color: var(--text-secondary);
}

.apply-btn {
  padding: 10px 16px;
  background: var(--accent);
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.apply-btn:hover {
  background: var(--accent-hover);
}

.remove-bg-btn {
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 10px;
}

.remove-bg-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
}

.preset-backgrounds {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.preset-btn {
  height: 56px;
  background-size: cover;
  background-position: center;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-weight: 500;
  font-size: 12px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  transition: all 0.2s;
}

.preset-btn:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}
</style>
