# "The Saturation Point" - System Defense Reviewer & Codebase Map

> **Quick Tip for Defense:** When the panel or professor asks to see the implementation of any requirement, refer to the tables below. You can navigate directly to the exact file and line ranges listed.

---

## 1. Quick Reference Matrix (Grading Rubric Map)

| Category / Requirement | Pts | Frontend File & Line Range | Backend File & Line Range | Key Technologies |
| :--- | :---: | :--- | :--- | :--- |
| **MP1: Product Datatable** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L819-L940) | [`controllers/productController.js`](controllers/productController.js#L4-L54) | MUI Table, Pagination |
| **MP1: Multiple Photo Upload** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L85-L125) | [`controllers/productController.js`](controllers/productController.js#L78-L163) | FormData, Multer (`array`) |
| **MP1: Cloudinary Integration** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L162-L260) | [`utils/cloudinary.js`](utils/cloudinary.js#L1-L36) | `cloudinary.v2`, CloudinaryStorage |
| **MP1: Bulk Delete with Checkboxes** | 5 | [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L664-L702) | [`controllers/productController.js`](controllers/productController.js#L174-L188) | MUI Checkbox, `$in` delete |
| **MP2: User Registration** | 2 | [`client/src/pages/Register.jsx`](client/src/pages/Register.jsx#L116-L223) | [`routes/userRoutes.js`](routes/userRoutes.js#L16-L21) | Formik, Yup, Cloudinary avatar |
| **MP2: Username & Password Login** | 5 | [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L65-L114) | [`controllers/userController.js`](controllers/userController.js#L80-L92) | Login via username or email |
| **MP2: User Profile Update + Photo** | 5 | [`client/src/pages/Profile.jsx`](client/src/pages/Profile.jsx#L91-L180) | [`controllers/userController.js`](controllers/userController.js#L18-L63) | Multer (`single`), Cloudinary |
| **MP2: Firebase Auth (Email/Pass)** | 10 | [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L84-L90) | [`middleware/auth.js`](middleware/auth.js#L4-L78) | Firebase Client SDK + Admin SDK |
| **MP3: Availed Purchase Check** | 10 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L77-L89) | [`controllers/orderController.js`](controllers/orderController.js#L135-L144) | Order history validation |
| **MP3: Write / Update Review** | 5 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L106-L154) | [`controllers/productController.js`](controllers/productController.js#L190-L261) | Product subdocument schema |
| **MP3: Admin Delete Review** | 5 | [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L156-L184) | [`controllers/productController.js`](controllers/productController.js#L263-L292) | Admin delete + rating recalculation |
| **Term Test: Completed Transaction** | 10 | [`client/src/pages/Cart.jsx`](client/src/pages/Cart.jsx#L40-L112) | [`controllers/orderController.js`](controllers/orderController.js#L5-L71) | Stock check, decrement, order save |
| **Term Test: Admin Order Status** | 5 | [`client/src/pages/AdminTransactions.jsx`](client/src/pages/AdminTransactions.jsx#L63-L108) | [`controllers/orderController.js`](controllers/orderController.js#L84-L133) | Status transition constraints |
| **Term Test: Customer Email Update** | 5 | *Triggered automatically on status update* | [`utils/emailService.js`](utils/emailService.js#L196-L320) | Nodemailer, HTML itemized table |
| **Term Test: PDF Receipt Attachment** | 10 | *Generated on status "delivered"* | [`utils/emailService.js`](utils/emailService.js#L4-L179) | PDFKit in-memory buffer |
| **Unit 1: Bad-Words Filter** | 10 | *Backend middleware / controller* | [`controllers/productController.js`](controllers/productController.js#L201-L226) | `bad-words` + Tagalog profanities |
| **Unit 1: Yup / Formik Validation** | 10 | Products: [`AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L56-L77)<br>Login: [`Login.jsx`](client/src/pages/Login.jsx#L65-L75)<br>Profile: [`Profile.jsx`](client/src/pages/Profile.jsx#L91-L140) | Handled on frontend with inline error messages | Yup schema + Formik state |
| **Unit 2: Material UI & CSS** | 20 | [`client/src/theme.js`](client/src/theme.js#L1-L80) | N/A | Custom MUI Theme, Lora/Montserrat |
| **Quiz 1: Price Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L285-L300) | [`controllers/productController.js`](controllers/productController.js#L25-L29) | `$gte`, `$lte` query |
| **Quiz 1: Category Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L267-L283) | [`controllers/productController.js`](controllers/productController.js#L18-L23) | `$in` categories query |
| **Quiz 1: Ratings Filter** | 5 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L303-L311) | [`controllers/productController.js`](controllers/productController.js#L31-L33) | `$gte` minimum rating |
| **Quiz 2: 12-Month Sales Line Chart** | 10 | [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L62-L90) | [`controllers/orderController.js`](controllers/orderController.js#L73-L82) | Recharts `LineChart`, all 12 months |
| **Quiz 2: Date Range Sales Chart** | 15 | [`client/src/pages/AdminDashboard.jsx`](client/src/pages/AdminDashboard.jsx#L93-L132) | [`controllers/orderController.js`](controllers/orderController.js#L73-L82) | Recharts `BarChart`, date range filter |
| **Quiz 3: Infinite Scroll (Catalog)** | 15 | [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L48-L123)<br>Sentinel: [`Catalog.jsx:591-613`](client/src/pages/Catalog.jsx#L591-L613) | [`controllers/productController.js`](controllers/productController.js#L35-L50) | `IntersectionObserver`, `skip` & `limit` pagination, Map deduplication |
| **Quiz 4: Facebook & Google Login** | 15 | [`client/src/context/AuthContext.jsx`](client/src/context/AuthContext.jsx#L136-L161)<br>Buttons: [`Login.jsx`](client/src/pages/Login.jsx#L365-L408) | [`middleware/auth.js`](middleware/auth.js#L19-L60) | Firebase OAuth popup, Mongo sync |

---

## 2. Detailed Breakdown by Rubric Category

### MP1: Product / Service CRUD (20 Points Total)

#### 1. Datatables for Product CRUD
- **Frontend File**: [`client/src/pages/AdminProducts.jsx#L819-L955`](client/src/pages/AdminProducts.jsx#L819-L955)
  - [**Lines 819-940**](client/src/pages/AdminProducts.jsx#L819-L940): Material UI `<Table>` implementation featuring sticky header, image thumbnail, name, brand, category, price, stock, and action buttons (Edit, Delete).
  - [**Lines 941-955**](client/src/pages/AdminProducts.jsx#L941-L955): Material UI `<TablePagination>` supporting dynamic page change and rows per page.
- **Backend File**: [`controllers/productController.js#L4-L54`](controllers/productController.js#L4-L54)
  - [**Lines 4-54 (`getProducts`)**](controllers/productController.js#L4-L54): Query builder fetching products with search, filtering, and pagination (`skip` and `limit`).
- **Database Model**: [`models/Product.js#L1-L64`](models/Product.js#L1-L64)

#### 2. Upload Multiple Photos
- **Frontend File**: [`client/src/pages/AdminProducts.jsx#L85-L125`](client/src/pages/AdminProducts.jsx#L85-L125)
  - [**Lines 85-125**](client/src/pages/AdminProducts.jsx#L85-L125): Appends up to 5 image files to `FormData` under the key `images` alongside an `imageOrder` array.
  - [**Lines 162-260**](client/src/pages/AdminProducts.jsx#L162-L260): File selection handler validating file types (JPEG, PNG, WEBP), file size (under 5MB), maximum count of 5, and controls for reordering images up/down.
  - [**Lines 480-570**](client/src/pages/AdminProducts.jsx#L480-L570): Image thumbnail preview grid with move up, move down, and remove buttons.
- **Backend Route**: [`routes/productRoutes.js#L24-L37`](routes/productRoutes.js#L24-L37)
  - [**Line 28 & Line 35**](routes/productRoutes.js#L28-L35): `upload.array('images', 5)` middleware processing multiple multipart file uploads.
- **Backend Controller**: [`controllers/productController.js#L78-L163`](controllers/productController.js#L78-L163)
  - [**Line 82 (`createProduct`)**](controllers/productController.js#L82): Maps uploaded files to an array of URLs: `req.files.map(file => file.path)`.
  - [**Lines 106-154 (`updateProduct`)**](controllers/productController.js#L106-L154): Processes newly uploaded files alongside existing image URLs based on the user-selected image order.

#### 3. Cloudinary Integration
- **Backend Utility**: [`utils/cloudinary.js#L1-L36`](utils/cloudinary.js#L1-L36)
  - [**Lines 6-10**](utils/cloudinary.js#L6-L10): Configures `cloudinary.v2` using environment variables (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
  - [**Lines 12-18**](utils/cloudinary.js#L12-L18): Sets up `CloudinaryStorage` with target folder `'saturation_point_new'` and formats `['jpg', 'png', 'jpeg', 'webp']`.
  - [**Lines 20-34**](utils/cloudinary.js#L20-L34): Configures Multer storage, enforcing 5MB limit and disallowing GIFs.
- **Cloudinary Asset Deletion**: [`controllers/productController.js#L124-L148`](controllers/productController.js#L124-L148)
  - [**Lines 124-148**](controllers/productController.js#L124-L148): Automatically invokes `cloudinary.uploader.destroy(publicId)` when an admin replaces or removes an image during product update.

#### 4. Bulk Delete Using Checkboxes
- **Frontend File**: [`client/src/pages/AdminProducts.jsx#L664-L702`](client/src/pages/AdminProducts.jsx#L664-L702)
  - [**Line 619**](client/src/pages/AdminProducts.jsx#L619): `selectedIds` state tracking selected product IDs.
  - [**Lines 745-757**](client/src/pages/AdminProducts.jsx#L745-L757): `handleSelectAll` and `handleSelectOne` functions managing checkbox selections.
  - [**Lines 829-841**](client/src/pages/AdminProducts.jsx#L829-L841): Header checkbox with `indeterminate` and `checked` states for Select All.
  - [**Lines 875-880**](client/src/pages/AdminProducts.jsx#L875-L880): Row-level checkboxes bound to `selectedIds.includes(product._id)`.
  - [**Lines 792-802**](client/src/pages/AdminProducts.jsx#L792-L802): "Bulk Delete" button with counter (`Bulk Delete ({selectedIds.length})`).
  - [**Lines 664-702**](client/src/pages/AdminProducts.jsx#L664-L702): `handleBulkDelete` function presenting a SweetAlert2 confirmation dialog and sending `{ ids: selectedIds }` to the backend.
- **Backend Route**: [`routes/productRoutes.js#L39`](routes/productRoutes.js#L39)
  - [**Line 39**](routes/productRoutes.js#L39): `router.post('/bulk-delete', verifyToken, verifyAdmin, bulkDeleteProducts);`
- **Backend Controller**: [`controllers/productController.js#L174-L188`](controllers/productController.js#L174-L188)
  - [**Lines 174-188**](controllers/productController.js#L174-L188): Uses Mongoose prepared delete: `Product.deleteMany({ _id: { $in: ids } })`.

---

### MP2: User Functions (20 Points Total)

#### 1. User Registration (Matching Old-System Fields)
- **Frontend File**: [`client/src/pages/Register.jsx#L116-L223`](client/src/pages/Register.jsx#L116-L223)
  - [**Lines 118-126**](client/src/pages/Register.jsx#L118-L126): Initial values matching old-system: `firstName`, `lastName`, `username`, `email`, `password`, `confirmPassword`, `profilePicture`.
  - [**Lines 127-155**](client/src/pages/Register.jsx#L127-L155): Yup validation rules for all fields (regex for names, minimum lengths, password match).
  - [**Lines 160-170 & 225-260**](client/src/pages/Register.jsx#L160-L170): Asynchronous real-time debounced username uniqueness check (`/api/users/check-username`).
  - [**Lines 172-221**](client/src/pages/Register.jsx#L172-L221): Submits user to Firebase, uploads profile picture to Cloudinary via backend `/api/users/profile`, and triggers a custom verification email via `/api/users/send-verification`.
- **Backend Routes**: [`routes/userRoutes.js#L16-L21`](routes/userRoutes.js#L16-L21)
- **Backend Controllers**: [`controllers/userController.js#L65-L123`](controllers/userController.js#L65-L123)
  - [**Lines 65-78 (`checkUsername`)**](controllers/userController.js#L65-L78): Checks username availability.
  - [**Lines 94-123 (`sendVerificationEmail`)**](controllers/userController.js#L94-L123): Generates verification link using Firebase Admin SDK and dispatches branded email.

#### 2. Username and Password Login
- **Frontend File**: [`client/src/pages/Login.jsx#L65-L114`](client/src/pages/Login.jsx#L65-L114)
  - [**Lines 67-74**](client/src/pages/Login.jsx#L67-L74): Input field `identifier` accepts **either an Email OR a Username**.
  - [**Lines 81-90**](client/src/pages/Login.jsx#L81-L90): If `identifier` does not contain `@`, queries backend endpoint `GET /api/users/email-by-username/:username` to retrieve the associated email automatically.
  - [**Lines 92-99**](client/src/pages/Login.jsx#L92-L99): Authenticates via Firebase `signInWithEmailAndPassword`, checks `emailVerified`, and rejects unverified logins.
  - [**Lines 101-108**](client/src/pages/Login.jsx#L101-L108): Fetches MongoDB profile and routes to `/admin/dashboard` or `/profile`.
- **Backend Controller**: [`controllers/userController.js#L80-L92`](controllers/userController.js#L80-L92)
  - [**Lines 80-92 (`getEmailByUsername`)**](controllers/userController.js#L80-L92): Finds user by username and returns their email.

#### 3. User Profile Update with Photo Upload
- **Frontend File**: [`client/src/pages/Profile.jsx#L91-L180`](client/src/pages/Profile.jsx#L91-L180)
  - [**Lines 91-140**](client/src/pages/Profile.jsx#L91-L140): Formik form with Yup validation for updating personal info (first name, last name, username, email).
  - [**Lines 142-180**](client/src/pages/Profile.jsx#L142-L180): Submits `FormData` containing updated fields and optional avatar file to `PUT /api/users/profile`.
  - [**Lines 230-265**](client/src/pages/Profile.jsx#L230-L265): File input validation for avatar (JPEG, PNG, WEBP under 5MB).
  - [**Lines 485-580**](client/src/pages/Profile.jsx#L485-L580): Password change tab using Firebase `updatePassword`.
- **Backend Route**: [`routes/userRoutes.js#L21`](routes/userRoutes.js#L21)
  - [**Line 21**](routes/userRoutes.js#L21): `router.put('/profile', verifyToken, upload.single('photo'), updateUserProfile);`
- **Backend Controller**: [`controllers/userController.js#L18-L63`](controllers/userController.js#L18-L63)
  - [**Lines 18-63 (`updateUserProfile`)**](controllers/userController.js#L18-L63): Updates `displayName`, `username`, `email` (with collision check), and saves Cloudinary `req.file.path` into `photoURL`.

#### 4. Firebase Authentication Integration
- **Client Firebase Initialization**: [`client/src/firebase.js#L1-L15`](client/src/firebase.js#L1-L15)
- **Auth Context Wrapper**: [`client/src/context/AuthContext.jsx#L84-L187`](client/src/context/AuthContext.jsx#L84-L187)
  - [**Lines 84-90**](client/src/context/AuthContext.jsx#L84-L90): `signInWithEmailAndPassword` and `createUserWithEmailAndPassword`.
  - [**Lines 172-187**](client/src/context/AuthContext.jsx#L172-L187): `onAuthStateChanged` listener synchronizing Firebase auth state with MongoDB profile.
- **Backend Firebase Admin SDK**: [`utils/firebaseAdmin.js#L41-L47`](utils/firebaseAdmin.js#L41-L47)
- **Backend Token Verification Middleware**: [`middleware/auth.js#L4-L78`](middleware/auth.js#L4-L78)
  - [**Lines 14-16**](middleware/auth.js#L14-L16): Verifies bearer token using `auth.verifyIdToken(token)` and binds MongoDB user to `req.mongoUser`.

---

### MP3: Review & Ratings (20 Points Total)

#### 1. Only Users Who Availed (Purchased) Can Review
- **Frontend File**: [`client/src/pages/ProductDetails.jsx#L77-L89`](client/src/pages/ProductDetails.jsx#L77-L89)
  - [**Lines 77-89**](client/src/pages/ProductDetails.jsx#L77-L89): Queries `/api/orders/myorders` and validates that the logged-in user has an order with `status === 'delivered'` containing the current product:
    ```javascript
    const purchased = orders.some(
      (order) =>
        order.status === 'delivered' &&
        order.orderItems.some((item) => item.product === id),
    );
    setHasPurchased(purchased);
    ```
  - [**Lines 440-470**](client/src/pages/ProductDetails.jsx#L440-L470): The review form is conditionally rendered only if `hasPurchased` is `true`. Otherwise, an informative notice is displayed.
- **Backend Controller**: [`controllers/orderController.js#L135-L144`](controllers/orderController.js#L135-L144)
  - [**Lines 135-144 (`getMyOrders`)**](controllers/orderController.js#L135-L144): Fetches all orders belonging to the authenticated user.

#### 2. Users Can Write and Update Their Own Review & Rating
- **Frontend File**: [`client/src/pages/ProductDetails.jsx#L62-L154`](client/src/pages/ProductDetails.jsx#L62-L154)
  - [**Lines 62-74**](client/src/pages/ProductDetails.jsx#L62-L74): Pre-populates existing review if the user has already reviewed the product (`isEditingReview` mode).
  - [**Lines 106-154**](client/src/pages/ProductDetails.jsx#L106-L154): Formik form submitting rating (1-5 stars) and comment to `POST /api/products/:id/reviews`.
- **Backend Controller**: [`controllers/productController.js#L190-L261`](controllers/productController.js#L190-L261)
  - [**Lines 231-248 (`createProductReview`)**](controllers/productController.js#L231-L248): Updates existing review in-place or pushes a new review.
  - [**Lines 250-254**](controllers/productController.js#L250-L254): Automatically recalculates product average `rating` and `numReviews`.
- **Database Model**: [`models/Product.js#L35-L60`](models/Product.js#L35-L60)

#### 3. Admin Can Delete Any Review
- **Frontend File**: [`client/src/pages/ProductDetails.jsx#L156-L184`](client/src/pages/ProductDetails.jsx#L156-L184)
  - [**Lines 156-184 (`handleDeleteReview`)**](client/src/pages/ProductDetails.jsx#L156-L184): Admin click handler calling `DELETE /api/products/:id/reviews/:reviewId`.
  - [**Lines 545-560**](client/src/pages/ProductDetails.jsx#L545-L560): Delete button conditionally rendered for administrators: `mongoUser?.role === 'admin'`.
- **Backend Route**: [`routes/productRoutes.js#L22`](routes/productRoutes.js#L22)
  - [**Line 22**](routes/productRoutes.js#L22): `router.delete('/:id/reviews/:reviewId', verifyToken, verifyAdmin, deleteReview);`
- **Backend Controller**: [`controllers/productController.js#L263-L292`](controllers/productController.js#L263-L292)
  - [**Lines 263-292 (`deleteReview`)**](controllers/productController.js#L263-L292): Removes review, recalculates rating, and saves.

---

### Term Test Lab: Orders, Status Updates, Emails & PDF (30 Points Total)

#### 1. Completed Transaction (Checkout Flow)
- **Frontend File**: [`client/src/pages/Cart.jsx#L40-L112`](client/src/pages/Cart.jsx#L40-L112)
  - [**Lines 40-112 (`handleCheckout`)**](client/src/pages/Cart.jsx#L40-L112): Shows confirmation modal and posts order to `/api/orders`.
- **Backend Route**: [`routes/orderRoutes.js#L11`](routes/orderRoutes.js#L11)
  - [**Line 11**](routes/orderRoutes.js#L11): `router.post('/', verifyToken, createOrder);`
- **Backend Controller**: [`controllers/orderController.js#L5-L71`](controllers/orderController.js#L5-L71)
  - [**Lines 16-28**](controllers/orderController.js#L16-L28): Validates product existence and available stock.
  - [**Lines 41-43**](controllers/orderController.js#L41-L43): Deducts inventory stock via `$inc: { stock: -item.quantity }`.
  - [**Line 46**](controllers/orderController.js#L46): Adds shipping fee (PHP 150.00).
  - [**Lines 48-56**](controllers/orderController.js#L48-L56): Creates order with status `'pending'`.
  - [**Lines 58-65**](controllers/orderController.js#L58-L65): Dispatches confirmation email.
- **Database Model**: [`models/Order.js#L1-L34`](models/Order.js#L1-L34)

#### 2. Admin Updates Transaction Status
- **Frontend File**: [`client/src/pages/AdminTransactions.jsx#L42-L108`](client/src/pages/AdminTransactions.jsx#L42-L108)
  - [**Lines 42-60**](client/src/pages/AdminTransactions.jsx#L42-L60): Fetches all orders via `GET /api/orders`.
  - [**Lines 63-108**](client/src/pages/AdminTransactions.jsx#L63-L108): `handleStatusChangeClick` and `confirmStatusChange` send `PUT /api/orders/:id/status`.
  - [**Lines 130-290**](client/src/pages/AdminTransactions.jsx#L130-L290): Orders table with status chips and action buttons.
  - [**Lines 300-475**](client/src/pages/AdminTransactions.jsx#L300-L475): Order details dialog modal.
- **Backend Controller**: [`controllers/orderController.js#L84-L133`](controllers/orderController.js#L84-L133)
  - [**Lines 84-113**](controllers/orderController.js#L84-L113): Validates status transitions.
  - [**Lines 117-125**](controllers/orderController.js#L117-L125): Restocks items if status changes to `'cancelled'`.
  - [**Line 127**](controllers/orderController.js#L127): Triggers updated status email to the customer.

#### 3. Email Customer with Updated Transaction Details (Subtotal & Grand Total)
- **Backend Utility**: [`utils/emailService.js#L196-L320`](utils/emailService.js#L196-L320)
  - [**Lines 198-205**](utils/emailService.js#L198-L205): Configures Nodemailer transport using SMTP credentials.
  - [**Lines 232-241**](utils/emailService.js#L232-L241): Itemized HTML table mapping.
  - [**Lines 272-284**](utils/emailService.js#L272-L284): Subtotal, shipping fee (PHP 150.00), and grand total summary.
  - [**Lines 301-320**](utils/emailService.js#L301-L320): Dispatches email via `transporter.sendMail`.

#### 4. Attach PDF Receipt on Email
- **Backend Utility**: [`utils/emailService.js#L4-L225`](utils/emailService.js#L4-L225)
  - [**Lines 214-225**](utils/emailService.js#L214-L225): Checks if `order.status === 'delivered'`; generates the PDF receipt buffer and attaches it to the outgoing email.
  - [**Lines 4-179 (`generatePDFReceipt`)**](utils/emailService.js#L4-L179): PDFKit stream generating official receipt in memory.
  - [**Lines 36-69**](utils/emailService.js#L36-L69): Customer and order header details.
  - [**Lines 71-128**](utils/emailService.js#L71-L128): Table of items.
  - [**Lines 129-173**](utils/emailService.js#L129-L173): Subtotal, shipping, and grand total.

---

### Unit 1: Bad-Words Filtering & Form Validation (20 Points Total)

#### 1. Filter / Mask Bad Words from Reviews (`bad-words` Package)
- **Backend Package**: [`package.json#L21`](package.json#L21) (`"bad-words": "^4.0.0"`)
- **Backend File**: [`controllers/productController.js#L201-L226`](controllers/productController.js#L201-L226)
  - [**Line 2**](controllers/productController.js#L2): `const { Filter } = require('bad-words');`
  - [**Lines 201-226 (`createProductReview`)**](controllers/productController.js#L201-L226): Instantiates filter, adds Filipino profanities, and masks profane words with asterisks (`****`).

#### 2. Form Validation on Product and User Forms (Yup & Formik)
- **Product Form (Admin)**: [`client/src/pages/AdminProducts.jsx#L56-L77`](client/src/pages/AdminProducts.jsx#L56-L77)
  - [**Lines 56-77**](client/src/pages/AdminProducts.jsx#L56-L77): Yup validation schema checking name, description, positive price, brand, category, and integer stock.
- **User Login Form**: [`client/src/pages/Login.jsx#L65-L75`](client/src/pages/Login.jsx#L65-L75)
  - [**Lines 65-75**](client/src/pages/Login.jsx#L65-L75): Yup validation requiring identifier and password.
- **User Registration Form**: [`client/src/pages/Register.jsx#L116-L156`](client/src/pages/Register.jsx#L116-L156)
  - [**Lines 116-156**](client/src/pages/Register.jsx#L116-L156): Comprehensive Yup schema for names, username regex, valid email, minimum 6-character password, and password match.
- **User Profile Update Form**: [`client/src/pages/Profile.jsx#L91-L140`](client/src/pages/Profile.jsx#L91-L140)
  - [**Lines 91-140**](client/src/pages/Profile.jsx#L91-L140): Yup schema for updating profile attributes and password.
- **Review Form**: [`client/src/pages/ProductDetails.jsx#L106-L117`](client/src/pages/ProductDetails.jsx#L106-L117)
  - [**Lines 106-117**](client/src/pages/ProductDetails.jsx#L106-L117): Rating required (min 1 star) and comment capped at 500 characters.

---

### Unit 2: User Interface Design CSS and Material UI (20 Points Total)

#### 1. Material UI Theme & Component System
- **Theme Configuration**: [`client/src/theme.js#L1-L80`](client/src/theme.js#L1-L80)
  - [**Lines 3-20**](client/src/theme.js#L3-L20): Color palette definition (`primary: '#1C1917'`, `secondary: '#CA8A04'`, `background: '#FAF9F6'`).
  - [**Lines 21-34**](client/src/theme.js#L21-L34): Typography hierarchy with Cormorant / Lora headers and Montserrat body.
  - [**Lines 35-37**](client/src/theme.js#L35-L37): Clean, sharp corners (`borderRadius: 0`).
  - [**Lines 38-79**](client/src/theme.js#L38-L79): Global component style overrides for `MuiButton`, `MuiPaper`, and `MuiTextField`.
- **Global Styles**: [`client/src/App.css#L1-L50`](client/src/App.css#L1-L50) and [`client/src/index.css#L1-L50`](client/src/index.css#L1-L50)
- **MUI Components Across Pages**:
  - Navigation bar with drawer & dropdown: [`client/src/components/Navbar.jsx#L1-L258`](client/src/components/Navbar.jsx#L1-L258)
  - Admin layout sidebar: [`client/src/components/AdminLayout.jsx#L1-L120`](client/src/components/AdminLayout.jsx#L1-L120)
  - Footer: [`client/src/components/Footer.jsx#L1-L100`](client/src/components/Footer.jsx#L1-L100)

---

### Quiz 1: Catalog Filters (15 Points Total)

#### 1. Price Filter (5 Points)
- **Frontend File**: [`client/src/pages/Catalog.jsx#L285-L300`](client/src/pages/Catalog.jsx#L285-L300)
  - [**Lines 40-41**](client/src/pages/Catalog.jsx#L40-L41): `minPrice` and `maxPrice` state variables.
  - [**Lines 63-64**](client/src/pages/Catalog.jsx#L63-L64): Appends `&minPrice=${minPrice}&maxPrice=${maxPrice}` to backend query.
  - [**Lines 285-300**](client/src/pages/Catalog.jsx#L285-L300): Min Price and Max Price text input fields with number validation.
- **Backend Controller**: [`controllers/productController.js#L25-L29`](controllers/productController.js#L25-L29)
  - [**Lines 25-29**](controllers/productController.js#L25-L29): Dynamically builds MongoDB query with `$gte` and `$lte`.

#### 2. Category Filter (5 Points)
- **Frontend File**: [`client/src/pages/Catalog.jsx#L267-L283`](client/src/pages/Catalog.jsx#L267-L283)
  - [**Line 39**](client/src/pages/Catalog.jsx#L39): `selectedCategories` array state.
  - [**Line 62**](client/src/pages/Catalog.jsx#L62): Appends `&category=${selectedCategories.join(',')}` to backend request.
  - [**Lines 267-283**](client/src/pages/Catalog.jsx#L267-L283): Material UI Category multi-select / dropdown component.
- **Backend Controller**: [`controllers/productController.js#L18-L23`](controllers/productController.js#L18-L23)
  - [**Lines 18-23**](controllers/productController.js#L18-L23): Query: `query.category = { $in: categories };`.

#### 3. Ratings Filter (5 Points)
- **Frontend File**: [`client/src/pages/Catalog.jsx#L303-L311`](client/src/pages/Catalog.jsx#L303-L311)
  - [**Line 42**](client/src/pages/Catalog.jsx#L42): `minRating` state variable.
  - [**Line 65**](client/src/pages/Catalog.jsx#L65): Appends `&minRating=${minRating}` to API request.
  - [**Lines 303-311**](client/src/pages/Catalog.jsx#L303-L311): Interactive Material UI `<Rating>` stars component.
- **Backend Controller**: [`controllers/productController.js#L31-L33`](controllers/productController.js#L31-L33)
  - [**Lines 31-33**](controllers/productController.js#L31-L33): Query: `query.rating = { $gte: Number(minRating) };`.

---

### Quiz 2: Sales Charts & Analytics (25 Points Total)

#### 1. Monthly Sales Line Chart - All 12 Months (10 Points)
- **Frontend File**: [`client/src/pages/AdminDashboard.jsx#L62-L225`](client/src/pages/AdminDashboard.jsx#L62-L225)
  - [**Lines 62-90 (`monthlyData` useMemo)**](client/src/pages/AdminDashboard.jsx#L62-L90): Pre-populates all 12 calendar months and aggregates sales by month index.
  - [**Lines 185-225**](client/src/pages/AdminDashboard.jsx#L185-L225): Renders Recharts `<LineChart>`.
- **Backend Controller**: [`controllers/orderController.js#L73-L82`](controllers/orderController.js#L73-L82)
  - [**Lines 73-82 (`getAllOrders`)**](controllers/orderController.js#L73-L82): Fetches all orders.

#### 2. Sales Chart with Date Range Filter (15 Points)
- **Frontend File**: [`client/src/pages/AdminDashboard.jsx#L93-L320`](client/src/pages/AdminDashboard.jsx#L93-L320)
  - [**Lines 40-41**](client/src/pages/AdminDashboard.jsx#L40-L41): `startDate` and `endDate` states.
  - [**Lines 93-132 (`filteredData` useMemo)**](client/src/pages/AdminDashboard.jsx#L93-L132): Aggregates daily sales between the selected start and end dates.
  - [**Lines 235-265**](client/src/pages/AdminDashboard.jsx#L235-L265): Date picker UI inputs.
  - [**Lines 270-320**](client/src/pages/AdminDashboard.jsx#L270-L320): Renders Recharts `<BarChart>`.

---

### Quiz 3: Infinite Scroll on Products List in Catalog (15 Points Total)

#### 1. Frontend Implementation (`IntersectionObserver` Architecture)
- **Frontend File**: [`client/src/pages/Catalog.jsx#L48-L123`](client/src/pages/Catalog.jsx#L48-L123)
  - [**Lines 48-51**](client/src/pages/Catalog.jsx#L48-L51): Infinite scroll state definitions (`page`, `totalPages`, `isFetchingMore`, `observerTarget` ref).
  - [**Lines 53-99 (`fetchProducts`)**](client/src/pages/Catalog.jsx#L53-L99): Asynchronously requests paginated products (`limit=8&page=${pageParam}`) and deduplicates items using a JavaScript `Map`.
  - [**Lines 106-123 (`IntersectionObserver` Hook)**](client/src/pages/Catalog.jsx#L106-L123): Automatically triggers the next page fetch when the bottom sentinel enters viewport (`entries[0].isIntersecting`).
  - [**Lines 591-613 (Sentinel UI & Loading State)**](client/src/pages/Catalog.jsx#L591-L613): Bottom sentinel container `<Box ref={observerTarget}>` rendering `<CircularProgress>` while loading and "End of catalog" once complete.

#### 2. Backend Pagination Engine
- **Backend File**: [`controllers/productController.js#L35-L50`](controllers/productController.js#L35-L50)
  - [**Lines 35-50 (`getProducts`)**](controllers/productController.js#L35-L50): Extracts `page` and `limit`, counts total documents, and applies `skip()` and `limit()`.

#### 3. Defense Demo Steps / What to Say to the Panel
1. Open the **Catalog** page in the browser.
2. Open Browser DevTools (F12 $\rightarrow$ **Network** tab, filter by `products`).
3. Scroll down the Catalog page: show that when reaching the bottom, a smooth loading spinner appears, and a new network request `GET /api/products?limit=8&page=2` is fired.
4. Show how products seamlessly append without resetting the scroll position or flashing duplicate items.
5. Highlight that this was built using native browser **`IntersectionObserver`**, avoiding bloated external packages for maximum performance.

---

### Quiz 4: Facebook or Gmail (Google) Login using Firebase (15 Points Total)

#### 1. OAuth Providers & Scope Configuration
- **Auth Context File**: [`client/src/context/AuthContext.jsx#L136-L161`](client/src/context/AuthContext.jsx#L136-L161)
  - [**Lines 136-150 (`loginWithGoogle`)**](client/src/context/AuthContext.jsx#L136-L150): Instantiates `GoogleAuthProvider` with email and profile scopes.
  - [**Lines 151-161 (`loginWithFacebook`)**](client/src/context/AuthContext.jsx#L151-L161): Instantiates `FacebookAuthProvider` with email and public profile scopes.
  - [**Lines 92-134 (`trackPopup`)**](client/src/context/AuthContext.jsx#L92-L134): Detects and monitors popup window state.
  - [**Lines 34-52 (`extractEmailFromCred`)**](client/src/context/AuthContext.jsx#L34-L52): Extracts verified email address.

#### 2. UI Buttons & Navigation Handlers
- **Login Page**: [`client/src/pages/Login.jsx#L134-L156`](client/src/pages/Login.jsx#L134-L156)
  - [**Lines 134-156 (`handleSocialLogin`)**](client/src/pages/Login.jsx#L134-L156): Awaits provider authentication, synchronizes profile with MongoDB via `fetchMongoProfile`, and redirects with `{ replace: true }`.
  - [**Lines 365-408**](client/src/pages/Login.jsx#L365-L408): Branded "Continue with Google" and "Continue with Facebook" action buttons.
- **Register Page**: [`client/src/pages/Register.jsx#L95-L115`](client/src/pages/Register.jsx#L95-L115) & [**Lines 741-780**](client/src/pages/Register.jsx#L741-L780)
  - [**Lines 95-115**](client/src/pages/Register.jsx#L95-L115): Social login handler.
  - [**Lines 741-780**](client/src/pages/Register.jsx#L741-L780): Social buttons.

#### 3. Backend Synchronization & Profile Creation
- **Backend Middleware**: [`middleware/auth.js#L14-L60`](middleware/auth.js#L14-L60)
  - [**Lines 14-17**](middleware/auth.js#L14-L17): Verifies Firebase ID token with Firebase Admin SDK.
  - [**Lines 19-32**](middleware/auth.js#L19-L32): Reads verified social email from the token or `X-User-Email` header.
  - [**Lines 33-60**](middleware/auth.js#L33-L60): Creates or merges MongoDB user document and assigns role.

---

## 3. Architecture & Security Defense Checklist

| Security / Design Area | Implementation Location | Defense Talking Points |
| :--- | :--- | :--- |
| **NoSQL Injection Prevention** | Controllers: [`productController.js#L4-L188`](controllers/productController.js#L4-L188), [`orderController.js#L5-L71`](controllers/orderController.js#L5-L71), [`userController.js#L18-L63`](controllers/userController.js#L18-L63) | All queries use Mongoose prepared methods (`findById`, `findOne`, `create`, `deleteMany`) with strict schema typing, preventing arbitrary operator injection. |
| **JWT & Token Authentication** | Middleware: [`middleware/auth.js:14-16`](middleware/auth.js#L14-L16) | Uses Firebase Admin SDK `verifyIdToken(token)` to cryptographically verify RS256 JWT tokens on every protected API call. |
| **Role-Based Access Control (RBAC)** | Middleware: [`middleware/auth.js:80-86`](middleware/auth.js#L80-L86)<br>Frontend: [`client/src/App.jsx:31-38`](client/src/App.jsx#L31-L38) | Protected routes check `mongoUser.role === 'admin'`. Unauthorized requests return HTTP 403 Forbidden on both backend and frontend. |
| **Stock Concurrency & Integrity** | Controller: [`orderController.js:41-43`](controllers/orderController.js#L41-L43) | Uses atomic MongoDB update operators `$inc: { stock: -quantity }` to prevent race conditions during checkout. |
| **Cloudinary File Storage & Cleanup** | Storage: [`utils/cloudinary.js:12-34`](utils/cloudinary.js#L12-L34)<br>Cleanup: [`controllers/productController.js:131-147`](controllers/productController.js#L131-L147), [`controllers/userController.js:173-182`](controllers/userController.js#L173-L182) | Direct upload to Cloudinary CDN with MIME-type filtering; automatically destroys obsolete public assets when products or users are deleted. |
| **In-Memory PDF Generation** | Utility: [`utils/emailService.js:4-179`](utils/emailService.js#L4-L179) | Uses streaming PDFKit buffers in memory, avoiding disk I/O vulnerabilities and temporary file storage issues. |

---

## 4. Frequently Asked Questions by Defense Panels

### Q1: "Show me where you ensure only customers who actually availed the product can write a review."
> **Answer & File to Show:**  
> Open [`client/src/pages/ProductDetails.jsx`](client/src/pages/ProductDetails.jsx#L77-L89).  
> Show lines 77–89: The system calls `/api/orders/myorders` and uses JavaScript `.some()` to verify that an order with `status === 'delivered'` exists containing this product's ID. If `hasPurchased` is false, the review submission form is hidden and replaced by a notice.

### Q2: "How does the system generate the official PDF receipt and send the email?"
> **Answer & File to Show:**  
> Open [`utils/emailService.js`](utils/emailService.js#L4-L179) and [`utils/emailService.js:214-225`](utils/emailService.js#L214-L225).  
> Show how `generatePDFReceipt` uses PDFKit to stream binary chunks into a memory buffer (`Buffer.concat(buffers)`). When an order is marked as `delivered`, the buffer is attached directly as `Receipt-${order._id}.pdf` via Nodemailer. Show lines 226–285 for the itemized HTML table showing subtotal, shipping fee, and grand total.

### Q3: "Where are the bad words filtered in reviews?"
> **Answer & File to Show:**  
> Open [`controllers/productController.js`](controllers/productController.js#L201-L226).  
> Show how `new Filter()` from the `bad-words` npm package is initialized, customized with Filipino profanities via `filter.addWords(...)`, and executed on the incoming comment with `filter.clean(sanitizedComment)`.

### Q4: "Where is the bulk delete implemented?"
> **Answer & File to Show:**  
> 1. Frontend: [`client/src/pages/AdminProducts.jsx`](client/src/pages/AdminProducts.jsx#L664-L702) & [`client/src/pages/AdminProducts.jsx:829-841`](client/src/pages/AdminProducts.jsx#L829-L841). Show the select-all checkbox, individual checkboxes, and the bulk delete handler sending an array of IDs.  
> 2. Backend: [`controllers/productController.js`](controllers/productController.js#L174-L188). Show `Product.deleteMany({ _id: { $in: ids } })`.

### Q5: "How does login with username work when Firebase only supports email/password?"
> **Answer & File to Show:**  
> Open [`client/src/pages/Login.jsx`](client/src/pages/Login.jsx#L81-L90) and [`controllers/userController.js`](controllers/userController.js#L80-L92).  
> Explain that if the user inputs a username (no `@` symbol), the frontend queries `GET /api/users/email-by-username/:username` to fetch their registered email address from MongoDB, which is then used seamlessly with Firebase Auth's `signInWithEmailAndPassword`.

### Q6: "How did you implement Infinite Scroll, and where is it located?"
> **Answer & File to Show:**  
> Open [`client/src/pages/Catalog.jsx`](client/src/pages/Catalog.jsx#L48-L123) and [`client/src/pages/Catalog.jsx:591-613`](client/src/pages/Catalog.jsx#L591-L613).  
> Show lines 106–123: The catalog uses the native `IntersectionObserver` API attached to a sentinel ref `<Box ref={observerTarget}>` at the bottom of the product list. When the user scrolls to the bottom, the observer automatically triggers `fetchProducts(nextPage, true)`.  
> Show lines 81–86: Newly received products are merged into a JavaScript `Map` to guarantee zero duplicate keys or duplicate renders.  
> Show [`controllers/productController.js:35-50`](controllers/productController.js#L35-L50) for the backend Mongoose `skip()` and `limit()` implementation returning `{ products, page, pages, total }`.

