<template>
  <div class="user-panel" :class="{ open: isOpen }">
    <button class="panel-toggle" @click="togglePanel" :class="{ active: isOpen }">
      <X v-if="isOpen" :size="20" />
      <div v-else-if="user" class="user-avatar">
        {{ userInitial }}
      </div>
      <User v-else :size="20" />
    </button>

    <div v-if="isOpen" class="panel-content">
      
      <div v-if="user" class="authenticated-view">
        <div class="user-header">
          <div class="large-avatar">{{ userInitial }}</div>
          <div class="user-info">
            <span class="user-name">{{ user.user_metadata?.username || 'Utilisateur' }}</span>
            <span class="user-email">{{ user.email }}</span>
          </div>
        </div>

        <div class="divider"></div>

        <button @click="handleLogout" class="action-btn logout-btn">
          <LogOut :size="16" />
          Se déconnecter
        </button>
      </div>

      <div v-else class="auth-view">
        <h2>{{ isLoginMode ? 'Connexion' : 'Créer un compte' }}</h2>
        
        <form @submit.prevent="handleSubmit" class="auth-form">
          
          <div v-if="!isLoginMode" class="input-group">
            <User :size="16" class="input-icon" />
            <input 
              v-model="username" 
              type="text" 
              placeholder="Nom d'utilisateur" 
              required
              minlength="3"
            />
          </div>

          <div class="input-group">
            <Mail :size="16" class="input-icon" />
            <input 
              v-model="email" 
              type="email" 
              placeholder="Email" 
              required
            />
          </div>

          <div class="input-group">
            <Lock :size="16" class="input-icon" />
            <input 
              v-model="password" 
              type="password" 
              placeholder="Mot de passe" 
              required
              minlength="6"
            />
          </div>

          <div v-if="errorMsg" class="error-message">
            {{ errorMsg }}
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="!loading">{{ isLoginMode ? 'Se connecter' : "S'inscrire" }}</span>
            <span v-else class="loader">...</span>
          </button>
        </form>

        <div class="auth-footer">
          <p v-if="isLoginMode">
            Pas encore de compte ? 
            <a href="#" @click.prevent="toggleAuthMode">S'inscrire</a>
          </p>
          <p v-else>
            Déjà un compte ? 
            <a href="#" @click.prevent="toggleAuthMode">Se connecter</a>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { User, X, LogOut, Mail, Lock } from 'lucide-vue-next'
import { useUserStore } from '../../stores/userStore'

// --- INIT STORE ---
const userStore = useUserStore()

// --- ETAT LOCAL UI ---
const isOpen = ref(false)
const isLoginMode = ref(true) // true = Login, false = Inscription
const loading = ref(false)
const errorMsg = ref('')

// Champs de formulaire
const username = ref('')
const email = ref('')
const password = ref('')

// --- ETAT UTILISATEUR ---
// On observe l'utilisateur global géré par Supabase
const user = computed(() => userStore.user)

// Calcul de l'initiale pour l'avatar
const userInitial = computed(() => {
  const name = user.value?.user_metadata?.username || user.value?.email
  return name ? name.charAt(0).toUpperCase() : '?'
})

// --- ACTIONS UI ---

function togglePanel() {
  isOpen.value = !isOpen.value
  errorMsg.value = ''
}

function toggleAuthMode() {
  isLoginMode.value = !isLoginMode.value
  errorMsg.value = ''
  if (isLoginMode.value) username.value = ''
}

// --- ACTIONS AUTHENTIFICATION ---

async function handleSubmit() {
  loading.value = true
  errorMsg.value = ''

  try {
    if (isLoginMode.value) {
      // Connexion via le Store (Supabase)
      await userStore.signIn(email.value, password.value)
    } else {
      // Inscription via le Store (Supabase)
      await userStore.signUp(email.value, password.value, username.value)
    }
    
    // Si succès, on ferme le panel
    isOpen.value = false
    
    // Reset des champs sensible
    password.value = ''
    
  } catch (error) {
    console.error(error)
    // On affiche le message d'erreur renvoyé par Supabase ou un message par défaut
    errorMsg.value = error.message || "Erreur d'authentification"
  } finally {
    loading.value = false
  }
}

async function handleLogout() {
  try {
    await userStore.logout()
    isOpen.value = false
    // Reset complet du formulaire
    email.value = ''
    password.value = ''
    username.value = ''
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error)
  }
}
</script>

<style scoped>
/* Positionnement : En dessous du bouton Settings */
.user-panel {
  position: fixed;
  top: 70px;
  right: 16px;
  z-index: 1000;
}

.panel-toggle {
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

.panel-toggle:hover, .panel-toggle.active {
  background: var(--bg-tertiary);
  border-color: var(--accent);
}

.user-avatar {
  width: 24px;
  height: 24px;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Le contenu déroulant */
.panel-content {
  position: absolute;
  top: 52px;
  right: 0;
  width: 300px;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 20px var(--shadow);
  animation: slideIn 0.2s ease-out;
  transform-origin: top right;
}

@keyframes slideIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

h2 {
  margin: 0 0 20px 0;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

/* Formulaire */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: var(--text-secondary);
  pointer-events: none;
}

.input-group input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 6px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input-group input:focus {
  border-color: var(--accent);
}

.submit-btn {
  margin-top: 8px;
  padding: 10px;
  background: var(--accent);
  border: none;
  color: white;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent-hover);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
}

.auth-footer a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.error-message {
  color: #ef4444;
  font-size: 13px;
  text-align: center;
  background: rgba(239, 68, 68, 0.1);
  padding: 8px;
  border-radius: 4px;
}

/* Vue Connecté */
.user-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.large-avatar {
  width: 64px;
  height: 64px;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  font-size: 28px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.user-info {
  text-align: center;
}

.user-name {
  display: block;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 18px;
}

.user-email {
  display: block;
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 4px;
}

.divider {
  height: 1px;
  background: var(--border);
  margin: 0 0 16px 0;
}

.action-btn {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-tertiary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  font-size: 14px;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
}
</style>