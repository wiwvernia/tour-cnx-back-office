<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">{{ label }}</label>
    <div
      class="flex flex-wrap gap-1.5 px-3 py-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition min-h-[42px]"
    >
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
      >
        {{ tag }}
        <button
          type="button"
          class="hover:text-blue-900 leading-none focus:outline-none"
          @click="removeTag(tag)"
        >×</button>
      </span>
      <input
        v-model="inputVal"
        type="text"
        :placeholder="modelValue.length === 0 ? placeholder : ''"
        class="flex-1 min-w-24 text-sm focus:outline-none bg-transparent"
        @keydown.enter.prevent="addTag"
        @keydown.backspace="onBackspace"
      />
    </div>
    <p v-if="hint" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue:  { type: Array, default: () => [] },
  label:       { type: String, default: '' },
  placeholder: { type: String, default: 'Press Enter to add tag' },
  hint:        { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

const inputVal = ref('')

function addTag() {
  const val = inputVal.value.trim()
  if (val && !props.modelValue.includes(val)) {
    emit('update:modelValue', [...props.modelValue, val])
  }
  inputVal.value = ''
}

function removeTag(tag) {
  emit('update:modelValue', props.modelValue.filter(t => t !== tag))
}

function onBackspace() {
  if (inputVal.value === '' && props.modelValue.length > 0) {
    emit('update:modelValue', props.modelValue.slice(0, -1))
  }
}
</script>
