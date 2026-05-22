<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5">{{ label }}</label>

    <!-- Upload Zone -->
    <div
      class="relative border-2 border-dashed transition-colors cursor-pointer overflow-hidden"
      :class="[
        circle ? 'rounded-full' : 'rounded-lg',
        modelValue ? 'border-indigo-300 hover:border-indigo-400' : 'border-gray-300 hover:border-gray-400',
      ]"
      :style="zoneStyle"
      @click="fileInput?.click()"
    >
      <!-- Uploading -->
      <div v-if="uploading" class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/80">
        <i class="mdi mdi-loading mdi-spin text-3xl text-gray-400" />
        <span class="text-xs text-gray-400">Uploading...</span>
      </div>

      <!-- Preview -->
      <template v-else-if="modelValue">
        <img :src="modelValue" class="absolute inset-0 w-full h-full object-cover" />
        <div v-if="!circle" class="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            class="text-xs text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded"
            @click.stop="fileInput?.click()"
          >เปลี่ยนรูป</button>
          <button
            type="button"
            class="text-xs text-white bg-red-500/70 hover:bg-red-600/80 px-3 py-1.5 rounded"
            @click.stop="$emit('update:modelValue', '')"
          >ลบ</button>
        </div>
      </template>

      <!-- Placeholder -->
      <div v-else class="absolute inset-0 flex flex-col items-center justify-center px-4">
        <i class="mdi mdi-image-plus text-4xl text-gray-300 block mb-2" />
        <p class="text-xs text-gray-400 text-center">{{ placeholder || 'คลิกเพื่ออัปโหลด' }}</p>
      </div>
    </div>

    <!-- Circle controls below -->
    <div v-if="circle && modelValue" class="flex gap-3 justify-center mt-2">
      <button type="button" class="text-xs text-blue-600 hover:underline" @click="fileInput?.click()">เปลี่ยนรูป</button>
      <button type="button" class="text-xs text-red-500 hover:underline" @click="$emit('update:modelValue', '')">ลบ</button>
    </div>
    <div v-else-if="circle" class="text-center mt-1">
      <button type="button" class="text-xs text-blue-600 hover:underline" @click="fileInput?.click()">อัปโหลดรูป</button>
    </div>

    <!-- Size hint -->
    <p v-if="hint" class="mt-1.5 flex items-start gap-1 text-xs text-gray-400">
      <i class="mdi mdi-information-outline mt-0.5 shrink-0" />{{ hint }}
    </p>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileSelect" />

    <!-- Crop Dialog -->
    <v-dialog v-model="cropDialog" max-width="680" persistent>
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center justify-between">
          <span>ปรับขนาดรูป</span>
          <AppBtn variant="ghost" color="secondary" size="sm" icon @click="cancelCrop">
            <i class="mdi mdi-close" />
          </AppBtn>
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="bg-gray-900 rounded-lg overflow-hidden" style="max-height:420px;">
            <img ref="cropperImg" :src="rawImageSrc" style="display:block;max-width:100%;max-height:420px;" />
          </div>
          <div class="mt-2 flex flex-wrap gap-4 text-xs text-gray-400">
            <span><i class="mdi mdi-cursor-move" /> ลากเพื่อย้ายพื้นที่</span>
            <span><i class="mdi mdi-magnify-plus-outline" /> Scroll เพื่อ Zoom</span>
            <span v-if="hint"><i class="mdi mdi-ruler-square" /> แนะนำ: {{ hint }}</span>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 flex gap-2 justify-end">
          <AppBtn variant="outline" color="secondary" :disabled="uploading" @click="cancelCrop">ยกเลิก</AppBtn>
          <AppBtn color="primary" :disabled="uploading" @click="confirmCrop">
            <i v-if="uploading" class="mdi mdi-loading mdi-spin mr-1" />
            {{ uploading ? 'กำลัง Upload...' : 'Crop & Upload' }}
          </AppBtn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const props = defineProps({
  modelValue:  { type: String, default: '' },
  label:       { type: String, default: '' },
  hint:        { type: String, default: '' },
  placeholder: { type: String, default: '' },
  aspectRatio: { type: Number, default: NaN },
  context:     { type: String, default: 'pages' },
  circle:      { type: Boolean, default: false },
  minHeight:   { type: String, default: '160px' },
  autoUpload:  { type: Boolean, default: true },
  noCrop:      { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const { request } = useApi()

const zoneStyle = computed(() => {
  if (props.circle) return 'width:100px;height:100px;'
  if (!isNaN(props.aspectRatio)) return `aspect-ratio:${props.aspectRatio};width:100%;`
  return `min-height:${props.minHeight};`
})

const fileInput  = ref(null)
const cropperImg = ref(null)
const cropDialog = ref(false)
const rawImageSrc = ref('')
const uploading  = ref(false)
let cropperInstance = null

function onFileSelect(e) {
  const file = e.target.files[0]
  if (!file) return
  e.target.value = ''

  if (props.noCrop) {
    uploadFile(file)
    return
  }

  const reader = new FileReader()
  reader.onload = (ev) => {
    rawImageSrc.value = ev.target.result
    cropDialog.value = true
  }
  reader.readAsDataURL(file)
}

watch(cropDialog, async (open) => {
  if (!open) {
    if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null }
    return
  }
  await nextTick()
  await new Promise(r => setTimeout(r, 300))
  if (!cropperImg.value) return
  if (cropperInstance) { cropperInstance.destroy(); cropperInstance = null }
  cropperInstance = new Cropper(cropperImg.value, {
    aspectRatio:   props.circle ? 1 : props.aspectRatio,
    viewMode:      1,
    dragMode:      'move',
    autoCropArea:  props.circle ? 1 : 0.85,
    responsive:    true,
    background:    false,
    guides:        true,
  })
})

function cancelCrop() {
  cropDialog.value = false
  rawImageSrc.value = ''
}

async function confirmCrop() {
  if (!cropperInstance) return
  uploading.value = true
  try {
    const canvas = cropperInstance.getCroppedCanvas({ maxWidth: 2400, maxHeight: 2400 })
    if (props.autoUpload) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', 0.85))
      await uploadFile(new File([blob], 'image.webp', { type: 'image/webp' }))
    } else {
      emit('update:modelValue', canvas.toDataURL('image/webp', 0.85))
    }
    cropDialog.value = false
  } catch (err) {
    console.error('Crop/upload failed:', err)
  } finally {
    uploading.value = false
  }
}

async function uploadFile(file) {
  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('context', props.context)
    const res = await request('/media/upload', { method: 'POST', body: formData })
    emit('update:modelValue', res.data.url)
  } catch (err) {
    console.error('Upload failed:', err)
  } finally {
    uploading.value = false
  }
}

onBeforeUnmount(() => {
  if (cropperInstance) cropperInstance.destroy()
})
</script>
