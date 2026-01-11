### Multi-Tenant Blog System V2 - API Documentation

This document describes the API endpoints for the Blog System V2. It is divided into **Public API** (for website visitors) and **Admin API** (for content management).

---

### 1. General Principles

#### 1.1 Multi-Tenancy (Schema)
All requests must specify the target tenant schema. This is typically handled by the `X-Schema` header or a default schema configured in the backend.

#### 1.2 Multi-Language Support (Locale)
- **Public API**: Returns content in a single locale.
    - Determined by the `lang` query parameter (e.g., `?lang=az`).
    - Falls back to the `Accept-Language` header.
    - Default is `en`.
- **Admin API**: Returns and accepts content in multiple locales simultaneously using a map structure: `{"en": {...}, "az": {...}}`.

#### 1.3 Pagination
List endpoints support pagination via query parameters:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10)

---

### 2. Public API (`/api/blog`)

Used for fetching published content and submitting comments.

#### 2.1 Posts
- `GET /posts`: List published posts.
    - Query params: `page`, `page_size`, `lang`.
- `GET /posts/:id`: Get a specific post by ID.
- `GET /posts/slug/:slug`: Get a specific post by its translated slug.
    - *Note: The system automatically resolves the slug to the correct post and locale.*

#### 2.2 Categories & Tags
- `GET /categories`: List all categories.
- `GET /tags`: List all tags.

#### 2.3 Comments
- `GET /posts/:id/comments`: List approved comments for a post (nested structure).
- `POST /posts/:id/comments`: Submit a new comment.
    - Body: `{"author_name": "...", "author_email": "...", "content": "...", "parent_id": 123}`

---

### 3. Admin API (`/api/admin/blog`)

Requires authentication. Used for managing all blog entities and translations.

#### 3.1 Posts
- `GET /posts`: List all posts (all statuses).
- `POST /posts`: Create a new post.
    - Body:
      ```json
      {
        "category_id": 1,
        "author_id": 1,
        "status": "draft",
        "tag_ids": [1, 2],
        "translations": [
          {"locale": "en", "title": "Hello", "content": "World"},
          {"locale": "az", "title": "Salam", "content": "Dünya"}
        ]
      }
      ```
- `GET /posts/:id`: Get full post details with all translations.
- `PUT /posts/:id`: Update post and its translations.
- `DELETE /posts/:id`: Soft delete a post.
- `POST /posts/:id/publish`: Change status to `published` and set `published_at`.
- `POST /posts/:id/archive`: Change status to `archived`.

#### 3.2 Categories & Tags
- `GET /categories` / `GET /tags`: List for admin.
- `POST /categories` / `POST /tags`: Create with translations.
- `PUT /categories/:id` / `PUT /tags/:id`: Update.
- `DELETE /categories/:id` / `DELETE /tags/:id`: Hard delete.

#### 3.3 Comments
- `GET /posts/:id/comments`: Admin list (includes pending/rejected).
- `GET /comments/:id`: Get single comment details.
- `PUT /comments/:id`: Update status (`approved`, `rejected`) or content.
- `DELETE /comments/:id`: Soft delete.

---

### 4. Response Structures

#### 4.1 Admin Translation Map
Admin responses return translations as a map indexed by locale:
```json
{
  "id": 1,
  "translations": {
    "en": {
      "title": "Welcome",
      "slug": "welcome",
      "content": "..."
    },
    "az": {
      "title": "Xoş gəlmisiniz",
      "slug": "xos-gelmisiniz",
      "content": "..."
    }
  }
}
```

#### 4.2 Public Single Locale
Public responses return flat objects for the requested locale:
```json
{
  "id": 1,
  "title": "Welcome",
  "slug": "welcome",
  "content": "..."
}
```
