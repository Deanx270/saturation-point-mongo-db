# "The Saturation Point" E-Commerce Store

## Project Overview
Migrating the old PHP/MySQL system to the MERN stack (MongoDB, Express, React, Node) + Firebase.

## Grading Rubric / Requirements Checklist

### MP1 (Product / Service CRUD)
- [x] Product/Service CRUD upload multiple photos cloudinary (12pts)
- [x] Product/Service CRUD datatables. upload multiple photos. cloudinary (15pts)
- [x] Product/Service CRUD datatables. upload multiple photos. bulk delete using checkboxes (20pts)

### MP2 (User Functions) - 20pts Total
- [x] User registration (2pts) - *Needs separate page and fields matching old-system*
- [x] Username and password login (5pts) 
- [x] User profile update with photo upload. (5pts) 
- [x] Username and password using firebase authentication (10pts)

### MP3 (Review & Ratings) - 20pts Total
- [x] Users who availed of the product/service can write a review and rate the product service (10pts)
- [x] Users can update their own review/rating. (5pts)
- [x] Admin can delete a review (5pts)

### Term Test Lab - 30pts Total
- [ ] Completed transaction. (10pts)
- [ ] Admin updates the status of the transaction. (5pts) 
- [ ] Email the customer of the updated transaction details. the email contains the list of products/services, their subtotal and grand total. (5pts)
- [ ] Attach a pdf receipt on the email (10pts)

### Unit 1
- [x] Filter/mask bad words from reviews. `bad-words` package (10pts)
- [x] Form validation on product and user forms. (product crud, user login, update profile) **YUP / Formik / React Hook Form** (10pts)

### Unit 2
- [x] User interface design css and Material UI (MUI) components (20pts)

### Quiz 1 
- [x] Price filter (5pts)
- [x] Category filter (5pts) 
- [ ] Ratings filter (5pts)

### Quiz 2
- [ ] Monthly sales charts. all months on the chart label. line chart (10pts) 
- [ ] Sales charts with date range filter. line or bar chart (15pts)

### Quiz 3
- [ ] Pagination on products list on homepage. (10pts)
- [ ] Infinite scroll on products list on homepage. (15pts)

### Quiz 4 
- [x] Facebook or gmail login using firebase (15pts)

### Term Test LEC
- [ ] Functional requirements completeness (10pts)
- [ ] Program execution (errors) (10pts)
- [ ] Project contribution (10pts)

## Design & Architecture Guidelines

1. **Old-System Parity:** ALL UI designs must strictly reference the `old-system` styles. Do not invent new styles unless required for new features.
2. **No Default HTML Elements:** NEVER rely on default HTML elements. Do not use default HTML inputs, buttons, dropdowns, popups, or the `required` attribute. Use MUI components or heavily styled components instead.
3. **Form Validation:** Form validation must be handled via Yup/Formik with custom inline errors beneath inputs (no default HTML popups or Toasts for field-level errors).
4. **Backend Security:** All backend queries must use proper ODM/ORM methods (Mongoose prepared statements) to prevent injection.
5. **DRY Principle:** Re-use components, layouts, and styles. If `Register.jsx` has a styled avatar preview, `Profile.jsx` must use the exact same logic and style.
6. **Brand Guidelines:**
   - Fonts: Cormorant (Headers), Montserrat (Body)
   - Professional, minimalist, sharp corners, high-end feel.
   - Links/CTAs must have underlines to be visibly clickable.
   - All pages must be fully mobile responsive.
7. **Requirement Compliance:** If the user explicitly asks you to do something that contradicts the existing requirements defined in this file (e.g., omitting a required field like username) OR contradicts modern/industry UX standards, you MUST remind the user of the requirements/standards first before proceeding, rather than blindly following the contradictory request.
