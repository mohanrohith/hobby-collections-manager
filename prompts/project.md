1. Introduction

This document outlines the requirements for a Hobby Collections Manager web application. The app’s primary goal is to help users catalog and organize various collections (diecast cars, Hot Wheels, LEGO, Funko Pops, books, etc.) in a streamlined, user-friendly way. It provides easy data entry, automated population of item details via scanning or API lookups, category-based browsing, search capabilities, and flexible image handling. The chosen technology stack is Firebase for backend services and a TypeScript-based frontend (e.g., React or Vue).

⸻

2. Goals and Objectives
	•	Effortless Data Entry: Allow users to quickly add new items by scanning barcodes/QR codes or manually entering details.
	•	Automated Item Population: Integrate with public APIs (and fallback to lightweight scraping if needed) to fetch item metadata (e.g., title, manufacturer, year, scale, images) automatically upon scanning.
	•	Structured Organization: Categorize items by collection type (diecast cars, Hot Wheels, LEGO, Funko Pops, books, etc.) and subcategories (scale, series, year, etc.).
	•	Unified Browse & Search: Provide a dashboard or catalog view grouped by category, with a global search bar and filter options (by name, category, year, scale, condition, etc.).
	•	Flexible Image Management: Default to fetching images from the web (via public APIs or reverse‐image search) while also allowing users to upload custom photos.
	•	Scalability & Real-Time Sync: Use Firebase’s Firestore (or Realtime Database) to enable real-time data updates across devices and auto‐sync.
	•	Cross‐Platform Compatibility: Build a responsive web app (mobile + desktop), with potential for future native wrappers (e.g., React Native, Capacitor).
	•	Security & Access Control: Implement user authentication via Firebase Auth (email/password, Google, maybe Apple), and protect each user’s collection data.

⸻

3. Scope

3.1 In Scope
	1.	User Management
	•	User registration/login via Firebase Authentication
	•	Password reset, email verification
	•	Optionally social logins (Google, Facebook)
	2.	Collection Types Support
	•	Diecast Cars (various scales)
	•	Hot Wheels
	•	LEGO sets
	•	Funko Pops
	•	Books (ISBN lookup)
	•	Design to accommodate adding new collection types easily
	3.	Data Entry
	•	Barcode/QR Scanner: Leverage device camera; recognize UPC/EAN/ISBN barcodes for cars, books, etc.
	•	Manual Entry Form: Allow manual input of fields (name/title, category, subcategory, manufacturer, scale, year, condition, notes, custom tags).
	•	Bulk Import (Optional V1+): CSV upload template (later milestone).
	4.	Automated Population
	•	Public API Integrations:
	•	Books: Open Library or Google Books API (ISBN lookup).
	•	LEGO: Brickset API or Bricklink API.
	•	Funko Pops: If a public API is available (otherwise fallback).
	•	Diecast Cars/Hot Wheels: Scalecatalog API or hobbyist databases.
	•	Web Scraping Fallback: If no stable API exists, lightweight serverless function (Cloud Function) to scrape minimal details (e.g., from Bricklink or PopPriceGuide).
	•	Auto-map Fields: Title, manufacturer/brand, release year, category tags, images, scale/size, approximate market value (optional).
	5.	Collection Dashboard & Browsing
	•	Main Catalog Page: Grid or list view of all items, grouped by category headings (e.g., a collapsible section per collection type).
	•	Category Filter: Quick filters to show only “Books,” “LEGO,” etc.
	•	Sorting Options: Sort by name, date added, year, scale, etc.
	•	Pagination or Infinite Scroll: For large collections.
	6.	Search & Advanced Filtering
	•	Global Search Bar: Real-time search as the user types (Firestore’s startAt/endAt queries or Algolia integration).
	•	Attribute Filters: By subcategory (scale size for cars, set number for LEGO, ISBN range, condition, tags).
	•	Tagging System: Custom tags (e.g., “Mint,” “Rare,” “Boxed”).
	7.	Item Details Page
	•	Show all metadata (auto-populated and custom fields).
	•	Display fetched image(s) + ability to upload additional images (via Firebase Storage).
	•	Notes section (free-text, user comments).
	•	“Edit” and “Delete” actions.
	•	“Mark as Traded/Sold” or “Wishlist” status (optional).
	8.	Image Handling
	•	Auto-fetch: If API returns a high-resolution image URL, save that link in Firestore.
	•	Custom Upload: Users can upload their own photos; store in Firebase Storage with metadata references in Firestore.
	•	Image Caching & Resizing: On upload or fetch, generate thumbnails (Cloud Function + Firebase Storage triggers).
	•	Graceful Degradation: Placeholder image if no image available.
	9.	Offline Support (Optional)
	•	Cache previously loaded items locally (with Firestore offline persistence).
	•	Allow adding/editing while offline; sync on reconnect.
	10.	Analytics & Reporting (Optional V2)
	•	Number of items per category.
	•	Total estimated value (if market data available).
	•	Recently added / recently updated items.
	•	Export to CSV/PDF report.

