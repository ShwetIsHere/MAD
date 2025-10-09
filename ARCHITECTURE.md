# SnackIt Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      MOBILE APP LAYER                        │
│                    (React Native + Expo)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Auth     │  │    Tabs     │  │   Recipe    │        │
│  │   Screens   │  │   Screens   │  │   Details   │        │
│  │             │  │             │  │             │        │
│  │  • Login    │  │  • Home     │  │  • Full     │        │
│  │  • Signup   │  │  • Grocery  │  │    Recipe   │        │
│  │             │  │  • Recipes  │  │  • Ingred.  │        │
│  │             │  │  • Meal     │  │  • Steps    │        │
│  │             │  │  • Profile  │  │  • Share    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           CONTEXT & STATE MANAGEMENT                  │  │
│  │  • AuthContext (User session, login, logout)         │  │
│  │  • React Hooks (useState, useEffect, useContext)     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              UTILITY LAYER                            │  │
│  │  • Supabase Client                                    │  │
│  │  • API Helpers (ready for integration)               │  │
│  │  • Type Definitions                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└───────────────────────────┬───────────────────────────────┘
                            │
                            │ HTTPS/WSS
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                             │
│                  (Supabase Platform)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  Authentication │  │   PostgreSQL    │                  │
│  │                 │  │    Database     │                  │
│  │  • Email/Pass   │  │                 │                  │
│  │  • OAuth        │  │  • profiles     │                  │
│  │  • Sessions     │  │  • groceries    │                  │
│  │  • JWT Tokens   │  │  • recipes      │                  │
│  │                 │  │  • favorites    │                  │
│  └─────────────────┘  │  • meal_plans   │                  │
│                        │  • shopping     │                  │
│  ┌─────────────────┐  └─────────────────┘                  │
│  │   Row Level     │                                        │
│  │    Security     │  ┌─────────────────┐                  │
│  │                 │  │   Real-time     │                  │
│  │  • User Isolation│  │  Subscriptions  │                  │
│  │  • Data Privacy │  │                 │                  │
│  │  • Access Rules │  │  • Live Updates │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### User Authentication Flow
```
┌─────────┐        ┌─────────┐        ┌──────────┐
│  User   │───────▶│  Login  │───────▶│ Supabase │
│         │        │ Screen  │        │   Auth   │
└─────────┘        └─────────┘        └──────────┘
     ▲                                      │
     │                                      │
     │              ┌──────────┐            │
     └──────────────│   Auth   │◀───────────┘
                    │ Context  │
                    └──────────┘
                         │
                         ▼
                  ┌────────────┐
                  │    Tabs    │
                  │  Screens   │
                  └────────────┘
```

### Recipe Matching Flow
```
┌──────────┐     ┌───────────┐     ┌──────────────┐
│   User   │────▶│ Groceries │────▶│  Algorithm   │
│  Added   │     │  Screen   │     │              │
│ Grocery  │     └───────────┘     │ • Get Items  │
└──────────┘                        │ • Match      │
                                    │ • Calculate  │
                                    │ • Sort       │
                                    └──────────────┘
                                           │
                                           ▼
┌──────────┐     ┌───────────┐     ┌──────────────┐
│   User   │◀────│  Recipes  │◀────│   Filtered   │
│   Sees   │     │  Screen   │     │   & Sorted   │
│ Matched  │     └───────────┘     │   Recipes    │
└──────────┘                        └──────────────┘
```

### Meal Planning Flow
```
┌──────────┐     ┌───────────┐     ┌──────────────┐
│   User   │────▶│ Meal Plan │────▶│  Save to DB  │
│ Assigns  │     │  Screen   │     └──────────────┘
│  Recipe  │     └───────────┘
└──────────┘           │
                       │
                       ▼
              ┌─────────────────┐
              │ Generate List   │
              │                 │
              │ 1. Get Recipes  │
              │ 2. Get Ingred.  │
              │ 3. Aggregate    │
              │ 4. Save List    │
              └─────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Shopping List  │
              └─────────────────┘
```

---

## 📊 Database Schema Relationships

```
┌────────────────┐
│    profiles    │
│                │
│ • id (PK)      │─────┐
│ • email        │     │
│ • full_name    │     │
│ • dietary_pref │     │
└────────────────┘     │
                       │ user_id (FK)
                       │
         ┌─────────────┼─────────────┬─────────────────┐
         │             │             │                 │
         ▼             ▼             ▼                 ▼
┌────────────┐  ┌────────────┐  ┌──────────┐  ┌──────────────┐
│ groceries  │  │meal_plans  │  │favorites │  │shopping_list │
│            │  │            │  │          │  │              │
│• id (PK)   │  │• id (PK)   │  │• id (PK) │  │• id (PK)     │
│• user_id   │  │• user_id   │  │• user_id │  │• user_id     │
│• name      │  │• recipe_id─┼──┤• recipe  │  │• name        │
│• category  │  │• date      │  │  _id     │  │• quantity    │
│• quantity  │  │• meal_type │  └──────────┘  └──────────────┘
│• expiry    │  └────────────┘       │
└────────────┘                       │
                                     │
                              ┌──────┴──────┐
                              │             │
                       ┌──────────────┐     │
                       │   recipes    │◀────┘
                       │              │
                       │ • id (PK)    │
                       │ • title      │
                       │ • cuisine    │
                       │ • difficulty │
                       │ • ingredients│
                       │ • instructions│
                       └──────────────┘
```

---

## 🎯 Component Hierarchy

