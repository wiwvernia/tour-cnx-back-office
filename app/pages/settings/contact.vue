<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <i class="mdi mdi-office-building text-blue-600" />
          Contact Settings
        </h1>
        <p class="text-sm text-gray-500 mt-1">Configure company details, map integration, and social links displayed across the front-end website</p>
      </div>
      <div class="flex gap-2">
        <AppBtn variant="outline" color="secondary" :disabled="saving" @click="resetChanges">
          Discard
        </AppBtn>
        <AppBtn color="primary" :disabled="saving" @click="save">
          <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />
          <i v-else class="mdi mdi-check mr-1" />
          Save Changes
        </AppBtn>
      </div>
    </div>

    <!-- Alert / Toast Notification -->
    <v-fade-transition>
      <div v-if="notification.show" :class="`mb-4 p-4 rounded-lg flex items-center gap-3 border shadow-sm ${notification.class}`">
        <i :class="`mdi ${notification.icon} text-xl`" />
        <span class="text-sm font-medium">{{ notification.message }}</span>
        <button class="ml-auto hover:opacity-75" @click="notification.show = false">
          <i class="mdi mdi-close" />
        </button>
      </div>
    </v-fade-transition>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="text-center">
        <i class="mdi mdi-loading mdi-spin text-4xl text-blue-600 mb-2 block" />
        <span class="text-sm text-gray-500 font-medium">Loading settings...</span>
      </div>
    </div>

    <!-- Main Content Form -->
    <v-row v-else>
      <!-- Left Column: Location & Office Media -->
      <v-col cols="12" md="8">
        
        <!-- Office Information -->
        <v-card class="mb-5 border border-gray-200/80 rounded-xl overflow-hidden" elevation="0">
          <div class="bg-gray-50/50 px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
            <i class="mdi mdi-map-marker-outline text-lg text-gray-500" />
            <span class="font-semibold text-gray-800 text-sm">Office Details</span>
          </div>
          <v-card-text class="flex flex-col gap-4 p-5">
            <AppInput 
              v-model="form.officeName" 
              label="Office Name" 
              placeholder="e.g., Heritage Sanctuary Office" 
              required
            />
            <AppTextarea 
              v-model="form.address" 
              label="Office Full Address" 
              placeholder="e.g., 123 Ratchadamnoen Rd, Sri Phum, Chiang Mai 50200" 
              :rows="3" 
            />
          </v-card-text>
        </v-card>

        <!-- Google Maps Integration -->
        <v-card class="mb-5 border border-gray-200/80 rounded-xl overflow-hidden" elevation="0">
          <div class="bg-gray-50/50 px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
            <i class="mdi mdi-google-maps text-lg text-red-500" />
            <span class="font-semibold text-gray-800 text-sm">Location Map Integration</span>
          </div>
          <v-card-text class="flex flex-col gap-4 p-5">
            <AppInput 
              v-model="form.mapLink" 
              label="Google Maps Link" 
              placeholder="https://maps.google.com/?q=..." 
              hint="Enter the shareable link or embed coordinates URL for your business location"
            />
            <AppInput 
              v-model="form.mapMarkerText" 
              label="Map Marker Pin Text" 
              placeholder="e.g., Lanna Heritage Travel" 
              hint="Text tag display when hovering or clicking the map marker pin"
            />
          </v-card-text>
        </v-card>

        <!-- Office Image — hidden until displayed on frontend -->
      </v-col>

      <!-- Right Column: Direct Contact & Socials -->
      <v-col cols="12" md="4">
        
        <!-- Contact Channels Card -->
        <v-card class="mb-5 border border-gray-200/80 rounded-xl overflow-hidden" elevation="0">
          <div class="bg-gray-50/50 px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
            <i class="mdi mdi-card-account-phone-outline text-lg text-gray-500" />
            <span class="font-semibold text-gray-800 text-sm">Contact Channels</span>
          </div>
          <v-card-text class="flex flex-col gap-4 p-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <i class="mdi mdi-phone text-blue-600" /> Phone Number
              </label>
              <AppInput 
                v-model="form.phone" 
                placeholder="e.g., +66 (0) 53123 456" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <i class="mdi mdi-email text-red-500" /> Email Address
              </label>
              <AppInput 
                v-model="form.email" 
                placeholder="e.g., hello@lannaheritage.travel" 
                type="email"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <i class="mdi mdi-chat text-green-500" /> Line ID
              </label>
              <AppInput 
                v-model="form.lineId" 
                placeholder="e.g., @lannaheritage" 
              />
            </div>
          </v-card-text>
        </v-card>

        <!-- Social Media Profiles -->
        <v-card class="border border-gray-200/80 rounded-xl overflow-hidden" elevation="0">
          <div class="bg-gray-50/50 px-5 py-4 border-b border-gray-100 flex items-center gap-2.5">
            <i class="mdi mdi-share-variant-outline text-lg text-gray-500" />
            <span class="font-semibold text-gray-800 text-sm">Social Media Links</span>
          </div>
          <v-card-text class="flex flex-col gap-4 p-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <i class="mdi mdi-facebook text-[#1877F2]" /> Facebook URL
              </label>
              <AppInput 
                v-model="form.facebookUrl" 
                placeholder="https://facebook.com/your-page" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <i class="mdi mdi-instagram text-[#E4405F]" /> Instagram URL
              </label>
              <AppInput 
                v-model="form.instagramUrl" 
                placeholder="https://instagram.com/your-username" 
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <i class="mdi mdi-music-note text-[#000000]" /> TikTok URL
              </label>
              <AppInput 
                v-model="form.tiktokUrl" 
                placeholder="https://tiktok.com/@your-username" 
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const { request } = useApi()

const officeImageInput = ref(null)
const loading = ref(true)
const saving = ref(false)
const uploadingImage = ref(false)

const notification = reactive({
  show: false,
  message: '',
  class: '',
  icon: '',
})

const form = reactive({
  officeName: '',
  address: '',
  phone: '',
  email: '',
  lineId: '',
  officeImageUrl: '',
  mapLink: '',
  mapMarkerText: '',
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: '',
})

let savedSnapshot = {}

function showNotification(msg, type = 'success') {
  notification.message = msg
  notification.show = true
  if (type === 'success') {
    notification.class = 'bg-green-50 border-green-200 text-green-800'
    notification.icon = 'mdi-checkbox-marked-circle-outline text-green-600'
  } else {
    notification.class = 'bg-red-50 border-red-200 text-red-800'
    notification.icon = 'mdi-alert-circle-outline text-red-600'
  }
  
  // Auto dismiss after 4 seconds
  setTimeout(() => {
    notification.show = false
  }, 4000)
}

function applyApiData(data) {
  form.officeName = data.officeName || ''
  form.address = data.address || ''
  form.phone = data.phone || ''
  form.email = data.email || ''
  form.lineId = data.lineId || ''
  form.officeImageUrl = data.officeImageUrl || ''
  form.mapLink = data.mapLink || ''
  form.mapMarkerText = data.mapMarkerText || ''
  form.facebookUrl = data.facebookUrl || ''
  form.instagramUrl = data.instagramUrl || ''
  form.tiktokUrl = data.tiktokUrl || ''
}

async function fetchSettings() {
  loading.value = true
  try {
    const res = await request('/settings/contact')
    applyApiData(res.data)
    savedSnapshot = JSON.parse(JSON.stringify(form))
  } catch (e) {
    console.error(e)
    showNotification('Failed to fetch contact settings.', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(fetchSettings)

async function handleOfficeImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  uploadingImage.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('context', 'settings')
    const res = await request('/media/upload', { method: 'POST', body: formData })
    form.officeImageUrl = res.data.url
    showNotification('Office image uploaded successfully.')
  } catch (err) {
    console.error(err)
    showNotification('Failed to upload image. Please try again.', 'error')
  } finally {
    uploadingImage.value = false
    e.target.value = ''
  }
}

function resetChanges() {
  Object.assign(form, JSON.parse(JSON.stringify(savedSnapshot)))
  showNotification('Changes discarded.')
}

async function save() {
  if (!form.officeName.trim()) {
    showNotification('Office Name is a required field.', 'error')
    return
  }

  saving.value = true
  try {
    const body = {
      officeName: form.officeName,
      address: form.address,
      phone: form.phone,
      email: form.email,
      lineId: form.lineId,
      mapLink: form.mapLink,
      mapMarkerText: form.mapMarkerText,
      officeImageUrl: form.officeImageUrl,
      facebookUrl: form.facebookUrl,
      instagramUrl: form.instagramUrl,
      tiktokUrl: form.tiktokUrl,
    }
    const res = await request('/settings/contact', { method: 'PUT', body })
    applyApiData(res.data)
    savedSnapshot = JSON.parse(JSON.stringify(form))
    showNotification('Contact settings updated successfully!')
  } catch (e) {
    console.error(e)
    showNotification('Failed to save contact settings.', 'error')
  } finally {
    saving.value = false
  }
}
</script>
