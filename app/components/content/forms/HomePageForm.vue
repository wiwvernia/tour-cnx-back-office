<template>
  <v-row>
    <!-- ========== LEFT COLUMN ========== -->
    <v-col cols="12" md="8">

      <!-- 1. Hero Section -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
          <i class="mdi mdi-image-area text-gray-400" />
          Hero Section
        </v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <!-- BG Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Background Image</label>
            <div
              class="relative border-2 border-dashed rounded-lg overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
              :class="form.hero.bgImage ? 'border-gray-300' : 'border-gray-200 py-8 text-center'"
              @click="triggerUpload('heroImage')"
            >
              <img
                v-if="form.hero.bgImage"
                :src="form.hero.bgImage"
                class="w-full h-48 object-cover"
              />
              <template v-else>
                <i class="mdi mdi-image-plus text-5xl text-gray-300" />
                <p class="mt-2 text-sm text-gray-400">Upload hero background image</p>
                <p class="text-xs text-gray-300 mt-1">Recommended: 1920×1080px</p>
              </template>
            </div>
            <input ref="heroImageInput" type="file" class="hidden" accept="image/*" @change="e => handleImage(e, 'hero', 'bgImage')" />
            <!-- [AUDIT FIX] Alt Text -->
            <AppInput v-model="form.hero.bgImageAlt" label="Background Image Alt Text" placeholder="Aerial view of Chiang Mai ancient temples" class="mt-3" />
          </div>

          <AppInput v-model="form.hero.heading" label="Main Heading" placeholder="สัมผัสเสน่ห์ล้านนา เที่ยวเชียงใหม่กับเรา" />
          <AppTextarea v-model="form.hero.subheading" label="Sub-heading / Tagline" rows="2" placeholder="ดิ่มด่ำกับวัฒนธรรมที่สุ่มลึก…" />

          <v-row dense>
            <v-col cols="12" sm="6">
              <div class="flex flex-col gap-2">
                <span class="text-sm font-medium text-gray-700">Primary Button</span>
                <AppInput v-model="form.hero.primaryBtn.text" placeholder="จองทัวร์เลย" />
                <AppInput v-model="form.hero.primaryBtn.link" placeholder="/contact" />
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="flex flex-col gap-2">
                <span class="text-sm font-medium text-gray-700">Secondary Button</span>
                <AppInput v-model="form.hero.secondaryBtn.text" placeholder="ดูแพ็กเกจ" />
                <AppInput v-model="form.hero.secondaryBtn.link" placeholder="/services" />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- 2. Philosophy Section -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
          <i class="mdi mdi-leaf text-gray-400" />
          Philosophy / About Section
        </v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="flex flex-col gap-4">
                <AppInput v-model="form.philosophy.sectionLabel" label="Section Badge" placeholder="OUR PHILOSOPHY" />
                <AppInput v-model="form.philosophy.heading" label="Heading" placeholder="ประสบการณ์การเดินทางที่เหนือกว่า…" />
                <AppTextarea v-model="form.philosophy.description" label="Description" rows="3" placeholder="ด้วยประสบการณ์กว่า 15 ปี…" />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <label class="block text-sm font-medium text-gray-700 mb-1.5">Section Image</label>
              <div
                class="border-2 border-dashed rounded-lg overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
                :class="form.philosophy.image ? 'border-gray-300' : 'border-gray-200 py-6 text-center'"
                @click="triggerUpload('philosophyImage')"
              >
                <img
                  v-if="form.philosophy.image"
                  :src="form.philosophy.image"
                  class="w-full h-40 object-cover"
                />
                <template v-else>
                  <i class="mdi mdi-image-plus text-4xl text-gray-300" />
                  <p class="mt-1 text-xs text-gray-400">Upload image</p>
                </template>
              </div>
              <input ref="philosophyImageInput" type="file" class="hidden" accept="image/*" @change="e => handleImage(e, 'philosophy', 'image')" />
              <!-- [AUDIT FIX] Alt Text -->
              <AppInput v-model="form.philosophy.imageAlt" label="Image Alt Text" placeholder="Traditional Lanna craftsmanship" class="mt-3" />
            </v-col>
          </v-row>

          <!-- Quote Card -->
          <div class="border rounded-lg p-4 bg-gray-50 flex flex-col gap-3">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quote Card (overlay)</span>
            <AppInput v-model="form.philosophy.quote.text" label="Quote Text" placeholder='"ความใส่ใจคือหัวใจของเรา"' />
            <AppTextarea v-model="form.philosophy.quote.description" label="Quote Description" rows="2" placeholder="เราคัดสรรทุกรายละเอียด…" />
          </div>

          <!-- Feature Bullets -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Feature Bullets (3 items)</label>
            <div v-for="(feat, i) in form.philosophy.features" :key="i" class="flex gap-2 mb-2 items-center">
              <div class="w-32 shrink-0">
                <AppInput v-model="feat.icon" placeholder="mdi-shield-check" />
              </div>
              <div class="flex-1">
                <AppInput v-model="feat.text" :placeholder="defaultFeatureTexts[i]" />
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- 3. Featured Services Section -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
          <i class="mdi mdi-star-circle-outline text-gray-400" />
          Featured Services Section
        </v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppInput v-model="form.featuredServices.heading" label="Section Heading" placeholder="บริการแนะนำ" />
          <AppInput v-model="form.featuredServices.subtitle" label="Section Subtitle" placeholder="ออกแบบมาเพื่อความสุขสงบและแรงบันดาลใจ" />
          <AppInput v-model="form.featuredServices.linkText" label="Link Text (View All)" placeholder="ดูบริการทั้งหมด" />
          <div class="rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm text-blue-600 flex gap-2 items-start">
            <i class="mdi mdi-information-outline mt-0.5" />
            <span>Service cards are automatically pulled from the <strong>Services</strong> section. Mark a service as "Featured" to display it here.</span>
          </div>
        </v-card-text>
      </v-card>

      <!-- 4. Reviews Section -->
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
          <i class="mdi mdi-star-outline text-gray-400" />
          Testimonials Section
        </v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppInput v-model="form.testimonials.heading" label="Section Heading" placeholder="รีวิวจากลูกค้าของเรา" />
          <AppInput v-model="form.testimonials.subtitle" label="Subtitle" placeholder="เสียงจากผู้ร่วมเดินทาง" />
          <div class="rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm text-blue-600 flex gap-2 items-start">
            <i class="mdi mdi-information-outline mt-0.5" />
            <span>Review cards are automatically pulled from <strong>Reviews & Testimonials</strong>. Reviews marked as "Review of the Month" will be highlighted.</span>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- ========== RIGHT COLUMN ========== -->
    <v-col cols="12" md="4">

      <!-- [AUDIT FIX] Section Reordering / Visibility -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
          <i class="mdi mdi-order-bool-ascending text-gray-400" />
          Section Order & Visibility
        </v-card-title>
        <v-card-text class="pa-3">
          <p class="text-xs text-gray-500 mb-3">Drag to reorder • Toggle to show/hide sections</p>
          <div
            v-for="(section, index) in sectionOrder"
            :key="section.key"
            class="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg border border-gray-100 bg-gray-50 cursor-grab hover:bg-white transition-colors"
          >
            <i class="mdi mdi-drag-vertical text-gray-300 text-xl shrink-0" />
            <span class="text-sm font-medium text-gray-700 flex-1">{{ section.label }}</span>
            <v-switch
              v-model="section.visible"
              density="compact"
              hide-details
              color="primary"
              class="shrink-0"
            />
          </div>
        </v-card-text>
      </v-card>

      <!-- SEO / Meta -->
      <v-card class="mb-4">
        <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center">
          SEO
          <span class="ml-auto inline-block px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-700">Excellent</span>
        </v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <div class="bg-white border rounded p-3 shadow-sm" style="font-family: Arial, sans-serif;">
            <div class="text-xs text-blue-800 mb-1">https://example.com/</div>
            <div class="text-sm text-blue-600 font-medium mb-1 leading-tight">{{ form.seo.title || 'หน้าแรก' }}</div>
            <div class="text-xs text-gray-500 line-clamp-2">{{ form.seo.description || '–' }}</div>
          </div>
          <AppInput v-model="form.seo.title" label="Page Title" placeholder="หน้าแรก - Lanna Heritage Travel" />
          <AppTextarea v-model="form.seo.description" label="Meta Description" rows="3" :counter="160" hint="150-160 characters" />
          <AppToggle v-model="form.seo.inSitemap" label="Include in Sitemap" />
          <AppToggle v-model="form.seo.autoSchema" label="Auto JSON-LD Schema" />
        </v-card-text>
      </v-card>

      <!-- Footer -->
      <v-card>
        <v-card-title class="pa-4 pb-2 text-base font-semibold flex items-center gap-2">
          <i class="mdi mdi-page-layout-footer text-gray-400" />
          Footer
        </v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <AppInput v-model="form.footer.brandName" label="Brand Name" placeholder="Lanna Heritage" />
          <AppTextarea v-model="form.footer.tagline" label="Brand Tagline" rows="2" placeholder="มอบประสบการณ์การท่องเที่ยวแบบเบ็ดเสร็จ…" />

          <div class="border-t pt-4 flex flex-col gap-3">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact Info</span>
            <AppInput v-model="form.footer.address" label="Address" placeholder="ถนนท่าแพ เชียงใหม่" />
            <AppInput v-model="form.footer.phone" label="Phone" placeholder="053-XXX-XXXX" />
            <AppInput v-model="form.footer.email" label="Email" placeholder="hello@lannaheritage.com" />
          </div>

          <div class="border-t pt-4 flex flex-col gap-3">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Social Media</span>
            <AppInput v-model="form.footer.tiktok" label="TikTok URL" placeholder="https://tiktok.com/@…" />
            <AppInput v-model="form.footer.instagram" label="Instagram URL" placeholder="https://instagram.com/…" />
          </div>

          <div class="border-t pt-4">
            <AppInput v-model="form.footer.copyright" label="Copyright Text" placeholder="© 2024 Lanna Heritage Travel. All rights reserved." />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
})

