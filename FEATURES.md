# SnackIt - Feature Documentation

## 📖 Detailed Feature Guide

### 1. Authentication System

#### Login Screen (`app/(auth)/login.tsx`)
- **Email/Password Login**: Traditional authentication
- **Google Sign-In**: OAuth integration (requires setup)
- **Error Handling**: User-friendly error messages
- **Navigation**: Auto-redirect to main app after successful login

#### Signup Screen (`app/(auth)/signup.tsx`)
- **Account Creation**: Email + password with validation
- **Password Strength**: Minimum 6 characters
- **Email Verification**: Supabase sends confirmation email
- **Success Handling**: Redirect to login with success message

#### Auth Context (`contexts/AuthContext.tsx`)
- **Session Management**: Automatic session persistence
- **Auth State Listener**: Real-time auth state updates
- **Protected Routes**: Automatic redirect based on auth status
- **Sign Out**: Clean session termination

---

### 2. User Profile & Preferences

#### Profile Screen (`app/(tabs)/profile.tsx`)

**Dietary Preferences:**
- **Diet Types**: Vegetarian, Vegan, Non-Veg, Pescatarian, Any
- **Allergies Tracking**: Add/remove allergies with tags
- **Dislikes**: Track foods you don't like
- **Cuisine Preferences**: Select favorite cuisines

**Profile Data:**
- Full name
- Email (from auth)
- Avatar (future feature)
- All preferences saved to Supabase

**Actions:**
- Save profile button
- Sign out functionality

---

### 3. Grocery Management

#### Groceries Screen (`app/(tabs)/groceries.tsx`)

**Add Grocery Items:**
- Item name (text input)
- Category selection (vegetables, fruits, grains, dairy, meat, seafood, spices, condiments, beverages, other)
- Quantity (numeric)
- Unit selection (piece, kg, g, l, ml, cup, tbsp, tsp, oz)
- Expiry date (optional with date picker)

**Display Features:**
- Grouped by category
- Category icons for visual organization
- Expiry warnings (expiring soon in orange, expired in red)
- Item count per category

**Actions:**
- Edit existing items
- Delete items
- Floating action button for quick add

**Smart Features:**
- Expiry date tracking
- Visual indicators for expiring/expired items
- Category-based organization

---

### 4. Recipe Discovery

#### Recipes Screen (`app/(tabs)/recipes.tsx`)

**Recipe Matching:**
- **Smart Matching**: Compares your groceries with recipe ingredients
- **Match Percentage**: Shows how many ingredients you have (color-coded)
  - 70%+ = Green (excellent match)
  - 40-69% = Orange (good match)
  - <40% = Red (needs shopping)
- **Sorting**: Recipes automatically sorted by match score

**Search & Filters:**
- **Text Search**: Search by recipe title or description
- **Cuisine Filter**: Indian, Italian, Chinese, Mexican, Thai, Japanese, Mediterranean, American
- **Cooking Time**: Quick (<30 min), Medium (30-60 min), Long (>60 min)
- **Difficulty**: Easy, Medium, Hard
- **Active Filter Count**: Badge showing number of active filters

**Recipe Cards Display:**
- Recipe image (or placeholder)
- Title and description
- Match percentage badge
- Quick info: cooking time, difficulty, cuisine, servings
- Tap to view full details

---

### 5. Recipe Details

#### Recipe Detail Screen (`app/recipe/[id].tsx`)

**Header:**
- Full-screen recipe image
- Back button
- Share button (social sharing)
- Favorite toggle (heart icon)

**Recipe Information:**
- Title and description
- Quick info badges:
  - Cooking time
  - Difficulty level
  - Servings
  - Cuisine type

**Nutrition Information:**
- Calories per serving
- Protein, Carbs, Fat breakdown
- Optional: Fiber and other nutrients

**Tabs:**

1. **Ingredients Tab:**
   - Complete ingredient list
   - Quantity and unit for each
   - Optional ingredients marked
   - Bullet point format

