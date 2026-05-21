<template>
  <NuxtLink v-if="to" :to="to" :class="[baseClass, sizeClass, variantClass]" v-bind="$attrs">
    <i v-if="prependIcon" :class="`mdi ${prependIcon} text-base leading-none`" aria-hidden="true" />
    <slot />
  </NuxtLink>
  <button v-else :type="type" :disabled="disabled" :class="[baseClass, sizeClass, variantClass, disabled && 'opacity-50 cursor-not-allowed']" v-bind="$attrs">
    <i v-if="prependIcon" :class="`mdi ${prependIcon} text-base leading-none`" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant:     { type: String,  default: 'solid' },   // solid | outline | ghost
  color:       { type: String,  default: 'primary' }, // primary | secondary | danger
  size:        { type: String,  default: 'md' },       // md | sm
  icon:        { type: Boolean, default: false },      // icon-only square button
  prependIcon: { type: String,  default: '' },
  to:          { type: String,  default: '' },
  type:        { type: String,  default: 'button' },
  disabled:    { type: Boolean, default: false },
})

// Non-conflicting layout utilities only — colors handled via scoped CSS
const baseClass = 'app-btn inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 select-none cursor-pointer no-underline'

const sizeClass = computed(() => {
  if (props.icon) return props.size === 'sm' ? 'app-btn--sm-icon' : 'app-btn--md-icon'
  return props.size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
})

// Resolves to a scoped CSS class (e.g. app-btn--outline-danger)
const variantClass = computed(() => `app-btn--${props.variant}-${props.color}`)
</script>

<style scoped>
/* ── Size: icon-only ─────────────────────────────────────────────── */
.app-btn--sm-icon { width: 1.75rem; height: 1.75rem; padding: 0; flex-shrink: 0; }
.app-btn--md-icon { width: 2.25rem; height: 2.25rem; padding: 0; flex-shrink: 0; }

/* ── SOLID ───────────────────────────────────────────────────────── */
.app-btn--solid-primary   { background-color: #2563eb !important; color: #fff !important; border: none !important; }
.app-btn--solid-primary:hover   { background-color: #1d4ed8 !important; }
.app-btn--solid-secondary { background-color: #e5e7eb !important; color: #374151 !important; border: none !important; }
.app-btn--solid-secondary:hover { background-color: #d1d5db !important; }
.app-btn--solid-danger    { background-color: #dc2626 !important; color: #fff !important; border: none !important; }
.app-btn--solid-danger:hover    { background-color: #b91c1c !important; }

/* ── OUTLINE ─────────────────────────────────────────────────────── */
.app-btn--outline-primary   { border: 1px solid #2563eb !important; color: #2563eb !important; background-color: transparent !important; }
.app-btn--outline-primary:hover   { background-color: #eff6ff !important; }
.app-btn--outline-secondary { border: 1px solid #9ca3af !important; color: #4b5563 !important; background-color: transparent !important; }
.app-btn--outline-secondary:hover { background-color: #f9fafb !important; }
.app-btn--outline-danger    { border: 1px solid #ef4444 !important; color: #dc2626 !important; background-color: transparent !important; }
.app-btn--outline-danger:hover    { background-color: #fef2f2 !important; }

/* ── GHOST ───────────────────────────────────────────────────────── */
.app-btn--ghost-primary   { border: none !important; background-color: transparent !important; color: #2563eb !important; }
.app-btn--ghost-primary:hover   { background-color: #eff6ff !important; }
.app-btn--ghost-secondary { border: none !important; background-color: transparent !important; color: #4b5563 !important; }
.app-btn--ghost-secondary:hover { background-color: #f3f4f6 !important; }
.app-btn--ghost-danger    { border: none !important; background-color: transparent !important; color: #dc2626 !important; }
.app-btn--ghost-danger:hover    { background-color: #fef2f2 !important; }
</style>
