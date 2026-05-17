<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Global Settings</h1>
        <p class="text-sm text-gray-500 mt-1">Brand identity, theme colors, typography & SEO defaults</p>
      </div>
      <div class="flex gap-2">
        <AppBtn variant="outline" color="secondary" :disabled="saving" @click="resetChanges">Discard</AppBtn>
        <AppBtn color="primary" :disabled="saving" @click="save">
          <i v-if="saving" class="mdi mdi-loading mdi-spin mr-1" />
          <i v-else class="mdi mdi-check mr-1" />Save Settings
        </AppBtn>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <i class="mdi mdi-loading mdi-spin text-4xl text-gray-300" />
    </div>

    <v-row v-else>
      <!-- ===== LEFT COLUMN ===== -->
      <v-col cols="12" md="8">

        <!-- 1. Brand Identity -->
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
            <i class="mdi mdi-palette-swatch text-gray-400" />Brand Identity
          </v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <v-row dense>
              <!-- Logo -->
              <v-col cols="12" sm="6">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Logo (Light BG)</label>
                <div
                  class="border-2 border-dashed rounded-lg overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center bg-white"
                  style="height: 100px;"
                  @click="logoLightInput?.click()"
                >
                  <div v-if="imageUploads.logoLight" class="flex items-center justify-center">
                    <i class="mdi mdi-loading mdi-spin text-3xl text-gray-400" />
                  </div>
                  <img v-else-if="form.logoLight" :src="form.logoLight" class="max-h-16 max-w-full object-contain p-2" />
                  <div v-else class="text-center text-gray-300">
                    <i class="mdi mdi-image-plus text-4xl block" />
                    <span class="text-xs">Upload logo</span>
                  </div>
                </div>
                <input ref="logoLightInput" type="file" class="hidden" accept="image/*" @change="e => handleImage(e, 'logoLight')" />
                <p class="text-xs text-gray-400 mt-1">PNG, JPG, WebP or GIF (max 10MB). Transparent BG recommended.</p>
              </v-col>

              <!-- Logo Dark -->
              <v-col cols="12" sm="6">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">Logo (Dark BG)</label>
                <div
                  class="border-2 border-dashed rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center bg-gray-900"
                  style="height: 100px;"
                  @click="logoDarkInput?.click()"
                >
                  <div v-if="imageUploads.logoDark" class="flex items-center justify-center">
                    <i class="mdi mdi-loading mdi-spin text-3xl text-gray-400" />
                  </div>
                  <img v-else-if="form.logoDark" :src="form.logoDark" class="max-h-16 max-w-full object-contain p-2" />
                  <div v-else class="text-center text-gray-600">
                    <i class="mdi mdi-image-plus text-4xl block" />
                    <span class="text-xs">Upload dark logo</span>
                  </div>
                </div>
                <input ref="logoDarkInput" type="file" class="hidden" accept="image/*" @change="e => handleImage(e, 'logoDark')" />
                <p class="text-xs text-gray-400 mt-1">PNG, JPG, WebP or GIF (max 10MB). Transparent BG recommended.</p>
              </v-col>
            </v-row>

            <AppInput v-model="form.siteName" label="Site Name" placeholder="Lanna Heritage Travel" />
            <AppInput v-model="form.tagline" label="Site Tagline" placeholder="สัมผัสเสน่ห์ล้านนา เที่ยวเชียงใหม่กับเรา" />

            <!-- Favicon -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Favicon (32×32px)</label>
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors bg-white"
                  @click="faviconInput?.click()"
                >
                  <i v-if="imageUploads.favicon" class="mdi mdi-loading mdi-spin text-xl text-gray-400" />
                  <img v-else-if="form.favicon" :src="form.favicon" class="w-8 h-8 object-contain" />
                  <i v-else class="mdi mdi-image text-2xl text-gray-300" />
                </div>
                <span class="text-xs text-gray-400">Recommended: 32×32px or 64×64px .ico/.png</span>
              </div>
              <input ref="faviconInput" type="file" class="hidden" accept="image/*, .ico" @change="e => handleImage(e, 'favicon')" />
            </div>
          </v-card-text>
        </v-card>

        <!-- 2. Theme Colors -->
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
            <i class="mdi mdi-palette text-gray-400" />Theme Colors
          </v-card-title>
          <v-card-text>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="colorKey in colorKeys" :key="colorKey.key">
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ colorKey.label }}</label>
                <div class="flex items-center gap-2">
                  <div class="relative">
                    <input
                      type="color"
                      :value="form.colors[colorKey.key]"
                      class="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                      @input="form.colors[colorKey.key] = $event.target.value"
                    />
                  </div>
                  <div class="flex-1">
                    <input
                      type="text"
                      :value="form.colors[colorKey.key]"
                      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                      @input="form.colors[colorKey.key] = $event.target.value"
                    />
                  </div>
                </div>
                <p class="text-xs text-gray-400 mt-1">{{ colorKey.hint }}</p>
              </div>
            </div>

            <!-- Color Preview -->
            <div class="mt-4 rounded-lg overflow-hidden border border-gray-200">
              <div class="p-4 flex items-center justify-between" :style="`background: ${form.colors.primary}`">
                <span class="font-bold text-white text-sm">Primary Button Preview</span>
                <span class="px-3 py-1 rounded text-xs font-semibold text-white border border-white/50">Click me</span>
              </div>
              <div class="p-4 flex items-center gap-3 bg-white">
                <span class="text-sm font-semibold" :style="`color: ${form.colors.primary}`">Primary Text</span>
                <span class="text-sm font-semibold" :style="`color: ${form.colors.accent}`">Accent Text</span>
                <span class="text-sm" :style="`color: ${form.colors.bodyText}`">Body text sample</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- 3. Typography -->
        <v-card>
          <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
            <i class="mdi mdi-format-font text-gray-400" />Typography
          </v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppSelect v-model="form.fonts.heading" label="Heading Font" :options="fontOptions" />
            <AppSelect v-model="form.fonts.body" label="Body Font" :options="fontOptions" />

            <!-- Font Preview -->
            <div class="border rounded-lg p-4 bg-gray-50">
              <div class="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-3">Preview</div>
              <div class="text-2xl font-bold mb-1" :style="`font-family: '${form.fonts.heading}', serif`">
                สัมผัสเสน่ห์ล้านนา
              </div>
              <div class="text-sm text-gray-600" :style="`font-family: '${form.fonts.body}', sans-serif`">
                ด้วยประสบการณ์กว่า 15 ปีในพื้นที่เชียงใหม่ เราเข้าใจความสุขของการเดินทาง
              </div>
            </div>

            <AppSelect v-model="form.fonts.size" label="Base Font Size" :options="['14px', '15px', '16px', '17px', '18px']" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ===== RIGHT COLUMN ===== -->
      <v-col cols="12" md="4">

        <!-- Global SEO Defaults -->
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
            <i class="mdi mdi-earth text-gray-400" />Global SEO
          </v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppInput v-model="form.seo.titleSuffix" label="Title Suffix" placeholder="| Lanna Heritage Travel" hint="Appended to every page title" />
            <AppTextarea v-model="form.seo.defaultDescription" label="Default Meta Description" rows="3" :counter="160" />
            <AppInput v-model="form.seo.googleAnalyticsId" label="Google Analytics ID" placeholder="G-XXXXXXXXXX" />
            <AppInput v-model="form.seo.facebookPixelId" label="Facebook Pixel ID" placeholder="123456789012345" />
            <div class="border-t pt-3 flex flex-col gap-3">
              <AppToggle v-model="form.seo.generateSitemap" label="Auto-generate Sitemap" />
              <AppToggle v-model="form.seo.allowIndexing" label="Allow Search Engine Indexing" />
            </div>
          </v-card-text>
        </v-card>

        <!-- Feature Flags -->
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
            <i class="mdi mdi-toggle-switch text-gray-400" />Feature Flags
          </v-card-title>
          <v-card-text class="flex flex-col gap-3">
            <AppToggle v-model="form.features.showReviews" label="Show Reviews Section" />
            <AppToggle v-model="form.features.showBlog" label="Show Blog / Articles" />
            <AppToggle v-model="form.features.showContactForm" label="Show Contact Form" />
            <AppToggle v-model="form.features.showLineChat" label="Show LINE Chat Widget" />
            <AppToggle v-model="form.features.maintenanceMode" label="Maintenance Mode" />
            <div v-if="form.features.maintenanceMode" class="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-700 flex gap-2 items-start">
              <i class="mdi mdi-alert mt-0.5" />
              Website will show a maintenance page to all visitors.
            </div>
          </v-card-text>
        </v-card>

        <!-- Navigation Menu Labels -->
        <v-card class="mb-4">
          <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
            <i class="mdi mdi-form-textbox text-gray-400" />Navigation Labels
          </v-card-title>
          <v-card-text class="flex flex-col gap-4">
            <AppInput v-model="form.menuHomeLabel" label="Home Menu Label" placeholder="หน้าแรก" />
            <AppInput v-model="form.menuServicesLabel" label="Services Menu Label" placeholder="บริการ" />
            <AppInput v-model="form.menuArticlesLabel" label="Articles Menu Label" placeholder="บทความ" />
            <AppInput v-model="form.menuReviewsLabel" label="Reviews Menu Label" placeholder="รีวิว" />
            <AppInput v-model="form.menuContactLabel" label="Contact Menu Label" placeholder="ติดต่อเรา" />
            <AppInput v-model="form.ctaBookLabel" label="CTA Button Label (Book)" placeholder="จองทัวร์" />
          </v-card-text>
        </v-card>

        <!-- Build & Cache — hidden until implemented -->
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const { request } = useApi()

