<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Contact Info Settings</h1>
        <p class="text-sm text-gray-500 mt-1">Manage company details and contact information displayed on the website</p>
      </div>
      <div class="d-flex gap-2">
        <AppBtn variant="outline" color="secondary" :disabled="saving" @click="resetChanges">Discard</AppBtn>
        <AppBtn color="primary" :disabled="saving" @click="save">
          <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />
          <i v-else class="mdi mdi-check mr-1" />Save Changes
        </AppBtn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <v-row v-else>
      <!-- Main Content -->
      <v-col cols="12" md="8">
        <!-- Office Info -->
        <v-card class="mb-6 overflow-hidden">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Office Information</v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppInput v-model="form.officeName" label="Office Name" placeholder="e.g. Heritage Sanctuary Office" required />
            <AppTextarea v-model="form.address" label="Full Address" placeholder="123 ถนนราชดำเนิน ตำบลศรีภูมิ..." :rows="3" />
          </v-card-text>
        </v-card>

        <!-- Map Settings -->
        <v-card class="mb-6 overflow-hidden">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Map Integration</v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppInput v-model="form.mapLink" label="Google Maps URL" placeholder="https://maps.google.com/..." prepend-inner-icon="mdi-map-marker-radius" />
            <AppInput v-model="form.mapMarkerText" label="Map Marker Text" placeholder="e.g. Lanna Heritage Travel" hint="Text displayed inside the map marker card" />
          </v-card-text>
        </v-card>

        <!-- Office Background -->
        <v-card class="overflow-hidden">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Office Image</v-card-title>
          <v-card-text>
            <div
              class="border-2 border-dashed rounded-lg pa-8 text-center cursor-pointer hover:bg-slate-50 transition-colors"
              style="border-color: #e2e8f0;"
              @click="triggerUpload"
            >
              <div v-if="!form.officeImage">
                <i class="mdi mdi-image-plus text-5xl text-gray-300" />
                <p class="mt-2 text-gray-400">Upload office background image</p>
              </div>
              <img v-else :src="form.officeImage" class="rounded max-h-[300px] mx-auto object-cover" />
            </div>
            <input ref="fileInput" type="file" class="d-none" accept="image/*" @change="handleImageUpload" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Sidebar -->
      <v-col cols="12" md="4">
        <!-- Contact Channels -->
        <v-card class="mb-6 overflow-hidden">
          <v-card-title class="pa-4 pb-2 text-base font-semibold font-bold">Contact Channels</v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppInput v-model="form.phone" label="Phone Number" placeholder="e.g. +66 (0) 53123 456" />
            <AppInput v-model="form.email" label="Email Address" placeholder="e.g. hello@lannaheritage.travel" />
            <AppInput v-model="form.lineId" label="Line ID" placeholder="e.g. @lannaheritage" />
          </v-card-text>
        </v-card>

        <!-- Social Links -->
        <v-card class="overflow-hidden">
          <v-card-title class="pa-4 pb-2 text-base font-semibold font-bold">Social Media</v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppInput v-model="form.facebook" label="Facebook URL" placeholder="https://facebook.com/..." />
            <AppInput v-model="form.instagram" label="Instagram URL" placeholder="https://instagram.com/..." />
            <AppInput v-model="form.tiktok" label="TikTok URL" placeholder="https://tiktok.com/@..." />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const { request } = useApi()

const fileInput = ref(null)
const loading = ref(true)
const saving = ref(false)

const form = ref({
  officeName: '',
  address: '',
  phone: '',
  email: '',
  lineId: '',
  officeImage: '',
  mapLink: '',
  mapMarkerText: '',
  facebook: '',
  instagram: '',
  tiktok: '',
})

let savedSnapshot = {}

function applyApiData(data) {
  form.value.officeName = data.officeName || ''
  form.value.address = data.address || ''
  form.value.phone = data.phone || ''
  form.value.email = data.email || ''
  form.value.lineId = data.lineId || ''
  form.value.officeImage = data.officeImageUrl || ''
  form.value.mapLink = data.mapLink || ''
  form.value.mapMarkerText = data.mapMarkerText || ''
  form.value.facebook = data.facebookUrl || ''
  form.value.instagram = data.instagramUrl || ''
  form.value.tiktok = data.tiktokUrl || ''
}

async function fetchSettings() {
  loading.value = true
  try {
    const res = await request('/settings/contact')
    applyApiData(res.data)
    savedSnapshot = JSON.parse(JSON.stringify(form.value))
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchSettings)

function triggerUpload() { fileInput.value?.click() }

function handleImageUpload(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => { form.value.officeImage = ev.target.result }
    reader.readAsDataURL(file)
  }
}

function resetChanges() {
  form.value = JSON.parse(JSON.stringify(savedSnapshot))
}

async function save() {
  saving.value = true
  try {
    const f = form.value
    const body = {
      officeName: f.officeName,
      address: f.address,
      phone: f.phone,
      email: f.email,
      lineId: f.lineId,
      mapLink: f.mapLink,
      mapMarkerText: f.mapMarkerText,
      officeImageUrl: f.officeImage && !f.officeImage.startsWith('data:') ? f.officeImage : undefined,
      facebookUrl: f.facebook,
      instagramUrl: f.instagram,
      tiktokUrl: f.tiktok,
    }
    const res = await request('/settings/contact', { method: 'PUT', body })
    applyApiData(res.data)
    savedSnapshot = JSON.parse(JSON.stringify(form.value))
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