⸻

3.2 Out of Scope (Initial Version)
	•	Multi-user sharing of collections (collaborative editing).
	•	Advanced scraping of gated websites or APIs requiring paid subscriptions.
	•	Native mobile apps (to be a future iteration).
	•	In-depth market pricing engine (beyond basic average value from API).

⸻

4. Functional Requirements

ID	Requirement
FR1	User Authentication: Users must sign up/login using email/password or OAuth (Google).
FR2	Add New Item – Scan Mode: Upon scanning a barcode/QR code with device camera, auto-populate item details via API.
FR3	Add New Item – Manual Mode: Provide a form to manually enter or edit all item attributes if scanning fails.
FR4	Public API Integration: Query relevant APIs for each category to fetch metadata:

   • Books → Open Library/Google Books  
   • LEGO → Brickset/Bricklink  
   • Funko Pops → (if API exists) or skip  
   • Diecast Cars/Hot Wheels → Scalecatalog or hobby database  
                                                                                                                                                                                       |

| FR5  | Web Scraping Fallback: If API returns no results, attempt a lightweight scrape of known public pages (e.g., Bricklink for LEGO).                                                                                                     |
| FR6  | Category Assignment: Allow users to select “Collection Type” (e.g., “Books,” “LEGO,” etc.) and subcategory (e.g., “Star Wars”).                                                                                                      |
| FR7  | Image Fetch & Upload:
• Fetch default image from API.
• Allow users to upload custom images (JPEG/PNG); store in Firebase Storage.                                                                                                             |
| FR8  | Dashboard View: Show all items in a grid/list, grouped by Category headers.                                                                                                                                                          |
| FR9  | Filtering & Sorting:
• Filter by category, subcategory, tags, year, condition, etc.
• Sort by name, date added, year, scale.                                                                                                                                                                              |
| FR10 | Search Functionality: Provide a search bar to query items by name, ID, tags, ISBN, model number.                                                                                                                                     |
| FR11 | Item Detail Page: Display complete metadata, images, notes, and actions (edit, delete, mark status).                                                                                                                                 |
| FR12 | Edit Item: Allow users to modify any field, re-scan/change barcode, update notes, add/remove tags, change status.                                                                                                                    |
| FR13 | Delete Item: Remove item from Firestore and delete associated storage objects (images).                                                                                                                                            |
| FR14 | Tagging System: Users can add custom tags to items (e.g., “Mint Condition,” “Collector’s Edition”).                                                                                                                                  |
| FR15 | Wishlist/Status Tracking (Optional): Mark items as “Owned,” “Wishlist,” “Sold,” with date timestamps.                                                                                                                               |
| FR16 | Offline Data Persistence: Enable Firestore’s offline persistence so app remains functional offline (read/write).                                                                                                                     |
| FR17 | Responsive UI: Layout adapts to desktop, tablet, and mobile screen sizes.                                                                                                                                                            |
| FR18 | User Settings:
• Profile management (display name, email).
• Theme (light/dark) toggle.                                                                                                                                            |

⸻

