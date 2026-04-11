---
name: "Senior Full Stack Software Engineer"
description: "Guidelines and instructions for the Senior Full Stack Software Engineer role, focusing on Frontend, Security, and Docker."
---

# 💻 Senior Full Stack Software Engineer

พัฒนาและดูแลระบบทั้ง Frontend และ Backend โดยเน้นหนักไปที่ความเชี่ยวชาญด้าน Frontend ควบคู่ไปกับการให้ความสำคัญกับความปลอดภัยระดับสูง (Security) และโครงสร้างพื้นฐานผ่าน Docker

**Tech Stack หลักของโปรเจกต์:**
- **Nuxt.js** (Vue.js Framework สำหรับโครงสร้างแอปพลิเคชันหลัก)
- **Vuetify** (UI Component Library)
- **Tailwind CSS** (Utility-first CSS สำหรับการจัดแต่งหน้าตาอย่างรวดเร็วและยืดหยุ่น)
- **Docker** (สำหรับการทำ Containerization และ Deployment)

**หน้าที่และความรับผิดชอบ:**
- **Frontend Excellence:** เป็นผู้นำในการออกแบบและพัฒนาฝั่ง Frontend ประยุกต์ใช้ Nuxt.js, Vuetify และ Tailwind CSS ให้ทำงานสอดประสานกันอย่างมีประสิทธิภาพและได้มาตรฐาน (Clean Code, Reusability, Responsive)
- **Security-First Approach & Anti-Hack:** นำหลักการออกแบบที่เน้นความปลอดภัยมาใช้ (Secure by Design) มีความตระหนักรู้และป้องกันช่องโหว่ต่างๆ (เช่น XSS, CSRF, Injection, Data Leakage) รวมถึงมีการตรวจสอบความปลอดภัย (Code Audit) ก่อนนำขึ้นระบบจริง
- **Docker & Containerization:** ออกแบบและปรับแต่ง Dockerfile รวมถึง docker-compose ให้มีขนาดเล็กและปลอดภัยครอบคลุมตั้งแต่กระบวนการ Development ไปจนถึง Production Deployment ให้ทำงานได้ต่อเนื่องและไร้รอยต่อ
- **Nuxt 4 / Modern Directory Structure:** นำแนวทางการจัดเก็บไฟล์ของ Nuxt 4 มาใช้เพื่อความเป็นระเบียบ โดยเก็บโค้ดแอปพลิเคชันทั้งหมด (Components, Pages, Plugins, Layouts) ไว้ในโฟลเดอร์ `app/` และเก็บ config files (nuxt.config.ts, tailwind.config.ts) ไว้ที่ root แทน
- **SSR & Client-side Libraries:** มีความเข้าใจในการจัดการ Library ที่เรียกใช้ browser-only globals (เช่น `document`, `window`) โดยใช้เทคนิค `.client.vue` component extension และห่อหุ้มด้วย `<ClientOnly>` เพื่อป้องกัน SSR Error (เช่นการใช้ Quill Editor)
- **Nuxt Cache Management:** เมื่อมีการเปลี่ยนแปลงโครงสร้างไฟล์สำคัญหรือ extension (เช่น `.vue` -> `.client.vue`) ควรลบ `.nuxt` cache และรันใหม่ (`rm -rf .nuxt && npm run dev`) เพื่อป้องกัน IPC connection errors และ build mismatch

---

## Component Architecture Guidelines

### 1. การจัดการ Input Components
- **Vuetify 3/4 Gotchas:** เมื่อใช้ `label` และ `placeholder` ร่วมกันใน Vuetify ต้องใส่พรอป `persistent-placeholder` เสมอ เพื่อป้องกันปัญหา label ลอยทับ placeholder (overlap) ขณะที่ยังไม่มีการกรอกข้อมูล
- **Best Practice:** ควรห่อหุ้ม Vuetify components เป็น Custom Tailwind components (`components/common/`) เพื่อความง่ายในการปรับแต่งสไตล์และควบคุม behavior ที่ต้องการในครั้งเดียวทั้งโปรเจกต์

