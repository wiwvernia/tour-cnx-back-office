<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <select
        :value="modelValue ?? ''"
        :disabled="disabled"
        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none cursor-pointer pr-8 disabled:bg-gray-100 disabled:cursor-not-allowed"
        v-bind="$attrs"
        @change="onchange"
      >
        <option v-if="placeholder" value="" disabled :selected="modelValue == null || modelValue === ''">{{ placeholder }}</option>
        <option v-for="opt in normalized" :key="String(opt.value)" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <span class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
    <p v-if="hint" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue:  { default: null },
  label:       { type: String, default: '' },
  options:     { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  required:    { type: Boolean, default: false },
  disabled:    { type: Boolean, default: false },
  hint:        { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue'])

// Accept string[] or { label, value }[]
const normalized = computed(() =>
  props.options.map(opt =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  )
)

function onchange(e) {
  const val = e.target.value
  emit('update:modelValue', val === '' ? null : val)
}
</script>