5. Non-Functional Requirements
	1.	Performance
	•	Initial page load under 3 seconds (with caching).
	•	Scanning and lookup < 2 seconds (API call + parsing).
	•	Dashboard list should paginate or lazy-load after 50 items.
	2.	Scalability
	•	Designed to handle up to 10,000 items per user without major performance degradation.
	•	Firestore indexes on frequently searched fields (name/title, barcode, tags).
	3.	Security
	•	Use Firebase Authentication + Firestore Security Rules to ensure each user can only access their own data.
	•	Validate image uploads (size limit ≤ 5 MB; restrict file types).
	•	Sanitize any scraped data before storing/display.
	4.	Availability
	•	Target 99.9% uptime (rely on Firebase-managed services).
	•	Graceful error handling when API is down (allow manual override).
	5.	Maintainability
	•	Code written in TypeScript with clear interfaces/types for all data models.
	•	Modular component structure (e.g., React components per feature).
	•	Documented API service layer for each category integration.
	6.	Usability
	•	Intuitive UI with clear navigation (sidebar or top menu).
	•	Tooltips or inline help for scanning, tagging, and filtering.
	•	Accessible (WCAG 2.1 Level AA) – proper contrast, keyboard navigation.
	7.	Internationalization (Optional)
	•	Support English by default; architecture allows adding other languages via translation files.

⸻

6. System Architecture

┌────────────────────────────────────────────┐
│         Frontend (TypeScript SPA)         │
│  • React (CRA or Next.js) or Vue (Vite)    │
│  • Material-UI or Tailwind (UI library)    │
│  • Redux or Context API (state management) │
│  • Barcode Scanner Library (e.g., Quagga)  │
│  • Firebase SDK (Auth, Firestore, Storage) │
└────────────────────────────────────────────┘
                    │
                    │ HTTPS (SSL/TLS)
                    │
