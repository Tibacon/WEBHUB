import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../constants/index'

export const useUserStore = defineStore('user', () => {
  // --- STATE ---
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)

  // --- GETTERS ---
  // Vérifie si l'utilisateur est connecté si l'objet user existe
  const isAuthenticated = computed(() => !!user.value)
  
  // Récupère le username stocké dans les métadonnées Supabase
  const username = computed(() => user.value?.user_metadata?.username || '')

  // --- ACTIONS ---

  /**
   * Initialise la session au chargement de l'app
   */
  async function loadUser() {
    loading.value = true
    
    // 1. Récupérer la session actuelle
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      session.value = data.session
      user.value = data.session.user
    }

    // 2. Écouter les changements
    supabase.auth.onAuthStateChange((_event, _session) => {
      session.value = _session
      user.value = _session ? _session.user : null
    })
    
    loading.value = false
  }

  /**
   * Création de compte (Sign Up)
   */
  async function signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: name // Stocké dans user_metadata.username
        }
      }
    })

    if (error) throw error
    if (data.user) {
      user.value = data.user
      session.value = data.session
    }
  }

  /**
   * Connexion (Sign In)
   */
  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error) throw error
    
    user.value = data.user
    session.value = data.session
  }

  /**
   * Déconnexion (Sign Out)
   */
  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    user.value = null
    session.value = null
  }

  return {
    user,
    username,
    isAuthenticated,
    loading,
    loadUser,
    signUp,
    signIn,
    logout
  }
})