# TourCNX Backoffice — API Documentation & Database Schema

> **Version:** 1.2.0
> **Last Updated:** 2026-04-12
> **Implementation Status:** Phase 1 complete (Auth, Users, Settings)
> **Base URL:** `https://api.tourcnx.com/v1`
> **Auth:** Bearer JWT (all endpoints require `Authorization: Bearer <token>` unless marked **Public**)

---

## Table of Contents

1. [Conventions & Naming](#conventions--naming)
2. [Authentication](#authentication)
3. [Database Schema](#database-schema)
4. [Validation Rules](#validation-rules)
5. [Business Logic & Constraints](#business-logic--constraints)
6. [API Endpoints](#api-endpoints)
   - [Auth](#auth)
   - [Admin Users](#admin-users)
   - [Service Categories](#service-categories)
   - [Services](#services)
   - [Article Categories](#article-categories)
   - [Articles](#articles)
   - [Reviews](#reviews)
   - [Inquiries](#inquiries)
   - [Contact Settings](#contact-settings)
   - [Entity Relationships](#entity-relationships)
   - [Page Content (CMS)](#page-content-cms)
   - [Global Settings](#global-settings)
   - [Media Upload](#media-upload)
7. [Error Codes](#error-codes)
8. [Entity Relationship Diagram](#entity-relationship-diagram)

---

## Conventions & Naming

### Request / Response Format
- All bodies: `Content-Type: application/json`
- Timestamps: ISO 8601 — `"2024-03-20T14:30:00Z"`
- Date-only fields: `"YYYY-MM-DD"`
- **JSON keys:** camelCase in all request/response payloads
- **Database columns:** snake_case — backend handles mapping automatically
- Pagination: `?page=1&limit=20` — defaults: `page=1`, `limit=20`, max `limit=100`

### Standard List Response
```json
{
  "data": [ ...items ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

### Standard Single Item Response
```json
{ "data": { ...item } }
```

### Content Status Enum
| Value | Description |
|---|---|
| `draft` | Saved but not visible on frontend |
| `published` | Live and visible on frontend |
| `archived` | Hidden from frontend, kept for records (articles only) |

### Soft Delete Policy
- **Services, Articles, Reviews, Inquiries:** Soft-delete — set `deleted_at` timestamp, filter out in all queries by default.
  All tables above must have: `deleted_at TIMESTAMP nullable`
- **Categories, Users, Media:** Hard delete — validated before deletion (see Business Logic)
- **Settings / Page Content:** Never deleted — only updated

---

## Authentication

JWT-based. Two-token flow with **refresh token rotation** (every refresh issues a new refresh token and revokes the old one).

| Token | Type | Expiry | Storage |
|---|---|---|---|
| `accessToken` | JWT (HS256) | 1 hour | Memory / short-lived |
| `refreshToken` | Opaque hex string (SHA-256 hashed in DB) | 30 days | HttpOnly Cookie recommended |

> **Default admin:** `admin@tourcnx.com` / `Admin1234` — seeded by migration 000005. Change password immediately after first login.

---

## Database Schema

### Table: `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK, default gen_random_uuid() | |
| `name` | VARCHAR(100) | NOT NULL | Full display name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| `password_hash` | VARCHAR(255) | NOT NULL | bcrypt (min cost 12) |
| `avatar_url` | VARCHAR(500) | nullable | Profile photo URL |
| `role` | VARCHAR(20) | NOT NULL, default `'admin'` | Only `'admin'` for now |
| `is_banned` | BOOLEAN | NOT NULL, default false | |
| `last_active_at` | TIMESTAMP | nullable | Updated on each authenticated request |
| `deleted_at` | TIMESTAMP | nullable | Soft delete (excluded from login) |
| `created_at` | TIMESTAMP | NOT NULL, default NOW() | |
| `updated_at` | TIMESTAMP | NOT NULL, auto-update | |

---

### Table: `service_categories`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `name` | VARCHAR(100) | NOT NULL | |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | URL-safe, lowercase, hyphens only |
| `description` | TEXT | nullable | |
| `created_at` | TIMESTAMP | NOT NULL, default NOW() | |
| `updated_at` | TIMESTAMP | NOT NULL, auto-update | |

---

### Table: `services`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `title` | VARCHAR(255) | NOT NULL | |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | `/services/{slug}` |
| `description` | VARCHAR(200) | nullable | Short summary — max 200 chars |
| `content` | TEXT | nullable | Rich-text HTML body |
| `category_id` | UUID | FK → `service_categories.id`, SET NULL on delete | nullable |
| `status` | VARCHAR(20) | NOT NULL, default `'draft'` | `draft` / `published` |
| `is_featured` | BOOLEAN | NOT NULL, default false | Show in homepage featured section |
| `meta_image_url` | VARCHAR(500) | nullable | OG / featured image CDN URL |
| `meta_image_alt` | VARCHAR(255) | nullable | Alt text for accessibility & SEO |
| `meta_title` | VARCHAR(60) | nullable | Override page `<title>` |
| `meta_description` | VARCHAR(160) | nullable | Override meta description |
| `canonical_url` | VARCHAR(500) | nullable | Blank = use current page URL |
| `auto_schema` | BOOLEAN | NOT NULL, default true | Auto-generate JSON-LD |
| `in_sitemap` | BOOLEAN | NOT NULL, default true | Include in sitemap.xml |
| `published_at` | TIMESTAMP | nullable | Set server-side when status → `published` |
| `deleted_at` | TIMESTAMP | nullable | Soft delete |
| `created_at` | TIMESTAMP | NOT NULL, default NOW() | |
| `updated_at` | TIMESTAMP | NOT NULL, auto-update | |

---

### Table: `article_categories`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `name` | VARCHAR(100) | NOT NULL | |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | |
| `description` | TEXT | nullable | |
| `created_at` | TIMESTAMP | NOT NULL, default NOW() | |
| `updated_at` | TIMESTAMP | NOT NULL, auto-update | |

---

### Table: `articles`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `title` | VARCHAR(255) | NOT NULL | |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | `/articles/{slug}` |
| `excerpt` | VARCHAR(200) | nullable | Short summary — max 200 chars |
| `content` | TEXT | nullable | Rich-text HTML body |
| `category_id` | UUID | FK → `article_categories.id`, SET NULL on delete | nullable |
| `tags` | TEXT[] | nullable | Array of freeform tag strings |
| `author` | VARCHAR(100) | nullable | Display name of author |
| `reading_time` | SMALLINT | nullable | Estimated read time in minutes (min 1) |
| `status` | VARCHAR(20) | NOT NULL, default `'draft'` | `draft` / `published` / `archived` |
| `is_featured` | BOOLEAN | NOT NULL, default false | Featured story highlight |
| `image_url` | VARCHAR(500) | nullable | Header / featured image CDN URL |
| `image_alt` | VARCHAR(255) | nullable | Alt text |
| `meta_title` | VARCHAR(60) | nullable | |
| `meta_description` | VARCHAR(160) | nullable | |
| `canonical_url` | VARCHAR(500) | nullable | |
| `auto_schema` | BOOLEAN | NOT NULL, default true | |
| `in_sitemap` | BOOLEAN | NOT NULL, default true | |
| `published_at` | TIMESTAMP | nullable | Set when status → `published` |
| `deleted_at` | TIMESTAMP | nullable | Soft delete |
| `created_at` | TIMESTAMP | NOT NULL, default NOW() | |
| `updated_at` | TIMESTAMP | NOT NULL, auto-update | |

---

### Table: `reviews`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `reviewer_name` | VARCHAR(100) | NOT NULL | |
| `reviewer_photo_url` | VARCHAR(500) | nullable | Avatar image CDN URL |
| `rating` | SMALLINT | NOT NULL, CHECK (1–5) | Star rating |
| `content` | TEXT | NOT NULL | Full review text |
| `linked_service_id` | UUID | FK → `services.id`, SET NULL on delete | nullable |
| `trip_photo_url` | VARCHAR(500) | nullable | Photo from the trip |
| `is_monthly` | BOOLEAN | NOT NULL, default false | "Review of the Month" flag |
| `status` | VARCHAR(20) | NOT NULL, default `'draft'` | `draft` / `published` |
| `review_date` | DATE | nullable | Date of the actual experience |
| `published_at` | TIMESTAMP | nullable | Set when status → `published` |
| `deleted_at` | TIMESTAMP | nullable | Soft delete |
| `created_at` | TIMESTAMP | NOT NULL, default NOW() | |
| `updated_at` | TIMESTAMP | NOT NULL, auto-update | |

> **Cross-links to Articles:** Managed via `entity_relationships` table (`rel_type = 'article_review'`), not a direct FK.

---

### Table: `inquiries`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `name` | VARCHAR(100) | NOT NULL | Customer full name |
| `email` | VARCHAR(255) | NOT NULL | Must be valid email format |
| `phone` | VARCHAR(30) | nullable | |
| `subject` | VARCHAR(255) | NOT NULL | |
| `message` | TEXT | NOT NULL | Full message body |
| `status` | VARCHAR(20) | NOT NULL, default `'new'` | `new` / `read` / `replied` |
| `reply_note` | TEXT | nullable | Internal note after replying |
| `received_at` | TIMESTAMP | NOT NULL, default NOW() | Original submission time |
| `deleted_at` | TIMESTAMP | nullable | Soft delete |
| `updated_at` | TIMESTAMP | NOT NULL, auto-update | |

---

### Table: `entity_relationships`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `rel_type` | VARCHAR(30) | NOT NULL | `service_review` / `article_service` / `article_review` |
| `from_entity_type` | VARCHAR(20) | NOT NULL | `service` / `article` / `review` |
| `from_entity_id` | UUID | NOT NULL | |
| `to_entity_type` | VARCHAR(20) | NOT NULL | |
| `to_entity_id` | UUID | NOT NULL | |
| `note` | VARCHAR(255) | nullable | Admin annotation (e.g. "featured review") |
| `created_at` | TIMESTAMP | NOT NULL, default NOW() | |
| UNIQUE constraint | | `(rel_type, from_entity_id, to_entity_id)` | Prevent duplicate links |

---

### Table: `page_content`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | e.g. `home`, `about`, `services` |
| `title` | VARCHAR(255) | nullable | Admin display title |
| `type` | VARCHAR(20) | NOT NULL, default `'static'` | `static` / `dynamic` |
| `content_json` | JSONB | nullable | Structured section data (see schema below) |
| `meta_title` | VARCHAR(60) | nullable | |
| `meta_description` | VARCHAR(160) | nullable | |
| `auto_schema` | BOOLEAN | NOT NULL, default true | |
| `in_sitemap` | BOOLEAN | NOT NULL, default true | |
| `updated_at` | TIMESTAMP | NOT NULL, auto-update | |

---

### Table: `contact_settings` *(Singleton)*
| Column | Type | Description |
|---|---|---|
| `id` | VARCHAR(6) PK | Fixed value `'global'` |
| `office_name` | VARCHAR(255) | |
| `address` | TEXT | |
| `phone` | VARCHAR(30) | |
| `email` | VARCHAR(255) | |
| `line_id` | VARCHAR(100) | |
| `map_link` | VARCHAR(500) | Google Maps embed/share URL |
| `map_marker_text` | VARCHAR(255) | Text shown on map pin |
| `office_image_url` | VARCHAR(500) | |
| `facebook_url` | VARCHAR(500) | |
| `instagram_url` | VARCHAR(500) | |
| `tiktok_url` | VARCHAR(500) | |
| `updated_at` | TIMESTAMP | |

---

### Table: `global_settings` *(Singleton)*
| Column | Type | Description |
|---|---|---|
| `id` | VARCHAR(6) PK | Fixed value `'global'` |
| `site_name` | VARCHAR(255) | |
| `tagline` | VARCHAR(500) | |
| `logo_light_url` | VARCHAR(500) | Logo for light backgrounds |
| `logo_dark_url` | VARCHAR(500) | Logo for dark backgrounds (nav) |
| `favicon_url` | VARCHAR(500) | 32×32 or 64×64 .ico/.png |
| `color_primary` | VARCHAR(7) | HEX e.g. `#7B1B1B` |
| `color_accent` | VARCHAR(7) | |
| `color_background` | VARCHAR(7) | |
| `color_body_text` | VARCHAR(7) | |
| `font_heading` | VARCHAR(100) | Google Fonts family name |
| `font_body` | VARCHAR(100) | Google Fonts family name |
| `font_size_base` | VARCHAR(10) | e.g. `16px` |
| `seo_title_suffix` | VARCHAR(100) | Appended to every `<title>` |
| `seo_default_description` | VARCHAR(500) | Fallback meta description |
| `google_analytics_id` | VARCHAR(50) | `G-XXXXXXXXXX` |
| `facebook_pixel_id` | VARCHAR(50) | |
| `generate_sitemap` | BOOLEAN | |
| `allow_indexing` | BOOLEAN | Controls `robots.txt` |
| `feature_show_reviews` | BOOLEAN | |
| `feature_show_blog` | BOOLEAN | |
| `feature_show_contact_form` | BOOLEAN | |
| `feature_show_line_chat` | BOOLEAN | |
| `feature_maintenance_mode` | BOOLEAN | |
| `updated_at` | TIMESTAMP | |

---

### Table: `media`
| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | |
| `filename` | VARCHAR(255) | Original filename |
| `url` | VARCHAR(500) | CDN URL (WebP converted) |
| `mime_type` | VARCHAR(50) | Always `image/webp` after processing |
| `original_mime_type` | VARCHAR(50) | Original upload type |
| `size_bytes` | INTEGER | Post-conversion file size |
| `width` | SMALLINT | nullable |
| `height` | SMALLINT | nullable |
| `alt_text` | VARCHAR(255) | nullable |
| `context` | VARCHAR(50) | nullable — `service` / `article` / `review` / `settings` |
| `uploaded_by` | UUID | FK → `users.id`, SET NULL on delete |
| `created_at` | TIMESTAMP | |

---

## Validation Rules

### Common Rules
| Field | Rule |
|---|---|
| `slug` | Lowercase, alphanumeric + hyphens only (`[a-z0-9-]`), 3–255 chars, unique per entity type |
| `email` | RFC 5322 format validation |
| `password` | 8–72 chars, at least 1 uppercase, 1 number (bcrypt max is 72) |
| HEX color | Must match `^#[0-9A-Fa-f]{6}$` |
| `rating` | Integer 1–5 inclusive |
| `readingTime` | Integer ≥ 1 |

### Field Length Summary
| Entity | Field | Max |
|---|---|---|
| Service | `description` | 200 chars |
| Article | `excerpt` | 200 chars |
| Any | `metaTitle` | 60 chars |
| Any | `metaDescription` | 160 chars |
| User | `name` | 100 chars |
| User | `password` | 72 chars (bcrypt limit) |

### Media Upload
- **Allowed types:** `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- **Max file size:** 10 MB per file
- **Processing:** Backend converts all uploads to WebP and generates two sizes: original + `@0.5x` thumbnail
- **Rate limit on upload:** 20 requests / minute per user

### Public Contact Form (`POST /inquiries`)
- **Rate limit:** 3 submissions / 10 minutes per IP
- **Honeypot field:** Include optional `website` field — if filled, silently drop (bot detection)
- `message` min length: 10 chars

---

## Business Logic & Constraints

### Status Transitions
```
Service / Article:   draft → published → archived
                     published → draft (unpublish)
                     archived → draft (restore)

Review:              draft → published
                     published → draft (unpublish)

Inquiry:             new → read → replied
                     (one-way — cannot revert)
```

### Publish Requirements
Backend must return `422 UNPROCESSABLE` if trying to publish with missing required fields:

| Entity | Required to Publish |
|---|---|
| Service | `title`, `slug`, `content` (non-empty), `categoryId` |
| Article | `title`, `slug`, `excerpt`, `content` (non-empty), `categoryId` |
| Review | `reviewerName`, `rating`, `content`, `linkedServiceId` |

### Deletion Constraints
| Entity | Constraint |
|---|---|
| `service_categories` | Cannot delete if has linked services → `409 CONFLICT` |
| `article_categories` | Cannot delete if has linked articles → `409 CONFLICT` |
| `users` | Cannot delete self → `403 FORBIDDEN`. Soft-deletes only — banned users cannot login |
| `services` | Soft-delete — clears `linked_service_id` in reviews via SET NULL |
| `articles` | Soft-delete |
| `reviews` | Soft-delete |

### Slug Uniqueness
- Slugs are **globally unique per entity type** (not per category)
- Slug is **auto-generated server-side** if not provided: lowercase title, strip non-ASCII, replace spaces with `-`
- Slug of existing content **cannot be changed** once published (backend should warn or block)

### "Review of the Month" (`is_monthly`)
- Only **one review** should have `is_monthly = true` at a time
- When setting a review as monthly, backend should **automatically unset** any existing monthly review

### Self-Action Guards
- `PATCH /users/:id/ban` — cannot ban yourself → `403`
- `DELETE /users/:id` — cannot delete yourself → `403`

### Entity Relationship Constraints
- `from_entity_id` and `to_entity_id` must refer to **existing, non-deleted** records
- Cannot create a relationship where `from_entity_id === to_entity_id`
- `rel_type` must match the entity types:
  - `service_review`: from=service, to=review
  - `article_service`: from=article, to=service
  - `article_review`: from=article, to=review

---

## API Endpoints

---

### Auth

#### `POST /auth/login` — *Public*
```json
// Request
{ "email": "admin@example.com", "password": "Admin1234" }

// Response 200
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "8437b77df355dd56b7b8a234a9f1e3a141ffc83f...",
    "expiresIn": 3600,
    "user": { "id": "uuid", "name": "Admin", "email": "admin@example.com", "role": "admin", "avatarUrl": null }
  }
}
```
Errors: `401` invalid credentials, `403` account banned

---

#### `POST /auth/refresh` — *Public*
```json
// Request
{ "refreshToken": "8437b77df355dd56..." }

// Response 200 — issues NEW accessToken + NEW refreshToken (old refreshToken is revoked)
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "b91c33fa0d12...",
    "expiresIn": 3600
  }
}
```
Errors: `401` invalid/expired/revoked token, `403` account banned

#### `POST /auth/logout`
Revokes the refresh token server-side. Response `204`
```json
// Request
{ "refreshToken": "8437b77df355dd56..." }
```

#### `GET /auth/me`
Response `200` → `{ data: User }`

---

### Admin Users

#### `GET /users`
Query: `?page=1&limit=20&status=active|banned`

```json
// Response 200
{
  "data": [{
    "id": "uuid", "name": "Patcharapon Admin", "email": "admin@lannaheritage.com",
    "avatarUrl": "https://...", "role": "admin", "isBanned": false,
    "lastActiveAt": "2024-04-07T12:00:00Z", "createdAt": "2024-01-15T00:00:00Z"
  }],
  "meta": { "total": 3, "page": 1, "limit": 20, "totalPages": 1 }
}
```

---

#### `POST /users`
```json
// Request
{ "name": "New Admin", "email": "new@example.com", "password": "Password123", "avatarUrl": "https://..." }
// Response 201 → { data: User }
```
Errors: `409` email already exists

#### `GET /users/:id` → `200` `{ data: User }`
#### `PUT /users/:id` — update `name`, `email`, `avatarUrl` (not password)
```json
// Request
{ "name": "Updated", "email": "updated@example.com", "avatarUrl": "https://..." }
// Response 200 → { data: User }
```

#### `POST /users/:id/change-password`
```json
// Request
{ "newPassword": "NewPassword123" }
// Response 204
```

#### `PATCH /users/:id/ban` → `200` `{ data: { isBanned: true } }` — `403` if self
#### `PATCH /users/:id/unban` → `200` `{ data: { isBanned: false } }`
#### `DELETE /users/:id` → `204` soft-delete — `403` if self

---

### Service Categories

#### `GET /service-categories`
Query: `?page=1&limit=50&search=keyword`

```json
// Response 200
{
  "data": [{ "id": "uuid", "name": "Tour Packages", "slug": "tour-packages", "description": "...", "servicesCount": 5 }],
  "meta": { ... }
}
```

#### `POST /service-categories`
```json
// Request
{ "name": "New Category", "slug": "new-category", "description": "..." }
// Response 201 → { data: ServiceCategory }
```
> Slug is optional — auto-generated from `name` if omitted.

#### `GET /service-categories/:id` → `200`
#### `PUT /service-categories/:id` → `200`
#### `DELETE /service-categories/:id` → `204` | `409` if has linked services

---

### Services

#### `GET /services`
Query: `?page=1&limit=20&status=draft|published&categoryId=uuid&isFeatured=true&search=keyword`

```json
// Response 200
{
  "data": [{
    "id": "uuid", "title": "Temple Tour", "slug": "temple-tour",
    "description": "...", "categoryId": "uuid", "categoryName": "Tour Packages",
    "status": "published", "isFeatured": true, "metaImageUrl": "https://...",
    "publishedAt": "2024-03-01T00:00:00Z", "updatedAt": "2024-03-20T10:00:00Z"
  }],
  "meta": { ... }
}
```

#### `POST /services`
```json
// Request
{
  "title": "Temple Tour", "slug": "temple-tour",
  "description": "Short description max 200 chars",
  "content": "<p>Rich text HTML</p>",
  "categoryId": "uuid",
  "status": "draft", "isFeatured": false,
  "metaImageUrl": "https://...", "metaImageAlt": "Monks at Doi Suthep",
  "metaTitle": "Temple Tour Chiang Mai", "metaDescription": "Visit the most sacred...",
  "canonicalUrl": "", "autoSchema": true, "inSitemap": true
}
// Response 201 → { data: Service (full) }
```

#### `GET /services/:id` → `200` full detail including `content` HTML
#### `PUT /services/:id` → `200`
#### `DELETE /services/:id` → `204` soft-delete

---

### Article Categories

Same structure as Service Categories — path `/article-categories`.

#### `GET /article-categories` → `200`
#### `POST /article-categories` → `201`
#### `GET /article-categories/:id` → `200`
#### `PUT /article-categories/:id` → `200`
#### `DELETE /article-categories/:id` → `204` | `409` if has linked articles

---

### Articles

#### `GET /articles`
Query: `?page=1&limit=20&status=draft|published|archived&categoryId=uuid&isFeatured=true&tag=tagname&search=keyword`

```json
// Response 200
{
  "data": [{
    "id": "uuid", "title": "5 วัดที่ห้ามพลาดในเชียงใหม่", "slug": "5-temples-chiang-mai",
    "excerpt": "...", "categoryId": "uuid", "categoryName": "Culture",
    "tags": ["temples", "lanna", "travel"], "author": "Lanna Heritage Team",
    "readingTime": 5, "status": "published", "isFeatured": true,
    "imageUrl": "https://...", "imageAlt": "Temple at sunrise",
    "publishedAt": "2024-03-15T00:00:00Z", "updatedAt": "2024-03-20T10:00:00Z"
  }],
  "meta": { ... }
}
```

#### `POST /articles`
```json
// Request
{
  "title": "Article Title", "slug": "article-slug",
  "excerpt": "Short excerpt max 200 chars",
  "content": "<p>Rich text HTML</p>",
  "categoryId": "uuid",
  "tags": ["tag1", "tag2"],
  "author": "Lanna Heritage Team", "readingTime": 5,
  "status": "draft", "publishedAt": "2024-03-15", "isFeatured": false,
  "imageUrl": "https://...", "imageAlt": "Article header image",
  "metaTitle": "", "metaDescription": "", "canonicalUrl": "",
  "autoSchema": true, "inSitemap": true
}
// Response 201 → { data: Article (full) }
```

#### `GET /articles/:id` → `200`
#### `PUT /articles/:id` → `200`
#### `DELETE /articles/:id` → `204` soft-delete

---

### Reviews

#### `GET /reviews`
Query: `?page=1&limit=20&status=draft|published&isMonthly=true&rating=5&linkedServiceId=uuid&search=reviewerName`

```json
// Response 200
{
  "data": [{
    "id": "uuid", "reviewerName": "คุณรินลณี วัฒนศิริ",
    "reviewerPhotoUrl": "https://...", "rating": 5,
    "content": "Review text...",
    "linkedServiceId": "uuid", "linkedServiceTitle": "Temple Tour",
    "tripPhotoUrl": "https://...", "isMonthly": true,
    "status": "published", "reviewDate": "2024-03-20",
    "publishedAt": "2024-03-21T00:00:00Z", "createdAt": "2024-03-21T00:00:00Z"
  }],
  "meta": { ... }
}
```

#### `POST /reviews`
```json
// Request
{
  "reviewerName": "คุณรินลณี วัฒนศิริ",
  "reviewerPhotoUrl": "https://...",
  "rating": 5,
  "content": "Full review text...",
  "linkedServiceId": "uuid",
  "tripPhotoUrl": "https://...",
  "isMonthly": false,
  "status": "draft",
  "reviewDate": "2024-03-20"
}
// Response 201 → { data: Review }
```

> When `isMonthly: true` — backend unsets `is_monthly` on any other review automatically.

> **Cross-links to Articles** are managed via `POST /relationships` (rel_type: `article_review`) — not in this payload.

#### `GET /reviews/:id` → `200`
#### `PUT /reviews/:id` → `200`
#### `DELETE /reviews/:id` → `204` soft-delete

---

### Inquiries

Inquiries are **created by the public frontend contact form**. Backoffice only reads and manages.

#### `GET /inquiries`
Query: `?page=1&limit=20&status=new|read|replied&search=name|email`

```json
// Response 200
{
  "data": [{
    "id": "uuid", "name": "คุณสมชาย ใจดี", "email": "somchai@example.com",
    "phone": "081-222-3344", "subject": "สอบถามข้อมูลทริปเชียงใหม่",
    "message": "...", "status": "new", "replyNote": null,
    "receivedAt": "2024-04-07T14:30:00Z", "updatedAt": "2024-04-07T14:30:00Z"
  }],
  "meta": { ... }
}
```

#### `GET /inquiries/:id` → `200` full detail
```json
// Response 200
{
  "data": {
    "id": "uuid", "name": "คุณสมชาย ใจดี", "email": "somchai@example.com",
    "phone": "081-222-3344", "subject": "สอบถามข้อมูลทริปเชียงใหม่",
    "message": "รบกวนขอตารางเวลาทริป...", "status": "new", "replyNote": null,
    "receivedAt": "2024-04-07T14:30:00Z", "updatedAt": "2024-04-07T14:30:00Z"
  }
}
```

#### `PATCH /inquiries/:id/status`
```json
// Request
{ "status": "replied", "replyNote": "ตอบกลับทาง email แล้ว 8 เม.ย." }
// Response 200 → { data: { status: "replied", replyNote: "..." } }
```
> `status` transitions: `new → read → replied` only (one-way)

#### `DELETE /inquiries/:id` → `204` soft-delete

---

#### `POST /inquiries` — *Public (Frontend contact form)*
```json
// Request
{
  "name": "คุณสมชาย ใจดี", "email": "somchai@example.com",
  "phone": "081-222-3344", "subject": "สอบถามข้อมูลทริป",
  "message": "รบกวนขอข้อมูล...",
  "website": ""
}
// Response 201 → { data: { id: "uuid" } }
```
> `website` is a honeypot field — if non-empty, return `201` silently without saving.
> **Rate limit:** 3 requests / 10 min per IP → `429 TOO_MANY_REQUESTS`

---

### Contact Settings

Singleton — one row, always exists.

#### `GET /settings/contact` → `200`
```json
{
  "data": {
    "officeName": "Heritage Sanctuary Office",
    "address": "123 ถนนราชดำเนิน ตำบลศรีภูมิ อำเภอเมือง เชียงใหม่ 50200",
    "phone": "+66 (0) 53123 456", "email": "hello@lannaheritage.travel",
    "lineId": "@lannaheritage", "officeImageUrl": "https://...",
    "mapLink": "https://maps.google.com/?q=...", "mapMarkerText": "Lanna Heritage Travel",
    "facebookUrl": "https://facebook.com/...",
    "instagramUrl": "https://instagram.com/...",
    "tiktokUrl": "https://tiktok.com/@...",
    "updatedAt": "2024-04-07T10:00:00Z"
  }
}
```

#### `PUT /settings/contact` → `200`
All fields are optional — only provided fields will be updated (partial update supported).
```json
// Response 200 → { data: ContactSettings } (full object)
```

---

### Entity Relationships

#### `GET /relationships`
Query: `?relType=service_review|article_service|article_review&page=1&limit=50&fromEntityId=uuid&toEntityId=uuid`

```json
// Response 200
{
  "data": [{
    "id": "uuid", "relType": "service_review",
    "fromEntityType": "service", "fromEntityId": "uuid", "fromEntityName": "Temple Tour",
    "toEntityType": "review", "toEntityId": "uuid", "toEntityName": "คุณรินลณี วัฒนศิริ",
    "note": "featured review", "createdAt": "2024-03-01T00:00:00Z"
  }],
  "meta": { ... }
}
```

#### `POST /relationships`
```json
// Request
{
  "relType": "service_review",
  "fromEntityType": "service", "fromEntityId": "uuid",
  "toEntityType": "review", "toEntityId": "uuid",
  "note": "featured review"
}
// Response 201 → { data: Relationship }
```
Errors: `409` duplicate, `404` entity not found, `422` invalid rel_type / entity type mismatch

#### `DELETE /relationships/:id` → `204`

---

### Page Content (CMS)

#### `GET /pages` → `200`
```json
{
  "data": [
    { "slug": "home", "title": "Home Page", "type": "dynamic", "updatedAt": "..." },
    { "slug": "about", "title": "About Us", "type": "static", "updatedAt": "..." },
    { "slug": "services", "title": "Our Services", "type": "dynamic", "updatedAt": "..." }
  ]
}
```

#### `GET /pages/:slug` → `200`
```json
{
  "data": {
    "slug": "home", "title": "Home Page",
    "metaTitle": "หน้าแรก - Lanna Heritage Travel",
    "metaDescription": "สัมผัสเสน่ห์ล้านนา...",
    "autoSchema": true, "inSitemap": true,
    "contentJson": {
      "sectionOrder": [
        { "key": "hero",             "label": "Hero Section",           "visible": true },
        { "key": "philosophy",       "label": "Philosophy / About",     "visible": true },
        { "key": "featuredServices", "label": "Featured Services",      "visible": true },
        { "key": "testimonials",     "label": "Testimonials / Reviews", "visible": true }
      ],
      "hero": {
        "bgImageUrl": "https://...", "bgImageAlt": "Aerial view of Chiang Mai temples",
        "heading": "สัมผัสเสน่ห์ล้านนา\nเที่ยวเชียงใหม่\nกับเรา",
        "subheading": "ดิ่มด่ำกับวัฒนธรรม...",
        "primaryBtn":   { "text": "จองทัวร์เลย", "link": "/contact" },
        "secondaryBtn": { "text": "ดูแพ็กเกจ",  "link": "/services" }
      },
      "philosophy": {
        "sectionLabel": "OUR PHILOSOPHY",
        "heading": "ประสบการณ์การเดินทาง...", "description": "...",
        "imageUrl": "https://...", "imageAlt": "Traditional Lanna craftsmanship",
        "quote": { "text": "\"ความใส่ใจคือหัวใจของเรา\"", "description": "..." },
        "features": [
          { "icon": "mdi-shield-check", "text": "การบริการที่เชื่อถือได้ระดับมืออาชีพ" },
          { "icon": "mdi-map-marker-path", "text": "เส้นทางท่องเที่ยว..." },
          { "icon": "mdi-star", "text": "มาตรฐานที่พักและยานพาหนะระดับ 5 ดาว" }
        ]
      },
      "featuredServices": {
        "heading": "บริการแนะนำ", "subtitle": "ออกแบบมาเพื่อความสุขสงบ...",
        "linkText": "ดูบริการทั้งหมด"
      },
      "testimonials": {
        "heading": "รีวิวจากลูกค้าของเรา", "subtitle": "เสียงจากผู้ร่วมเดินทาง"
      },
      "footer": {
        "brandName": "Lanna Heritage", "tagline": "มอบประสบการณ์...",
        "address": "ถนนท่าแพ เชียงใหม่", "phone": "053-XXX-XXXX",
        "email": "hello@lannaheritage.com",
        "tiktokUrl": "https://tiktok.com/@...", "instagramUrl": "https://instagram.com/...",
        "copyright": "© 2024 Lanna Heritage Travel. All rights reserved."
      }
    },
    "updatedAt": "2024-04-07T10:00:00Z"
  }
}
```

#### `PUT /pages/:slug` → `200`
Request: `metaTitle`, `metaDescription`, `autoSchema`, `inSitemap`, `contentJson` (full object)
> Backend validates `contentJson` shape based on `slug`. Unknown slugs return `404`.

---

### Global Settings

Singleton — one row, always exists.

#### `GET /settings/global` → `200`
```json
{
  "data": {
    "siteName": "Lanna Heritage Travel",
    "tagline": "สัมผัสเสน่ห์ล้านนา...",
    "logoLightUrl": "https://...",
    "logoDarkUrl": "https://...",
    "faviconUrl": "https://...",
    "colorPrimary": "#7B1B1B",
    "colorAccent": "#C8956C",
    "colorBackground": "#F5F0EB",
    "colorBodyText": "#2D2D2D",
    "fontHeading": "Sarabun",
    "fontBody": "Sarabun",
    "fontSizeBase": "16px",
    "seoTitleSuffix": "| Lanna Heritage Travel",
    "seoDefaultDescription": "...",
    "googleAnalyticsId": "G-XXXXXXXXXX",
    "facebookPixelId": "",
    "generateSitemap": true,
    "allowIndexing": true,
    "featureShowReviews": true,
    "featureShowBlog": true,
    "featureShowContactForm": true,
    "featureShowLineChat": false,
    "featureMaintenanceMode": false,
    "updatedAt": "2024-04-07T10:00:00Z"
  }
}
```

#### `PUT /settings/global` → `200`
All fields are optional — only provided fields will be updated (partial update supported).
```json
// Request example (partial update)
{
  "siteName": "TourCNX",
  "featureMaintenanceMode": true
}
// Response 200 → { data: GlobalSettings } (full object)
```
> When `featureMaintenanceMode: true` is saved, frontend should begin showing maintenance page on next request.

---

### Media Upload

#### `POST /media/upload`
`Content-Type: multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | Image file |
| `altText` | string | ❌ | Alt text |
| `context` | string | ❌ | `service` / `article` / `review` / `settings` |

```json
// Response 201
{
  "data": {
    "id": "uuid",
    "url": "https://cdn.tourcnx.com/media/2024/03/temple-tour.webp",
    "filename": "temple-tour.jpg", "mimeType": "image/webp",
    "sizeBytes": 84320, "width": 1200, "height": 800,
    "altText": "Monks at Doi Suthep temple"
  }
}
```

> - Auto-converts to **WebP**, generates `@0.5x` thumbnail
> - Allowed: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
> - Max size: **10 MB**
> - Rate limit: 20 uploads / min per user

#### `DELETE /media/:id` → `204`

---

## Error Codes

| HTTP Status | Code | When |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Invalid body — includes `{ errors: [{field, message}] }` |
| `401` | `UNAUTHORIZED` | Missing / expired / invalid token |
| `403` | `FORBIDDEN` | Authenticated but not allowed (ban self, delete self, etc.) |
| `404` | `NOT_FOUND` | Resource not found or soft-deleted |
| `409` | `CONFLICT` | Duplicate slug, duplicate relationship, delete category with children |
| `422` | `UNPROCESSABLE` | Business logic failure (publish missing fields, invalid status transition) |
| `429` | `TOO_MANY_REQUESTS` | Rate limit exceeded — includes `Retry-After` header |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

```json
// Error response shape
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Slug already exists",
    "errors": [
      { "field": "slug", "message": "This slug is already taken" }
    ]
  }
}
```

---

## Entity Relationship Diagram

```
users
  └─ uploaded_by → media

service_categories  ←─ FK ─── services
article_categories  ←─ FK ─── articles

services ──────┐
               ├── entity_relationships ──── reviews
articles ──────┤   (rel_type: service_review)
               │
               ├── entity_relationships ──── services
               │   (rel_type: article_service)
               │
               └── entity_relationships ──── reviews
                   (rel_type: article_review)

inquiries          (standalone — public contact form → backoffice read-only)
page_content       (keyed by slug — singleton per page)
contact_settings   (singleton)
global_settings    (singleton)
```

---

### Endpoint Quick Reference

| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Current user |
| GET/POST | `/users` | List / Create admin |
| GET/PUT/DELETE | `/users/:id` | Get / Update / Delete admin |
| POST | `/users/:id/change-password` | Change password |
| PATCH | `/users/:id/ban` | Ban admin |
| PATCH | `/users/:id/unban` | Unban admin |
| GET/POST | `/service-categories` | List / Create |
| GET/PUT/DELETE | `/service-categories/:id` | CRUD |
| GET/POST | `/services` | List / Create |
| GET/PUT/DELETE | `/services/:id` | CRUD |
| GET/POST | `/article-categories` | List / Create |
| GET/PUT/DELETE | `/article-categories/:id` | CRUD |
| GET/POST | `/articles` | List / Create |
| GET/PUT/DELETE | `/articles/:id` | CRUD |
| GET/POST | `/reviews` | List / Create |
| GET/PUT/DELETE | `/reviews/:id` | CRUD |
| GET | `/inquiries` | List inquiries |
| GET | `/inquiries/:id` | Inquiry detail |
| PATCH | `/inquiries/:id/status` | Update status + note |
| DELETE | `/inquiries/:id` | Soft-delete |
| **POST** | **`/inquiries`** | **Public — contact form** |
| GET/PUT | `/settings/contact` | Contact info |
| GET/POST | `/relationships` | List / Create links |
| DELETE | `/relationships/:id` | Remove link |
| GET | `/pages` | List pages |
| GET/PUT | `/pages/:slug` | Get / Update page content |
| GET/PUT | `/settings/global` | Global config |
| POST | `/media/upload` | Upload file |
| DELETE | `/media/:id` | Delete file |

---

*v1.1.0 — All field names use camelCase in JSON payloads and snake_case in the database. Backend handles mapping.*
