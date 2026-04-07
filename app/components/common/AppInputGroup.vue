<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">{{ label }}</label>
    <div class="flex items-stretch border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 bg-white">
      <span class="px-3 py-2 bg-gray-100 text-gray-500 text-sm border-r border-gray-300 select-none flex items-center whitespace-nowrap">
        {{ prefix }}
      </span>
      <input
        :value="modelValue"
        type="text"
        :placeholder="placeholder"
        class="flex-1 px-3 py-2 text-sm focus:outline-none bg-transparent min-w-0"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </div>
    <p v-if="hint" class="text-xs text-gray-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false })
defineProps({
  modelValue:  { type: String, default: '' },
  label:       { type: String, default: '' },
  prefix:      { type: String, default: '/' },
  placeholder: { type: String, default: '' },
  hint:        { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>
