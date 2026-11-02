# "The Saturation Point" - System Defense Reviewer & Codebase Map

> **Quick Tip for Defense:** When the panel or professor asks to see the implementation of any requirement, refer to the tables below. You can navigate directly to the exact file and line ranges listed.

---

## 1. Quick Reference Matrix (Grading Rubric Map)

| Category / Requirement | Pts | Frontend File & Line Range | Backend File & Line Range | Key Technologies |
| :--- | :---: | :--- | :--- | :--- |
| **MP1: Product Datatable** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L880-L980) | [`controllers/productController.js`](controllers/productController.js#L4-L54) | MUI Table, Pagination, Search & `TableSortLabel` |
| **MP1: Multiple Photo Upload** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L85-L125) | [`controllers/productController.js`](controllers/productController.js#L78-L163) | FormData, Multer (`array`) |
| **MP1: Cloudinary Integration** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L162-L260) | [`utils/cloudinary.js`](utils/cloudinary.js#L1-L36) | `cloudinary.v2`, CloudinaryStorage |
| **MP1: Bulk Delete with Checkboxes** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L709-L747) | [`controllers/productController.js`](controllers/productController.js#L174-L188) | MUI Checkbox, `$in` delete |
| **MP2: User Registration** | 2 | [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L116-L223) | [`routes/userRoutes.js`](routes/userRoutes.js#L16-L21) | Formik, Yup, Cloudinary avatar |
| **MP2: Username & Password Login** | 5 | [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L65-L114) | [`controllers/userController.js`](controllers/userController.js#L80-L92) | Login via username or email |
| **MP2: User Profile Update + Photo** | 5 | [`client/src/pages/Profile.jsx`](client/src/pages/Profile.jsx#L100-L190) | [`controllers/userController.js`](controllers/userController.js#L18-L63) | Multer (`single`), Cloudinary |
| **MP2: Firebase Auth (Email/Pass)** | 10 | [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L84-L90) | [`middleware/auth.js`](middleware/auth.js#L4-L78) | Firebase Client SDK + Admin SDK |
| **MP3: Availed Purchase Check** | 10 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L77-L89) | [`controllers/orderController.js`](controllers/orderController.js#L135-L144) | Order history validation (`status === 'delivered'`) |
| **MP3: Write / Update Review** | 5 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L106-L154) | [`controllers/productController.js`](controllers/productController.js#L190-L261) | Product subdocument schema |
| **MP3: Admin Delete Review** | 5 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L156-L184) | [`controllers/productController.js`](controllers/productController.js#L263-L292) | Admin delete + rating recalculation |
| **Term Test: Completed Transaction** | 10 | [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L40-L115) | [`controllers/orderController.js`](controllers/orderController.js#L5-L71) | Stock check, decrement, order save |
| **Term Test: Admin Order Status** | 5 | [`client/src/pages/AdminTransactions.jsx`](client/src/pages/AdminTransactions.jsx#L84-L133) | [`controllers/orderController.js`](controllers/orderController.js#L84-L133) | Status transition constraints |
| **Term Test: Customer Email Update** | 5 | *Triggered automatically on status update* | [`utils/emailService.js`](utils/emailService.js#L196-L318) | Nodemailer, HTML itemized table |
| **Term Test: PDF Receipt Attachment** | 10 | *Attached on all order and status emails* | [`utils/emailService.js`](utils/emailService.js#L4-L179) | PDFKit in-memory buffer (`shouldAttachReceipt = true`) |
| **Unit 1: Bad-Words Filter** | 10 | *Backend middleware / controller* | [`controllers/productController.js`](controllers/productController.js#L201-L226) | `bad-words` + Tagalog profanities |
| **Unit 1: Yup / Formik Validation** | 10 | Products: [`AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L56-L77)<br>Login: [`Login.jsx`](client/src/pages/Login.jsx#L65-L75)<br>Profile: [`Profile.jsx`](client/src/pages/Profile.jsx#L100-L150) | Handled on frontend with inline error messages | Yup schema + Formik state |
| **Unit 2: Material UI & CSS** | 20 | [`client/src/theme.js`](client/src/theme.js#L1-L80) | N/A | Custom MUI Theme, Lora/Montserrat |
| **Quiz 1: Price Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L285-L300) | [`controllers/productController.js`](controllers/productController.js#L25-L29) | `$gte`, `$lte` query |
| **Quiz 1: Category Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L267-L283) | [`controllers/productController.js`](controllers/productController.js#L18-L23) | `$in` categories query |
| **Quiz 1: Ratings Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L303-L311) | [`controllers/productController.js`](controllers/productController.js#L31-L33) | `$gte` minimum rating |
| **Quiz 2: 12-Month Sales Line Chart** | 10 | [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L62-L90) | [`controllers/orderController.js`](controllers/orderController.js#L73-L82) | Recharts `LineChart`, all 12 months |
| **Quiz 2: Date Range Sales Chart** | 15 | [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L93-L132) | [`controllers/orderController.js`](controllers/orderController.js#L73-L82) | Recharts `BarChart`, date range filter |
| **Quiz 3: Facebook & Gmail Login** | 15 | Context: [`AuthContext.jsx`](client/src/context/AuthContext.jsx#L136-L161)<br>Buttons: [`Login.jsx`](client/src/pages/Login.jsx#L366-L400) | [`middleware/auth.js`](middleware/auth.js#L14-L60) | Firebase OAuth popups, Google & Facebook providers |
| **Quiz 3 (Alternative): Infinite Scroll** | 15 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L48-L123)<br>Sentinel: [`Catalog.jsx#L591-L613`](client/src/pages/Catalog.jsx#L591-L613) | [`controllers/productController.js`](controllers/productController.js#L35-L50) | `IntersectionObserver`, `skip` & `limit` pagination |
| **Quiz 4: Redux State Management** | 15 | Store: [`redux/store.js`](client/src/redux/store.js#L1-L11)<br>Slice: [`redux/slices/cartSlice.js`](client/src/redux/slices/cartSlice.js#L1-L135)<br>Root: [`main.jsx`](client/src/main.jsx#L14-L26) | N/A (Client State Architecture) | Redux Toolkit (`configureStore`, `createSlice`, `createAsyncThunk`, `useDispatch`, `useSelector`) |

---

## 2. Detailed Breakdown by Rubric Category

### MP1: Product / Service CRUD (20 Points Total)

#### 1. Datatables for Product CRUD
- **Frontend File**: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L880-L980)
  - **Material UI `<Table>`**: Features sticky header with `#FAF9F6` background, image thumbnail, name, brand, category, price, stock, and action buttons (Edit, Delete).
  - **Column Header Sorting**: Uses MUI `<TableSortLabel>` on `Name`, `Brand`, `Category`, `Price`, and `Stock` columns with ascending/descending toggling.
  - **Real-Time Search Bar**: Instant client-side search across Name, Brand, Category, and Price with auto-reset to page `0` upon typing.
  - **Height Alignment**: Search input height (`48px`) is mathematically matched with adjacent action buttons (`Bulk Delete`, `Add Product`).
  - **Material UI `<TablePagination>`**: Supports dynamic page changes and rows per page (`5, 10, 25, 50`).
- **Backend File**: [`controllers/productController.js`](controllers/productController.js#L4-L54)
  - `getProducts`: Query builder fetching products with search keyword, category/price/rating filters, and pagination (`skip` and `limit`).
- **Database Model**: [`models/Product.js`](models/Product.js#L1-L64)

#### 2. Upload Multiple Photos
- **Frontend File**: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L85-L125)
  - Appends up to 5 image files to `FormData` under the key `images` alongside an `imageOrder` array.
  - File selection handler validating file types (JPEG, PNG, WEBP), file size (under 5MB), maximum count of 5, and controls for reordering images up/down.
  - Image thumbnail preview grid with move up, move down, and remove buttons.
- **Backend Route**: [`routes/productRoutes.js`](routes/productRoutes.js#L24-L37)
  - `upload.array('images', 5)` middleware processing multiple multipart file uploads.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L78-L163)
  - `createProduct`: Maps uploaded files to an array of URLs: `req.files.map(file => file.path)`.
  - `updateProduct`: Processes newly uploaded files alongside existing image URLs based on the user-selected image order.

#### 3. Cloudinary Integration
- **Backend Utility**: [`utils/cloudinary.js`](utils/cloudinary.js#L1-L36)
  - Configures `cloudinary.v2` using environment variables (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
  - Sets up `CloudinaryStorage` with target folder `'saturation_point_new'` and formats `['jpg', 'png', 'jpeg', 'webp']`.
  - Configures Multer storage, enforcing 5MB limit and disallowing GIFs.
- **Cloudinary Asset Deletion**: [`controllers/productController.js`](controllers/productController.js#L124-L148)
  - Automatically invokes `cloudinary.uploader.destroy(publicId)` when an admin replaces or removes an image during product update.

#### 4. Bulk Delete Using Checkboxes
- **Frontend File**: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L709-L747)
  - `selectedIds` state tracking selected product IDs.
  - `handleSelectAll` and `handleSelectOne` functions managing checkbox selections across sorted and filtered lists.
  - Header checkbox with `indeterminate` and `checked` states for Select All.
  - Row-level checkboxes bound to `selectedIds.includes(product._id)`.
  - "Bulk Delete" button with counter (`Bulk Delete ({selectedIds.length})`).
  - Presents a SweetAlert2 confirmation dialog and sends `{ ids: selectedIds }` to the backend.
- **Backend Route**: [`routes/productRoutes.js`](routes/productRoutes.js#L39)
  - `router.post('/bulk-delete', verifyToken, verifyAdmin, bulkDeleteProducts);`
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L174-L188)
  - Uses Mongoose prepared delete: `Product.deleteMany({ _id: { $in: ids } })`.

---

### MP2: User Functions (20 Points Total)

#### 1. User Registration (Matching Old-System Fields)
- **Frontend File**: [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L116-L223)
  - Initial values matching old-system: `firstName`, `lastName`, `username`, `email`, `password`, `confirmPassword`, `profilePicture`.
  - Yup validation rules for all fields (regex for names, minimum lengths, password match).
  - Asynchronous real-time debounced username uniqueness check (`/api/users/check-username`).
  - Submits user to Firebase, uploads profile picture to Cloudinary via backend `/api/users/profile`, and triggers a custom verification email via `/api/users/send-verification`.
- **Backend Routes**: [`routes/userRoutes.js`](routes/userRoutes.js#L16-L21)
- **Backend Controllers**: [`controllers/userController.js`](controllers/userController.js#L65-L123)
  - `checkUsername`: Checks username availability.
  - `sendVerificationEmail`: Generates verification link using Firebase Admin SDK and dispatches branded email.

#### 2. Username and Password Login
- **Frontend File**: [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L65-L114)
  - Input field `identifier` accepts **either an Email OR a Username**.
  - If `identifier` does not contain `@`, queries backend endpoint `GET /api/users/email-by-username/:username` to retrieve the associated email automatically.
  - Authenticates via Firebase `signInWithEmailAndPassword`, checks `emailVerified`, and rejects unverified logins.
  - Fetches MongoDB profile and routes to `/admin/dashboard` or `/profile`.
- **Backend Controller**: [`controllers/userController.js`](controllers/userController.js#L80-L92)
  - `getEmailByUsername`: Finds user by username and returns their email.

#### 3. User Profile Update with Photo Upload
- **Frontend File**: [`client/src/pages/Profile.jsx`](client/src/pages/Profile.jsx#L100-L190)
  - Formik form with Yup validation for updating personal info (first name, last name, username, email).
  - Submits `FormData` containing updated fields and optional avatar file to `PUT /api/users/profile`.
  - File input validation for avatar (JPEG, PNG, WEBP under 5MB).
  - Password change section using Firebase `updatePassword`.
- **Backend Route**: [`routes/userRoutes.js`](routes/userRoutes.js#L21)
  - `router.put('/profile', verifyToken, upload.single('photo'), updateUserProfile);`
- **Backend Controller**: [`controllers/userController.js`](controllers/userController.js#L18-L63)
  - `updateUserProfile`: Updates `displayName`, `username`, `email` (with collision check), and saves Cloudinary `req.file.path` into `photoURL`.

#### 4. Firebase Authentication Integration
- **Client Firebase Initialization**: [`client/src/firebase.js`](client/src/firebase.js#L1-L15)
- **Auth Context Wrapper**: [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L84-L187)
  - `signInWithEmailAndPassword` and `createUserWithEmailAndPassword`.
  - `onAuthStateChanged` listener synchronizing Firebase auth state with MongoDB profile.
- **Backend Firebase Admin SDK**: [`utils/firebaseAdmin.js`](utils/firebaseAdmin.js#L1-L30)
- **Backend Token Verification Middleware**: [`middleware/auth.js`](middleware/auth.js#L4-L78)
  - Verifies bearer token using `auth.verifyIdToken(token)` and binds MongoDB user to `req.mongoUser`.

---

### MP3: Review & Ratings (20 Points Total)

#### 1. Only Users Who Availed (Purchased) Can Review
- **Frontend File**: [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L77-L89)
  - Queries `/api/orders/myorders` and validates that the logged-in user has an order with `status === 'delivered'` containing the current product:
    ```javascript
    const purchased = orders.some(
      (order) =>
        order.status === 'delivered' &&
        order.orderItems.some((item) => item.product === id),
    );
    setHasPurchased(purchased);
    ```
  - The review form is conditionally rendered only if `hasPurchased` is `true`. Otherwise, an informative notice is displayed.
- **Backend Controller**: [`controllers/orderController.js`](controllers/orderController.js#L135-L144)
  - `getMyOrders`: Fetches all orders belonging to the authenticated user.

#### 2. Users Can Write and Update Their Own Review & Rating
- **Frontend File**: [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L106-L154)
  - Pre-populates existing review if the user has already reviewed the product (`isEditingReview` mode).
  - Formik form submitting rating (1-5 stars) and comment to `POST /api/products/:id/reviews`.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L190-L261)
  - `createProductReview`: Updates existing review in-place or pushes a new review.
  - Automatically recalculates product average `rating` and `numReviews`.
- **Database Model**: [`models/Product.js`](models/Product.js#L35-L60)

#### 3. Admin Can Delete Any Review
- **Frontend File**: [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L156-L184)
  - Admin click handler calling `DELETE /api/products/:id/reviews/:reviewId`.
  - Delete button conditionally rendered for administrators: `mongoUser?.role === 'admin'`.
- **Backend Route**: [`routes/productRoutes.js`](routes/productRoutes.js#L22)
  - `router.delete('/:id/reviews/:reviewId', verifyToken, verifyAdmin, deleteReview);`
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L263-L292)
  - `deleteReview`: Removes review, recalculates rating, and saves.

---

### Term Test Lab: Orders, Status Updates, Emails & PDF (30 Points Total)

#### 1. Completed Transaction (10 Points)
- **Frontend File**: [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L40-L115)
  - Shows order confirmation modal with payment method selection (Cash on Delivery).
  - Posts order items and payment method to `/api/orders`.
  - Clears cart via Redux action `clearCartAction()` and redirects to `/profile`.
- **Backend Route**: [`routes/orderRoutes.js`](routes/orderRoutes.js#L11)
  - `router.post('/', verifyToken, createOrder);`
- **Backend Controller**: [`controllers/orderController.js`](controllers/orderController.js#L5-L71)
  - Validates product existence and live inventory stock.
  - Deducts inventory stock atomically via `$inc: { stock: -item.quantity }`.
  - Adds standard shipping fee (`₱150.00`).
  - Creates order with status `'pending'`.
  - Triggers confirmation email with PDF receipt attached.
- **Database Model**: [`models/Order.js`](models/Order.js#L1-L34)

#### 2. Admin Updates Transaction Status (5 Points)
- **Frontend File**: [`client/src/pages/AdminTransactions.jsx`](client/src/pages/AdminTransactions.jsx#L84-L133)
  - Datatable includes search, sorting via `TableSortLabel`, and status select dropdowns.
  - Restricts invalid transitions (e.g., delivered/cancelled cannot be reverted; pending cannot skip directly to delivered).
  - Sends `PUT /api/orders/:id/status` to update the transaction.
- **Backend Controller**: [`controllers/orderController.js`](controllers/orderController.js#L84-L133)
  - Validates state transition integrity.
  - Automatically restores inventory stock via `$inc: { stock: item.quantity }` if status changes to `'cancelled'`.
  - Triggers updated status email to the customer with updated transaction details.

#### 3. Email Customer with Updated Details (Subtotal & Grand Total) (5 Points)
- **Backend Utility**: [`utils/emailService.js`](utils/emailService.js#L196-L318)
  - Configures Nodemailer transport using Mailtrap / SMTP credentials.
  - Generates HTML email containing:
    - Customer greeting: `Dear ${userName}`
    - Clear status banner: `Your order is now SHIPPED / DELIVERED / CANCELLED`
    - Itemized table with product name, quantity, and individual subtotal
    - Subtotal summary
    - Shipping fee (`₱150.00`)
    - Grand total summary

#### 4. Attach PDF Receipt on Email (10 Points)
- **Backend Utility**: [`utils/emailService.js`](utils/emailService.js#L4-L179) & [`utils/emailService.js:214-225`](utils/emailService.js#L214-L225)
  - `shouldAttachReceipt = true`: **Every order confirmation and status update email** attaches the official PDF receipt buffer (`Receipt-${order._id}.pdf`).
  - Generated in memory via `PDFKit` streaming buffers without writing temporary files to disk.
  - Features store branding ("THE SATURATION POINT"), order ID, date, customer name, email, payment method, item table with unit prices and subtotals, shipping fee, and grand total.

---

### Unit 1: Bad-Words Filtering & Form Validation (20 Points Total)

#### 1. Filter / Mask Bad Words from Reviews (`bad-words` Package) (10 Points)
- **Backend Package**: [`package.json`](package.json#L23) (`"bad-words": "^4.1.5"`)
- **Backend File**: [`controllers/productController.js`](controllers/productController.js#L201-L226)
  - `const { Filter } = require('bad-words');`
  - Instantiates filter, registers custom Filipino/Tagalog profanities via `filter.addWords(...)`, and masks profane words with asterisks (`****`).

#### 2. Form Validation on Product and User Forms (Yup & Formik) (10 Points)
- **Product Form (Admin)**: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L56-L77)
  - Yup validation schema checking name, description, positive price, brand, category, and integer stock.
- **User Login Form**: [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L65-L75)
  - Yup validation requiring identifier and password.
- **User Registration Form**: [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L116-L156)
  - Yup schema for names, username regex, valid email, minimum 6-character password, and password match.
- **User Profile Update Form**: [`client/src/pages/Profile.jsx`](client/src/pages/Profile.jsx#L100-L150)
  - Yup schema for updating profile attributes and password.
- **Review Form**: [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L106-L117)
  - Rating required (min 1 star) and comment validation.

---

### Unit 2: User Interface Design CSS and Material UI (20 Points Total)

#### 1. Material UI Theme & Component System
- **Theme Configuration**: [`client/src/theme.js`](client/src/theme.js#L1-L80)
  - Color palette definition (`primary: '#1C1917'`, `secondary: '#CA8A04'`, `background: '#FAF9F6'`).
  - Typography hierarchy using Lora / Cormorant headers and Montserrat body.
  - Clean, sharp corners (`borderRadius: 0`).
  - Component overrides for `MuiButton`, `MuiPaper`, and `MuiTextField`.
- **Consistent Layout**:
  - Max container width locked to `maxWidth="xl"` (1536px) across Admin dashboard and user Profile for visual symmetry.
  - Table headers locked with `#FAF9F6` background styling.
  - Action buttons and search inputs locked to uniform `48px` heights.

---

### Quiz 1: Catalog Filters (15 Points Total)

#### 1. Price Filter (5 Points)
- **Frontend File**: [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L285-L300)
  - `minPrice` and `maxPrice` state inputs querying `&minPrice=${minPrice}&maxPrice=${maxPrice}`.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L25-L29)
  - Builds MongoDB query with `$gte` and `$lte`.

#### 2. Category Filter (5 Points)
- **Frontend File**: [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L267-L283)
  - `selectedCategories` array querying `&category=${selectedCategories.join(',')}`.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L18-L23)
  - Builds MongoDB query with `$in: categories`.

#### 3. Ratings Filter (5 Points)
- **Frontend File**: [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L303-L311)
  - Interactive Material UI `<Rating>` component querying `&minRating=${minRating}`.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L31-L33)
  - Builds MongoDB query with `rating: { $gte: Number(minRating) }`.

---

### Quiz 2: Sales Charts & Analytics (25 Points Total)

#### 1. Monthly Sales Line Chart - All 12 Months (10 Points)
- **Frontend File**: [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L62-L90)
  - Pre-populates all 12 calendar months (`Jan` through `Dec`) and maps delivered order amounts.
  - Renders Recharts `<LineChart>` with responsive container.
- **Backend Controller**: [`controllers/orderController.js`](controllers/orderController.js#L73-L82)
  - Fetches orders for dashboard calculations.

#### 2. Sales Chart with Date Range Filter (15 Points)
- **Frontend File**: [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L93-L132)
  - `startDate` and `endDate` date pickers filtering sales aggregation.
  - Renders Recharts `<BarChart>` displaying revenue grouped by date.

---

### Quiz 3: Facebook & Gmail Login using Firebase (15 Points Total)

#### 1. OAuth Providers & Scope Configuration
- **Auth Context File**: [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L136-L161)
  - `loginWithGoogle`: Instantiates `GoogleAuthProvider` with email and profile scopes.
  - `loginWithFacebook`: Instantiates `FacebookAuthProvider` with email and public profile scopes.
  - `trackPopup`: Automatically tracks popup status to prevent hung authentication sessions.
  - `extractEmailFromCred`: Safely retrieves verified social emails from provider credentials.
- **Login & Register UI**:
  - [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L366-L400): Branded "Continue with Google" and "Continue with Facebook" action buttons.
  - [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L741-L780): Social authentication options.
- **Backend Synchronization**: [`middleware/auth.js`](middleware/auth.js#L14-L60)
  - Verifies token via Firebase Admin SDK, reads social credentials, and ensures a matching MongoDB user profile exists.

*(Note: The catalog also includes the native **`IntersectionObserver` Infinite Scroll** under [`client/src/pages/Catalog.jsx:48-123`](client/src/pages/Catalog.jsx#L48-L123)).*

---

### Quiz 4: Redux State Management (15 Points Total)

#### 1. Store Configuration & Architecture
- **Dependencies**: [`client/package.json`](client/package.json#L18-L24) (`"@reduxjs/toolkit": "^2.13.0"`, `"react-redux": "^9.3.1"`)
- **Store Configuration**: [`client/src/redux/store.js`](client/src/redux/store.js#L1-L11)
  - Configured using Redux Toolkit's `configureStore`:
    ```javascript
    import { configureStore } from '@reduxjs/toolkit';
    import cartReducer from './slices/cartSlice';

    export const store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
    ```
- **Application Provider Root**: [`client/src/main.jsx`](client/src/main.jsx#L14-L26)
  - Root application is wrapped with Redux `<Provider store={store}>` at top level.

#### 2. Cart Slice, Actions & Async Thunks
- **Slice File**: [`client/src/redux/slices/cartSlice.js`](client/src/redux/slices/cartSlice.js#L1-L135)
  - **Synchronous Actions & Reducers**:
    - `setCart`: Sets cart items array.
    - `updateQuantity`: Adjusts item quantity while respecting product stock limits.
    - `removeFromCart`: Removes a specific product from cart state.
    - `clearCart`: Clears all cart items upon successful checkout.
  - **Asynchronous Thunks (`createAsyncThunk`)**:
    - `addToCartWithStockCheck`: Asynchronously fetches live stock from the backend API (`/api/products/:id`) before appending to cart state to prevent overselling.
    - `verifyCartStockThunk`: Asynchronously audits live database stock for all items currently in cart upon cart page load.
  - **Selectors**:
    - `selectCartItems`: Selects cart item list.
    - `selectCartTotal`: Calculates subtotal sum across cart items.
    - `selectCartItemCount`: Calculates total item count for badge indicators.

#### 3. Component Consumption
- **Navbar**: [`client/src/components/Navbar.jsx`](client/src/components/Navbar.jsx#L17-L21) selects cart badge counter via `useSelector(selectCartItemCount)`.
- **Cart Page**: [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L11-L38) dispatches actions (`updateQuantityAction`, `removeFromCartAction`, `clearCartAction`, `verifyCartStockThunk`) and reads state via `useSelector(selectCartItems)`.
- **Context Bridge**: [`client/src/context/CartContext.jsx`](client/src/context/CartContext.jsx#L1-L100) provides seamless Redux dispatching and persistence with user `localStorage`.

---

## 3. Architecture & Security Defense Checklist

| Security / Design Area | Implementation Location | Defense Talking Points |
| :--- | :--- | :--- |
| **NoSQL Injection Prevention** | Controllers: [`productController.js`](controllers/productController.js#L4-L188), [`orderController.js`](controllers/orderController.js#L5-L71), [`userController.js`](controllers/userController.js#L18-L63) | All queries use Mongoose prepared methods (`findById`, `findOne`, `create`, `deleteMany`) with strict schema typing, preventing arbitrary operator injection. |
| **JWT & Token Authentication** | Middleware: [`middleware/auth.js:14-16`](middleware/auth.js#L14-L16) | Uses Firebase Admin SDK `verifyIdToken(token)` to cryptographically verify RS256 JWT tokens on every protected API call. |
| **Role-Based Access Control (RBAC)** | Middleware: [`middleware/auth.js:80-86`](middleware/auth.js#L80-L86)<br>Frontend: [`client/src/App.jsx:31-38`](client/src/App.jsx#L31-L38) | Protected routes check `mongoUser.role === 'admin'`. Unauthorized requests return HTTP 403 Forbidden on both backend and frontend. |
| **Stock Concurrency & Integrity** | Controller: [`orderController.js:41-43`](controllers/orderController.js#L41-L43) | Uses atomic MongoDB update operators `$inc: { stock: -quantity }` to prevent race conditions during checkout. |
| **Cloudinary File Storage & Cleanup** | Storage: [`utils/cloudinary.js:12-34`](utils/cloudinary.js#L12-L34)<br>Cleanup: [`controllers/productController.js:131-147`](controllers/productController.js#L131-L147), [`controllers/userController.js:173-182`](controllers/userController.js#L173-L182) | Direct upload to Cloudinary CDN with MIME-type filtering; automatically destroys obsolete public assets when products or users are deleted. |
| **In-Memory PDF Generation** | Utility: [`utils/emailService.js:4-179`](utils/emailService.js#L4-L179) | Uses streaming PDFKit buffers in memory, avoiding disk I/O vulnerabilities and temporary file storage issues. |
| **Rate Limiting & DDoS Defense** | Middleware: [`server.js:13-28`](server.js#L13-L28) | Uses `express-rate-limit` with `trust proxy` enabled to cap requests at 500 per 15 minutes per IP, returning HTTP 429 to mitigate Layer 7 brute force attacks. |
| **Redux State Management** | Store: [`client/src/redux/store.js`](client/src/redux/store.js#L1-L11)<br>Slice: [`client/src/redux/slices/cartSlice.js`](client/src/redux/slices/cartSlice.js#L1-L135) | Unidirectional data flow using Redux Toolkit with pure reducers, async thunks for live stock verification, and centralized state. |

---

## 4. Frequently Asked Questions by Defense Panels

### Q1: "Show me where you ensure only customers who actually availed the product can write a review."
> **Answer & File to Show:**  
> Open [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L77-L89).  
> Show lines 77–89: The system calls `/api/orders/myorders` and uses JavaScript `.some()` to verify that an order with `status === 'delivered'` exists containing this product's ID. If `hasPurchased` is false, the review submission form is hidden and replaced by a notice.

### Q2: "How does the system generate the official PDF receipt and send the email?"
> **Answer & File to Show:**  
> Open [`utils/emailService.js`](utils/emailService.js#L4-L179) and [`utils/emailService.js:214-225`](utils/emailService.js#L214-L225).  
> Show how `generatePDFReceipt` uses PDFKit to stream binary chunks into a memory buffer (`Buffer.concat(buffers)`). `shouldAttachReceipt = true` ensures that **every order email and status update email** attaches the official PDF receipt buffer (`Receipt-${order._id}.pdf`) via Nodemailer. Show lines 226–285 for the itemized HTML table showing subtotal, shipping fee, and grand total.

### Q3: "How is Redux implemented in the project for Quiz 4?"
> **Answer & File to Show:**  
> 1. Show [`client/package.json`](client/package.json#L18-L24): Point to `@reduxjs/toolkit` and `react-redux`.  
> 2. Show [`client/src/main.jsx`](client/src/main.jsx#L14-L26): Point to `<Provider store={store}>` wrapping the React application.  
> 3. Show [`client/src/redux/store.js`](client/src/redux/store.js#L1-L11): Point to the store initialized with `configureStore` and `cartReducer`.  
> 4. Show [`client/src/redux/slices/cartSlice.js`](client/src/redux/slices/cartSlice.js#L1-L135): Point to the `cartSlice`, the synchronous reducers (`setCart`, `updateQuantity`, `removeFromCart`, `clearCart`), and the async thunks `addToCartWithStockCheck` and `verifyCartStockThunk`.  
> 5. Show [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L11-L38) and [`client/src/components/Navbar.jsx`](client/src/components/Navbar.jsx#L17-L21) actively consuming Redux via `useDispatch` and `useSelector`.

### Q4: "Where are the bad words filtered in reviews?"
> **Answer & File to Show:**  
> Open [`controllers/productController.js`](controllers/productController.js#L201-L226).  
> Show how `new Filter()` from the `bad-words` npm package is initialized, customized with Filipino profanities via `filter.addWords(...)`, and executed on the incoming comment with `filter.clean(sanitizedComment)`.

### Q5: "Where is the bulk delete implemented?"
> **Answer & File to Show:**  
> 1. Frontend: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L709-L747) & [`client/src/pages/AdminProducts.jsx:880-922`](client/src/pages/AdminProducts.jsx#L880-L922). Show the select-all checkbox, individual checkboxes, and the bulk delete handler sending an array of IDs.  
> 2. Backend: [`controllers/productController.js`](controllers/productController.js#L174-L188). Show `Product.deleteMany({ _id: { $in: ids } })`.

### Q6: "How does login with username work when Firebase only supports email/password?"
> **Answer & File to Show:**  
> Open [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L81-L90) and [`controllers/userController.js`](controllers/userController.js#L80-L92).  
> Explain that if the user inputs a username (no `@` symbol), the frontend queries `GET /api/users/email-by-username/:username` to fetch their registered email address from MongoDB, which is then used seamlessly with Firebase Auth's `signInWithEmailAndPassword`.

### Q7: "How is clickable column header sorting and search implemented in the admin datatables?"
> **Answer & File to Show:**  
> Open [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L630-L665) and [`client/src/pages/AdminProducts.jsx:880-940`](client/src/pages/AdminProducts.jsx#L880-L940).  
> Explain that MUI's native `<TableSortLabel>` is used for sortable headers with ascending/descending toggling. Show the `useMemo` filtering and sorting pipelines that handle case-insensitive string sorting, numeric price/stock sorting, and chronological date sorting across all 5 admin tables and user Order History. Show that search input height is locked to `48px` to match action buttons.

### Q8: "How is the system protected against DDoS and API spamming?"
> **Answer & File to Show:**  
> Open [`server.js:13-28`](server.js#L13-L28).  
> Explain that the application uses a multi-layered defense strategy:  
> 1. At the infrastructure level (Layers 3 & 4), Render and Firebase sit behind edge networks that mitigate volumetric floods.  
> 2. At the application level (Layer 7), [`server.js:13-28`](server.js#L13-L28) enforces `express-rate-limit` with `trust proxy` set to `1` (for reverse proxy environments), capping requests at 500 per 15 minutes per IP address and returning HTTP 429 Too Many Requests if exceeded.
