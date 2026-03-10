# Golden Oak School - Website & Admin Portal

A modern, responsive, and dynamic web platform for Golden Oak School built with React, Vite, and Supabase. The portal features a beautifully designed public-facing website and a secure, feature-rich admin dashboard for complete content management.

![Hero Section](https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/graduation-cap.svg)

## Features

### 🌐 Public Website
- **Dynamic Content:** All content (Home, About, Admissions, Academics, Facilities, Gallery, Contact) is driven by the Supabase database.
- **Beautiful UI:** Responsive design with modern glassmorphism, smooth animations, and a rich green-and-gold aesthetic.
- **Online Admissions:** Integrated admission inquiry form that posts directly to the admin dashboard.
- **Real-time Analytics:** Automatic page-view tracking integrated with the backend.
- **WhatsApp Integration:** Floating quick-action button for immediate chat support.

### 🛡️ Admin Dashboard 
- **Website Manager:** A complete CMS to edit the website logo, contact information, gallery items, testimonials, and dynamic content.
- **Analytics Dashboard:** Real-time visibility into website traffic, page views over 7 and 30 days, device breakdowns, and top pages visited.
- **Inquiry Management:** View, track, and manage all admission inquiries submitted through the website.
- **Profile Management:** Admins can securely change their display name, email, profile picture (stored in Supabase Storage), and password.
- **Audit Logs:** Track system changes and admin activities.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18, Vite
- **Routing:** React Router DOM (v6)
- **Styling:** Vanilla CSS + modern CSS variables
- **Icons:** Lucide React
- **Backend & Database:** Supabase (PostgreSQL, Auth, Storage)
- **Charts:** Recharts (for Analytics)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase Project (Database, Auth, Storage)

### 1. Clone the repository
```bash
git clone <repository-url>
cd golden-oak-school
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the provided SQL migrations in your Supabase SQL Editor to set up the necessary tables, RLS policies, and storage buckets:
1. `supabase_schema.sql` (Base authentication and profiles)
2. `cms_migration.sql` (Website content tables and Gallery storage)
3. `page_views_migration.sql` (Analytics tracking tables)

**Seed Data (Optional):**
To populate the CMS with initial sample data, run:
```bash
node seed-cms.mjs
```

### 5. Run the Application
```bash
npm run dev
```
The app will be available at `http://localhost:5173`. 
Access the admin portal at `http://localhost:5173/adminlogin`.

---

## 📁 Project Structure

```
├── public/                 # Static assets (images, icons)
├── src/
│   ├── ams/                # Admin Management System (Dashboard, CMS, Auth)
│   ├── components/         # Reusable UI components (Navbar, Footer, etc.)
│   ├── hooks/              # Custom React hooks (useSiteSettings, usePageView)
│   ├── pages/              # Public website pages
│   ├── App.tsx             # Main router configuration
│   └── supabaseClient.ts   # Supabase client initialization
├── *.sql                   # Supabase database migration files
└── index.css               # Global styles and design system tokens
```

---

## 🛡️ Security
- **Row Level Security (RLS):** Enabled on all Supabase tables, strictly enforcing that public data is read-only, and only authenticated admins can write/update data.
- **Secure Authentication:** Managed via Supabase Auth.
- **Storage Policies:** Gallery storage buckets configured with public read access and admin-only upload/delete permissions.

---

 *Designed for excellence in education by [ScaleXWebSolution](https://scalexwebsolution.vercel.app/).*