### 2. Common UI Components (`components/common/`)
| Component | ใช้แทน | Props หลัก |
|-----------|--------|-----------|
| `AppBtn` | `v-btn` | `variant` (solid/outline/ghost), `color` (primary/secondary/danger), `size` (md/sm), `icon`, `to`, `prependIcon` |
| `AppInput` | `v-text-field` | `v-model`, `label`, `placeholder`, `required`, `hint`, `counter` |
| `AppTextarea` | `v-textarea` | `v-model`, `label`, `rows`, `maxlength`, `hint` |
| `AppSelect` | `v-select` | `v-model`, `label`, `options` (string[] หรือ {label,value}[]), `placeholder`, `required` |
| `AppInputGroup` | `v-text-field` with prefix | `v-model`, `label`, `prefix`, `hint` |
| `AppTable` | `v-table` | `columns` ([{key, label}]), `rows`, `rowKey` — ใช้ slot ชื่อ `col.key` สำหรับ custom cell |

**Button Variant Guidelines:**
- `solid primary` — Primary action (Save, Publish, Add)
- `outline secondary` — Secondary action (Cancel draft, Manage)
- `ghost primary/secondary` — Tertiary action (Edit, View)
- `ghost danger` — Destructive action (Delete, Remove)

### 3. Form Components (`components/content/forms/`)
- **`ServiceForm`** — จัดการ form ทั้งหมดของ Service (Basic Info + Content + SEO + Publish sidebar) ใช้ `defineExpose({ getData })` เพื่อให้ page เรียก `formRef.value.getData()` ตอน save
- **`CategoryForm`** — form สำหรับ Category (name + slug) ใช้งานใน Dialog พร้อม `:key="formKey"` เพื่อ force re-mount เมื่อเปลี่ยน item

### 4. Component Organization
- ใช้ `pathPrefix: false` ใน `nuxt.config.ts` เพื่อให้ component auto-import ด้วยชื่อไฟล์ ไม่ติด directory prefix
- **`components/common/`** — UI primitives ที่ใช้ซ้ำทั่วทั้งโปรเจกต์
- **`components/content/`** — components เฉพาะ content domain
- **`components/content/forms/`** — form components ระดับ feature

### 5. Vuetify 4 Compatibility Notes
- ใช้ `v-divider` แทน `v-list-divider` (ถูกลบออกใน Vuetify 4)
- ไม่มี `color="accent"` ใน Vuetify 4 — ใช้ `teal-darken-2` หรือสีอื่นแทน
- `v-btn`, `v-card`, `v-dialog`, `v-table`, `v-chip`, `v-icon` ยังคงใช้งาน Vuetify ได้ตามปกติ
- Script `<script setup>` ไม่รองรับ TypeScript `as` cast หากไม่มี `lang="ts"` — ใช้ `$event.target.value` ตรงๆ แทน
- Force light theme โดยตั้ง `theme: { defaultTheme: 'light' }` ใน `app/plugins/vuetify.ts` เพื่อป้องกัน dark mode จาก system `prefers-color-scheme`

### 6. Extended Common Components
| Component | ใช้แทน | หมายเหตุ |
|-----------|--------|---------|
| `AppToggle` | `v-switch` | Tailwind peer + `after:` pseudo-element pattern — ห้ามใช้ nested div แยกสำหรับ thumb |
| `AppTagInput` | `v-combobox` | Enter เพิ่ม tag, Backspace บน empty ลบ tag สุดท้าย |
| `AppDatePicker` | `<input type="date">` | `v-menu` + `v-date-picker` แปลง YYYY-MM-DD ↔ Date, แสดงผล th-TH locale |
| `AppStarRating` | `v-btn` loop | 5 ดาว clickable, yellow fill + hover scale |

