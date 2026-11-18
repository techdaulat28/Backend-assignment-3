# Assignment 3 — Inventory and Data Management System

**Course:** Web Dev III  
**Unit:** Unit 3  
**CO:** CO3  
**Marks:** 2.5

This project implements the Assignment 3 requirements from the provided lab sheet: a RESTful inventory backend using **Node.js, Express.js, MongoDB and Mongoose**, with schema validation, CRUD, filtering/sorting/pagination, stock adjustments, low-stock reporting, aggregation, dotenv configuration, and centralized error handling.

## 1. Requirements covered

- Mongoose Product schema with field-level validation
- Create Product API
- Get all products with filtering, sorting and pagination
- Get one product by ID
- Update product details
- Safe restock/sale stock adjustment
- Delete product
- Low-stock alert report
- Category-wise inventory summary using MongoDB aggregation
- Centralized error handling
- dotenv environment variables

## 2. Project structure

```text
Inventory-Data-Management-System/
├── src/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── productController.js
│   │   └── reportController.js
│   ├── middleware/errorMiddleware.js
│   ├── models/Product.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── reportRoutes.js
│   └── app.js
├── postman/
│   └── Inventory-API.postman_collection.json
├── postman-screenshots/
│   └── README.md
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## 3. Setup

### Step 1 — Install Node.js

Use Node.js 18+.

### Step 2 — Install MongoDB

Run a local MongoDB server, or use a MongoDB Atlas connection string.

### Step 3 — Install dependencies

```bash
npm install
```

### Step 4 — Configure environment variables

Copy `.env.example` to `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then update `.env` if necessary:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/inventory_management
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

### Step 5 — Start the server

```bash
npm start
```

Development mode:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

## 4. API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API information |
| POST | `/api/products` | Create product |
| GET | `/api/products` | List products with filtering/sorting/pagination |
| GET | `/api/products/:id` | Get single product |
| PUT | `/api/products/:id` | Update product |
| PATCH | `/api/products/:id/stock` | Restock or record sale |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/reports/low-stock` | Low-stock report |
| GET | `/api/reports/low-stock?threshold=15` | Low-stock report with custom threshold |
| GET | `/api/reports/category-summary` | Category-wise aggregation |

## 5. Create Product example

**POST** `/api/products`

```json
{
  "name": "Wireless Mouse",
  "sku": "WM-1001",
  "category": "Electronics",
  "price": 799,
  "stock": 25,
  "lowStockThreshold": 10,
  "supplier": "Tech Supplies Ltd",
  "description": "2.4 GHz wireless mouse"
}
```

## 6. Filtering, sorting and pagination

Example:

```text
GET /api/products?category=Electronics&minPrice=100&maxPrice=2000&sortBy=price&order=asc&page=1&limit=10
```

Supported filters:

- `search`
- `category`
- `minPrice`
- `maxPrice`
- `minStock`
- `maxStock`

Supported sorting fields:

- `name`
- `category`
- `price`
- `stock`
- `createdAt`

## 7. Stock adjustment

Restock:

**PATCH** `/api/products/:id/stock`

```json
{
  "action": "restock",
  "quantity": 15
}
```

Sale:

```json
{
  "action": "sale",
  "quantity": 5
}
```

A sale is rejected when requested quantity is greater than available stock.

## 8. Reports

### Low-stock report

```text
GET /api/reports/low-stock
```

By default, a product is considered low stock when:

```text
stock <= lowStockThreshold
```

A custom threshold can also be supplied:

```text
GET /api/reports/low-stock?threshold=15
```

### Category-wise summary

```text
GET /api/reports/category-summary
```

The aggregation returns:

- category
- product count
- total units
- inventory value
- average price

## 9. Postman testing

The complete Postman collection is included here:

```text
postman/Inventory-API.postman_collection.json
```

Import this collection into Postman.

Recommended execution order:

1. Health / API Root
2. Create Product
3. Copy the returned `_id`
4. Set the collection variable `productId`
5. Get All Products
6. Search Products
7. Get Single Product
8. Update Product
9. Restock Product
10. Record Sale
11. Low Stock Report
12. Low Stock Report — Custom Threshold
13. Category-wise Inventory Summary
14. Delete Product

### Mandatory Postman screenshots

The assignment requires screenshots of Postman outputs in the GitHub README. The repository therefore contains a dedicated `postman-screenshots` folder with the exact checklist.

**Important:** screenshots cannot honestly be claimed as completed from this environment because Postman GUI and a running MongoDB instance are not available here. After starting MongoDB and the API on your computer, run the supplied collection in Postman and add the actual screenshots to `postman-screenshots/`.

Recommended screenshots:

- `01-create-product.png`
- `02-get-all-products.png`
- `03-get-single-product.png`
- `04-update-product.png`
- `05-restock.png`
- `06-sale.png`
- `07-low-stock-report.png`
- `08-category-summary.png`
- `09-delete-product.png`

Then add them to this README using:

```markdown
![Create Product](postman-screenshots/01-create-product.png)
![Get All Products](postman-screenshots/02-get-all-products.png)
![Get Single Product](postman-screenshots/03-get-single-product.png)
![Update Product](postman-screenshots/04-update-product.png)
![Restock](postman-screenshots/05-restock.png)
![Sale](postman-screenshots/06-sale.png)
![Low Stock Report](postman-screenshots/07-low-stock-report.png)
![Category Summary](postman-screenshots/08-category-summary.png)
![Delete Product](postman-screenshots/09-delete-product.png)
```

## 10. GitHub commands

Create a new GitHub repository first, then run:

```bash
git init
git add .
git commit -m "Complete Assignment 3 Inventory Management System"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

After adding the real Postman screenshots:

```bash
git add .
git commit -m "Add Postman API test screenshots"
git push
```

## 11. Security

Do **not** commit `.env`.

The repository includes `.env.example` so another machine can configure its own MongoDB connection.

## 12. Rubric mapping

| Rubric | Implementation |
|---|---|
| Database Schema Design & Validation | `src/models/Product.js` |
| CRUD Functionality | `src/controllers/productController.js` |
| Filtering / Sorting / Pagination | `getProducts()` |
| Aggregation / Reports | `src/controllers/reportController.js` |
| API Design & Clean Code | Routes, controllers, middleware and configuration separated |

## Submission checklist

- [x] Complete Node.js + Express backend
- [x] MongoDB + Mongoose integration
- [x] Product schema and validation
- [x] CRUD APIs
- [x] Filtering, sorting and pagination
- [x] Restock and sale operations
- [x] Low-stock report
- [x] Category aggregation
- [x] Centralized error handling
- [x] dotenv configuration
- [x] Postman collection
- [ ] Run APIs in Postman locally
- [ ] Capture actual Postman response screenshots
- [ ] Insert screenshots into this README
- [ ] Push final repository to GitHub
