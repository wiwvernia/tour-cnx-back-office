<template>
  <div class="flex flex-col gap-4">
    <AppInput
      v-model="form.name"
      label="Category Name"
      placeholder="e.g. Health & Wellness"
    />
    <AppInputGroup
      v-model="form.slug"
      label="URL Slug"
      prefix="/"
      hint="Lowercase, hyphen-separated. Auto-generated from name."
    />
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  initialData: { type: Object, default: () => ({ id: null, name: '', slug: '' }) },
  isEditing:   { type: Boolean, default: false },
})

const form = reactive({ ...props.initialData })

watch(() => form.name, (val) => {
  if (!props.isEditing) {
    form.slug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }
})

defineExpose({ getData: () => ({ ...form }) })
</script>