┌──────────────────────────────────────────────┐
│            Firebase (Managed)               │
│ ┌──────────────────────────────────────────┐ │
│ │Authentication (email/password, OAuth)   │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │   Firestore (NoSQL document DB)         │ │
│ │ - Collections: Users, Items, Categories  │ │
│ │ - Indexes on search fields              │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │   Firebase Storage (Images)             │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ Cloud Functions (API integrations,      │ │
│ │ - Fetch item metadata                   │ │
│ │ - Generate image thumbnails             │ │
│ │ - Light web scraping tasks              │ │
│ └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘


⸻

7. Data Model

7.1 Firestore Collections & Documents
	1.	users (collection)
	•	 (document)
	•	displayName: string
	•	email: string
	•	createdAt: timestamp
	2.	items (collection, nested under user)
Each item document is stored under a user’s namespace: users/{userId}/items/{itemId}.
	•	Fields:
	•	name: string (auto-from API or custom)
	•	barcode: string (UPC/EAN/ISBN)
	•	category: string (e.g., “Books,” “LEGO,” “Diecast Cars,” “Funko Pops”)
	•	subCategory: string (e.g., “Star Wars LEGO,” “1:64 Scale”)
	•	manufacturer: string
	•	yearReleased: number
	•	tags: array of strings
	•	condition: string (e.g., “New,” “Used,” “Mint”)
	•	notes: string
	•	status: string (e.g., “Owned,” “Wishlist,” “Sold”)
	•	dateAdded: timestamp
	•	dateModified: timestamp
	•	imageUrls: array of strings (Firestore URLs or Storage URLs)
	•	thumbnailUrl: string (optional)
	•	metadataSource: string (“autoApi”, “scraped”, or “manual”)
	•	additionalData: map (to store any API-specific extra fields, e.g., ISBN, page count for books)
	3.	categories (optional, dynamic list)
	•	 (document)
	•	name: string (e.g., “Books”)
	•	iconUrl: string (optional)
	•	defaultTags: array[string] (e.g., for books: “Hardcover,” “Paperback”)
	4.	settings (under each user, optional)
	•	theme: string (“light”/“dark”)
	•	lastSync: timestamp
	•	preferredImageResolution: number

⸻

8. External Integrations

8.1 Barcode Scanning
	•	Library (Frontend):
	•	Use a well-supported JavaScript library that works in browser:
	•	QuaggaJS
	•	ZXing (“zebra crossing”) via a wrapper
	•	Must support common code types: EAN-13, UPC-A, ISBN, Code-128.
	•	Process:
	1.	User clicks “Scan” on the Add Item form.
	2.	Camera permission is requested; if granted, video stream activated.
	3.	Barcode library processes frames; once code detected, stop camera.
	4.	Extract code string, call relevant lookup Cloud Function.

8.2 Cloud Functions (Metadata Lookup)
	•	Books
	•	Function Name: fetchBookMetadata
	•	Input: ISBN
	•	Process: Call Open Library API:

https://openlibrary.org/api/books?bibkeys=ISBN:<isbn>&format=json&jscmd=data

or Google Books:

https://www.googleapis.com/books/v1/volumes?q=isbn:<isbn>


	•	Output:

{
  "title": "...",
  "authors": ["..."],
  "publisher": "...",
  "publishedDate": "...",
  "pageCount": ...,
  "categories": ["..."],
  "thumbnailUrl": "...",
  "description": "..."
}


	•	LEGO
	•	Function Name: fetchLegoSetMetadata
	•	Input: Set Number (obtained from barcode if encoded, or manual).
	•	Process: Call Brickset API (requires API key) or Bricklink API.
	•	Output:

{
  "name": "...",
  "setNumber": "...",
  "year": ...,
  "theme": "...",
  "pieces": ...,
  "imageUrl": "...",
  "officialUrl": "..."
}


	•	Funko Pops
	•	Function Name: fetchFunkoMetadata
	•	Input: UPC or “Pop ID”.
	•	Process: If Funko has no official API, integrate third-party site (Pop Price Guide) or use a lightweight scraping function to extract name and image.
	•	Output:

{
  "name": "...",
  "series": "...",
  "number": "...",
  "imageUrl": "...",
  "retailPrice": ...
}


	•	Diecast Cars / Hot Wheels
	•	Function Name: fetchDiecastMetadata
	•	Input: UPC (if available) or manual entry.
	•	Process: Query Scalecatalog (if they provide an open API) or fallback to scraping catalogs that list manufacturer, model, scale, year, image.
	•	Output:

{
  "manufacturer": "...",
  "modelName": "...",
  "scale": "...",
  "releaseYear": ...,
  "imageUrl": "..."
}


	•	Web Scraping Fallback
	•	Use a small headless-capable library (e.g., Cheerio for Node.js) in Cloud Functions.
	•	Limit scraping to public, non-JavaScript-heavy pages.
	•	If no data found (404 or missing elements), return an empty object, and prompt user for manual entry.

8.3 Image Processing
	•	Thumbnail Generation
	•	Trigger a Cloud Function on image upload to Firebase Storage.
	•	Use sharp (npm) to generate a 200×200 thumbnail, store in thumbnails/{itemId}.jpg.
	•	Web Image Search (Optional)
	•	If API returns no image, perform a simple Google Custom Search JSON API (paid) or fallback to Bing’s Image Search API.
	•	Limit to one result, verify license when possible.
	•	Save that URL in Firestore and optionally cache it in Storage.

⸻

9. User Interface / UX Design

9.1 Technology Choice
	•	Framework:
	•	React (TypeScript) with Create React App or Next.js (for potential server-side rendering).
	•	Or Vue 3 (TypeScript) with Vite.
	•	UI Library:
	•	Tailwind CSS for styling (utility-first approach).
	•	Or Material-UI (MUI) if prefabricated components are preferred.
	•	State Management:
	•	React Context or Redux Toolkit (TypeScript) for global state (e.g., current user, settings).
	•	React Query (or SWR) for data fetching with caching (optional, but Firestore SDK already handles real-time).
	•	Barcode Scanning: ZXing or QuaggaJS React wrapper component.
	•	Form Handling: React Hook Form (TypeScript-friendly) for validation.
	•	Search Suggestions: Firestore’s indexed queries (e.g., where('name', '>=', query).where('name', '<=', query + '\uf8ff')) or integrate Algolia for fuzzy search.
	•	Image Preview: Use the native <img> tag with lazy loading (loading="lazy").

9.2 Wireframes / Screens
	1.	Login / Sign Up Screen
	•	Email/Password fields, “Sign in with Google” button.
	•	Link to “Forgot Password.”
	2.	Dashboard (Home Page)
	•	Top navigation bar:
	•	Logo/Brand (“Collections Manager”)
	•	Search bar (global search)
	•	User menu (profile, sign out)
	•	Sidebar or horizontal tabs for categories: “All,” “Books,” “LEGO,” “Diecast,” “Funko,” etc.
	•	Main content: Grid of item cards. Each card shows thumbnail, name/model, category tag, and status badge (e.g., Owned/Wishlist).
	•	“+ Add Item” floating action button (FAB) at bottom-right.
	3.	Add Item Modal / Page
	•	Step 1: Choose input method: “Scan Barcode” or “Manual Entry.”
	•	Scan Barcode View: Live camera preview with bounding box. On successful scan, show a “Fetching details…” spinner.
	•	Manual Entry View: Form fields:
	•	Category (dropdown) → dynamically loads subcategories.
	•	Name/Title (text).
	•	Barcode/ID (text).
	•	Manufacturer (text).
	•	Year Released (number).
	•	Tags (multi-select chips).
	•	Condition (dropdown).
	•	Notes (textarea).
	•	Image Upload (file input, drag & drop).
	•	Auto-populate: After scanning, prefill as many fields as possible. Highlight fields that failed to auto-populate in red/italic so user can fill them.
	4.	Item Details Page
	•	Header: Item name + category badges + status label.
	•	Image Carousel (if multiple images).
	•	Metadata table:
	•	Barcode, Category, Subcategory, Manufacturer, Year, Tags, Condition, Added on, Last Modified.
	•	“Edit” button (pencil icon) and “Delete” (trash icon).
	•	Notes section at the bottom with an “Edit Notes” button.
	•	“Mark as Sold” or “Move to Wishlist” action (button).
	5.	Search / Filters Panel
	•	When user clicks search bar:
	•	Auto-suggest item names as typed (typeahead).
	•	If user presses “Filters” icon, side panel slides out with checkboxes/dropdowns for category, year range slider, tags, condition, status.
	6.	Settings Page
	•	User Profile: Display name (editable), email (non-editable), change password.
	•	App Preferences: Light/Dark mode toggle, Items per page (pagination size), default image resolution (High/Medium/Low).
	•	Data Export: “Export my collection to CSV” button.
	7.	Responsive Behavior
	•	On mobile, collapse sidebar into a hamburger menu.
	•	Dashboard cards adjust to one or two columns depending on width.
	•	Scanning view must allow full-screen camera preview.

⸻

10. Technical Details

10.1 Frontend
	•	Language: TypeScript
	•	Framework: React 18 (with Hooks) or Vue 3 Composition API
	•	Routing: React Router (if CRA) or Next.js Pages/Router
	•	Styling: Tailwind CSS v3 for utility-first styling, with optionally Headless UI for accessible components.
	•	State Management:
	•	React Context for user & app settings.
	•	React Query for Firestore queries (caching, real-time updates).
	•	Barcode Scanning: ZXing or QuaggaJS React wrapper component.
	•	Form Handling: React Hook Form (TypeScript-friendly) for validation.
	•	Search Suggestions: Firestore’s indexed queries (e.g.,

where('name', '>=', query)
  .where('name', '<=', query + '\uf8ff')

) or integrate Algolia for fuzzy search.

	•	Image Preview: Use the native <img> tag with loading="lazy".

10.2 Backend (Firebase)
	•	Authentication:
	•	Firebase Auth with Email/Password and Google Sign-In providers.
	•	Enforce email verification.
	•	Database:
	•	Firestore: Document-based structure under users/{userId}/items/{itemId}.
	•	Use composite indexes for search fields: [ name, category ], [ barcode ], [ tags[] ].
	•	Storage:
	•	Bucket:

gs://<project-id>.appspot.com/items/{userId}/{itemId}/{imageFilename}


	•	Enable public read only for thumbnails (or serve via Firebase Storage security rules requiring auth).

	•	Cloud Functions:
	•	Node.js (TypeScript) functions deployed to Firebase Functions region closest to primary user base (e.g., asia-south1).
	•	fetchBookMetadata: HTTP trigger, callable from frontend.
	•	fetchLegoSetMetadata: HTTP trigger (requires Brickset API key, stored in Environment Config).
	•	fetchDiecastMetadata: HTTP trigger (public or custom hobby API key).
	•	imageThumbnailGenerator: Storage trigger; on image upload, generate thumbnail.
	•	Firestore Security Rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Ensure only authenticated users can read/write their own data
    match /users/{userId}/items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}


	•	Storage Rules:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /items/{userId}/{itemId}/{imageFile} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && validImage(request.resource);
    }
  }
}