```
App Root (_layout.tsx)
│
├── AuthProvider (Context)
│   │
│   ├── Authentication Required?
│   │   │
│   │   ├── YES: (auth) Group
│   │   │   ├── Login Screen
│   │   │   └── Signup Screen
│   │   │
│   │   └── NO: (tabs) Group
│   │       │
│   │       ├── Tab Navigator
│   │       │   ├── Home Tab (index)
│   │       │   │   ├── QuickActions
│   │       │   │   ├── RecentActivity
│   │       │   │   └── SuggestedRecipes
│   │       │   │
│   │       │   ├── Groceries Tab
│   │       │   │   ├── GroceryList
│   │       │   │   │   └── GroceryItem
│   │       │   │   └── AddGroceryModal
│   │       │   │
│   │       │   ├── Recipes Tab
│   │       │   │   ├── SearchBar
│   │       │   │   ├── FilterButton
│   │       │   │   ├── RecipeList
│   │       │   │   │   └── RecipeCard
│   │       │   │   └── FilterModal
│   │       │   │
│   │       │   ├── Meal Plan Tab
│   │       │   │   ├── WeekNavigator
│   │       │   │   ├── MealGrid
│   │       │   │   │   └── MealSlot
│   │       │   │   └── ShoppingListButton
│   │       │   │
│   │       │   └── Profile Tab
│   │       │       ├── ProfileHeader
│   │       │       ├── DietTypeSelector
│   │       │       ├── AllergyManager
│   │       │       ├── DislikeManager
│   │       │       └── CuisineSelector
│   │       │
│   │       └── Recipe Detail (/recipe/[id])
│   │           ├── RecipeHeader
│   │           ├── QuickInfo
│   │           ├── NutritionInfo
│   │           ├── TabSelector
│   │           ├── IngredientsTab
│   │           └── InstructionsTab
│   │
│   └── Other Screens
│       ├── Barcode Scanner
│       └── Entry Point (index)
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client Layer                       │
│                                                       │
│  • JWT Token Storage (AsyncStorage)                 │
│  • Secure HTTPS Connections                         │
│  • Environment Variables (.env)                     │
│  • Input Validation                                 │
└───────────────────────┬─────────────────────────────┘
                        │
                        │ Encrypted
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              Supabase Auth Layer                     │
│                                                       │
│  • JWT Token Verification                           │
│  • Session Management                               │
│  • Password Hashing (bcrypt)                        │
│  • OAuth Integration                                │
└───────────────────────┬─────────────────────────────┘
                        │
                        │ Authenticated
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│           Row Level Security (RLS)                   │
│                                                       │
│  SELECT: WHERE user_id = auth.uid()                 │
│  INSERT: CHECK user_id = auth.uid()                 │
│  UPDATE: WHERE user_id = auth.uid()                 │
│  DELETE: WHERE user_id = auth.uid()                 │
└───────────────────────┬─────────────────────────────┘
                        │
                        │ Authorized
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                 Database Layer                       │
│                                                       │
│  • User Data Isolation                              │
│  • Encrypted at Rest                                │
│  • Automatic Backups                                │
└─────────────────────────────────────────────────────┘
```

---

## 📱 Navigation Structure

```
                    App Start
                        │
                        ▼
                  [AuthContext]
                        │
              ┌─────────┴─────────┐
              │                   │
         Not Logged In       Logged In
              │                   │
              ▼                   ▼
        ┌──────────┐      ┌─────────────┐
        │  (auth)  │      │   (tabs)    │
        └──────────┘      └─────────────┘
              │                   │
      ┌───────┴───────┐   ┌──────┼──────┬──────┬────────┐
      │               │   │      │      │      │        │
   Login          Signup Home  Groc.  Rec. MealPl  Prof.
      │               │   │      │      │      │        │
      └───────┬───────┘   │      │      ▼      │        │
              │           │      │  [recipe]   │        │
              │           │      │    :id      │        │
              ▼           │      │             │        │
          [Success]       │      └──[scanner]──┘        │
              │           │                             │
              └───────────┴─────────────────────────────┘
                          │
                      Protected
                       Routes
```

---

## 🚀 Performance Optimizations

```
┌─────────────────────────────────────────────────┐
│            Client-Side Optimizations             │
│                                                   │
│  • React.memo() for expensive components         │
│  • useMemo() for complex calculations            │
│  • useCallback() for function memoization        │
│  • Lazy loading for images                       │
│  • Virtualized lists for long lists              │
│  • Debouncing for search                         │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│           Database Optimizations                 │
│                                                   │
│  • Indexes on foreign keys                       │
│  • Indexes on frequently queried columns         │
│  • Efficient query patterns                      │
│  • Connection pooling                            │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            Network Optimizations                 │
│                                                   │
│  • Batch API requests                            │
│  • Caching strategies                            │
│  • Optimistic UI updates                         │
│  • Real-time subscriptions                       │
└─────────────────────────────────────────────────┘
```

---

## 🔄 State Management Flow

```
┌──────────────┐
│  Component   │
│   Renders    │
└──────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│   useState   │────▶│   useEffect  │
│   (Local)    │     │  (Side Fx)   │
└──────────────┘     └──────────────┘
       │                     │
       │                     ▼
       │             ┌──────────────┐
       │             │  API Call    │
       │             │  (Supabase)  │
       │             └──────────────┘
       │                     │
       ▼                     ▼
┌──────────────┐     ┌──────────────┐
│ useContext   │◀────│    Update    │
│  (Global)    │     │    State     │
└──────────────┘     └──────────────┘
       │
       ▼
┌──────────────┐
│   Re-render  │
│  Components  │
└──────────────┘
```

---

This architecture provides:
- ✅ **Scalability**: Easy to add features
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Security**: Multiple layers of protection
- ✅ **Performance**: Optimized at every layer
- ✅ **User Experience**: Fast and responsive