const logoLightInput = ref(null)
const logoDarkInput = ref(null)
const faviconInput = ref(null)
const loading = ref(true)
const saving = ref(false)

const imageUploads = reactive({
  logoLight: false,
  logoDark: false,
  favicon: false,
})

const fontOptions = [
  'Sarabun', 'Noto Sans Thai', 'Prompt', 'Kanit', 'Mitr',
  'Inter', 'Playfair Display', 'Cormorant Garamond',
]

const colorKeys = [
  { key: 'primary', label: 'Primary Color', hint: 'Main brand color (buttons, links)' },
  { key: 'accent', label: 'Accent Color', hint: 'Highlights and decorative elements' },
  { key: 'background', label: 'Background', hint: 'Page background color' },
  { key: 'bodyText', label: 'Body Text', hint: 'Default paragraph text color' },
]

const form = reactive({
  logoLight: '',
  logoDark: '',
  favicon: '',
  siteName: '',
  tagline: '',
  colors: { primary: '#7B1B1B', accent: '#C8956C', background: '#F5F0EB', bodyText: '#2D2D2D' },
  fonts: { heading: 'Sarabun', body: 'Sarabun', size: '16px' },
  seo: {
    titleSuffix: '',
    defaultDescription: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    generateSitemap: true,
    allowIndexing: true,
  },
  features: {
    showReviews: true,
    showBlog: true,
    showContactForm: true,
    showLineChat: true,
    maintenanceMode: false,
  },
  menuHomeLabel: 'หน้าแรก',
  menuServicesLabel: 'บริการ',
  menuArticlesLabel: 'บทความ',
  menuReviewsLabel: 'รีวิว',
  menuContactLabel: 'ติดต่อเรา',
  ctaBookLabel: 'จองทัวร์',
})

