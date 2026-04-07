<template>
  <NuxtLink v-if="to" :to="to" :class="classes" v-bind="$attrs">
    <i v-if="prependIcon" :class="`mdi ${prependIcon} text-base leading-none`" aria-hidden="true" />
    <slot />
  </NuxtLink>
  <button v-else :type="type" :disabled="disabled" :class="[classes, disabled && 'opacity-50 cursor-not-allowed']" v-bind="$attrs">
    <i v-if="prependIcon" :class="`mdi ${prependIcon} text-base leading-none`" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'solid' },   // solid | outline | ghost
  color:   { type: String, default: 'primary' }, // primary | secondary | danger
  size:    { type: String, default: 'md' },       // md | sm
  icon:    { type: Boolean, default: false },     // icon-only square button
  prependIcon: { type: String, default: '' },
  to:      { type: String, default: '' },
  type:    { type: String, default: 'button' },
  disabled:{ type: Boolean, default: false },
})

const base = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 select-none'

const sizeMap = {
  md: props.icon ? 'p-2'       : 'px-4 py-2 text-sm',
  sm: props.icon ? 'p-1.5'     : 'px-3 py-1.5 text-xs',
}

const variantColorMap = {
  solid: {
    primary:   'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  },
  outline: {
    primary:   'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    secondary: 'border border-gray-400 text-gray-600 hover:bg-gray-50 focus:ring-gray-400',
    danger:    'border border-red-500 text-red-600 hover:bg-red-50 focus:ring-red-500',
  },
  ghost: {
    primary:   'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    secondary: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
    danger:    'text-red-600 hover:bg-red-50 focus:ring-red-500',
  },
}

const classes = computed(() => [
  base,
  sizeMap[props.size] ?? sizeMap.md,
  variantColorMap[props.variant]?.[props.color] ?? variantColorMap.solid.primary,
])
</script>