function validImage(resource) {
  return resource.contentType.matches('image/.*')
         && resource.size < 5 * 1024 * 1024;
}


	•	Third-Party API Keys:
	•	Store any API keys (Brickset, Google Books) in Firebase Functions environment variables (never in frontend code).
	•	Restrict usage via API key restrictions on provider side.
	•	Privacy Considerations:
	•	No usage of personal user data outside authentication.
	•	Inform users about what metadata is fetched and how images are stored.

⸻

11. Detailed Functional Flow

11.1 User Authentication Flow
	1.	Sign-Up
	•	User clicks “Sign Up.”
	•	Enters email + password.
	•	Email verification link sent.
	•	Upon verification, user logs in.
	2.	Login
	•	Email/password form or “Sign in with Google.”
	•	On success, redirect to Dashboard.
	3.	Session Persistence
	•	Firebase Auth persists session across browser reloads.

⸻

11.2 Adding a New Item (Scan-Based)
	1.	User clicks “+ Add Item → Scan Barcode.”
	2.	App opens camera feed and activates ZXing/Quagga scanning.
	3.	Once barcode recognized (e.g., “9780143127741”), app stops camera and displays “Fetching metadata…”
	4.	Frontend calls:

const fetchBook = firebase.functions().httpsCallable('fetchBookMetadata');
fetchBook({ isbn: '9780143127741' });


	5.	Cloud Function queries Open Library / Google Books:
	•	Parses JSON response; extracts Title, Author(s), Publisher, PublishedDate, Thumbnail.
	6.	Cloud Function returns parsed metadata to frontend.
	7.	Frontend pre-populates form:
	•	name = "Sapiens: A Brief History of Humankind"
	•	author = "Yuval Noah Harari"
	•	year = 2015
	•	thumbnailUrl = "https://covers.openlibrary.org/b/id/123456-L.jpg"
	8.	User verifies/corrects any missing fields; selects “Books” as category; optionally change subcategory (e.g., “History”).
	9.	User clicks “Save”; frontend writes a new document under