function applyApiData(data) {
  form.logoLight = data.logoLightUrl || ''
  form.logoDark = data.logoDarkUrl || ''
  form.favicon = data.faviconUrl || ''
  form.siteName = data.siteName || ''
  form.tagline = data.tagline || ''
  form.colors.primary = data.colorPrimary || '#7B1B1B'
  form.colors.accent = data.colorAccent || '#C8956C'
  form.colors.background = data.colorBackground || '#F5F0EB'
  form.colors.bodyText = data.colorBodyText || '#2D2D2D'
  form.fonts.heading = data.fontHeading || 'Sarabun'
  form.fonts.body = data.fontBody || 'Sarabun'
  form.fonts.size = data.fontSizeBase || '16px'
  form.seo.titleSuffix = data.seoTitleSuffix || ''
  form.seo.defaultDescription = data.seoDefaultDescription || ''
  form.seo.googleAnalyticsId = data.googleAnalyticsId || ''
  form.seo.facebookPixelId = data.facebookPixelId || ''
  form.seo.generateSitemap = data.generateSitemap ?? true
  form.seo.allowIndexing = data.allowIndexing ?? true
  form.features.showReviews = data.featureShowReviews ?? true
  form.features.showBlog = data.featureShowBlog ?? true
  form.features.showContactForm = data.featureShowContactForm ?? true
  form.features.showLineChat = data.featureShowLineChat ?? true
  form.features.maintenanceMode = data.featureMaintenanceMode ?? false
  form.menuHomeLabel = data.menuHomeLabel || 'หน้าแรก'
  form.menuServicesLabel = data.menuServicesLabel || 'บริการ'
  form.menuArticlesLabel = data.menuArticlesLabel || 'บทความ'
  form.menuReviewsLabel = data.menuReviewsLabel || 'รีวิว'
  form.menuContactLabel = data.menuContactLabel || 'ติดต่อเรา'
  form.ctaBookLabel = data.ctaBookLabel || 'จองทัวร์'
}

