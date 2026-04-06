<template>
  <div>
    <QuillEditor
      v-model:content="model"
      content-type="html"
      :options="options"
      style="min-height: 300px;"
    />
  </div>
</template>

<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const model = defineModel({ default: '' })

const options = {
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': [1, 2, 3, 4, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean'],
    ],
  },
}
</script>

<style>
.ql-editor {
  min-height: 280px;
  font-size: 15px;
}
</style>