users/{userId}/items/{generatedId}

with all fields.

	10.	If thumbnailUrl provided:
	•	Optionally download & upload to Firebase Storage (or store external URL).
	•	Trigger thumbnail generation Function if needed.

⸻

11.3 Adding a New Item (Manual)
	1.	User clicks “+ Add Item → Manual Entry.”
	2.	Form fields appear blank.
	3.	User enters Category, Name, Barcode (optional), Manufacturer, Year, Condition, Tags, Notes.
	4.	User can optionally drag & drop an image.
	5.	On “Save,” frontend:
	•	If image uploaded: upload file to Firebase Storage, get download URL.
	•	Write item document in Firestore with provided values.

⸻

11.4 Editing an Item
	1.	From Dashboard, user clicks an item card → navigates to Item Details Page.
	2.	Click “Edit;” form fields become editable (pre-filled with current data).
	3.	User updates any field, or removes/replaces image.
	4.	On “Save Changes,” update Firestore document and Storage as needed; update dateModified.

⸻

11.5 Browsing & Searching
	1.	On Dashboard, by default “All Categories” selected.
	2.	Clicking a category in sidebar filters the list:

firestore
  .collection('users')
  .doc(userId)
  .collection('items')
  .where('category', '==', 'Books')


	3.	Typing in the Search Bar:
	•	If length ≥ 2 characters, Firestore query:

firestore
  .collection('users')
  .doc(userId)
  .collection('items')
  .where('name', '>=', query)
  .where('name', '<=', query + '\uf8ff')


	•	Show real-time suggestions in dropdown.

	4.	Clicking a suggested item navigates to its details.

⸻

12. Security & Privacy
	•	Authentication:
	•	Firebase Auth ensures secure user sign-in.
	•	Enforce email verification and strong password policies.
	•	Data Access Rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Ensure only authenticated users can read/write their own data
    match /users/{userId}/items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}


	•	Storage Rules:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /items/{userId}/{itemId}/{imageFile} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && validImage(request.resource);
    }
  }
}

