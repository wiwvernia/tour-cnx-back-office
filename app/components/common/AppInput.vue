<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div v-if="hint || counter" class="flex justify-between mt-1">
      <span v-if="hint" class="text-xs text-gray-500">{{ hint }}</span>
      <span
        v-if="counter"
        class="text-xs ml-auto"
        :class="(modelValue?.length ?? 0) > counter ? 'text-red-500' : 'text-gray-400'"
      >
        {{ modelValue?.length ?? 0 }}/{{ counter }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false })
defineProps({
  modelValue: { type: String, default: '' },
  label:       { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type:        { type: String, default: 'text' },
  required:    { type: Boolean, default: false },
  disabled:    { type: Boolean, default: false },
  hint:        { type: String, default: '' },
  counter:     { type: Number, default: 0 },
})
defineEmits(['update:modelValue'])
</script>
