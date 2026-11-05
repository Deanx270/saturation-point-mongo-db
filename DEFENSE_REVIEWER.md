# "The Saturation Point" - System Defense Reviewer & Codebase Map

> **Quick Tip for Defense:** When the panel or professor asks to see the implementation of any requirement from the grading rubric, refer to the tables and sections below. You can navigate directly to the exact file and line ranges listed.

---

## 1. Quick Reference Matrix (Grading Rubric Map)

| Category / Requirement | Pts | Frontend File & Line Range | Backend File & Line Range | Key Technologies |
| :--- | :---: | :--- | :--- | :--- |
| **MP1: Product Datatable** | 5 | UI: [`AdminProducts.jsx#L842-L1155`](client/src/pages/AdminProducts.jsx#L842-L1155)<br>Logic: [`AdminProducts.jsx#L630-L673`](client/src/pages/AdminProducts.jsx#L630-L673) | [`controllers/productController.js`](controllers/productController.js#L8-L75) | MUI Table, Pagination, Search & `TableSortLabel` |
| **MP1: Multiple Photo Upload** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L85-L125) | [`controllers/productController.js`](controllers/productController.js#L121-L206) | FormData, Multer (`array`), `imageOrder` |
| **MP1: Cloudinary Integration** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L85-L125) | [`utils/cloudinary.js`](utils/cloudinary.js#L1-L36)<br>[`controllers/productController.js`](controllers/productController.js#L173-L190) | `cloudinary.v2`, CloudinaryStorage, automatic destroy |
| **MP1: Bulk Delete with Checkboxes** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L709-L748) | [`controllers/productController.js`](controllers/productController.js#L217-L231) | MUI Checkbox, `$in` delete, instant local state |
| **MP2: User Registration** | 2 | [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L121-L235) | [`routes/userRoutes.js`](routes/userRoutes.js#L29-L32)<br>[`controllers/userController.js`](controllers/userController.js#L66-L124) | Formik, Yup, Cloudinary avatar, Mailtrap verify |
| **MP2: Username & Password Login** | 5 | [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L113-L169)<br>Form UI: [`Login.jsx#L267-L345`](client/src/pages/Login.jsx#L267-L345) | [`controllers/userController.js`](controllers/userController.js#L81-L93) | Login via username or email lookup, username enumeration defense |
| **MP2: User Profile Update + Photo** | 5 | [`client/src/pages/Profile.jsx`](client/src/pages/Profile.jsx#L153-L265) | [`controllers/userController.js`](controllers/userController.js#L19-L64) | Multer (`single`), Cloudinary CDN upload |
| **MP2: Firebase Auth (Email/Pass)** | 10 | [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L98-L105) | [`middleware/auth.js`](middleware/auth.js#L4-L114) | Firebase Client SDK + Admin SDK `verifyIdToken` |
| **MP3: Availed Purchase Check** | 10 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L76-L92) | [`controllers/orderController.js`](controllers/orderController.js#L135-L144) | Order history validation (`status === 'delivered'`) |
| **MP3: Write / Update Review** | 5 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L104-L154) | [`controllers/productController.js`](controllers/productController.js#L233-L304) | Subdocument schema, average recalculation |
| **MP3: Admin Delete Review** | 5 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L156-L183) | [`controllers/productController.js`](controllers/productController.js#L306-L334) | Admin delete + rating recalculation |
| **Term Test: Completed Transaction** | 10 | [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L49-L125) | [`controllers/orderController.js`](controllers/orderController.js#L5-L71) | Stock check, `$inc: -qty`, order creation |
| **Term Test: Admin Order Status** | 5 | [`client/src/pages/AdminTransactions.jsx`](client/src/pages/AdminTransactions.jsx#L123-L200) | [`controllers/orderController.js`](controllers/orderController.js#L84-L133) | Status transition constraints, cancel restock |
| **Term Test: Customer Email Update** | 5 | *Triggered automatically on status update* | [`utils/emailService.js`](utils/emailService.js#L196-L318) | Nodemailer, Mailtrap, HTML itemized table |
| **Term Test: PDF Receipt Attachment** | 10 | *Attached on all order and status emails* | [`utils/emailService.js`](utils/emailService.js#L4-L179)<br>[`utils/emailService.js#L214-L225`](utils/emailService.js#L214-L225) | PDFKit in-memory buffer (`Receipt-${order._id}.pdf`) |
| **Unit 1: Bad-Words Filter** | 10 | *Backend review sanitation* | [`controllers/productController.js`](controllers/productController.js#L244-L268) | `bad-words` + Tagalog profanity dictionary |
| **Unit 1: Yup / Formik Validation** | 10 | Products: [`AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L68-L80)<br>Login: [`Login.jsx`](client/src/pages/Login.jsx#L113-L122)<br>Register: [`Register.jsx`](client/src/pages/Register.jsx#L130-L158)<br>Profile: [`Profile.jsx`](client/src/pages/Profile.jsx#L170-L201) | Handled on frontend with inline error messages | Yup schema + Formik state management |
| **Unit 2: Material UI & CSS** | 20 | [`client/src/theme.js`](client/src/theme.js#L1-L81) | N/A | Custom MUI Theme, Lora/Montserrat, `#FAF9F6` |
| **Quiz 1: Price Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L310-L327) | [`controllers/productController.js`](controllers/productController.js#L41-L45) | `$gte`, `$lte` MongoDB queries |
| **Quiz 1: Category Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L293-L308) | [`controllers/productController.js`](controllers/productController.js#L34-L39) | `$in` categories query |
| **Quiz 1: Ratings Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L359-L370) | [`controllers/productController.js`](controllers/productController.js#L47-L49) | `$gte` minimum rating filter |
| **Quiz 1: Reviews Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L329-L357) | [`controllers/productController.js`](controllers/productController.js#L51-L53) | `$gte` minimum review count filter, quick 1+ toggle |
| **Quiz 2: 12-Month Sales Line Chart** | 10 | [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L70-L100)<br>Chart: [`AdminDashboard.jsx#L205-L248`](client/src/pages/AdminDashboard.jsx#L205-L248) | [`controllers/orderController.js`](controllers/orderController.js#L73-L82) | Recharts `LineChart`, all 12 calendar months |
| **Quiz 2: Date Range Sales Chart** | 15 | [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L102-L158)<br>Picker: [`BrandDatePicker.jsx`](client/src/components/BrandDatePicker.jsx)<br>Chart: [`AdminDashboard.jsx#L365-L400`](client/src/pages/AdminDashboard.jsx#L365-L400) | [`controllers/orderController.js`](controllers/orderController.js#L73-L82) | Recharts `BarChart`, luxury brand date picker, calendar boundary & year constraints (2020-2027) |
| **Quiz 3: Facebook & Gmail Login** | 15 | Context: [`AuthContext.jsx`](client/src/context/AuthContext.jsx#L150-L178)<br>Buttons: [`Login.jsx`](client/src/pages/Login.jsx#L465-L510) | [`middleware/auth.js`](middleware/auth.js#L14-L90) | Firebase OAuth popups, Google & Facebook providers |
| **Quiz 3: Infinite Scroll** | 15 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L118-L135)<br>Sentinel: [`Catalog.jsx#L651-L673`](client/src/pages/Catalog.jsx#L651-L673)<br>Append Logic: [`Catalog.jsx#L85-L94`](client/src/pages/Catalog.jsx#L85-L94) | [`controllers/productController.js`](controllers/productController.js#L54-L71) | Native `IntersectionObserver`, `skip` & `limit`, Map deduplication |
| **Quiz 4: Redux State Management** | 15 | Store: [`redux/store.js`](client/src/redux/store.js#L1-L12)<br>Slice: [`redux/slices/cartSlice.js`](client/src/redux/slices/cartSlice.js#L1-L130)<br>Root: [`main.jsx`](client/src/main.jsx#L14-L30) | N/A (Client State Architecture) | Redux Toolkit (`configureStore`, `createSlice`, `createAsyncThunk`) |

---

## 2. Detailed Breakdown by Rubric Category

### MP1: Product / Service CRUD (20 Points Total)

#### 1. Datatables for Product CRUD (5 Points)
- **Frontend Files & Logic**:
  - **Datatable UI & Controls**: [`client/src/pages/AdminProducts.jsx#L842-L1155`](client/src/pages/AdminProducts.jsx#L842-L1155)
  - **Sorting, Filtering & Pagination State**: [`client/src/pages/AdminProducts.jsx#L630-L673`](client/src/pages/AdminProducts.jsx#L630-L673)
  - **Material UI `<Table>` & Layout**: Features sticky header with `#FAF9F6` background, image thumbnail, name, brand, category, price, stock, and action buttons (Edit, Delete) in lines 903–1140.
  - **Column Header Sorting**: Uses MUI `<TableSortLabel>` (lines 935–989) on `Name`, `Brand`, `Category`, `Price`, and `Stock` columns with ascending/descending toggling driven by `handleRequestSort` and `sortedProducts` (lines 636–673).
  - **Real-Time Search Bar**: Instant client-side search `TextField` across Name, Brand, Category, and Price with auto-reset to page `0` upon typing (lines 851–874, 643–653).
  - **Height Alignment**: Search input height (`48px`) is mathematically matched with adjacent action buttons (`Bulk Delete`, `Add Product`) in lines 851–900.
  - **Material UI `<TablePagination>`**: Supports dynamic page changes and rows per page (`5, 10, 25, 50`) in lines 1142–1154.
  - **Optimistic State Updates**: Deletions immediately remove records from local React state (`setProducts(prev => prev.filter(...))`), preventing table reloading or screen flashing (lines 733, 768).
  - **SweetAlert2 Async Feedback**: Uses `showLoaderOnConfirm: true` and `preConfirm` to render an inline loading spinner while awaiting the delete request (lines 721–742, 760–776).
- **Backend File**: [`controllers/productController.js`](controllers/productController.js#L8-L75)
  - `getProducts`: Query builder fetching products with search keyword, category/price/rating filters, and pagination (`skip` and `limit`).
  - **Regex Injection & ReDoS Defense**: User search input (`kw`) is sanitized via `escapeRegex` (`replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`) before compiling into MongoDB `$regex` queries, neutralizing regex metacharacters, syntax crash vectors (e.g., unclosed parentheses), and wildcard manipulation.
- **Database Model**: [`models/Product.js`](models/Product.js#L1-L64)

#### 2. Upload Multiple Photos (5 Points)
- **Frontend File**: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L85-L125)
  - Appends up to 5 image files to `FormData` under the key `images` alongside an `imageOrder` array.
  - File selection handler validating file types (JPEG, PNG, WEBP), file size (under 5MB), maximum count of 5, and controls for reordering images up/down.
  - Image thumbnail preview grid with move up, move down, and remove buttons.
- **Backend Route**: [`routes/productRoutes.js`](routes/productRoutes.js#L26-L39)
  - `upload.array('images', 5)` middleware processing multiple multipart file uploads.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L121-L206)
  - `createProduct`: Maps uploaded files to an array of URLs: `req.files.map(file => file.path)`.
  - `updateProduct`: Processes newly uploaded files alongside existing image URLs based on the user-selected image order.

#### 3. Cloudinary Integration (5 Points)
- **Backend Utility**: [`utils/cloudinary.js`](utils/cloudinary.js#L1-L36)
  - Configures `cloudinary.v2` using environment variables (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
  - Sets up `CloudinaryStorage` with target folder `'saturation_point_new'` and formats `['jpg', 'png', 'jpeg', 'webp']`.
  - Configures Multer storage, enforcing 5MB limit and disallowing GIFs.
- **Cloudinary Asset Deletion**: [`controllers/productController.js`](controllers/productController.js#L173-L190)
  - Automatically invokes `cloudinary.uploader.destroy(publicId)` when an admin replaces or removes an image during product update or deletion.

#### 4. Bulk Delete Using Checkboxes (5 Points)
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
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L217-L231)
  - Uses Mongoose prepared delete: `Product.deleteMany({ _id: { $in: ids } })`.

---

### MP2: User Functions (20 Points Total)

#### 1. User Registration (Matching Old-System Fields) (2 Points)
- **Frontend File**: [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L121-L235)
  - Initial values matching old-system: `firstName`, `lastName`, `username`, `email`, `password`, `confirmPassword`, `profilePicture`.
  - Yup validation rules for all fields (regex for names, minimum lengths, password match).
  - Asynchronous real-time debounced username uniqueness check (`/api/users/check-username`).
  - Submits user to Firebase, uploads profile picture to Cloudinary via backend `/api/users/profile`, and triggers a custom verification email via `/api/users/send-verification`.
- **Backend Routes**: [`routes/userRoutes.js`](routes/userRoutes.js#L29-L32)
- **Backend Controllers**: [`controllers/userController.js`](controllers/userController.js#L66-L124)
  - `checkUsername`: Checks username availability.
  - `sendVerificationEmail`: Generates verification link using Firebase Admin SDK and dispatches branded email via Mailtrap.

#### 2. Username and Password Login (5 Points)
- **Frontend File**: [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L113-L169) (Formik Logic) & [`client/src/pages/Login.jsx#L267-L345`](client/src/pages/Login.jsx#L267-L345) (Form Fields)
  - Input field `identifier` accepts **either an Email OR a Username** ([`Login.jsx#L273-L297`](client/src/pages/Login.jsx#L273-L297)).
  - Password input field with visibility toggle and adornment ([`Login.jsx#L298-L345`](client/src/pages/Login.jsx#L298-L345)).
  - If `identifier` does not contain `@`, queries backend endpoint `GET /api/users/email-by-username/:username` to retrieve the associated email automatically ([`Login.jsx#L129-L135`](client/src/pages/Login.jsx#L129-L135)).
  - **User Enumeration & Timing Attack Defense**: If the username is not found in MongoDB, instead of disclosing `"User not found with that username"`, the client waits for 350ms to mirror Firebase network latency and throws `Firebase: auth/invalid-credential` ([`client/src/pages/Login.jsx#L136-L137`](client/src/pages/Login.jsx#L136-L137)).
  - **Unified Credential Error**: Handled by `formatFirebaseError` ([`client/src/pages/Login.jsx#L84-L97`](client/src/pages/Login.jsx#L84-L97)), which uniformly displays `"Invalid email, username, or password. Please try again."` for all invalid email, username, or password attempts.
  - Authenticates via Firebase `signInWithEmailAndPassword`, checks `emailVerified`, and rejects unverified logins ([`Login.jsx#L141-L148`](client/src/pages/Login.jsx#L141-L148)).
  - Fetches MongoDB profile and routes to `/admin/dashboard` or `/profile` ([`Login.jsx#L150-L163`](client/src/pages/Login.jsx#L150-L163)).
- **Backend Controller**: [`controllers/userController.js`](controllers/userController.js#L81-L93)
  - `getEmailByUsername`: Finds user by username and returns their email.

#### 3. User Profile Update with Photo Upload (5 Points)
- **Frontend File**: [`client/src/pages/Profile.jsx`](client/src/pages/Profile.jsx#L153-L265)
  - Formik form with Yup validation for updating personal info (first name, last name, username, email).
  - Submits `FormData` containing updated fields and optional avatar file to `PUT /api/users/profile`.
  - File input validation for avatar (JPEG, PNG, WEBP under 5MB).
  - Password change section using Firebase `updatePassword`.
- **Backend Route**: [`routes/userRoutes.js`](routes/userRoutes.js#L35)
  - `router.put('/profile', verifyToken, upload.single('photo'), updateUserProfile);`
- **Backend Controller**: [`controllers/userController.js`](controllers/userController.js#L19-L64)
  - `updateUserProfile`: Updates `displayName`, `username`, `email` (with collision check), and saves Cloudinary `req.file.path` into `photoURL`.

#### 4. Username and Password using Firebase Authentication (10 Points)
- **Client Firebase Initialization**: [`client/src/firebase.js`](client/src/firebase.js#L1-L15)
- **Auth Context Wrapper**: [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L98-L205)
  - `signInWithEmailAndPassword` and `createUserWithEmailAndPassword`.
  - `onAuthStateChanged` listener synchronizing Firebase auth state with MongoDB profile.
- **Backend Firebase Admin SDK**: [`utils/firebaseAdmin.js`](utils/firebaseAdmin.js#L1-L47)
- **Backend Token Verification Middleware**: [`middleware/auth.js`](middleware/auth.js#L4-L114)
  - Verifies bearer token using `auth.verifyIdToken(token)` and binds MongoDB user to `req.mongoUser`.

---

### MP3: Review & Ratings (20 Points Total)

#### 1. Only Users Who Availed (Purchased) Can Review (10 Points)
- **Frontend File**: [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L76-L92)
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

#### 2. Users Can Write and Update Their Own Review & Rating (5 Points)
- **Frontend File**: [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L104-L154)
  - Pre-populates existing review if the user has already reviewed the product (`isEditingReview` mode).
  - Formik form submitting rating (1-5 stars) and comment to `POST /api/products/:id/reviews`.
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L233-L304)
  - `createProductReview`: Updates existing review in-place or pushes a new review.
  - Automatically recalculates product average `rating` and `numReviews`.
- **Database Model**: [`models/Product.js`](models/Product.js#L35-L60)

#### 3. Admin Can Delete Any Review (5 Points)
- **Frontend File**: [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L156-L183)
  - Admin click handler calling `DELETE /api/products/:id/reviews/:reviewId`.
  - Delete button conditionally rendered for administrators: `mongoUser?.role === 'admin'`.
- **Backend Route**: [`routes/productRoutes.js`](routes/productRoutes.js#L24)
  - `router.delete('/:id/reviews/:reviewId', verifyToken, verifyAdmin, deleteReview);`
- **Backend Controller**: [`controllers/productController.js`](controllers/productController.js#L306-L334)
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
- **Frontend File**: [`client/src/pages/AdminTransactions.jsx`](client/src/pages/AdminTransactions.jsx#L123-L200)
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
- **Backend Utility**: [`utils/emailService.js`](utils/emailService.js#L4-L179) & [`utils/emailService.js#L214-L225`](utils/emailService.js#L214-L225)
  - `shouldAttachReceipt = true`: **Every order confirmation and status update email** attaches the official PDF receipt buffer (`Receipt-${order._id}.pdf`).
  - Generated in memory via `PDFKit` streaming buffers without writing temporary files to disk.
  - Features store branding ("THE SATURATION POINT"), order ID, date, customer name, email, payment method, item table with unit prices and subtotals, shipping fee, and grand total.

---

### Unit 1: Bad-Words Filtering & Form Validation (20 Points Total)

#### 1. Filter / Mask Bad Words from Reviews (`bad-words` Package) (10 Points)
- **Backend Package**: [`package.json`](package.json#L27) (`"bad-words": "^4.1.5"`)
- **Backend File**: [`controllers/productController.js`](controllers/productController.js#L244-L268)
  - `const Filter = require('bad-words');`
  - Instantiates filter, registers custom Filipino/Tagalog profanities via `filter.addWords(...)`, and masks profane words with asterisks (`****`).

#### 2. Form Validation on Product and User Forms (Yup & Formik) (10 Points)
- **Product Form (Admin)**: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L68-L80)
  - Yup validation schema checking name, description, positive price, brand, category, and integer stock.
- **User Login Form**: [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L113-L122)
  - Yup validation requiring identifier and password.
- **User Registration Form**: [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L130-L158)
  - Yup schema for names, username regex, valid email, minimum 6-character password, and password match.
- **User Profile Update Form**: [`client/src/pages/Profile.jsx`](client/src/pages/Profile.jsx#L170-L201)
  - Yup schema for updating profile attributes and password.

---

### Unit 2: User Interface Design CSS and Material UI (20 Points Total)

#### 1. Material UI Theme & Component System (20 Points)
- **Theme Configuration**: [`client/src/theme.js`](client/src/theme.js#L1-L81)
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
- **Frontend File**: [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L70-L100) & [`client/src/pages/AdminDashboard.jsx#L205-L248`](client/src/pages/AdminDashboard.jsx#L205-L248)
  - Pre-populates all 12 calendar months (`Jan` through `Dec`) and maps delivered order amounts.
  - Renders Recharts `<LineChart>` with responsive container.
- **Backend Controller**: [`controllers/orderController.js`](controllers/orderController.js#L73-L82)
  - Fetches orders for dashboard calculations.

#### 2. Sales Chart with Date Range Filter (15 Points)
- **Frontend Files**:
  - Luxury Brand Date Picker: [`client/src/components/BrandDatePicker.jsx`](client/src/components/BrandDatePicker.jsx)
  - Admin Dashboard Integration: [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L102-L158) & [`client/src/pages/AdminDashboard.jsx#L365-L400`](client/src/pages/AdminDashboard.jsx#L365-L400)
- **Validation & UX Enhancements**:
  - **Custom Luxury Theme**: Replaces browser-default HTML inputs with an artisanal popover calendar matching the store palette (`#1C1917`, `#CA8A04`, `#FAF9F6`) and typography (`Lora`, `Montserrat`).
  - **Impossible Date Elimination**: The read-only text input prevents typing corrupt dates (such as `02/31/0002` or `09/31/2026`). Month grids dynamically calculate exact days in the month (`new Date(year, month + 1, 0).getDate()`), guaranteeing 30 days for September and 28/29 days for February.
  - **Year Boundaries (2020–2027)**: Month and year dropdowns strictly constrain selection between 2020 and 2027, preventing unrealistic ancient or distant future years.
  - **Range & Infinite Loop Protection**: `minDate` and `maxDate` properties disable invalid days relative to selected start/end dates. The dashboard enforces `startDate <= endDate`, caps the date range to 730 days (2 years), displays an inline error alert banner if reversed, and limits day iteration loops (`iterations <= 730`) to protect against browser thread freezes.
  - **Local Date Handling**: Replaced `.toISOString().split('T')[0]` with local `formatYMD` helper, eliminating 1-day timezone offset bugs in UTC+8.

---

### Quiz 3: OAuth Login & Infinite Scroll (30 Points Total)

#### 1. Facebook or Gmail Login using Firebase (15 Points)
- **Auth Context File**: [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L150-L178)
  - `loginWithGoogle`: Instantiates `GoogleAuthProvider` with email and profile scopes.
  - `loginWithFacebook`: Instantiates `FacebookAuthProvider` with email and public profile scopes.
  - `trackPopup`: Automatically tracks popup status to prevent hung authentication sessions.
  - `extractEmailFromCred`: Safely retrieves verified social emails from provider credentials.
- **Login & Register UI**:
  - [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L465-L510): Branded "Continue with Google" and "Continue with Facebook" action buttons.
  - [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L755-L790): Social authentication options.
- **Backend Synchronization**: [`middleware/auth.js`](middleware/auth.js#L14-L90)
  - Verifies token via Firebase Admin SDK, reads social credentials, and ensures a matching MongoDB user profile exists.

#### 2. Infinite Scroll on Products List in Catalog (15 Points)
- **Frontend Files**:
  - Observer Hook: [`client/src/pages/Catalog.jsx#L118-L135`](client/src/pages/Catalog.jsx#L118-L135)
  - Sentinel Target & Loading Spinner: [`client/src/pages/Catalog.jsx#L651-L673`](client/src/pages/Catalog.jsx#L651-L673)
  - Paginated Fetch & Deduplicated Append: [`client/src/pages/Catalog.jsx#L56-L111`](client/src/pages/Catalog.jsx#L56-L111) (specifically lines 85–94)
- **Key Implementation Details**:
  - **Native `IntersectionObserver`**: Watches sentinel element `<Box ref={observerTarget}>` at the foot of the catalog with `threshold: 1.0`. When scrolled into view, if `!isFetchingMore && page < totalPages`, automatically increments `page + 1` and fetches the next batch.
  - **Map-Based Key Deduplication**: Lines 86–91 use `new Map()` keyed by `product._id` to merge `prev` products and newly fetched page products, preventing duplicate keys or React re-render collisions.
  - **End of Catalog Indicator**: Automatically unobserves or displays "End of catalog" once `page >= totalPages`.
- **Backend File**: [`controllers/productController.js#L54-L71`](controllers/productController.js#L54-L71)
  - Computes `skip = (pageNum - 1) * pageSize` with `limit = 9` (default 12 or passed limit).
  - Queries `Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize)`.
  - Returns `{ products, page, pages, total }` to control frontend pagination boundary.

---

### Quiz 4: Redux State Management (15 Points Total)

#### 1. Store Configuration & Architecture
- **Dependencies**: [`client/package.json`](client/package.json#L18-L24) (`"@reduxjs/toolkit": "^2.13.0"`, `"react-redux": "^9.3.1"`)
- **Store Configuration**: [`client/src/redux/store.js`](client/src/redux/store.js#L1-L12)
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
- **Application Provider Root**: [`client/src/main.jsx`](client/src/main.jsx#L14-L30)
  - Root application is wrapped with Redux `<Provider store={store}>` at top level.

#### 2. Cart Slice, Actions & Async Thunks
- **Slice File**: [`client/src/redux/slices/cartSlice.js`](client/src/redux/slices/cartSlice.js#L1-L130)
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
- **Navbar**: [`client/src/components/Navbar.jsx`](client/src/components/Navbar.jsx#L16-L22) selects cart badge counter via `useSelector(selectCartItemCount)`.
- **Cart Page**: [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L31-L45) dispatches actions (`updateQuantityAction`, `removeFromCartAction`, `clearCartAction`, `verifyCartStockThunk`) and reads state via `useSelector(selectCartItems)`.
- **Context Bridge**: [`client/src/context/CartContext.jsx`](client/src/context/CartContext.jsx#L1-L95) provides seamless Redux dispatching and persistence with user `localStorage`.

---

## 3. Architecture & Security Defense Checklist

| Security / Design Area | Implementation Location | Defense Talking Points |
| :--- | :--- | :--- |
| **NoSQL Injection Prevention** | Controllers: [`productController.js`](controllers/productController.js#L8-L231), [`orderController.js`](controllers/orderController.js#L5-L71), [`userController.js`](controllers/userController.js#L19-L64) | All queries use Mongoose prepared methods (`findById`, `findOne`, `create`, `deleteMany`) with strict schema typing, preventing arbitrary operator injection. |
| **Regex Injection & ReDoS Mitigation** | Controller: [`productController.js:4-6, 21, 80`](controllers/productController.js#L4-L6) | Sanitizes search queries using `escapeRegex` to neutralize regex metacharacters (`. * + ? ^ $ { } ( ) [ ] \`), eliminating wildcard manipulation, syntax compilation crashes, and catastrophic backtracking DoS. |
| **JWT & Token Authentication** | Middleware: [`middleware/auth.js:14-16`](middleware/auth.js#L14-L16) | Uses Firebase Admin SDK `verifyIdToken(token)` to cryptographically verify RS256 JWT tokens on every protected API call. |
| **Role-Based Access Control (RBAC)** | Middleware: [`middleware/auth.js:116-122`](middleware/auth.js#L116-L122)<br>Frontend: [`client/src/App.jsx:32-39`](client/src/App.jsx#L32-L39) | Protected routes check `mongoUser.role === 'admin'`. Unauthorized requests return HTTP 403 Forbidden on both backend and frontend. |
| **Stock Concurrency & Integrity** | Controller: [`orderController.js:41-43`](controllers/orderController.js#L41-L43) | Uses atomic MongoDB update operators `$inc: { stock: -quantity }` to prevent race conditions during checkout. |
| **Cloudinary File Storage & Cleanup** | Storage: [`utils/cloudinary.js:12-34`](utils/cloudinary.js#L12-L34)<br>Cleanup: [`controllers/productController.js:173-190`](controllers/productController.js#L173-L190) | Direct upload to Cloudinary CDN with MIME-type filtering; automatically destroys obsolete public assets when products are updated or removed. |
| **In-Memory PDF Generation** | Utility: [`utils/emailService.js:4-179`](utils/emailService.js#L4-L179) | Uses streaming PDFKit buffers in memory, avoiding disk I/O vulnerabilities and temporary file storage issues. |
| **Optimistic / In-Place UI Updates** | Frontend: [`AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L749-L780) | Local state filtering eliminates table reloading, accompanied by SweetAlert2 `showLoaderOnConfirm` and `preConfirm` for seamless button interaction. |
| **Redux State Management** | Store: [`client/src/redux/store.js`](client/src/redux/store.js#L1-L12)<br>Slice: [`client/src/redux/slices/cartSlice.js`](client/src/redux/slices/cartSlice.js#L1-L130) | Unidirectional data flow using Redux Toolkit with pure reducers, async thunks for live stock verification, and centralized state. |

---

## 4. Frequently Asked Questions by Defense Panels

### Q1: "Show me where you ensure only customers who actually availed the product can write a review."
> **Answer & File to Show:**  
> Open [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L76-L92).  
> Show lines 76–92: The system calls `/api/orders/myorders` and uses JavaScript `.some()` to verify that an order with `status === 'delivered'` exists containing this product's ID. If `hasPurchased` is false, the review submission form is hidden and replaced by a notice.

### Q2: "How does the system generate the official PDF receipt and send the email?"
> **Answer & File to Show:**  
> Open [`utils/emailService.js`](utils/emailService.js#L4-L179) and [`utils/emailService.js:214-225`](utils/emailService.js#L214-L225).  
> Show how `generatePDFReceipt` uses PDFKit to stream binary chunks into a memory buffer (`Buffer.concat(buffers)`). `shouldAttachReceipt = true` ensures that **every order email and status update email** attaches the official PDF receipt buffer (`Receipt-${order._id}.pdf`) via Nodemailer. Show lines 240–295 for the itemized HTML table showing subtotal, shipping fee, and grand total.

### Q3: "How is Redux implemented in the project for Quiz 4?"
> **Answer & File to Show:**  
> 1. Show [`client/package.json`](client/package.json#L18-L24): Point to `@reduxjs/toolkit` and `react-redux`.  
> 2. Show [`client/src/main.jsx`](client/src/main.jsx#L14-L30): Point to `<Provider store={store}>` wrapping the React application.  
> 3. Show [`client/src/redux/store.js`](client/src/redux/store.js#L1-L12): Point to the store initialized with `configureStore` and `cartReducer`.  
> 4. Show [`client/src/redux/slices/cartSlice.js`](client/src/redux/slices/cartSlice.js#L1-L130): Point to the `cartSlice`, the synchronous reducers (`setCart`, `updateQuantity`, `removeFromCart`, `clearCart`), and the async thunks `addToCartWithStockCheck` and `verifyCartStockThunk`.  
> 5. Show [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L31-L45) and [`client/src/components/Navbar.jsx`](client/src/components/Navbar.jsx#L16-L22) actively consuming Redux via `useDispatch` and `useSelector`.

### Q4: "Where are the bad words filtered in reviews?"
> **Answer & File to Show:**  
> Open [`controllers/productController.js`](controllers/productController.js#L244-L268).  
> Show how `new Filter()` from the `bad-words` npm package is initialized, customized with Filipino profanities via `filter.addWords(...)`, and executed on the incoming comment with `filter.clean(sanitizedComment)`.

### Q5: "Where is the bulk delete implemented?"
> **Answer & File to Show:**  
> 1. Frontend: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L709-L748) & [`client/src/pages/AdminProducts.jsx:915-980`](client/src/pages/AdminProducts.jsx#L915-L980). Show the select-all checkbox, individual checkboxes, and the bulk delete handler sending an array of IDs.  
> 2. Backend: [`controllers/productController.js`](controllers/productController.js#L217-L231). Show `Product.deleteMany({ _id: { $in: ids } })`.

### Q6: "How does login with username work when Firebase only supports email/password?"
> **Answer & File to Show:**  
> Open [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L128-L142) and [`client/src/pages/Login.jsx:84-97`](client/src/pages/Login.jsx#L84-L97).  
> 1. Show lines 129–135: If the input lacks an `@`, the frontend calls `GET /api/users/email-by-username/:username` in [`controllers/userController.js`](controllers/userController.js#L81-L93) to retrieve the registered email, which is then passed to Firebase's `signInWithEmailAndPassword`.  
> 2. Show lines 136–137: If the username does not exist, the catch block adds a 350ms delay to match the network duration of a Firebase auth roundtrip and throws a standard `Firebase: auth/invalid-credential` error.  
> 3. Show lines 84–97: `formatFirebaseError` intercepts the error and outputs a generic message: `"Invalid email, username, or password. Please try again."`.

### Q7: "How is clickable column header sorting and search implemented in the admin datatables?"
> **Answer & File to Show:**  
> Open [`client/src/pages/AdminProducts.jsx#L636-L673`](client/src/pages/AdminProducts.jsx#L636-L673) for the sorting and filtering pipelines, and [`client/src/pages/AdminProducts.jsx#L911-L989`](client/src/pages/AdminProducts.jsx#L911-L989) for the MUI `<TableSortLabel>` header UI.  
> Explain that MUI's native `<TableSortLabel>` is used for sortable headers with ascending/descending toggling. Show the `useMemo` filtering and sorting pipelines that handle case-insensitive string sorting, numeric price/stock sorting, and chronological date sorting across all admin tables. Show that search input height is locked to `48px` (lines 851–874) to match action buttons.

### Q8: "How does the system handle uploading multiple photos and storing them on Cloudinary?"
> **Answer & File to Show:**  
> 1. Frontend: Open [`client/src/pages/AdminProducts.jsx#L85-L125`](client/src/pages/AdminProducts.jsx#L85-L125). Show how files are appended to `FormData` under the key `images` alongside the `imageOrder` array.  
> 2. Route Middleware: Open [`routes/productRoutes.js#L26-L39`](routes/productRoutes.js#L26-L39). Show `upload.array('images', 5)` using `multer-storage-cloudinary` to validate formats and stream directly to Cloudinary.  
> 3. Controller: Open [`controllers/productController.js#L121-L206`](controllers/productController.js#L121-L206). Show `req.files.map(f => f.path)` mapped into the product document, and lines 173–190 where replaced images trigger `cloudinary.uploader.destroy(publicId)`.

### Q9: "Where are the Catalog filters implemented on the frontend and backend?"
> **Answer & File to Show:**  
> 1. Frontend: Open [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx).  
>    - Price filter inputs: [`Catalog.jsx#L310-L327`](client/src/pages/Catalog.jsx#L310-L327)  
>    - Category checkboxes: [`Catalog.jsx#L293-L308`](client/src/pages/Catalog.jsx#L293-L308)  
>    - Ratings filter: [`Catalog.jsx#L359-L370`](client/src/pages/Catalog.jsx#L359-L370)  
>    - Reviews filter & quick 1+ toggle: [`Catalog.jsx#L329-L357`](client/src/pages/Catalog.jsx#L329-L357)  
> 2. Backend: Open [`controllers/productController.js#L34-L53`](controllers/productController.js#L34-L53). Show how queries for `$in` (categories), `$gte`/`$lte` (price), and `$gte` (rating & numReviews) are dynamically assembled into the MongoDB query object.

### Q10: "How are the sales analytics charts implemented in Quiz 2?"
> **Answer & File to Show:**  
> 1. Monthly 12-Month Line Chart: Open [`client/src/pages/AdminDashboard.jsx#L70-L100`](client/src/pages/AdminDashboard.jsx#L70-L100) (pre-populating all 12 calendar months Jan–Dec) and lines 205–248 rendering the Recharts `<LineChart>`.  
> 2. Custom Date Range Sales Chart: Open [`client/src/components/BrandDatePicker.jsx`](client/src/components/BrandDatePicker.jsx) and [`client/src/pages/AdminDashboard.jsx#L102-L158`](client/src/pages/AdminDashboard.jsx#L102-L158). Show how impossible dates (Feb 31) are eliminated by dynamic day calculation, years are restricted to 2020–2027, day loops are guarded (`iterations <= 730`), and sales are aggregated on Recharts `<BarChart>` ([`AdminDashboard.jsx#L365-L400`](client/src/pages/AdminDashboard.jsx#L365-L400)).

### Q11: "How does Facebook and Google login work using Firebase in Quiz 3?"
> **Answer & File to Show:**  
> 1. Open [`client/src/context/AuthContext.jsx#L150-L178`](client/src/context/AuthContext.jsx#L150-L178). Show `loginWithGoogle` with `GoogleAuthProvider` and `loginWithFacebook` with `FacebookAuthProvider`.  
> 2. Show `trackPopup` preventing orphaned popup sessions, and `extractEmailFromCred` safely retrieving the social provider's email.  
> 3. Show [`client/src/pages/Login.jsx#L465-L510`](client/src/pages/Login.jsx#L465-L510) and [`client/src/pages/Register.jsx#L755-L790`](client/src/pages/Register.jsx#L755-L790) rendering the branded social action buttons.  
> 4. Backend: Open [`middleware/auth.js#L14-L90`](middleware/auth.js#L14-L90) verifying the token via Firebase Admin SDK and binding the MongoDB user profile.

### Q12: "How is Infinite Scroll implemented in Quiz 3?"
> **Answer & File to Show:**  
> 1. Frontend Observer: Open [`client/src/pages/Catalog.jsx#L118-L135`](client/src/pages/Catalog.jsx#L118-L135). Show the `IntersectionObserver` observing `observerTarget.current` (rendered at [`Catalog.jsx#L651-L673`](client/src/pages/Catalog.jsx#L651-L673)). Explain the guard condition `if (entries[0].isIntersecting && !isFetchingMore && page < totalPages)` which guarantees no duplicate requests are triggered while a fetch is in-flight or when the catalog has reached the final page.  
> 2. Deduplication & State Append: Show lines 85–94 in [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L85-L94). Explain how `new Map()` keyed by `product._id` is used when appending items (`append === true`) to eliminate duplicate product cards even if new products were created or modified concurrently.  
> 3. Backend Pagination: Open [`controllers/productController.js#L54-L71`](controllers/productController.js#L54-L71). Show how `skip` and `limit` are calculated (`skip = (pageNum - 1) * pageSize`) and piped into Mongoose query builder (`queryBuilder.skip(skip).limit(pageSize)`), returning `page`, `pages`, and `total`.
