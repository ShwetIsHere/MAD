# ✅ Quick Start Checklist

Follow this checklist to get your SnackIt app running in 15 minutes!

---

## Prerequisites
- [ ] Node.js installed (v16+)
- [ ] npm or yarn installed
- [ ] Expo Go app on your phone (or emulator)

---

## Setup Steps

### 1. Dependencies (2 min)
```bash
cd "f:\MAD native\SnackIt"
npm install
```
- [ ] Dependencies installed successfully
- [ ] No error messages

### 2. Supabase Setup (5 min)

#### Create Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign up / Login
- [ ] Click "New Project"
- [ ] Choose organization
- [ ] Name: "SnackIt" (or your choice)
- [ ] Database Password: (save this!)
- [ ] Region: Choose closest to you
- [ ] Click "Create new project"
- [ ] Wait for project to be ready (~2 min)

#### Run Database Schema
- [ ] In Supabase dashboard, click "SQL Editor" (left sidebar)
- [ ] Click "New Query"
- [ ] Open `database/schema.sql` in your code editor
- [ ] Copy ALL content
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run" button
- [ ] Verify: "Success. No rows returned" message

#### Get API Keys
- [ ] Click "Settings" (gear icon, bottom left)
- [ ] Click "API" in settings menu
- [ ] Copy "Project URL"
- [ ] Copy "anon public" key

### 3. Environment Variables (1 min)
- [ ] In your project root, create `.env` file
- [ ] Copy content from `.env.example`
- [ ] Replace with your actual values:
```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
```
- [ ] Save the file

### 4. Start Development Server (1 min)
```bash
npm start
```
- [ ] QR code appears
- [ ] No error messages
- [ ] Metro bundler running

### 5. Run on Device (1 min)
- [ ] Open Expo Go app on your phone
- [ ] Scan QR code
- [ ] Wait for app to load
- [ ] App opens successfully!

---

## First Time Testing (5 min)

### Test Authentication
- [ ] See login screen
- [ ] Click "Sign Up"
- [ ] Enter email and password
- [ ] Click "Sign Up" button
- [ ] See success message
- [ ] Check email for verification (optional)
- [ ] Go back to login
- [ ] Login with same credentials
- [ ] Successfully logged in!

### Test Profile
- [ ] Navigate to "Profile" tab
- [ ] Enter your name
- [ ] Select diet type (e.g., Vegetarian)
- [ ] Add an allergy (e.g., "Peanuts")
- [ ] Add a dislike (e.g., "Cilantro")
- [ ] Select preferred cuisines (e.g., Italian, Indian)
- [ ] Click "Save Profile"
- [ ] See success message

### Test Groceries
- [ ] Navigate to "Groceries" tab
- [ ] Click the "+" floating button
- [ ] Enter item name: "Tomatoes"
- [ ] Select category: "vegetables"
- [ ] Enter quantity: "5"
- [ ] Select unit: "piece"
- [ ] (Optional) Select expiry date
- [ ] Click "Add Item"
- [ ] Item appears in list
- [ ] Add 2-3 more items

### Test Recipes
- [ ] Navigate to "Recipes" tab
- [ ] See 3 sample recipes
- [ ] Notice match percentages (if groceries added)
- [ ] Click on a recipe
- [ ] See recipe details
- [ ] View ingredients tab
- [ ] View instructions tab
- [ ] Click heart to favorite
- [ ] Click share icon
- [ ] Go back

### Test Meal Planning
- [ ] Navigate to "Meal Plan" tab
- [ ] See weekly calendar
- [ ] Try to add a meal (basic UI ready)
- [ ] Click "Generate Shopping List"

### Test Home
- [ ] Navigate to "Home" tab
- [ ] See welcome message
- [ ] See 4 quick action buttons
- [ ] Test quick actions work

---

## Verification Checklist

### Functionality
- [ ] Can create account
- [ ] Can login
- [ ] Can update profile
- [ ] Can add groceries
- [ ] Can view recipes
- [ ] Can see recipe details
- [ ] Can favorite recipes
- [ ] Navigation works smoothly
- [ ] No crash errors

### UI/UX
- [ ] Green theme consistent
- [ ] Icons display correctly
- [ ] Text readable
- [ ] Buttons work with feedback
- [ ] Modals open/close smoothly
- [ ] Forms work properly
- [ ] Lists scroll smoothly

### Data Persistence
- [ ] Logout and login again
- [ ] Profile data still there
- [ ] Groceries still there
- [ ] Favorites still there
- [ ] Everything persisted correctly

---

## Common Issues & Solutions

### ❌ "Cannot connect to Supabase"
**Solution:**
1. Check `.env` file has correct credentials
2. Restart expo server: `Ctrl+C` then `npm start`
3. Clear cache: `npm start -- --clear`

### ❌ "Schema errors in Supabase"
**Solution:**
1. Delete all tables in Supabase
2. Re-run the complete schema.sql
3. Check for any error messages

### ❌ "Module not found" errors
**Solution:**
```bash
rm -rf node_modules
npm install
```

### ❌ "Expo Go connection issues"
**Solution:**
1. Ensure phone and computer on same WiFi
2. Try tunnel mode: `npm start -- --tunnel`
3. Restart Expo Go app

### ❌ "TypeScript errors"
**Solution:**
1. Check all imports are correct
2. Run: `npx tsc --noEmit` to see errors
3. Usually auto-resolves after restart

---

## 🎉 Success Criteria

You've successfully set up SnackIt when:

✅ App runs without crashes
✅ Can create account and login
✅ Can add and manage groceries
✅ Can view recipes
✅ Can update profile
✅ Data persists after logout/login
✅ All navigation works
✅ UI looks good and responsive

---

## 📱 Next Steps After Setup

1. **Add More Groceries**: Build your inventory
2. **Explore Recipes**: Check the 3 samples
3. **Plan Meals**: Try the meal planner
4. **Customize**: Update your preferences

### Want to Add More Recipes?
1. Go to Supabase dashboard
2. Click "Table Editor"
3. Select "recipes" table
4. Click "Insert row"
5. Fill in recipe data (follow existing format)
6. Save

### Want Real Recipe Data?
Check `API_INTEGRATION.md` for:
- Spoonacular API integration
- Edamam API integration
- Recipe import tools

---

## 🚀 You're All Set!

Your SnackIt app is now running and ready for development!

**Estimated Setup Time:** 10-15 minutes
**Difficulty:** Easy ⭐⭐☆☆☆

**Need Help?**
- Read `SETUP.md` for detailed guide
- Read `FEATURES.md` for feature documentation
- Check `README.md` for overview

---

*Happy Cooking with SnackIt! 🍳*
