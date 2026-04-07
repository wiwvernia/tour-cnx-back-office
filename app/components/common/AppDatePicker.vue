<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">{{ label }}</label>
    <v-menu v-model="menu" :close-on-content-click="false" location="bottom start">
      <template #activator="{ props: menuProps }">
        <div
          v-bind="menuProps"
          class="w-full px-3 py-2 text-sm border rounded-lg bg-white cursor-pointer flex items-center justify-between transition"
          :class="menu
            ? 'border-blue-500 ring-2 ring-blue-500'
            : 'border-gray-300 hover:border-gray-400'"
        >
          <span :class="modelValue ? 'text-gray-900' : 'text-gray-400'">
            {{ displayValue || placeholder || 'Select date' }}
          </span>
          <i class="mdi mdi-calendar text-gray-400 text-base" />
        </div>
      </template>

      <v-date-picker
        :model-value="pickerValue"
        hide-header
        @update:model-value="onSelect"
      />
    </v-menu>
    <p v-if="hint" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }, // YYYY-MM-DD
  label:      { type: String, default: '' },
  placeholder:{ type: String, default: '' },
  hint:       { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const menu = ref(false)

// YYYY-MM-DD → Date object for v-date-picker
const pickerValue = computed(() => {
  if (!props.modelValue) return null
  const [y, m, d] = props.modelValue.split('-').map(Number)
  return new Date(y, m - 1, d)
})

// YYYY-MM-DD → display string
const displayValue = computed(() => {
  if (!props.modelValue) return ''
  const [y, m, d] = props.modelValue.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('th-TH', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
})

function onSelect(date) {
  if (!date) return
  const d = new Date(date)
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  emit('update:modelValue', iso)
  menu.value = false
}
</script>