2. **Instructions Tab:**
   - Step-by-step numbered instructions
   - Optional duration per step
   - Optional images per step
   - Clear, easy-to-follow format

**Actions:**
- Toggle favorite status
- Share recipe
- Navigate back

---

### 6. Meal Planning

#### Meal Plan Screen (`app/(tabs)/meal-plan.tsx`)

**Weekly View:**
- 7-day calendar view
- Current day highlighted
- Week navigation (previous/next)
- Date range display

**Meal Slots:**
- Breakfast, Lunch, Dinner, Snack
- Grid layout with days as columns
- Each slot shows:
  - Recipe title (if assigned)
  - Cooking time
  - Or "+" button to add

**Features:**
- Assign recipes to meal slots
- View planned meals at a glance
- Generate shopping list from week's meals
- Navigate weeks forward/backward

**Shopping List Generation:**
- Aggregates ingredients from all planned meals
- Combines quantities of duplicate ingredients
- One-click export to shopping list

---

### 7. Home Dashboard

#### Home Screen (`app/(tabs)/index.tsx`)

**Quick Actions Grid:**
1. **Add Groceries**: Direct link to grocery input
2. **Find Recipes**: Jump to recipe discovery
3. **Scan Barcode**: Open barcode scanner
4. **Meal Planner**: Access meal planning

**Sections:**
- Welcome message
- Recent Activity (placeholder for future)
- Suggested Recipes (based on groceries)
- Pro Tips section

**Pull to Refresh:**
- Refresh all dashboard data

---

### 8. Barcode Scanner

#### Barcode Scanner Screen (`app/barcode-scanner.tsx`)

**Camera Features:**
- Full-screen camera view
- Scanning frame guide
- Corner markers for alignment
- Camera permission handling

**Supported Formats:**
- EAN-13, EAN-8
- UPC-A, UPC-E
- QR codes
- Code 128, Code 39

**Scan Actions:**
- Auto-detect barcode
- Display product info (future: integrate product database)
- Add to groceries automatically
- Scan again option

---

## 🎯 Smart Features

### Ingredient Matching Algorithm

The app uses a smart matching system:

1. **Exact Match**: Direct ingredient name match
2. **Partial Match**: Substring matching (e.g., "tomato" matches "cherry tomatoes")
3. **Score Calculation**: `(matched ingredients / total ingredients) * 100`
4. **Sorting**: Recipes sorted by match score (highest first)

### Expiry Management

- **3-day warning**: Items expiring within 3 days show orange
- **Expired items**: Items past expiry show red
- **Visual indicators**: Calendar icon with color coding

### Data Persistence

- **Supabase Real-time**: All data syncs across devices
- **Row Level Security**: Users only see their own data
- **Automatic Timestamps**: created_at and updated_at managed automatically

---

## 🔒 Security Features

### Row Level Security (RLS)

All tables have RLS policies:
- Users can only access their own data
- Recipes are publicly readable but only editable by creator
- Automatic user_id enforcement

### Authentication Security

- Secure session management
- Token-based authentication
- Automatic session refresh
- Secure logout

---

## 📊 Database Schema

See `database/schema.sql` for complete schema including:
- All tables with relationships
- RLS policies
- Indexes for performance
- Trigger functions
- Sample data

---

## 🚀 Performance Optimizations

1. **Database Indexes**: All foreign keys and frequently queried fields
2. **Lazy Loading**: Components load data on demand
3. **Caching**: Auth state cached locally
4. **Optimistic Updates**: UI updates immediately before server confirms

---

## 🎨 UI/UX Features

- **NativeWind**: TailwindCSS for consistent styling
- **Color Coding**: Green theme throughout
- **Icons**: Ionicons for all UI elements
- **Animations**: Smooth transitions and modals
- **Responsive**: Works on all screen sizes
- **Accessibility**: Semantic HTML and proper labels

---

This documentation covers all major features implemented in SnackIt!
