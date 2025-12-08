<template>
  <div class="notes-widget">
    <div class="notes-header">
      <button @click="addNote" class="add-note-btn">
        <Plus :size="16" />
        Nouvelle note
      </button>
    </div>

    <div class="notes-list">
      <div v-for="note in notes" :key="note.id" class="note-item">
        <div class="note-header" @click="toggleNote(note.id)">
          <span class="note-title">{{ note.title || 'Note sans titre' }}</span>
          <span class="note-toggle">{{ note.isOpen ? '▼' : '▶' }}</span>
        </div>

        <div v-if="note.isOpen" class="note-content">
          <input
            v-model="note.title"
            @input="saveData"
            placeholder="Titre de la note"
            class="note-title-input"
          />
          <textarea
            v-model="note.content"
            @input="saveData"
            placeholder="Contenu de la note..."
            class="note-textarea"
          ></textarea>
          <button @click="deleteNote(note.id)" class="delete-note-btn">
            <Trash2 :size="14" />
            Supprimer
          </button>
        </div>
      </div>

      <div v-if="notes.length === 0" class="empty-state">
        Aucune note. Cliquez sur "Nouvelle note" pour commencer.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWidgetsStore } from '../../stores/widgetsStore'
import { Plus, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  widget: {
    type: Object,
    required: true
  }
})

const widgetsStore = useWidgetsStore()
const notes = ref([])

onMounted(() => {
  if (props.widget.data?.notes && Array.isArray(props.widget.data.notes)) {
    notes.value = props.widget.data.notes
  }
})

function addNote() {
  notes.value.push({
    id: Date.now(),
    title: '',
    content: '',
    isOpen: true
  })
  saveData()
}

function toggleNote(id) {
  const note = notes.value.find(n => n.id === id)
  if (note) {
    note.isOpen = !note.isOpen
    saveData()
  }
}

function deleteNote(id) {
  notes.value = notes.value.filter(n => n.id !== id)
  saveData()
}

function saveData() {
  widgetsStore.updateWidgetData(props.widget.id, { notes: notes.value })
}
</script>

<style scoped>
.notes-widget {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}

.notes-header {
  display: flex;
  justify-content: flex-end;
  padding: 8px 0;
  flex-shrink: 0;
}

.add-note-btn {
  padding: 6px 12px;
  background: var(--accent);
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-note-btn:hover {
  background: var(--accent-hover);
}

.notes-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.note-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.2s;
}

.note-header:hover {
  background: rgba(255, 255, 255, 0.1);
}

.note-title {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.note-toggle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.note-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.note-title-input {
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 4px;
  outline: none;
  font-size: 13px;
  font-weight: 500;
}

.note-title-input:focus {
  border-color: var(--accent);
}

.note-title-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.note-textarea {
  width: 100%;
  min-height: 100px;
  max-height: 200px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 4px;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.5;
}

.note-textarea:focus {
  border-color: var(--accent);
}

.note-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.delete-note-btn {
  padding: 6px 12px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 6px;
}

.delete-note-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.6);
}

.empty-state {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  text-align: center;
  padding: 20px;
}

/* Scrollbar styling */
.notes-list::-webkit-scrollbar {
  width: 6px;
}

.notes-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.notes-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.notes-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
