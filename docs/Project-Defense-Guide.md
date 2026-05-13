# Craftique - Project Defense Guide

This document is designed to help you prepare for your university discussion (defense) with your doctor/professor. It breaks down the architecture, file structure, key code snippets, and common "trick questions" professors ask.

---

## 1. High-Level Architecture

The project has been refactored from a monolithic legacy PHP application into a modern, decoupled **Single Page Application (SPA)** architecture. 

- **Backend (Laravel 11):** Acts as a Headless REST API. It handles business logic, database interactions (Eloquent ORM), and authentication (Laravel Sanctum). It returns data purely in JSON format.
- **Frontend (React + Vite):** Handles the User Interface and routing. It consumes the Laravel API using `axios`. It uses Tailwind CSS for styling.
- **Communication:** The frontend and backend communicate statelessly via HTTP requests. The frontend stores an authentication token and sends it with every secure request.

---

## 2. Core Project Structure

### `/backend` (Laravel API)
*   **`routes/api.php`**: The most important entry point. This defines all your API endpoints (e.g., `Route::get('/products', ...)`). The doctor will look here first to see how URLs map to your Controllers.
*   **`app/Http/Controllers/`**: Contains the logic for your endpoints. (e.g., `ProductController.php` gets products from the database and returns them).
*   **`app/Models/`**: Contains your Eloquent Models (e.g., `Product.php`, `User.php`). These map exactly to your database tables and define relationships (like `hasMany` or `belongsTo`).
*   **`database/migrations/`**: PHP classes that define your database schema (tables and columns). 

### `/frontend` (React SPA)
*   **`src/App.jsx`**: The root component. This is where your React Router is set up (e.g., `<Route path="/login" ... />`).
*   **`src/pages/`**: Contains the full-page components (e.g., `Home.jsx`, `Login.jsx`).
*   **`src/components/`**: Smaller, reusable UI pieces (e.g., `Navbar.jsx`, `ProductCard.jsx`).
*   **`src/api/axios.js`**: Your central configuration for making HTTP requests to Laravel.

---

## 3. Key Code Snippets & Explanations (Doctor's Favorites)

### A. The Backend: Eloquent Relationships & Controllers

**File:** `backend/app/Http/Controllers/ProductController.php`
```php
public function index()
{
    $products = Product::with('seller')->where('status', 'approved')->get();
    return response()->json($products);
}
```
*   **What it does:** Fetches all approved products and sends them to the frontend as JSON.
*   **Potential Doctor Question:** *"What does `with('seller')` do? Why not just get the products?"*
*   **Your Answer:** "That is eager loading. If we just got the products and then looped through them in the frontend or backend to get the seller's name, we would trigger an 'N+1 query problem' (querying the database hundreds of times). `with('seller')` tells Laravel to join/fetch the seller data in one efficient query."

**File:** `backend/app/Models/Order.php`
```php
public function items()
{
    return $this->hasMany(OrderItem::class);
}
```
*   **What it does:** Tells Laravel that one Order has multiple OrderItems.
*   **Potential Doctor Question:** *"How does Laravel know which items belong to which order?"*
*   **Your Answer:** "By convention, Laravel assumes that the `order_items` table has a foreign key called `order_id`. The `hasMany` method automatically uses that foreign key to link the records."

### B. The Backend: Security & Authentication

**File:** `backend/app/Http/Controllers/AuthController.php`
```php
if (!Auth::attempt($request->only('email', 'password'))) {
    return response()->json(['message' => 'Invalid credentials'], 401);
}
$user = User::where('email', $request->email)->first();
$token = $user->createToken('auth_token')->plainTextToken;
```
*   **What it does:** Verifies user login and issues an API token.
*   **Potential Doctor Question:** *"Why are you generating a token? Why not just use standard PHP sessions?"*
*   **Your Answer:** "Because our frontend is a completely separate React application on a different domain/port. Traditional PHP sessions rely on server-side state and cookies that don't work well across decoupled systems. A token (issued by Laravel Sanctum) is stateless; the React app saves it and sends it back in the header of future requests to prove its identity."

### C. The Frontend: Data Fetching (React Hooks)

**File:** `frontend/src/pages/Home.jsx`
```javascript
useEffect(() => {
    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch", error);
        }
    };
    fetchProducts();
}, []);
```
*   **What it does:** Fetches the product list from Laravel when the page first loads.
*   **Potential Doctor Question:** *"What is the empty array `[]` at the end of `useEffect` for? What happens if you remove it?"*
*   **Your Answer:** "That is the dependency array. An empty array means this effect should only run exactly *once* when the component first mounts (loads). If I remove it entirely, the effect will run after *every single render*, causing an infinite loop of API calls that would crash our server."

### D. The Frontend: Axios Interceptors

**File:** `frontend/src/api/axios.js`
```javascript
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```
*   **What it does:** Automatically attaches the user's login token to every single request sent to Laravel.
*   **Potential Doctor Question:** *"Why use an interceptor? Why not just add the header manually in every component?"*
*   **Your Answer:** "To keep the code DRY (Don't Repeat Yourself). If we manually added it to every `axios.get` and `axios.post`, our code would be messy and error-prone. The interceptor guarantees that if a user is logged in, their token is securely sent every time."

---

## 4. "Random Line" Rapid Fire Prep

Professors love pointing to specific symbols. Memorize these:

1.  **`=>` (Arrow Function in JS):** e.g., `const handleClick = () => {}`. It's a modern JavaScript function syntax that preserves the context of `this` and makes code shorter.
2.  **`->` (Object Operator in PHP):** e.g., `$request->user()`. It is used to access methods or properties of an object in PHP.
3.  **`::` (Scope Resolution Operator in PHP):** e.g., `Product::all()`. It is used to call *static* methods on a class without needing to instantiate the class first.
4.  **`async / await`:** e.g., `async function fetch() { await axios.get(...) }`. It is modern syntax for handling asynchronous operations (like network requests) so the code reads synchronously from top to bottom, avoiding "callback hell."
5.  **`{ products.map(...) }`:** Used in React JSX to loop over an array of data and render HTML elements for each item.

## 5. Live Modification Defense (What if they ask you to change something?)

**Scenario:** *"I want you to show only products that cost less than $50 on the homepage right now."*
*   **Where to go:** `backend/app/Http/Controllers/ProductController.php`
*   **What to change:** Modify the query:
    ```php
    // Original:
    $products = Product::where('status', 'approved')->get();
    
    // Change to:
    $products = Product::where('status', 'approved')->where('price', '<', 50)->get();
    ```

**Scenario:** *"Change the color of the 'Add to Cart' button."*
*   **Where to go:** `frontend/src/components/ProductCard.jsx`
*   **What to change:** Find the `<button className="bg-craft-600 ...">` and change the Tailwind class to `bg-red-500` or similar.
