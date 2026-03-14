# Golden Oak School - Full Project Documentation

## 1. Introduction & Overview
Golden Oak School is a modern, full-stack web application designed to serve both as a public-facing school website and a secure, internal Admin Management System (AMS). 

The platform allows administrators to dynamically manage the website's content, track real-time analytics, manage student admissions inquiries, and control system-wide settings like Maintenance Code without requiring any codebase changes. It was built with a strong focus on a premium UI/UX, incorporating modern design aesthetics, glassmorphism, and smooth animations.

---

## 2. Technology Stack
*   **Frontend Framework:** React 18 with Vite
*   **Routing:** React Router DOM (v6)
*   **Styling:** Vanilla CSS + modern CSS variables
*   **Icons:** Lucide React
*   **Charts:** Recharts (for Analytics Dashboard)
*   **Backend & Database:** Supabase (PostgreSQL, Authentication, Row Level Security, Storage)
*   **Deployment:** Vercel (configured via `vercel.json` for SPA rewrites)

---

## 3. Core Features

### 3.1 Public Website
*   **Dynamic Content:** Content such as the hero text, contact information, about text, map embed, and social links are fetched directly from the database's `site_settings` table.
*   **Responsive Design:** Optimized for all screen sizes, from mobile phones to large desktop monitors.
*   **Online Admissions Inquiry:** A multi-step form on the "Admissions" page that posts data directly to the admin dashboard.
*   **Contact Form:** A direct messaging system on the "Contact" page.
*   **Announcements:** Live feed of active announcements categorized by urgency/type.
*   **Gallery:** A dynamic image gallery powered by Supabase Storage.
*   **Real-time Analytics:** Custom hook (`usePageView`) silently tracks unique page views and stores them in the database.
*   **WhatsApp Integration:** Floating quick-action button for immediate chat support.

### 3.2 Admin Management System (AMS)
The AMS is heavily protected by Supabase Authentication and database-level Row Level Security (RLS). 

#### Admin Dashboard 
*   **Analytics Overview:** Visual representation (Area Charts) of page views over the last 7 and 30 days.
*   **Website Manager (CMS):** A dedicated interface to update `site_settings` (logo, contact info), manage active announcements, and upload/delete images from the public gallery.
*   **Inquiries & Messages Hub:** Full interfaces to view, filter (by status), and delete submissions from the Admissions Inquiry form and Contact form.
*   **Audit Logs:** Real-time tracking of actions taken inside the admin panel.

#### Master Controls (Super Admin specific)
*   **Super Admin Role:** A specialized `.mjs` script was written to assign unique `is_super_admin` flags to specific users, granting them access to the "Master Controls" tab.
*   **Maintenance Mode / Website Shutdown:** A toggle that instantly puts the public website into "Maintenance Mode", displaying an offline message to visitors while keeping the Admin portal fully accessible.
*   **Admin List:** Overview of all registered administrator accounts.

---

## 4. Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   npm or yarn
*   A Supabase Project

### Steps
1.  **Clone & Install:**
    ```bash
    git clone <repository-url>
    cd golden-oak-school
    npm install
    ```
2.  **Environment Variables:**
    Create a `.env` file in the root.
    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_key_for_admin_scripts
    ```
3.  **Database Initialisation:**
    Run the migrations chronologically in the Supabase SQL Editor:
    *   `supabase_schema.sql` (Creates profiles, core tables, triggers)
    *   `cms_migration.sql` (Sets up site settings, gallery, announcements)
    *   `page_views_migration.sql` (Sets up analytics tracking)
    *   `super_admin_migration.sql` (Adds super admin columns & site setting states)
    *   `fix_messages_migration.sql` (Fixes Contact Messages Row Level Security)

4.  **Create Super Admin:**
    Generate the Super Admin account locally bypassing email limits:
    ```bash
    node create-superadmin.mjs
    ```
5.  **Run Locally:**
    ```bash
    npm run dev
    ```

---

## 5. Development Problems Addressed & Solutions

During the development lifecycle, several critical bugs and architectural challenges were encountered and successfully resolved:

### 5.1 Super Admin Creation via Database Restrictions
**Problem:** Attempting to create the Super Admin account using the standard `supabase.auth.signUp()` method failed due to Supabase's built-in email rate limits and RLS policies blocking unauthenticated profile creation.
**Solution:** We created a dedicated backend script (`create-superadmin.mjs`) that utilizes the `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS. It uses `supabase.auth.admin.createUser()` to force-create the account and immediately `upsert` the `is_super_admin: true` flag into the `profiles` table.

### 5.2 Public Form Submissions Failing Silently 
**Problem:** The public "Online Inquiry Form" was failing to send data to the database, but was showing a generic "Success" message to the user because errors were being caught and ignored gracefully. 
**Solution:** 
1. The `Admissions.tsx` payload mapped the frontend field `grade` to the database field `grade`. However, the schema expected `grade_applying`. This field mismatch caused a hard SQL rejection. The mapping was corrected.
2. The `try-catch` blocks in both `Admissions.tsx` and `Contact.tsx` were rewritten to accurately catch the `error` object returned from Supabase. If an error is detected, the UI now properly displays a red alert message instructing the user to try again.

### 5.3 Contact Messages Deletion Blocked by RLS
**Problem:** After building the Admin interface to view Contact Messages, clicking the "Delete" button failed. Admins could read the messages, but the database rejected deletion requests.
**Solution:** We examined the SQL schema for `contact_messages` and found that the policy `"Admins read messages"` was restricted to `FOR SELECT` only. We created a migration script (`fix_messages_migration.sql`) to drop the old policy and create an overarching `"Admins manage messages" FOR ALL` policy.

---

## 6. Deployment
The application is pre-configured for Vercel deployment. A `vercel.json` file is included in the root directory.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```
This configuration ensures that Vercel routes all traffic to the `index.html` file, allowing React Router to handle the SPA navigation properly. Furthermore, Vercel Web Analytics (`<VercelAnalytics />`) has been integrated into `App.tsx` for production monitoring.
