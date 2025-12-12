# WEBHUB

Dashboard personnalisable avec widgets, synchronisation cloud et thèmes customisables.

## Table des matières
- [Objectif](#objectif)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Installation](#installation)
- [Wiki](#wiki)

## Objectif

### Français
Cette appli web vise à simplifier la navigation web en offrant une place où organiser ses pages web, informations importantes et quelconques autres ressources sous forme de widgets. Le but est avant tout de créer un outil que les utilisateurs peuvent utiliser à leur guise et selon leurs besoins, et non une structure rigide, ne servant qu'à une seule chose. La souplesse de son utilisation fera de **WEBHUB** une place parfaite pour regrouper ses pensées (dans le meilleur des mondes).

### English
This web application aims to simplify web browsing by providing a place to organize web pages, important information, and other resources in the form of widgets. The primary goal is to create a tool that users can use as they see fit and according to their needs, rather than a rigid structure serving only one purpose. Its flexibility will make **WEBHUB** a perfect place to gather your thoughts (in an ideal world).

## Fonctionnalités

- **8 widgets personnalisables** : Horloge, To-Do, Notes, Météo, Actualités, Calendrier, Citations, Crypto
- **Drag & Drop** : Réorganisez vos widgets librement
- **Redimensionnement flexible** : Ajustez la taille de chaque widget (1x1 à 4x4)
- **Thèmes personnalisables** : 8 couleurs d'accent au choix
- **Fonds d'écran** : Presets ou URL personnalisée
- **Synchronisation cloud** : Sauvegarde automatique avec Supabase (authentification optionnelle)
- **Stockage local** : Fonctionne hors ligne avec localStorage
- **Intégration calendrier** : Les tâches avec dates s'affichent automatiquement dans le calendrier
- **APIs temps réel** : Hacker News, ZenQuotes, CoinGecko, wttr.in

## Technologies

- **Frontend** : Vue 3 (Composition API) + Vite
- **State Management** : Pinia
- **Backend/DB** : Supabase (PostgreSQL)
- **Styling** : CSS Variables (thème minimaliste personnalisable)
- **Drag & Drop** : Sortable.js
- **Icons** : Lucide Vue Next

## Installation

### Prérequis
- Node.js 16+ et npm

### Français

1. **Cloner le repository**
```bash
git clone https://github.com/Tibacon/WEBHUB.git
cd WEBHUB
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Supabase (optionnel)**

   Si vous souhaitez activer la synchronisation cloud :
   - Créez un compte sur [Supabase](https://supabase.com)
   - Créez un nouveau projet
   - Copiez votre `URL` et `anon key`
   - Créez le fichier `src/constants/index.js` avec vos credentials :

```javascript
export const SUPABASE_URL = 'votre-url-supabase'
export const SUPABASE_ANON_KEY = 'votre-cle-anon'
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

5. **Accéder à l'application**

   Ouvrez votre navigateur sur `http://localhost:5173`

### English

1. **Clone the repository**
```bash
git clone https://github.com/Tibacon/WEBHUB.git
cd WEBHUB
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Supabase (optional)**

   If you want to enable cloud synchronization:
   - Create an account on [Supabase](https://supabase.com)
   - Create a new project
   - Copy your `URL` and `anon key`
   - Create the file `src/constants/index.js` with your credentials:

```javascript
export const SUPABASE_URL = 'your-supabase-url'
export const SUPABASE_ANON_KEY = 'your-anon-key'
```

4. **Start the development server**
```bash
npm run dev
```

5. **Access the application**

   Open your browser at `http://localhost:5173`

## Wiki

Pour plus d'informations détaillées, consultez le [Wiki officiel](https://github.com/Tibacon/WEBHUB/wiki)

---

Développé avec amour par l'équipe WEBHUB
