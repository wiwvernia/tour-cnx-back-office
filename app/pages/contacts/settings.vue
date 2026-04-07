<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Contact Info Settings</h1>
        <p class="text-sm text-gray-500 mt-1">Manage company details and contact information displayed on the website</p>
      </div>
      <div class="d-flex gap-2">
        <v-btn variant="outlined" color="primary" class="rounded-lg">Discard</v-btn>
        <v-btn color="primary" prepend-icon="mdi-check" class="rounded-lg">Save Changes</v-btn>
      </div>
    </div>

    <v-row>
      <!-- Main Content -->
      <v-col cols="12" md="8">
        <!-- Office Info -->
        <v-card class="mb-6 overflow-hidden">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Office Information</v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppInput
              v-model="form.officeName"
              label="Office Name"
              placeholder="e.g. Heritage Sanctuary Office"
              required
            />
            <AppTextarea
              v-model="form.address"
              label="Full Address"
              placeholder="123 ถนนราชดำเนิน ตำบลศรีภูมิ..."
              :rows="3"
            />
          </v-card-text>
        </v-card>

        <!-- Map Settings -->
        <v-card class="mb-6 overflow-hidden">
          <v-card-title class="pa-4 pb-2 text-base font-semibold">Map Integration</v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppInput
              v-model="form.mapLink"
              label="Google Maps URL"
              placeholder="https://maps.google.com/..."
              prepend-inner-icon="mdi-map-marker-radius"
            />
            <AppInput
              v-model="form.mapMarkerText"
              label="Map Marker Text"
              placeholder="e.g. Lanna Heritage Travel"
              hint="Text displayed inside the map marker card"
            />
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
                <v-icon size="48" color="slate-300">mdi-image-plus</v-icon>
                <p class="mt-2 text-slate-500">Upload office background image</p>
              </div>
              <v-img v-else :src="form.officeImage" class="rounded max-h-[300px]" />
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
            <AppInput
              v-model="form.phone"
              label="Phone Number"
              placeholder="e.g. +66 (0) 53123 456"
            />
            <AppInput
              v-model="form.email"
              label="Email Address"
              placeholder="e.g. hello@lannaheritage.travel"
            />
            <AppInput
              v-model="form.lineId"
              label="Line ID"
              placeholder="e.g. @lannaheritage"
            />
          </v-card-text>
        </v-card>

        <!-- Social Links -->
        <v-card class="overflow-hidden">
          <v-card-title class="pa-4 pb-2 text-base font-semibold font-bold">Social Media</v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppInput
              v-model="form.facebook"
              label="Facebook URL"
              placeholder="https://facebook.com/..."
            />
            <AppInput
              v-model="form.instagram"
              label="Instagram URL"
              placeholder="https://instagram.com/..."
            />
            <AppInput
              v-model="form.tiktok"
              label="TikTok URL"
              placeholder="https://tiktok.com/@..."
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const fileInput = ref(null)

const form = ref({
  officeName: 'Heritage Sanctuary Office',
  address: '123 ถนนราชดำเนิน ตำบลศรีภูมิ อำเภอเมือง เชียงใหม่ 50200',
  phone: '+66 (0) 53123 456',
  email: 'hello@lannaheritage.travel',
  lineId: '@lannaheritage',
  officeImage: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&q=80&w=1000',
  mapLink: 'https://maps.google.com/?q=Lanna+Heritage+Travel',
  mapMarkerText: 'Lanna Heritage Travel สำนักงานใหญ่ย่านประตูท่าแพ',
  facebook: 'https://facebook.com/lannaheritage',
  instagram: 'https://instagram.com/lannaheritage',
  tiktok: 'https://tiktok.com/@lannaheritage'
})

function triggerUpload() { fileInput.value?.click() }

function handleImageUpload(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => { form.value.officeImage = ev.target.result }
    reader.readAsDataURL(file)
  }
}
</script>
