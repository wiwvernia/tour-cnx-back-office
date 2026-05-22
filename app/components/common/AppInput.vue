<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :value="modelValue"
        :type="showPasswordToggle && showPassword ? 'text' : type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'w-full px-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed',
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500',
          showPasswordToggle ? 'pr-10' : '',
        ]"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button
        v-if="showPasswordToggle"
        type="button"
        tabindex="-1"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        @click="showPassword = !showPassword"
      >
        <i :class="showPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'" />
      </button>
    </div>
    <div v-if="error" class="mt-1 flex items-center gap-1 text-xs text-red-500">
      <i class="mdi mdi-alert-circle" />{{ error }}
    </div>
    <div v-else-if="hint || counter" class="flex justify-between mt-1">
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
  modelValue:         { type: String, default: '' },
  label:              { type: String, default: '' },
  placeholder:        { type: String, default: '' },
  type:               { type: String, default: 'text' },
  required:           { type: Boolean, default: false },
  disabled:           { type: Boolean, default: false },
  hint:               { type: String, default: '' },
  counter:            { type: Number, default: 0 },
  showPasswordToggle: { type: Boolean, default: false },
  error:              { type: String, default: '' },
})
defineEmits(['update:modelValue'])

const showPassword = ref(false)
</script>
