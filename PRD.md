# 📄 Product Requirement Document (PRD)

**Project Name:** Dynamic Business Engine (DBE)  
**Concept:** Every Element is Configurable | SEO-First Strategy  
**Version:** 1.0 | **Status:** 🟢 Approved for Development

---

## 1. Executive Summary
ระบบบริหารจัดการเนื้อหา (CMS) ที่มีความยืดหยุ่นสูง ออกแบบมาเพื่อรองรับธุรกิจหลากหลายประเภท (เช่น ท่องเที่ยว, สุขภาพ, บริการ) โดยมีจุดเด่นดังนี้:
- **ทุกองค์ประกอบบนหน้าเว็บไซต์** (Text, Image, Layout) ต้องสามารถปรับแต่งได้จากระบบหลังบ้าน (Backoffice)
- **โครงสร้างรองรับ SEO ระดับสูงสุด** ตั้งแต่วันแรกที่เริ่มพัฒนา

---

## 2. System Architecture Overview
ระบบถูกแบ่งออกเป็น 3 ส่วนหลักที่ต้องทำงานสอดประสานกัน:

1. **🖥️ Frontend Repository**
   - แสดงผลแบบ Dynamic ตามข้อมูลที่ได้รับจาก API (Section-based Rendering)
2. **⚙️ Backend / API Repository**
   - จัดการ Data Schema แบบ Generic, Logic ความสัมพันธ์ (Relationship) และ SEO Engine
3. **🛠️ Backoffice (BOF) Repository**
   - ส่วนจัดการ Content, Metadata และการตั้งค่าระบบสำหรับ Admin

---

## 3. Key Functional Requirements

### 3.1 Dynamic Content & Layout (Frontend & BOF)
- **Section Management:** หน้าบ้านต้องถูกออกแบบเป็น Components (เช่น Hero, Services, Articles, Testimonials) ที่สามารถเปิด-ปิด หรือสลับลำดับได้ผ่าน BOF
- **Global Config:** สามารถเปลี่ยน Logo, Primary Color, Secondary Color และ Font ได้จากระบบหลังบ้าน
- **Asset Control:** ทุกไฟล์รูปภาพต้องสามารถอัปโหลดใหม่และกำหนด Alt Text ได้ เพื่อประโยชน์ทาง SEO
- **Content Specific Metadata:** แต่ละ Module จะมี Data Field พิเศษเสริม เช่น Review (Trip Photo, Review of the Month) และ Article (อัปโหลด Featured Image, เวลาอ่าน/Reading Time)

### 3.2 Dynamic Taxonomy & Relations (Backend & BOF)
- **Custom Categories:** ผู้ใช้งานสามารถสร้างหมวดหมู่ (Categories) และป้ายกำกับ (Tags) ได้เองในทุก Module (เช่น Services, Articles, Reviews)
- **Entity Linking (Relations):** ระบบต้องรองรับการสร้างความสัมพันธ์ข้ามข้อมูล เช่น:
  - เชื่อมโยง **"รีวิวลูกค้า"** เข้ากับ **"รายการบริการ"** ที่เฉพาะเจาะจง
  - เชื่อมโยง **"บทความแนะนำ"** เข้ากับ **"บริการ"** ที่เกี่ยวข้อง
  - *Logic:* โครงสร้างความสัมพันธ์ต้องถูกเก็บในรูปแบบ Many-to-Many เพื่อความยืดหยุ่น
  
### 3.3 SEO Engine (Priority #1) 🚀
- **Per-Page SEO Control:** ทุกหน้า (รวมถึงหน้าหมวดหมู่) ต้องมีฟิลด์สำหรับจัดการ:
  - Custom URL Slug (เช่น `/health/detox-program`)
  - Meta Title & Meta Description (พร้อมระบบนับตัวอักษร)
  - Canonical Tags