const heroImageInput = ref(null)
const philosophyImageInput = ref(null)

// [AUDIT FIX] Section reorder & visibility
const sectionOrder = ref([
  { key: 'hero', label: 'Hero Section', visible: true },
  { key: 'philosophy', label: 'Philosophy / About', visible: true },
  { key: 'featuredServices', label: 'Featured Services', visible: true },
  { key: 'testimonials', label: 'Testimonials / Reviews', visible: true },
])

const defaultFeatureTexts = [
  'การบริการที่เชื่อถือได้ระดับมืออาชีพ',
  'เส้นทางท่องเที่ยวที่ดำเนิงเส้นสัมผัสและสุมสน',
  'มาตรฐานที่พักและยานพาหนะระดับ 5 ดาว',
]

const form = reactive({
  hero: {
    bgImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=1920',
    bgImageAlt: 'Aerial view of Chiang Mai ancient temples at sunrise', // [AUDIT FIX]
    heading: 'สัมผัสเสน่ห์ล้านนา\nเที่ยวเชียงใหม่\nกับเรา',
    subheading: 'ดิ่มด่ำกับวัฒนธรรมที่สุ่มลึกและการดูแลระดับพรีเมียม เพื่อให้การพักผ่อนของคุณคือความทรงจำที่ล้ำค่าที่สุดในชีวิต',
    primaryBtn: { text: 'จองทัวร์เลย', link: '/contact' },
    secondaryBtn: { text: 'ดูแพ็กเกจ', link: '/services' },
  },
  philosophy: {
    sectionLabel: 'OUR PHILOSOPHY',
    heading: 'ประสบการณ์การเดินทางที่เหนือกว่าความคาดหมาย',
    description: 'ด้วยประสบการณ์กว่า 15 ปีในพื้นที่เชียงใหม่ เราเข้าใจความสุขของการเดินทางสำหรับผู้ใหญ่ที่ต้องการความสะดวกสบาย ความปลอดภัย และเรื่องราวที่น่าสนใจในเบื้องหลังสถานที่ท่องเที่ยวแต่ละแห่ง',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'Traditional Lanna craftsmanship and heritage', // [AUDIT FIX]
    quote: {
      text: '"ความใส่ใจคือหัวใจของเรา"',
      description: 'เราคัดสรรทุกรายละเอียดด้วยความสำนึก เติมเต็มด้วยประสบการณ์ที่ปลอดภัย สงบ และเติบโนด้วยคุณภาพเพื่อนักเดินทางที่มีประสบการณ์สูง',
    },
    features: [
      { icon: 'mdi-shield-check', text: 'การบริการที่เชื่อถือได้ระดับมืออาชีพ' },
      { icon: 'mdi-map-marker-path', text: 'เส้นทางท่องเที่ยวที่ดำเนิงเส้นสัมผัสและสุมสน' },
      { icon: 'mdi-star', text: 'มาตรฐานที่พักและยานพาหนะระดับ 5 ดาว' },
    ],
  },
  featuredServices: {
    heading: 'บริการแนะนำ',
    subtitle: 'ออกแบบมาเพื่อความสุขสงบและแรงบันดาลใจ',
    linkText: 'ดูบริการทั้งหมด',
  },
  testimonials: {
    heading: 'รีวิวจากลูกค้าของเรา',
    subtitle: 'เสียงจากผู้ร่วมเดินทาง',
  },
  seo: {
    title: 'หน้าแรก - Lanna Heritage Travel',
    description: 'สัมผัสเสน่ห์ล้านนาและประสบการณ์การท่องเที่ยวระดับพรีเมียมในเชียงใหม่ กับ Lanna Heritage Travel',
    inSitemap: true,
    autoSchema: true,
  },
  footer: {
    brandName: 'Lanna Heritage',
    tagline: 'มอบประสบการณ์การท่องเที่ยวแบบเบ็ดเสร็จ เติมความประทับใจและความเป็นส่วนตัว',
    address: 'ถนนท่าแพ เชียงใหม่',
    phone: '053-XXX-XXXX',
    email: 'hello@lannaheritage.com',
    tiktok: 'https://tiktok.com/@lannaheritage',
    instagram: 'https://instagram.com/lannaheritage',
    copyright: '© 2024 Lanna Heritage Travel. All rights reserved.',
  },
  ...props.initialData,
})

function triggerUpload(ref) {
  if (ref === 'heroImage') heroImageInput.value?.click()
  if (ref === 'philosophyImage') philosophyImageInput.value?.click()
}

function handleImage(e, section, field) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => { form[section][field] = ev.target.result }
  reader.readAsDataURL(file)
}

defineExpose({ getData: () => JSON.parse(JSON.stringify(form)) })
</script>
