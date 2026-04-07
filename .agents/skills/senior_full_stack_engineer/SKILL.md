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

---

## Component Architecture Guidelines

### 1. ห้ามใช้ Vuetify Input Components โดยตรง
ใช้ custom Tailwind CSS components แทน `v-text-field`, `v-textarea`, `v-select` เสมอ เพื่อความสม่ำเสมอและหลีกเลี่ยงปัญหา label/placeholder overlap ใน Vuetify 4

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