- **Global SEO Config:** ระบบรองรับการตั้งค่า Default Title Suffix, Meta Description และการฝัง Tracking Codes ต่างๆ (เช่น Google Analytics ID, Facebook Pixel ID) ควบคุมได้จากหลังบ้าน
- **Automated Schema Markup:** ระบบต้องครอบคลุมการ Generate `JSON-LD` อัตโนมัติ (เช่น Article, Service, Review, FAQ Schema)
- **Automated Sitemap:** ไฟล์ `sitemap.xml` ต้องถูกอัปเดตโดยอัตโนมัติเมื่อมีการเพิ่ม/ลบเนื้อหา
- **Internal Linking:** ระบบ Text Editor ใน BOF ต้องอำนวยความสะดวกในการแทรก Internal Link

### 3.4 Feature Flags & System Toggles
- **Module Control:** มีระบบเปิด-ปิดการแสดงผลของแต่ละ Module (เช่น Blog, Review, Contact Form) ได้โดยตรงจากฝั่ง BOF
- **Maintenance Mode:** รองรับการเปิด-ปิด Maintenance โหมด เมื่อระบบต้องการอัปเดตใหญ่

---

## 4. Technical Specifications (For Repositories)

### 🚀 Frontend (Next.js / React)
- **SEO Optimization:** ใช้งาน Server-Side Rendering (SSR) เพื่อให้ Search Engine Bot เก็บข้อมูลได้ครบถ้วน
- **Core Web Vitals:** ต้องสอบผ่านเกณฑ์ LCP, FID และ CLS (ได้คะแนน "สีเขียว" หรือ 90+ บน Mobile)
- **Responsive Design:** แสดงผลสมบูรณ์ในทุกขนาดหน้าจอ (ยึดหลัก Mobile First)

### ⚙️ Backend / API (Node.js / Go / Python)
- **Generic Schema:** ออกแบบ Database Structure ที่ไม่ยึดติดกับชื่อธุรกิจ (ตัวอย่าง: ตาราง `posts` ที่มี `post_type` เป็น `'service'` หรือ `'article'`)
- **Image Processing:** มีระบบแปลงไฟล์รูปภาพเป็น `.webp` และ Resize อัตโนมัติในขั้นตอนการอัปโหลด
- **Caching:** ใช้งานระบบ Cache เพื่อลดภาระของ Database และเพิ่มความเร็วในการ Render หน้าเว็บ

### 🛠️ Backoffice (React / Vue)
- **Centralized Relationship Manager:** มีหน้าจัดการความสัมพันธ์ระหว่าง Entity รวมศูนย์ (เช่น Service ↔ Review, Article ↔ Service) แยกส่วนชัดเจน เพื่อง่ายต่อการบริหารความสัมพันธ์ข้าม Module ที่มีมากมาย
- **SEO Preview:** สามารถแสดงตัวอย่างผลการค้นหาบน Google (Search Result Preview) แบบ Real-time ขณะที่ Admin กำลังกรอกข้อมูล

---

## 5. User Stories (ตัวอย่างการใช้งาน)

> **ในฐานะ Admin:** ฉันต้องการสร้างหมวดหมู่ "บริการสุขภาพ" และผูกรีวิวจากลูกค้าเข้ากับบริการนั้น เพื่อเพิ่มความน่าเชื่อถือ
>
> **ในฐานะ Admin:** ฉันต้องการแก้ไข URL Slug ของบทความเก่าให้ตรงกับ Keyword ที่ Google แนะนำ เพื่อทำอันดับให้ดีขึ้น
>
> **ในฐานะ User:** ฉันต้องการอ่านบทความที่เกี่ยวข้องกับบริการที่ฉันกำลังดูอยู่ เพื่อหาข้อมูลประกอบการตัดสินใจ

---

## 6. Success Metrics

- ⚡ **Performance:** คะแนน Google PageSpeed Insights (Mobile) `>= 90`
- 🧩 **Flexibility:** สามารถเปลี่ยนเนื้อหาเว็บจากธุรกิจ "ท่องเที่ยว" เป็น "บริการที่ปรึกษา" ได้โดยไม่ต้องเข้ามาแก้ไข Code (Zero Code Changes)
- 📈 **SEO Readiness:** ทุกหน้ามี Schema Markup และ Meta Tags ครบถ้วนตามมาตรฐานเชิงลึกของ Google

---

**Document Owner:** Project Manager  
**Contact:** [Your Team / Repo URL]