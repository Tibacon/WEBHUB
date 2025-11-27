import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const username = ref('')
  const isAuthenticated = ref(false)

  // Charger l'utilisateur depuis localStorage
  function loadUser() {
    const savedUser = localStorage.getItem('webhub_user')
    if (savedUser) {
      const user = JSON.parse(savedUser)
      username.value = user.username
      isAuthenticated.value = true
    }
  }

  // Connexion (pour l'instant juste local, pas de backend)
  function login(name) {
    username.value = name
    isAuthenticated.value = true
    localStorage.setItem('webhub_user', JSON.stringify({ username: name }))
  }

  // Déconnexion
  function logout() {
    username.value = ''
    isAuthenticated.value = false
    localStorage.removeItem('webhub_user')
  }

  return {
    username,
    isAuthenticated,
    loadUser,
    login,
    logout
  }
})
