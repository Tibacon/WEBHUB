<template>
  <div class="notes-widget">
    <textarea
      v-model="content"
      @input="saveData"
      placeholder="Écrivez vos notes ici..."
    ></textarea>
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
const content = ref('')

onMounted(() => {
  if (props.widget.data?.content) {
    content.value = props.widget.data.content
  }
})

function saveData() {
  widgetsStore.updateWidgetData(props.widget.id, { content: content.value })
}
</script>

<style scoped>
.notes-widget {
  height: 100%;
}

textarea {
  width: 100%;
  height: 100%;
  min-height: 150px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 6px;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
}

textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

textarea:focus {
  border-color: rgba(100, 108, 255, 0.6);
}
</style>
