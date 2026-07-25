# Cudemy — Design Reference

Reference doc for design/UI work on this project. Feed this to Claude when asking for new
screens, components, or UI changes so output matches the existing system.

## Product

A full-stack LMS (Udemy-style). Students browse/search/purchase courses; instructors create
courses made of modules → lectures (video), with optional quiz questions per lecture.

## Stack

- **Client:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, TanStack Query,
  Radix UI primitives + shadcn-style wrappers, `class-variance-authority`, `dnd-kit` (drag/reorder),
  `media-chrome` (video player), `react-hot-toast`.
- **Server:** Node.js, Express 5, TypeScript, Prisma (MongoDB), Better Auth, Cloudinary
  (image/video storage), Helmet/CORS/rate-limit/mongo-sanitize/hpp for hardening.

## Folder Structure

```
client/src/
  app/
    (home)/            marketing + student-facing: /, /auth, /courses, /courses/[IdCourse],
                        /search, /my-learning, /account, /instructor (onboarding flow)
    (dashboard)/        instructor/admin area: /dashboard, /manage-courses, /manage-courses/[courseId]
  components/            shared, page-level components (navigation, hero, banner, video player…)
  components/ui/         shadcn-style primitives (button, card, dialog, input, select…)
  components/ui/kibo-ui/ third-party composite UI (video-player)
  actions/                server actions
  lib/, util/             helpers (cn(), etc.)

server/
  routes/                 authRoute, courseRoute, instructorRoute, userRoutes
  controllers/             courseController/ (course, lecture, module, question), auth, users, instructor
  models/, prisma/schema/  course, module, lecture, question(+image), instructor, user(+session/account)
  middlewares/, utils/, config/, lib/
```

Route groups `(home)` and `(dashboard)` split the two audiences (learners vs. instructors) at the
layout level — keep that split in mind when placing new pages.

## Data Model (Prisma / MongoDB)

- **User** — `roles: string[]` (student/instructor/admin), has many `Course` (as instructor),
  `EnrolledCourse`, `Lecture`, optional `Instructor` profile. Auth via Better Auth
  (`Session`, `Account`, `Verification`).
- **Course** — title, description, price/discount, `level[]`, `category[]`, cover image
  (`secureUrl`/`publicId` via Cloudinary), `isPublished`, belongs to instructor, has `Module[]`,
  `Question[]`, `EnrolledCourse[]` (students).
- **Module** — ordered section of a course (`order`, `optional`), has `Lecture[]`.
- **Lecture** — video content (`secureUrl`/`publicId`), `duration`, `order`, `isPreview` flag,
  belongs to a `Module` + instructor, has `Question[]`.
- **Question** — quiz question tied to a lecture + course, optional `Image[]`.
- **Instructor** — onboarding/profile data (expertise, experience, qualifications) linked 1:1 to `User`.

## Design Tokens

Defined in [client/src/app/globals.css](client/src/app/globals.css), Tailwind v4 `@theme` +
CSS variables (OKLCH), shadcn-compatible.

**Fonts**
- Sans/body: `Poppins`
- Serif/display: `Outfit`

**Color roles** (light values shown; each has a `.dark` override)
| Token | Light value | Use |
|---|---|---|
| `--primary` | `oklch(0.729 0.1582 22.2023)` (coral/salmon, `#fb7a79`) | brand accent, primary buttons, links |
| `--background` / `--foreground` | white / near-black | page base |
| `--card`, `--popover` | white | elevated surfaces |
| `--secondary`, `--muted`, `--accent` | near-white grays | subdued surfaces/text |
| `--destructive` | red | errors, delete actions |
| `--border`, `--input`, `--ring` | light gray | borders, form fields, focus rings |
| `--sidebar*` | dedicated palette | dashboard sidebar |
| `--chart-1..5` | blue-purple ramp | analytics charts |

Legacy one-off vars still used in places: `--primary-color: #fb7a79`, `--input-bg-color: #fdf3f3`,
`--input-border-color: #fb7a79` — prefer the shadcn tokens (`--primary`, `--input`) for new work.

**Radius:** base `--radius: 0.325rem`, derived `sm/md/lg/xl` via `calc()`.
**Shadows:** custom soft shadow scale, e.g. `--shadow-search-bar: 0px 6px 20px 0px rgba(0,0,0,0.05)`.
**Dark mode:** class-based (`.dark`), toggled via `theme-provider.tsx` / `theme-toggle.tsx`.

## Component Conventions

- UI primitives live in `components/ui/` and follow the shadcn pattern: `cva()` for variants,
  `cn()` (in `lib/utils`) to merge classes, `data-slot` attributes, Radix primitives underneath.
- Example — `Button` (`components/ui/button.tsx`) variants: `default`, `destructive`, `outline`,
  `secondary`, `ghost`, `link`, plus app-specific `primary` and `facebook` (social auth); sizes:
  `default`, `sm`, `md`, `lg`, `icon`.
- Feature-level shared components (nav, hero, banner, footer, video player, rating/stars) live
  directly under `components/`, not `components/ui/`.
- Third-party composite widgets (e.g. the Media Chrome video player) are wrapped under
  `components/ui/kibo-ui/`.
- Drag-and-drop (module/lecture reordering in the instructor dashboard) uses `@dnd-kit`.
- Forms/validation use `zod`.

## Conventions for New Design Work

- Match existing route group: student-facing pages go under `app/(home)/...`, instructor/admin
  screens under `app/(dashboard)/...`.
- Reuse `components/ui/*` primitives before adding new ones; extend via `cva` variants rather
  than one-off className overrides.
- Use the semantic tokens (`bg-primary`, `text-muted-foreground`, `bg-card`, etc.) — avoid hex
  colors except where the codebase already uses legacy vars (auth/input styling).
- Keep both light and dark values in sync when adding a new color token.
- Course/module/lecture UI should reflect the ordering (`order` field) and optional/preview flags
  already modeled in Prisma (e.g. preview lectures are watchable without enrollment).