function validImage(resource) {
  return resource.contentType.matches('image/.*')
         && resource.size < 5 * 1024 * 1024;
}


	•	Third-Party API Keys:
	•	Store any API keys (Brickset, Google Books) in Firebase Functions environment variables (never in frontend code).
	•	Restrict usage via API key restrictions on provider side.
	•	Privacy Considerations:
	•	No usage of personal user data outside authentication.
	•	Inform users about what metadata is fetched and how images are stored.

⸻

13. Non-Functional Considerations
	1.	Logging & Error Monitoring
	•	Use Firebase Crashlytics (for React Native wrapper in future) or Sentry for JavaScript errors.
	•	Cloud Functions: log all failed API calls or exceptions to Stackdriver Logging.
	2.	Testing Strategy
	•	Unit Tests (Frontend): Jest + React Testing Library for core components (Add Item form, Search bar).
	•	Integration Tests: Cypress (End-to-End) for flows: signup/login, add item (scan/manual), search, edit, delete.
	•	Backend Tests: Cloud Functions unit tests (Mocha/Chai) mocking external API responses.
	3.	Continuous Integration / Deployment
	•	GitHub (or GitLab) Actions pipeline:
	•	On push to main: run linter (ESLint), run Jest tests, build app.
	•	On merge to production branch: deploy frontend to Firebase Hosting and Functions to Firebase.
	•	Feature Branch Workflow: Every new feature branch must include updated tests before merge.
	4.	Internationalization & Localization (Future)
	•	Use a library like i18next (React) with JSON translation files.
	•	Ensure date formats adapt based on user locale.
	5.	Accessibility
	•	All forms and buttons must have ARIA labels.
	•	Keyboard navigation: Focus order should be logical.
	•	Contrast ratio ≥ 4.5:1 for text.

⸻

14. Project Phases & Milestones

Phase	Duration	Deliverables
Phase 1	2 weeks	- Project kickoff, tech stack setup (Firebase project, CI/CD)

         - Basic authentication flows implemented  
         - Skeleton UI with navigation and placeholders for Dashboard, Add Item, Item Details                                                                                                               |

| Phase 2 | 3 weeks  | - Firestore data model defined; basic CRUD flows (manual entry)
- Item listing on Dashboard with category grouping
- Search bar implementation with Firestore queries                                                                                                                                                |
| Phase 3 | 2 weeks  | - Barcode scanning integration (ZXing/Quagga)
- Cloud Function for Books API lookup
- Auto-populate form fields for scanned books                                                                                                                                                |
| Phase 4 | 3 weeks  | - Integrations for LEGO (Brickset API) and Diecast (if API exists)
- Image upload flow with Firebase Storage + thumbnail generation
- Item Details page fully functional (view, edit, delete)                                                                                                                                    |
| Phase 5 | 2 weeks  | - Advanced filtering & sorting (tags, year, condition)
- Offline persistence (Firestore offline)
- Responsive design polish for mobile/tablet/desktop                                                                                                                                            |
| Phase 6 | 2 weeks  | - Testing (unit, integration, E2E)
- Documentation (README, code comments, API docs)
- Performance optimizations, Firestore indexes, security rules audit                                                                                                                            |
| Phase 7 | 1 week   | - Final bug fixes
- Deployment to production
- Post-deployment verification and handoff                                                                                                                                                        |

⸻

15. Additional Recommendations
	1.	Tag & Category Management
	•	Allow users to define custom categories (e.g., “Hot Wheels Retro Series”) for greater flexibility.
	•	Provide default category templates but let advanced users tweak them.
	2.	User Onboarding & Tutorial
	•	A quick “Getting Started” modal or guided tour (e.g., Intro.js) that shows how to scan, add, and search items.
	3.	Data Export / Import
	•	CSV export of entire collection (fields + image URLs).
	•	CSV import template so bulk upload is possible (for users migrating from spreadsheets).
	4.	Push Notifications (Future)
	•	Notify users when a new market price is available for high-value items.
	•	Remind users about items in “Wishlist” after a configurable period.
	5.	Third-Party Social Sharing (Optional)
	•	Allow users to share a “Wishlist” or “Recently Added” collection on social media (generate shareable link).
	6.	Monetization Strategy (If applicable)
	•	Freemium tier: up to 200 items free; premium subscription unlocks unlimited items, advanced filtering, automated price tracking.