let savedSnapshot = {}

async function fetchSettings() {
  loading.value = true
  try {
    const res = await request('/settings/global')
    applyApiData(res.data)
    savedSnapshot = JSON.parse(JSON.stringify(form))
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchSettings)

async function handleImage(e, field) {
  const file = e.target.files[0]
  if (!file) return
  imageUploads[field] = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('context', 'settings')
    const res = await request('/media/upload', { method: 'POST', body: formData })
    form[field] = res.data.url
  } catch (err) {
    console.error(err)
  } finally {
    imageUploads[field] = false
    e.target.value = ''
  }
}

function resetChanges() {
  Object.assign(form, JSON.parse(JSON.stringify(savedSnapshot)))
}

async function save() {
  saving.value = true
  try {
    const body = {
      siteName: form.siteName,
      tagline: form.tagline,
      logoLightUrl: form.logoLight,
      logoDarkUrl: form.logoDark,
      faviconUrl: form.favicon,
      colorPrimary: form.colors.primary,
      colorAccent: form.colors.accent,
      colorBackground: form.colors.background,
      colorBodyText: form.colors.bodyText,
      fontHeading: form.fonts.heading,
      fontBody: form.fonts.body,
      fontSizeBase: form.fonts.size,
      seoTitleSuffix: form.seo.titleSuffix,
      seoDefaultDescription: form.seo.defaultDescription,
      googleAnalyticsId: form.seo.googleAnalyticsId,
      facebookPixelId: form.seo.facebookPixelId,
      generateSitemap: form.seo.generateSitemap,
      allowIndexing: form.seo.allowIndexing,
      featureShowReviews: form.features.showReviews,
      featureShowBlog: form.features.showBlog,
      featureShowContactForm: form.features.showContactForm,
      featureShowLineChat: form.features.showLineChat,
      featureMaintenanceMode: form.features.maintenanceMode,
      menuHomeLabel: form.menuHomeLabel,
      menuServicesLabel: form.menuServicesLabel,
      menuArticlesLabel: form.menuArticlesLabel,
      menuReviewsLabel: form.menuReviewsLabel,
      menuContactLabel: form.menuContactLabel,
      ctaBookLabel: form.ctaBookLabel,
    }
    const res = await request('/settings/global', { method: 'PUT', body })
    applyApiData(res.data)
    savedSnapshot = JSON.parse(JSON.stringify(form))
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>
