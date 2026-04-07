<template>
  <label class="inline-flex items-center gap-3 cursor-pointer select-none">
    <div class="relative">
      <input
        type="checkbox"
        class="sr-only peer"
        :checked="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <div
        class="w-10 h-6 rounded-full transition-colors duration-200
               bg-gray-300 peer-checked:bg-blue-600
               peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
               after:content-[''] after:absolute after:top-1 after:left-1
               after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow
               after:transition-transform after:duration-200
               peer-checked:after:translate-x-4"
      ></div>
    </div>
    <span v-if="label" class="text-sm font-medium text-gray-700">{{ label }}</span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label:      { type: String, default: '' },
  disabled:   { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])
</script>