⸻

16. Acceptance Criteria
	•	A user can successfully sign up and log in, and data is isolated per user.
	•	A user can add items manually and view them in the Dashboard.
	•	A user can scan a barcode for a book or known item and have fields auto-populated correctly.
	•	Images are fetched automatically (when available) or uploaded manually; thumbnails are generated.
	•	The Dashboard displays all items grouped by category, and the user can filter/sort effectively.
	•	Search queries return relevant items in under 500 ms for typical collections (≤ 1,000 items).
	•	Offline mode allows reading and adding items; changes sync on reconnect.
	•	Security rules prevent unauthorized data access (e.g., user A cannot see user B’s items).
	•	UI is responsive across desktop, tablet, and mobile widths.

⸻

17. Glossary of Terms
	•	Firestore: Firebase’s NoSQL document database, storing JSON-like documents in collections.
	•	Cloud Functions: Serverless backend functions running Node.js (TypeScript) for API calls or data processing.
	•	Barcode (UPC/EAN/ISBN): Standardized codes printed on product packaging; used to uniquely identify items.
	•	Thumbnail: A small, lower-resolution copy of an image used for quick display in lists.
	•	Real-time Updates: Firestore’s snapshot listeners automatically push changes to connected clients.
	•	Token: Temporary authentication credential (Firebase Auth) to authorize access to Firestore and Storage.
	•	RXJS (Optional): Reactive programming library (if using Angular instead of React/Vue).

⸻

18. Dependencies and External Libraries
	1.	Firebase SDKs
	•	firebase/auth
	•	firebase/firestore
	•	firebase/storage
	•	firebase/functions
	2.	Barcode Scanning
	•	@zxing/library (ZXing) OR quagga (QuaggaJS)
	3.	UI Framework
	•	React
	•	react, react-dom, react-router-dom, react-hook-form, react-query
	•	tailwindcss, @headlessui/react (optional)
	•	OR Vue
	•	vue, vue-router, vuex or pinia, vite
	•	tailwindcss, @headlessui/vue (optional)
	4.	Cloud Function Dependencies
	•	node-fetch (for HTTP requests)
	•	cheerio (for lightweight scraping)
	•	sharp (for image resizing)
	5.	Testing
	•	Unit: jest, @testing-library/react
	•	E2E: cypress
	6.	Linting & Formatting
	•	eslint (TypeScript rules)
	•	prettier

⸻

19. Risks & Mitigations

Risk	Mitigation
API Rate Limits / Downtime	- Cache API responses for 24 hours when possible.

                                                                       - Implement fallback to manual entry if API call fails.  
                                                                       - Monitor usage and consider upgrading to paid tiers if rate limits reached.                                                                                                           |

| Inconsistent Data Across External Sources                           | - Allow user to edit any auto-populated field before saving.
- Log anomalies in Cloud Function logs for future tuning.                                                                                                                                      |
| Scalability Concerns with Large Collections                         | - Use Firestore indexes on frequently queried fields.
- Implement pagination or infinite scroll after a limit (e.g., show 50 items at a time).                                                                                                                                            |
| Cross-Platform Camera/API Compatibility                             | - Thoroughly test scanning flow on major browsers (Chrome, Safari, Firefox) and OS (iOS/Android).
- Provide a fallback “Enter Barcode Manually” option if camera access is denied.                                                                                                                       |
| Security Vulnerabilities in Scraping Functions                       | - Whitelist only a small set of target domains for scraping.
- Sanitize all scraped HTML inputs.                                                                                                                                                              |
| Poor Image Quality / Missing Images                                  | - If no image is found, allow user to upload a custom image.
- Display a generic “No Image Available” placeholder.                                                                                                                                            |

⸻

20. Conclusion

The Hobby Collections Manager will provide collectors a modern, intuitive platform to catalog and manage diverse collections—ranging from diecast cars and Hot Wheels to LEGO sets, Funko Pops, and books—without tedious manual entry. By leveraging barcode scanning, public APIs, and Firebase’s suite of backend services, users can quickly add items, keep track of details, and browse their collections in real-time across all devices. This requirements document should serve as a foundation to guide design, implementation, testing, and deployment, ensuring a scalable, maintainable, and secure solution.