<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">{{ label }}</label>
    <div class="flex gap-1">
      <button
        v-for="i in 5"
        :key="i"
        type="button"
        class="focus:outline-none transition-transform hover:scale-110"
        @click="$emit('update:modelValue', i)"
      >
        <i
          class="mdi text-2xl"
          :class="i <= modelValue ? 'mdi-star text-yellow-400' : 'mdi-star-outline text-gray-300'"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Number, default: 0 },
  label: { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>
