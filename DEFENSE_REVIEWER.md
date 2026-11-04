# "The Saturation Point" - System Defense Reviewer & Codebase Map

> **Quick Tip for Defense:** When the panel or professor asks to see the implementation of any requirement, refer to the tables below. You can navigate directly to the exact file and line ranges listed.

---

## 1. Quick Reference Matrix (Grading Rubric Map)

| Category / Requirement | Pts | Frontend File & Line Range | Backend File & Line Range | Key Technologies |
| :--- | :---: | :--- | :--- | :--- |
| **MP1: Product Datatable** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L910-L1140) | [`controllers/productController.js`](controllers/productController.js#L8-L63) | MUI Table, Pagination, Search & `TableSortLabel` |
| **MP1: Multiple Photo Upload** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L85-L125) | [`controllers/productController.js`](controllers/productController.js#L109-L194) | FormData, Multer (`array`), `imageOrder` |
| **MP1: Cloudinary Integration** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L85-L125) | [`utils/cloudinary.js`](utils/cloudinary.js#L1-L36)<br>[`controllers/productController.js`](controllers/productController.js#L155-L180) | `cloudinary.v2`, CloudinaryStorage, automatic destroy |
| **MP1: Bulk Delete with Checkboxes** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L709-L748) | [`controllers/productController.js`](controllers/productController.js#L205-L219) | MUI Checkbox, `$in` delete, instant local state |
| **MP1: Live Hero Search Autocomplete** | + | [`client/src/pages/Home.jsx`](client/src/pages/Home.jsx#L30-L98) | [`controllers/productController.js`](controllers/productController.js#L65-L85)<br>[`routes/productRoutes.js`](routes/productRoutes.js#L19) | 250ms Debounced live search, `escapeRegex` sanitize |
| **MP2: User Registration** | 2 | [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L121-L235) | [`routes/userRoutes.js`](routes/userRoutes.js#L29-L31)<br>[`controllers/userController.js`](controllers/userController.js#L66-L124) | Formik, Yup, Cloudinary avatar, Mailtrap verify |
| **MP2: Username & Password Login** | 5 | [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L113-L171) | [`controllers/userController.js`](controllers/userController.js#L81-L93) | Login via username or email lookup, username enumeration defense |
| **MP2: Password Reset via Mailtrap** | + | Modal: [`Login.jsx`](client/src/pages/Login.jsx#L52-L74)<br>Page: [`ResetPassword.jsx`](client/src/pages/ResetPassword.jsx#L25-L100) | [`controllers/userController.js`](controllers/userController.js#L126-L196)<br>[`utils/emailService.js`](utils/emailService.js#L381-L441) | Firebase Admin action links, Mailtrap, timing defense |
| **MP2: User Profile Update + Photo** | 5 | [`client/src/pages/Profile.jsx`](client/src/pages/Profile.jsx#L100-L190) | [`controllers/userController.js`](controllers/userController.js#L19-L64) | Multer (`single`), Cloudinary CDN upload |
| **MP2: Firebase Auth (Email/Pass)** | 10 | [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L99-L105) | [`middleware/auth.js`](middleware/auth.js#L4-L114) | Firebase Client SDK + Admin SDK `verifyIdToken` |
| **MP2: User Account Enable / Disable** | + | [`client/src/pages/AdminUsers.jsx`](client/src/pages/AdminUsers.jsx#L102-L155) | [`controllers/userController.js`](controllers/userController.js#L244-L283)<br>[`middleware/auth.js`](middleware/auth.js#L92-L98) | Token revocation, instant 403 logout, status badges |
| **MP2: User Role Security (RBAC)** | + | [`client/src/pages/AdminUsers.jsx`](client/src/pages/AdminUsers.jsx#L412-L434) | [`controllers/userController.js`](controllers/userController.js#L210-L242) | Read-only luxury badges, HTTP 403 escalation lock |
| **MP3: Availed Purchase Check** | 10 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L77-L89) | [`controllers/orderController.js`](controllers/orderController.js#L135-L144) | Order history validation (`status === 'delivered'`) |
| **MP3: Write / Update Review** | 5 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L106-L154) | [`controllers/productController.js`](controllers/productController.js#L221-L292) | Subdocument schema, average recalculation |
| **MP3: Admin Delete Review** | 5 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L156-L184) | [`controllers/productController.js`](controllers/productController.js#L294-L322) | Admin delete + rating recalculation |
| **Term Test: Completed Transaction** | 10 | [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L49-L125) | [`controllers/orderController.js`](controllers/orderController.js#L5-L71) | Stock check, `$inc: -qty`, order creation |
| **Term Test: Admin Order Status** | 5 | [`client/src/pages/AdminTransactions.jsx`](client/src/pages/AdminTransactions.jsx#L84-L133) | [`controllers/orderController.js`](controllers/orderController.js#L84-L133) | Status transition constraints, cancel restock |
| **Term Test: Customer Email Update** | 5 | *Triggered automatically on status update* | [`utils/emailService.js`](utils/emailService.js#L196-L318) | Nodemailer, Mailtrap, HTML itemized table |
| **Term Test: PDF Receipt Attachment** | 10 | *Attached on all order and status emails* | [`utils/emailService.js`](utils/emailService.js#L4-L179)<br>[`utils/emailService.js#L218-L228`](utils/emailService.js#L218-L228) | PDFKit in-memory buffer (`Receipt-${order._id}.pdf`) |
| **Unit 1: Bad-Words Filter** | 10 | *Backend review sanitation* | [`controllers/productController.js`](controllers/productController.js#L232-L257) | `bad-words` + Tagalog profanity dictionary |
| **Unit 1: Yup / Formik Validation** | 10 | Products: [`AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L68-L76)<br>Login: [`Login.jsx`](client/src/pages/Login.jsx#L113-L122)<br>Register: [`Register.jsx`](client/src/pages/Register.jsx#L130-L170)<br>Profile: [`Profile.jsx`](client/src/pages/Profile.jsx#L100-L150) | Handled on frontend with inline error messages | Yup schema + Formik state management |
| **Unit 2: Material UI & CSS** | 20 | [`client/src/theme.js`](client/src/theme.js#L1-L80) | N/A | Custom MUI Theme, Lora/Montserrat, `#FAF9F6` |
| **Quiz 1: Price Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L310-L327) | [`controllers/productController.js`](controllers/productController.js#L41-L45) | `$gte`, `$lte` MongoDB queries |
| **Quiz 1: Category Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L293-L308) | [`controllers/productController.js`](controllers/productController.js#L34-L39) | `$in` categories query |
| **Quiz 1: Ratings Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L359-L370) | [`controllers/productController.js`](controllers/productController.js#L47-L49) | `$gte` minimum rating filter |
| **Quiz 1: Reviews Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L329-L357) | [`controllers/productController.js`](controllers/productController.js#L51-L53) | `$gte` minimum review count filter, quick 1+ toggle |
| **Quiz 2: 12-Month Sales Line Chart** | 10 | [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L62-L95)<br>Chart: [`AdminDashboard.jsx#L177-L218`](client/src/pages/AdminDashboard.jsx#L177-L218) | [`controllers/orderController.js`](controllers/orderController.js#L73-L82) | Recharts `LineChart`, all 12 calendar months |
| **Quiz 2: Date Range Sales Chart** | 15 | [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L96-L140)<br>Chart: [`AdminDashboard.jsx#L339-L370`](client/src/pages/AdminDashboard.jsx#L339-L370) | [`controllers/orderController.js`](controllers/orderController.js#L73-L82) | Recharts `BarChart`, dynamic date range aggregation |
| **Quiz 3: Facebook & Gmail Login** | 15 | Context: [`AuthContext.jsx`](client/src/context/AuthContext.jsx#L150-L180)<br>Buttons: [`Login.jsx`](client/src/pages/Login.jsx#L430-L480) | [`middleware/auth.js`](middleware/auth.js#L14-L60) | Firebase OAuth popups, Google & Facebook providers |
| **Quiz 3 (Alternative): Infinite Scroll** | 15 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L108-L135)<br>Target: [`Catalog.jsx#L606`](client/src/pages/Catalog.jsx#L606) | [`controllers/productController.js`](controllers/productController.js#L40-L55) | Native `IntersectionObserver`, `skip` & `limit` |
| **Quiz 4: Redux State Management** | 15 | Store: [`redux/store.js`](client/src/redux/store.js#L1-L11)<br>Slice: [`redux/slices/cartSlice.js`](client/src/redux/slices/cartSlice.js#L1-L135)<br>Root: [`main.jsx`](client/src/main.jsx#L14-L26) | N/A (Client State Architecture) | Redux Toolkit (`configureStore`, `createSlice`, `createAsyncThunk`) |
| **Database Seeder & Cleanup** | + | Terminal: `npm run seed`<br>Cleanup: `npm run unseed` | [`seed-additional.js`](seed-additional.js#L1-L372)<br>[`unseed.js`](unseed.js#L1-L103) | Idempotent insertion, partial deletion detection |

---

## 2. Detailed Breakdown by Rubric Category

### MP1: Product / Service CRUD (20 Points Total)

#### 1. Datatables for Product CRUD
- **Frontend File**: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L910-L1140)
  - **Material UI `<Table>`**: Features sticky header with `#FAF9F6` background, image thumbnail, name, brand, category, price, stock, and action buttons (Edit, Delete).
  - **Column Header Sorting**: Uses MUI `<TableSortLabel>` on `Name`, `Brand`, `Category`, `Price`, and `Stock` columns with ascending/descending toggling.
  - **Real-Time Search Bar**: Instant client-side search across Name, Brand, Category, and Price with auto-reset to page `0` upon typing.
  - **Height Alignment**: Search input height (`48px`) is mathematically matched with adjacent action buttons (`Bulk Delete`, `Add Product`).
  - **Material UI `<TablePagination>`**: Supports dynamic page changes and rows per page (`5, 10, 25, 50`).
  - **Optimistic State Updates**: Deletions immediately remove records from local React state (`setProducts(prev => prev.filter(...))`), preventing table reloading or screen flashing.
  - **SweetAlert2 Async Feedback**: Uses `showLoaderOnConfirm: true` and `preConfirm` to render an inline loading spinner while awaiting the delete request.
- **Backend File**: [`controllers/productController.js`](controllers/productController.js#L8-L63)
  - `getProducts`: Query builder fetching products with search keyword, category/price/rating filters, and pagination (`skip` and `limit`).
  - **Regex Injection & ReDoS Defense**: User search input (`kw`) is sanitized via `escapeRegex` (`replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) before compiling into MongoDB `$regex` queries, neutralizing regex metacharacters, syntax crash vectors (e.g., unclosed parentheses), and wildcard manipulation.
- **Database Model**: [`models/Product.js`](models/Product.js#L1-L64)

#### 2. Upload Multiple Photos
- **Frontend File**: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L85-L125)
  - Appends up to 5 image files to `FormData` under the key `images` alongside an `imageOrder` array.
  - File selection handler validating file types (JPEG, PNG, WEBP), file size (under 5MB), maximum count of 5, and controls for reordering images up/down.
  - Image thumbnail preview grid with move up, move down, and remove buttons.
- **Backend Route**: [`routes/productRoutes.js`](routes/productRoutes.js#L26-L39)
  - `upload.array('images', 5)` middleware processing multiple multipart file uploads.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L109-L194)
  - `createProduct`: Maps uploaded files to an array of URLs: `req.files.map(file => file.path)`.
  - `updateProduct`: Processes newly uploaded files alongside existing image URLs based on the user-selected image order.

#### 3. Cloudinary Integration
- **Backend Utility**: [`utils/cloudinary.js`](utils/cloudinary.js#L1-L36)
  - Configures `cloudinary.v2` using environment variables (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
  - Sets up `CloudinaryStorage` with target folder `'saturation_point_new'` and formats `['jpg', 'png', 'jpeg', 'webp']`.
  - Configures Multer storage, enforcing 5MB limit and disallowing GIFs.
- **Cloudinary Asset Deletion**: [`controllers/productController.js`](controllers/productController.js#L155-L180)
  - Automatically invokes `cloudinary.uploader.destroy(publicId)` when an admin replaces or removes an image during product update or deletion.

#### 4. Bulk Delete Using Checkboxes
- **Frontend File**: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L709-L748)
  - `selectedIds` state tracking selected product IDs.
  - `handleSelectAll` and `handleSelectOne` functions managing checkbox selections across sorted and filtered lists.
  - Header checkbox with `indeterminate` and `checked` states for Select All.
  - Row-level checkboxes bound to `selectedIds.includes(product._id)`.
  - "Bulk Delete" button with counter (`Bulk Delete ({selectedIds.length})`).
  - Presents a SweetAlert2 confirmation dialog and sends `{ ids: selectedIds }` to the backend.
  - Instant local state removal prevents entire datatable re-fetching.
- **Backend Route**: [`routes/productRoutes.js`](routes/productRoutes.js#L41)
  - `router.post('/bulk-delete', verifyToken, verifyAdmin, bulkDeleteProducts);`
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L205-L219)
  - Uses Mongoose prepared delete: `Product.deleteMany({ _id: { $in: ids } })`.

#### 5. Live Hero Search Autocomplete
- **Frontend File**: [`client/src/pages/Home.jsx`](client/src/pages/Home.jsx#L30-L98)
  - Features an interactive search bar in the hero section.
  - Debounced at 250ms: automatically queries `GET /api/products/search?q=...` once the user types 2 or more characters.
  - Real-time dropdown presents matching products with thumbnail images, names, categories, brands, and formatted prices.
  - Clicking any search result navigates directly to [`/product/:id`](client/src/pages/ProductDetails.jsx).
  - Pressing Enter or clicking search submits to [`/catalog?search=...`](client/src/pages/Catalog.jsx), syncing the query parameter into the catalog filter state.
  - Hero image optimization: image preloaded via [`client/index.html:7`](client/index.html#L7) with dark background `#1B263B` to eliminate flashing placeholders.
- **Backend Route & Controller**: [`routes/productRoutes.js:19`](routes/productRoutes.js#L19) & [`controllers/productController.js:65-85`](controllers/productController.js#L65-L85)
  - `searchProducts`: Performs case-insensitive regex search across `name`, `brand`, and `category`, returning up to 5 quick results for autocomplete speed.
  - **Regex Sanitization**: Query parameter `q` is sanitized through `escapeRegex` to prevent ReDoS and wildcard exploitation in real-time search queries.

---

### MP2: User Functions (20 Points Total)

#### 1. User Registration (Matching Old-System Fields)
- **Frontend File**: [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L121-L235)
  - Initial values matching old-system: `firstName`, `lastName`, `username`, `email`, `password`, `confirmPassword`, `profilePicture`.
  - Yup validation rules for all fields (regex for names, minimum lengths, password match).
  - Asynchronous real-time debounced username uniqueness check (`/api/users/check-username`).
  - Submits user to Firebase, uploads profile picture to Cloudinary via backend `/api/users/profile`, and triggers a custom verification email via `/api/users/send-verification`.
- **Backend Routes**: [`routes/userRoutes.js`](routes/userRoutes.js#L29-L31)
- **Backend Controllers**: [`controllers/userController.js`](controllers/userController.js#L66-L124)
  - `checkUsername`: Checks username availability.
  - `sendVerificationEmail`: Generates verification link using Firebase Admin SDK and dispatches branded email via Mailtrap.

#### 2. Username and Password Login
- **Frontend File**: [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L113-L171)
  - Input field `identifier` accepts **either an Email OR a Username**.
  - If `identifier` does not contain `@`, queries backend endpoint `GET /api/users/email-by-username/:username` to retrieve the associated email automatically.
  - **User Enumeration & Timing Attack Defense**: If the username is not found in MongoDB, instead of disclosing `"User not found with that username"`, the client waits for 350ms to mirror Firebase network latency and throws `Firebase: auth/invalid-credential` ([`client/src/pages/Login.jsx:136-137`](client/src/pages/Login.jsx#L136-L137)).
  - **Unified Credential Error**: Handled by `formatFirebaseError` ([`client/src/pages/Login.jsx:88-94`](client/src/pages/Login.jsx#L88-L94)), which uniformly displays `"Invalid email, username, or password. Please try again."` for all invalid email, username, or password attempts.
  - Authenticates via Firebase `signInWithEmailAndPassword`, checks `emailVerified`, and rejects unverified logins.
  - Fetches MongoDB profile and routes to `/admin/dashboard` or `/profile`.
- **Backend Controller**: [`controllers/userController.js`](controllers/userController.js#L81-L93)
  - `getEmailByUsername`: Finds user by username and returns their email.

#### 3. Password Reset Flow (Mailtrap Integration & Timing Attack Mitigation)
- **Frontend Login Modal**: [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L52-L74) & [`client/src/pages/Login.jsx:497-652`](client/src/pages/Login.jsx#L497-L652)
  - Accessible via "Forgot password?" button on the login card.
  - Accepts either registered username or email address.
  - Tightened modal geometry (`pt: 0.5, pb: 0`) ensures clean visual spacing between confirmation instructions and the "Done" button.
- **Dedicated Reset Page**: [`client/src/pages/ResetPassword.jsx`](client/src/pages/ResetPassword.jsx#L25-L100)
  - Client-side route: `/reset-password?mode=resetPassword&oobCode=...` registered in [`client/src/App.jsx:122`](client/src/App.jsx#L122).
  - Verifies cryptographic action code on mount via Firebase Client SDK `verifyPasswordResetCode(auth, oobCode)`.
  - Formik and Yup validation ensuring new password meets minimum 6 characters and matches confirmation.
  - Submits reset via `confirmPasswordReset(auth, oobCode, newPassword)` and redirects to Login.
- **Backend Route**: [`routes/userRoutes.js:32`](routes/userRoutes.js#L32)
  - Protected by dedicated `emailRateLimiter` (maximum 5 requests per 15 minutes per IP).
- **Backend Controller**: [`controllers/userController.js`](controllers/userController.js#L126-L196)
  - Resolves username or email to MongoDB record.
  - Checks if user account is disabled: disabled users are blocked with HTTP 403.
  - Generates cryptographically signed single-use reset URL via Firebase Admin SDK `auth.generatePasswordResetLink(user.email)`.
  - Dispatches HTML formatted reset email via Mailtrap Nodemailer transport ([`utils/emailService.js:381-441`](utils/emailService.js#L381-L441)).
  - **Side-Channel Timing Attack Mitigation**: Uses `setTimeout` normalization (target duration ~800–1050ms) across both existing and non-existing accounts, returning a uniform ambiguous message (`If an account matches that email or username, a password reset link has been sent.`).

#### 4. User Profile Update with Photo Upload
- **Frontend File**: [`client/src/pages/Profile.jsx`](client/src/pages/Profile.jsx#L100-L190)
  - Formik form with Yup validation for updating personal info (first name, last name, username, email).
  - Submits `FormData` containing updated fields and optional avatar file to `PUT /api/users/profile`.
  - File input validation for avatar (JPEG, PNG, WEBP under 5MB).
  - Password change section using Firebase `updatePassword`.
- **Backend Route**: [`routes/userRoutes.js`](routes/userRoutes.js#L35)
  - `router.put('/profile', verifyToken, upload.single('photo'), updateUserProfile);`
- **Backend Controller**: [`controllers/userController.js`](controllers/userController.js#L19-L64)
  - `updateUserProfile`: Updates `displayName`, `username`, `email` (with collision check), and saves Cloudinary `req.file.path` into `photoURL`.

#### 5. Firebase Authentication Integration
- **Client Firebase Initialization**: [`client/src/firebase.js`](client/src/firebase.js#L1-L15)
- **Auth Context Wrapper**: [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L99-L187)
  - `signInWithEmailAndPassword` and `createUserWithEmailAndPassword`.
  - `onAuthStateChanged` listener synchronizing Firebase auth state with MongoDB profile.
- **Backend Firebase Admin SDK**: [`utils/firebaseAdmin.js`](utils/firebaseAdmin.js#L1-L30)
- **Backend Token Verification Middleware**: [`middleware/auth.js`](middleware/auth.js#L4-L114)
  - Verifies bearer token using `auth.verifyIdToken(token)` and binds MongoDB user to `req.mongoUser`.

#### 6. User Account Enable / Disable Action & RBAC Protection
- **Frontend File**: [`client/src/pages/AdminUsers.jsx`](client/src/pages/AdminUsers.jsx#L102-L187)
  - Interactive **Enable / Disable** button with SweetAlert2 confirmation dialog and `showLoaderOnConfirm`.
  - In-place state update: updates user status in local state without full page reload.
  - Protected: Not applicable to admin accounts (`user.role !== 'admin'`).
  - Real-time `Status` column with visual status chip: `Active` (green) or `Disabled` (rose).
  - **Read-Only Luxury Role Badges**: Replaced interactive dropdown with read-only badges (`Admin` in charcoal/gold, `Customer` in neutral stone). Prevents accidental or arbitrary promotion of customers to administrators.
  - **Column Width Alignment**: Shrunk `ID` column from 16% to 9% (`minWidth: 100px`) and expanded `Actions` column to 19% (`minWidth: 170px`) with flex spacing to eliminate button overlapping.
- **Backend Route & Controller**: [`routes/userRoutes.js#L38-L40`](routes/userRoutes.js#L38-L40) & [`controllers/userController.js#L210-L283`](controllers/userController.js#L210-L283)
  - `PUT /api/users/:id/status`: Updates `user.status` to `active` or `disabled`.
  - `PUT /api/users/:id/role`: Enforces HTTP 403 guard (`Cannot change the role of a customer.`) and blocks self-role modification.
  - Firebase synchronization: Calls `auth.updateUser(uid, { disabled: true })` and `auth.revokeRefreshTokens(uid)` to immediately invalidate refresh tokens and prevent logins.
- **Middleware & Session Expiry**: [`middleware/auth.js`](middleware/auth.js#L92-L98) & [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L77-L92)
  - `verifyToken` middleware instantly rejects disabled users with `403` and `isAccountDisabled: true`.
  - Frontend auto-signs out disabled users immediately, expiring their session.

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
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L221-L292)
  - `createProductReview`: Updates existing review in-place or pushes a new review.
  - Automatically recalculates product average `rating` and `numReviews`.
- **Database Model**: [`models/Product.js`](models/Product.js#L35-L60)

#### 3. Admin Can Delete Any Review
- **Frontend File**: [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L156-L184)
  - Admin click handler calling `DELETE /api/products/:id/reviews/:reviewId`.
  - Delete button conditionally rendered for administrators: `mongoUser?.role === 'admin'`.
- **Backend Route**: [`routes/productRoutes.js`](routes/productRoutes.js#L24)
  - `router.delete('/:id/reviews/:reviewId', verifyToken, verifyAdmin, deleteReview);`
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L294-L322)
  - `deleteReview`: Removes review, recalculates rating, and saves.

---

### Term Test Lab: Orders, Status Updates, Emails & PDF (30 Points Total)

#### 1. Completed Transaction (10 Points)
- **Frontend File**: [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L49-L125)
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
- **Backend Utility**: [`utils/emailService.js`](utils/emailService.js#L4-L179) & [`utils/emailService.js:218-228`](utils/emailService.js#L218-L228)
  - `shouldAttachReceipt = true`: **Every order confirmation and status update email** attaches the official PDF receipt buffer (`Receipt-${order._id}.pdf`).
  - Generated in memory via `PDFKit` streaming buffers without writing temporary files to disk.
  - Features store branding ("THE SATURATION POINT"), order ID, date, customer name, email, payment method, item table with unit prices and subtotals, shipping fee, and grand total.

---

### Unit 1: Bad-Words Filtering & Form Validation (20 Points Total)

#### 1. Filter / Mask Bad Words from Reviews (`bad-words` Package) (10 Points)
- **Backend Package**: [`package.json`](package.json#L27) (`"bad-words": "^4.1.5"`)
- **Backend File**: [`controllers/productController.js`](controllers/productController.js#L232-L257)
  - `const Filter = require('bad-words');`
  - Instantiates filter, registers custom Filipino/Tagalog profanities via `filter.addWords(...)`, and masks profane words with asterisks (`****`).

#### 2. Form Validation on Product and User Forms (Yup & Formik) (10 Points)
- **Product Form (Admin)**: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L68-L76)
  - Yup validation schema checking name, description, positive price, brand, category, and integer stock.
- **User Login Form**: [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L113-L122)
  - Yup validation requiring identifier and password.
- **User Registration Form**: [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L130-L170)
  - Yup schema for names, username regex, valid email, minimum 6-character password, and password match.
- **User Profile Update Form**: [`client/src/pages/Profile.jsx`](client/src/pages/Profile.jsx#L100-L150)
  - Yup schema for updating profile attributes and password.
- **Password Reset Form**: [`client/src/pages/ResetPassword.jsx`](client/src/pages/ResetPassword.jsx#L58-L69)
  - Yup schema enforcing minimum 6 characters and password confirmation matching.
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

### Quiz 1: Catalog Filters (20 Points Total)

#### 1. Price Filter (5 Points)
- **Frontend File**: [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L310-L327)
  - `minPrice` and `maxPrice` state inputs querying `&minPrice=${minPrice}&maxPrice=${maxPrice}`.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L41-L45)
  - Builds MongoDB query with `$gte` and `$lte`.

#### 2. Category Filter (5 Points)
- **Frontend File**: [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L293-L308)
  - `selectedCategories` array querying `&category=${selectedCategories.join(',')}`.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L34-L39)
  - Builds MongoDB query with `$in: categories`.

#### 3. Ratings Filter (5 Points)
- **Frontend File**: [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L359-L370)
  - Interactive Material UI `<Rating>` component querying `&minRating=${minRating}`.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L47-L49)
  - Builds MongoDB query with `rating: { $gte: Number(minRating) }`.

#### 4. Reviews Filter (5 Points)
- **Frontend File**: [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L329-L357)
  - `minReviews` number input querying `&minReviews=${minReviews}` to filter products by minimum number of reviews.
  - Interactive quick-toggle checkbox `Has customer reviews only (1+)` setting `minReviews = '1'` for instant filtering of products with customer feedback.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L51-L53)
  - Builds MongoDB query with `numReviews: { $gte: Number(minReviews) }`.

---

### Quiz 2: Sales Charts & Analytics (25 Points Total)

#### 1. Monthly Sales Line Chart - All 12 Months (10 Points)
- **Frontend File**: [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L62-L95) & [`client/src/pages/AdminDashboard.jsx:177-218`](client/src/pages/AdminDashboard.jsx#L177-L218)
  - Pre-populates all 12 calendar months (`Jan` through `Dec`) and maps delivered order amounts.
  - Renders Recharts `<LineChart>` with responsive container.
- **Backend Controller**: [`controllers/orderController.js`](controllers/orderController.js#L73-L82)
  - Fetches orders for dashboard calculations.

#### 2. Sales Chart with Date Range Filter (15 Points)
- **Frontend File**: [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L96-L140) & [`client/src/pages/AdminDashboard.jsx:339-370`](client/src/pages/AdminDashboard.jsx#L339-L370)
  - `startDate` and `endDate` date pickers filtering sales aggregation.
  - Renders Recharts `<BarChart>` displaying revenue grouped by date.

---

### Quiz 3: Facebook & Gmail Login using Firebase (15 Points Total)

#### 1. OAuth Providers & Scope Configuration
- **Auth Context File**: [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L150-L180)
  - `loginWithGoogle`: Instantiates `GoogleAuthProvider` with email and profile scopes.
  - `loginWithFacebook`: Instantiates `FacebookAuthProvider` with email and public profile scopes.
  - `trackPopup`: Automatically tracks popup status to prevent hung authentication sessions.
  - `extractEmailFromCred`: Safely retrieves verified social emails from provider credentials.
- **Login & Register UI**:
  - [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L430-L480): Branded "Continue with Google" and "Continue with Facebook" action buttons.
  - [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L750-L790): Social authentication options.
- **Backend Synchronization**: [`middleware/auth.js`](middleware/auth.js#L14-L60)
  - Verifies token via Firebase Admin SDK, reads social credentials, and ensures a matching MongoDB user profile exists.

*(Note: The catalog also includes the native **`IntersectionObserver` Infinite Scroll** under [`client/src/pages/Catalog.jsx:108-135`](client/src/pages/Catalog.jsx#L108-L135)).*

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
- **Cart Page**: [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L31-L45) dispatches actions (`updateQuantityAction`, `removeFromCartAction`, `clearCartAction`, `verifyCartStockThunk`) and reads state via `useSelector(selectCartItems)`.
- **Context Bridge**: [`client/src/context/CartContext.jsx`](client/src/context/CartContext.jsx#L1-L100) provides seamless Redux dispatching and persistence with user `localStorage`.

---

### Database Management & Seed Utilities

#### 1. Database Seeder (`npm run seed`)
- **Script File**: [`seed-additional.js`](seed-additional.js#L1-L372)
  - Script command: `npm run seed` (defined in [`package.json:9`](package.json#L9)).
  - Idempotent execution: checks for existing names/emails prior to insertion, preventing duplicate key errors.
  - Injects 12 curated luxury fountain pens, inks, and paper products.
  - Injects 3 authentic luxury brands (`Platinum`, `Ferris Wheel Press`, `Clairefontaine`).
  - Injects 3 sample users and 6 completed transactions with delivered statuses for dashboard analytics and review verification.

#### 2. Database Cleanup & Unseed (`npm run unseed`)
- **Script File**: [`unseed.js`](unseed.js#L1-L103)
  - Script command: `npm run unseed` (defined in [`package.json:11`](package.json#L11)).
  - **Partial Deletion Detection**: Gracefully tracks which seeded records were already manually deleted by the administrator, reporting exact counts without throwing errors.
  - **Selective Data Purge**: Targets strictly seeded records by name and email, guaranteeing that newly created customer accounts, custom products, or default store categories are preserved.

---

## 3. Architecture & Security Defense Checklist

| Security / Design Area | Implementation Location | Defense Talking Points |
| :--- | :--- | :--- |
| **NoSQL Injection Prevention** | Controllers: [`productController.js`](controllers/productController.js#L8-L219), [`orderController.js`](controllers/orderController.js#L5-L71), [`userController.js`](controllers/userController.js#L19-L64) | All queries use Mongoose prepared methods (`findById`, `findOne`, `create`, `deleteMany`) with strict schema typing, preventing arbitrary operator injection. |
| **Regex Injection & ReDoS Mitigation** | Controller: [`productController.js:4-6, 17, 70`](controllers/productController.js#L4-L6) | Sanitizes search queries using `escapeRegex` to neutralize regex metacharacters (`. * + ? ^ $ { } ( ) [ ] \`), eliminating wildcard manipulation, syntax compilation crashes, and catastrophic backtracking DoS. |
| **JWT & Token Authentication** | Middleware: [`middleware/auth.js:14-16`](middleware/auth.js#L14-L16) | Uses Firebase Admin SDK `verifyIdToken(token)` to cryptographically verify RS256 JWT tokens on every protected API call. |
| **Role-Based Access Control (RBAC)** | Middleware: [`middleware/auth.js:116-122`](middleware/auth.js#L116-L122)<br>Frontend: [`client/src/App.jsx:32-39`](client/src/App.jsx#L32-L39) | Protected routes check `mongoUser.role === 'admin'`. Unauthorized requests return HTTP 403 Forbidden on both backend and frontend. |
| **Privilege Escalation Lock** | Controller: [`userController.js:220-224`](controllers/userController.js#L220-L224)<br>Frontend: [`AdminUsers.jsx:412-434`](client/src/pages/AdminUsers.jsx#L412-L434) | Replaced interactive role dropdowns with read-only badges. Backend enforces strict HTTP 403 blocking modification of customer roles. |
| **Login User Enumeration Prevention** | Frontend: [`client/src/pages/Login.jsx:88-94, 136-137`](client/src/pages/Login.jsx#L88-L94) | Unifies login error messages to `"Invalid email, username, or password. Please try again."` and injects a 350ms delay on missing usernames to mirror Firebase roundtrip latency, eliminating account enumeration hints. |
| **Side-Channel Timing Attack Mitigation** | Controller: [`controllers/userController.js:143-149, 174-180`](controllers/userController.js#L143-L149) | Normalized response latency (~800–1050ms) and generic success messages prevent attackers from enumerating valid registered emails via response time differences. |
| **Multi-Tier Rate Limiting** | API Gateway: [`server.js:14-23`](server.js#L14-L23)<br>Auth Routes: [`routes/userRoutes.js:19-27`](routes/userRoutes.js#L19-L27) | Tier 1: 500 requests / 15 min across entire API with reverse proxy trust (`trust proxy: 1`). Tier 2: Dedicated strict limit of 5 requests / 15 min on email verification and password reset endpoints. |
| **Stock Concurrency & Integrity** | Controller: [`orderController.js:41-43`](controllers/orderController.js#L41-L43) | Uses atomic MongoDB update operators `$inc: { stock: -quantity }` to prevent race conditions during checkout. |
| **Cloudinary File Storage & Cleanup** | Storage: [`utils/cloudinary.js:12-34`](utils/cloudinary.js#L12-L34)<br>Cleanup: [`controllers/productController.js:150-175`](controllers/productController.js#L150-L175), [`controllers/userController.js:295-305`](controllers/userController.js#L295-L305) | Direct upload to Cloudinary CDN with MIME-type filtering; automatically destroys obsolete public assets when products or users are deleted. |
| **In-Memory PDF Generation** | Utility: [`utils/emailService.js:4-179`](utils/emailService.js#L4-L179) | Uses streaming PDFKit buffers in memory, avoiding disk I/O vulnerabilities and temporary file storage issues. |
| **Optimistic / In-Place UI Updates** | Frontend: [`AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L740-L780), [`AdminUsers.jsx`](client/src/pages/AdminUsers.jsx#L134-L175) | Local state filtering eliminates table reloading, accompanied by SweetAlert2 `showLoaderOnConfirm` and `preConfirm` for seamless button interaction. |
| **Redux State Management** | Store: [`client/src/redux/store.js`](client/src/redux/store.js#L1-L11)<br>Slice: [`client/src/redux/slices/cartSlice.js`](client/src/redux/slices/cartSlice.js#L1-L135) | Unidirectional data flow using Redux Toolkit with pure reducers, async thunks for live stock verification, and centralized state. |

---

## 4. Frequently Asked Questions by Defense Panels

### Q1: "Show me where you ensure only customers who actually availed the product can write a review."
> **Answer & File to Show:**  
> Open [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L77-L89).  
> Show lines 77–89: The system calls `/api/orders/myorders` and uses JavaScript `.some()` to verify that an order with `status === 'delivered'` exists containing this product's ID. If `hasPurchased` is false, the review submission form is hidden and replaced by a notice.

### Q2: "How does the system generate the official PDF receipt and send the email?"
> **Answer & File to Show:**  
> Open [`utils/emailService.js`](utils/emailService.js#L4-L179) and [`utils/emailService.js:218-228`](utils/emailService.js#L218-L228).  
> Show how `generatePDFReceipt` uses PDFKit to stream binary chunks into a memory buffer (`Buffer.concat(buffers)`). `shouldAttachReceipt = true` ensures that **every order email and status update email** attaches the official PDF receipt buffer (`Receipt-${order._id}.pdf`) via Nodemailer. Show lines 240–295 for the itemized HTML table showing subtotal, shipping fee, and grand total.

### Q3: "How is Redux implemented in the project for Quiz 4?"
> **Answer & File to Show:**  
> 1. Show [`client/package.json`](client/package.json#L18-L24): Point to `@reduxjs/toolkit` and `react-redux`.  
> 2. Show [`client/src/main.jsx`](client/src/main.jsx#L14-L26): Point to `<Provider store={store}>` wrapping the React application.  
> 3. Show [`client/src/redux/store.js`](client/src/redux/store.js#L1-L11): Point to the store initialized with `configureStore` and `cartReducer`.  
> 4. Show [`client/src/redux/slices/cartSlice.js`](client/src/redux/slices/cartSlice.js#L1-L135): Point to the `cartSlice`, the synchronous reducers (`setCart`, `updateQuantity`, `removeFromCart`, `clearCart`), and the async thunks `addToCartWithStockCheck` and `verifyCartStockThunk`.  
> 5. Show [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L31-L45) and [`client/src/components/Navbar.jsx`](client/src/components/Navbar.jsx#L17-L21) actively consuming Redux via `useDispatch` and `useSelector`.

### Q4: "Where are the bad words filtered in reviews?"
> **Answer & File to Show:**  
> Open [`controllers/productController.js`](controllers/productController.js#L232-L257).  
> Show how `new Filter()` from the `bad-words` npm package is initialized, customized with Filipino profanities via `filter.addWords(...)`, and executed on the incoming comment with `filter.clean(sanitizedComment)`.

### Q5: "Where is the bulk delete implemented?"
> **Answer & File to Show:**  
> 1. Frontend: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L709-L748) & [`client/src/pages/AdminProducts.jsx:910-950`](client/src/pages/AdminProducts.jsx#L910-L950). Show the select-all checkbox, individual checkboxes, and the bulk delete handler sending an array of IDs.  
> 2. Backend: [`controllers/productController.js`](controllers/productController.js#L205-L219). Show `Product.deleteMany({ _id: { $in: ids } })`.

### Q6: "How does login with username work when Firebase only supports email/password, and how is username enumeration prevented?"
> **Answer & File to Show:**  
> Open [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L127-L140) and [`client/src/pages/Login.jsx:88-94`](client/src/pages/Login.jsx#L88-L94).  
> 1. Show lines 129–135: If the input lacks an `@`, the frontend calls `GET /api/users/email-by-username/:username` in [`controllers/userController.js`](controllers/userController.js#L81-L93) to retrieve the registered email, which is then passed to Firebase's `signInWithEmailAndPassword`.  
> 2. Show lines 136–137: If the username does not exist, the catch block adds a 350ms delay to match the network duration of a Firebase auth roundtrip and throws a standard `Firebase: auth/invalid-credential` error.  
> 3. Show lines 88–94: `formatFirebaseError` intercepts the error and outputs a generic message: `"Invalid email, username, or password. Please try again."`. This ensures attackers cannot determine whether an account exists or whether a username is registered.

### Q7: "How is clickable column header sorting and search implemented in the admin datatables?"
> **Answer & File to Show:**  
> Open [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L910-L980).  
> Explain that MUI's native `<TableSortLabel>` is used for sortable headers with ascending/descending toggling. Show the `useMemo` filtering and sorting pipelines that handle case-insensitive string sorting, numeric price/stock sorting, and chronological date sorting across all 5 admin tables and user Order History. Show that search input height is locked to `48px` to match action buttons.

### Q8: "How is the system protected against DDoS, brute force, and API spamming?"
> **Answer & File to Show:**  
> Open [`server.js:14-23`](server.js#L14-L23) and [`routes/userRoutes.js:19-27`](routes/userRoutes.js#L19-L27).  
> Explain that the application uses a multi-layered defense strategy:  
> 1. General API: [`server.js:14-23`](server.js#L14-L23) sets `trust proxy` to `1` (for reverse proxies like Render) and caps requests at 500 per 15 minutes per IP address, returning HTTP 429 Too Many Requests if exceeded.  
> 2. Sensitive Auth Endpoints: [`routes/userRoutes.js:19-27`](routes/userRoutes.js#L19-L27) applies a strict second limiter (`emailRateLimiter`) restricting password reset requests and verification emails to 5 requests per 15 minutes per IP address, mitigating mail-bombing and enumeration attacks.

### Q9: "How does the admin enable or disable normal users, and how does session expiry work?"
> **Answer & File to Show:**  
> 1. Frontend: [`client/src/pages/AdminUsers.jsx`](client/src/pages/AdminUsers.jsx#L102-L155). Show the `Status` column with `Active`/`Disabled` chips and the **Enable/Disable** button (restricted from operating on admins).  
> 2. Backend Route: `PUT /api/users/:id/status` in [`routes/userRoutes.js:39`](routes/userRoutes.js#L39) and [`controllers/userController.js:244-283`](controllers/userController.js#L244-L283). Show how disabling a user sets `status: 'disabled'` in MongoDB, calls Firebase Admin `auth.updateUser(uid, { disabled: true })`, and calls `auth.revokeRefreshTokens(uid)` to invalidate all active tokens.  
> 3. Middleware & Expiry: In [`middleware/auth.js:92-98`](middleware/auth.js#L92-L98), `verifyToken` rejects disabled users with HTTP 403 `isAccountDisabled: true`. In [`client/src/context/AuthContext.jsx:77-92`](client/src/context/AuthContext.jsx#L77-L92) and [`client/src/pages/Login.jsx:107-109`](client/src/pages/Login.jsx#L107-L109), detecting disabled status immediately triggers `signOut(auth)` to purge the session and blocks any new login attempt.

### Q10: "How does the Password Reset system work, and how does it prevent security vulnerabilities?"
> **Answer & File to Show:**  
> 1. Frontend Trigger: Open [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L52-L74). The user clicks "Forgot password?", enters their email or username, and dispatches a request to `/api/users/forgot-password`.  
> 2. Backend Generation: Open [`controllers/userController.js`](controllers/userController.js#L126-L196). If the user is disabled, it immediately aborts. Otherwise, Firebase Admin SDK's `auth.generatePasswordResetLink(user.email)` creates a single-use cryptographically signed link directed to our frontend client `/reset-password?mode=resetPassword&oobCode=...`.  
> 3. Email Delivery: Dispatched via Mailtrap Nodemailer transport ([`utils/emailService.js:381-441`](utils/emailService.js#L381-L441)).  
> 4. Side-Channel Timing Attack Mitigation: Show lines 143–149 and 174–180 in [`controllers/userController.js`](controllers/userController.js#L143-L149). Both existing and non-existing account paths are delayed to ~800–1050ms and return identical success responses, preventing attackers from probing valid accounts through network latency differences.  
> 5. Dedicated Reset Page: Open [`client/src/pages/ResetPassword.jsx`](client/src/pages/ResetPassword.jsx#L25-L100). The token is verified on mount (`verifyPasswordResetCode`), and the new password is confirmed via `confirmPasswordReset`.

### Q11: "Why is the Role field read-only in User Management instead of an interactive dropdown?"
> **Answer & File to Show:**  
> Open [`client/src/pages/AdminUsers.jsx`](client/src/pages/AdminUsers.jsx#L412-L434) and [`controllers/userController.js`](controllers/userController.js#L210-L242).  
> Explain that in modern security best practices and e-commerce architectures, normal customer accounts must never be arbitrarily promoted to administrators through a client-side table dropdown, which creates severe privilege escalation vulnerabilities. Customer roles are displayed using read-only luxury badges (`Admin` in charcoal/gold, `Customer` in neutral stone). Backend controller `updateUserRole` rejects any attempt to alter a customer's role with HTTP 403 `Cannot change the role of a customer.`.

### Q12: "Why don't the admin tables reload or flicker when deleting an item?"
> **Answer & File to Show:**  
> Open [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L740-L780) and [`client/src/pages/AdminUsers.jsx`](client/src/pages/AdminUsers.jsx#L134-L175).  
> Explain that instead of calling `fetchData()` which reloads the table and causes visual flickering, the system performs an in-place state removal: `setProducts((prev) => prev.filter((p) => p._id !== id))`. Furthermore, SweetAlert2's `showLoaderOnConfirm: true` and `preConfirm` hook are configured so that the modal itself presents an animated spinner while awaiting the backend API response, eliminating any perceived lag.

### Q13: "How does the hero search bar work with live autocomplete, and how is regex injection prevented?"
> **Answer & File to Show:**  
> Open [`client/src/pages/Home.jsx`](client/src/pages/Home.jsx#L30-L98) and [`controllers/productController.js`](controllers/productController.js#L65-L85).  
> Explain that the hero input uses a 250ms debounced `useEffect` that calls `GET /api/products/search?q=...` when 2 or more characters are entered. Show lines 4–6 in [`controllers/productController.js`](controllers/productController.js#L4-L6) for the `escapeRegex` helper (`string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`), which sanitizes user input so that metacharacters (e.g. `.` or `*` or `(`) cannot manipulate regex logic, crash the database with syntax errors, or trigger ReDoS attacks. Clicking a result navigates immediately to [`/product/:id`](client/src/pages/ProductDetails.jsx), while submitting navigates to [`/catalog?search=...`](client/src/pages/Catalog.jsx).

### Q14: "How do you run the database seeder and undo/unseed seeded data?"
> **Answer & File to Show:**  
> 1. Show [`package.json`](package.json#L9-L12) and [`START_GUIDE.txt`](START_GUIDE.txt): Run `npm run seed` to insert and `npm run unseed` to remove.  
> 2. Show [`seed-additional.js`](seed-additional.js): Adds 12 curated products, 3 brands, 3 users, and 6 sample transactions idempotently.  
> 3. Show [`unseed.js`](unseed.js): Safely removes seeded records while detecting if any were already deleted manually by the administrator, ensuring user-created products and core categories remain untouched.
