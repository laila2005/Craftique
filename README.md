# Craftique - Handmade Products Marketplace

Craftique is a modern, full-stack marketplace for handmade goods. It replaces the legacy monolithic PHP application with a completely decoupled architecture using **Laravel 11** for the RESTful backend API and **React (Vite)** for the dynamic frontend.

## Architecture & Technology Stack

The project has been restructured into two main directories:

### 1. Backend (`/backend`)
A headless REST API built on **Laravel 11** and **MySQL/SQLite** (currently using SQLite for out-of-the-box local execution).
- **Laravel Sanctum:** Provides multi-guard authentication (`admin`, `seller`, `buyer`) using scoped API tokens.
- **Eloquent ORM:** Handles complex relationships between `Products`, `Sellers`, `Users` (buyers), `Orders`, `Carts`, and `Reviews`.
- **Soft Deletes:** Products use soft deletes so that if a seller "deletes" an item, it is archived and previous order histories are not broken.
- **REST API (`routes/api.php`):** Serves versioned JSON responses using Laravel API Resources.

### 2. Frontend (`/frontend`)
A responsive Single Page Application (SPA) built with **React** and **Vite**.
- **Tailwind CSS:** Provides a premium, utility-first design system with custom brand colors (`craft` palette).
- **Axios:** Handles asynchronous HTTP requests to the Laravel API.
- **Lucide React:** Supplies modern, lightweight SVG icons.

### 3. Legacy Code (`/legacy`)
All the original procedural PHP files (e.g., `index.php`, `Cart.php`, `login.php`) have been safely archived in the `legacy` folder. They are no longer executed but remain for reference if any old business logic needs to be migrated later.

## Database Schema Highlights
- **Admins:** Superusers with full access to the platform.
- **Sellers:** Independent artisans who manage their own stores, descriptions, and product inventories.
- **Users:** Customers who browse products, add them to carts, check out, and leave reviews.
- **Products:** The core entity, linking to `seller_id`, tracking stock, and supporting image URLs.

## How to Run the Application

### 1. Run the Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Ensure you have PHP 8.2+ installed.
3. Install PHP dependencies:
   ```bash
   composer install
   ```
4. Run the database migrations and seeders (this will create the SQLite database and populate it with realistic dummy products and sellers):
   ```bash
   php artisan migrate:fresh --seed
   ```
5. Start the Laravel development server:
   ```bash
   php artisan serve
   ```
   *The API will be available at `http://127.0.0.1:8000`*

### 2. Run the React Frontend
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`*

## Key Features Implemented (MVP)
- **RESTful Endpoints:** Fetch all products and display them dynamically.
- **Multi-vendor Support:** Each product displays its artisan/seller information.
- **Premium UI:** A high-quality design aesthetics using Tailwind CSS, featuring hover effects, responsive grids, and clean typography.
- **Real Dummy Data:** The database seeder (`DatabaseSeeder.php`) populates the store with beautiful, realistic Unsplash images of handmade crafts (ceramics, knits, soaps).

## Future Roadmap (Next Steps)
- Connect the frontend shopping cart UI to the `POST /api/cart` endpoint.
- Build the Seller Dashboard React components to allow artisans to upload new products and manage orders.
- Implement the Laravel Gates & Policies for strict Role-Based Access Control on the edit/delete endpoints.