### 7. Extended Form Components
| Form | Feature หลัก |
|------|------------|
| `ArticleForm` | date (AppDatePicker), isFeatured (AppToggle), tags (AppTagInput), readingTime, author, SEO |
| `ReviewForm` | AppStarRating, linkedServiceId (AppSelect), relatedArticles (checkbox list), AppToggle isMonthly |
| `HomePageForm` | Hero/Philosophy/FeaturedServices/Testimonials sections + Section Order drag-and-drop + SEO + Footer |
| `AccountForm` | avatar upload, name, email, password — มี "Change password" toggle สำหรับ edit mode |

### 8. Dialog & Re-mount Pattern
- ใช้ `:key="formKey"` บน form component ใน dialog และ increment `formKey` ใน `openDialog()` เสมอ — เพื่อ force fresh reactive state เมื่อเปลี่ยน item
- `defineExpose({ getData: () => ({ ...form }) })` ทุก form component — parent เรียก `formRef.value?.getData()` ตอน save

### 9. Drag & Drop (Native HTML5)
- ไม่ต้องติดตั้ง library เพิ่ม — ใช้ `draggable="true"` + `@dragstart` / `@dragover.prevent` / `@dragend`
- Pattern สำหรับ reorder list:
  ```js
  function onDragOver(index) {
    if (dragIndex.value === null || dragIndex.value === index) return
    const items = [...list.value]
    const [moved] = items.splice(dragIndex.value, 1)
    items.splice(index, 0, moved)
    list.value = items
    dragIndex.value = index  // อัปเดต index ทันทีใน dragover
  }
  ```
- Highlight item ที่กำลังลากด้วย `:class="dragIndex === index ? 'border-blue-400 bg-blue-50 opacity-70' : '...'"` และ `cursor-grabbing` vs `cursor-grab`

### 10. Filter Row Alignment (Search + Select + Toggle)
- ใช้ `items-end` บน flex container เพื่อ align ล่างสุด เมื่อมี elements ที่มี label ด้านบน
- Toggle ที่อยู่ใน row เดียวกับ Select (มี label) ต้องเพิ่ม invisible spacer เพื่อ align:
  ```html
  <div class="flex flex-col justify-end">
    <span class="block text-sm font-medium mb-1.5" style="visibility: hidden;">&nbsp;</span>
    <AppToggle v-model="..." label="..." />
  </div>
  ```

### 11. Singleton Settings Pages
- หน้า Settings ที่เป็น singleton (Contact Settings, Global Settings) ไม่มี list — ใช้ `GET /settings/xxx` + `PUT /settings/xxx`
- ใช้ `reactive()` + `Object.assign(form, JSON.parse(JSON.stringify(snapshot)))` สำหรับ Discard changes

### 12. API Documentation Convention
- เมื่อ feature frontend สมบูรณ์แล้ว ให้สร้าง `API_DOC.md` ที่ root ของ project ครอบคลุม:
  - Database Schema (ทุก table พร้อม field types, constraints, FK)
  - REST Endpoints พร้อม request/response examples จริง
  - Error codes standard (`VALIDATION_ERROR`, `NOT_FOUND`, `CONFLICT` ฯลฯ)
  - ERD summary
- Naming convention: camelCase ใน JSON payload, snake_case ใน database

### 13. Page Architecture Patterns
- **Generic CMS page** (`content/[id].vue`) — detect `id === 'home'` เพื่อ render `HomePageForm` แทน generic editor
- **Singleton resource pages** (settings, contact) — ไม่มี create/delete — มีแค่ save + discard
- **Account management** — ต้องมี "cannot ban/delete self" guard: `v-if="row.id !== currentUserId"` บนปุ่ม ban/delete
- **Entity Relationships page** — ใช้ tab pill filter แยก relation type พร้อม badge count, กัน duplicate ก่อน create link
