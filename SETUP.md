# SnackIt - Setup Guide

## 🎯 Quick Start Guide

Follow these steps to get your SnackIt app up and running!

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Supabase Backend

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Create Database Tables**
   - In your Supabase dashboard, go to the SQL Editor
   - Copy the entire contents of `database/schema.sql`
   - Paste and run it in the SQL Editor
   - This will create all necessary tables, policies, and sample data

3. **Get Your API Credentials**
   - Go to Settings > API
   - Copy your Project URL and anon/public key

### Step 3: Configure Environment Variables

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 4: Run the App

```bash
npm start
```

Then:
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on your phone

## 📱 Testing the App

### Test Accounts
You can create test accounts directly in the app, or use the Supabase dashboard to create users.

### Sample Data
The database schema includes 3 sample recipes:
- Classic Margherita Pizza (Italian, Easy, 30 min)
- Chicken Tikka Masala (Indian, Medium, 45 min)
- Caesar Salad (American, Easy, 15 min)

## 🔧 Optional: Enable Google Sign-In

1. In Supabase Dashboard:
   - Go to Authentication > Providers
   - Enable Google provider
   - Follow the setup instructions to get OAuth credentials

2. Add your OAuth credentials in Supabase

3. Update your app's configuration if needed

## 🎨 Customization

### Change App Colors
Edit `tailwind.config.js` to customize colors:
```js
theme: {
  extend: {
    colors: {
      primary: '#16a34a', // Change this
    },
  },
}
```

### Add More Sample Recipes
Run additional INSERT queries in Supabase SQL Editor using the same format as in `schema.sql`.

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- Check your `.env` file has correct credentials
- Restart the Expo development server
- Verify your Supabase project is active

### "Authentication not working"
- Check email confirmation settings in Supabase Authentication settings
- Verify Row Level Security policies are properly set up
- Check browser console for detailed error messages

### "Camera not working"
- Grant camera permissions when prompted
- On iOS simulator, camera features won't work (test on real device)
- Ensure `expo-camera` is properly installed

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start --clear
```

## 📚 Next Steps

1. **Add Your Own Recipes**
   - Use the Supabase dashboard to add more recipes
   - Or build an admin panel to add recipes from the app

2. **Customize Features**
   - Add voice input for groceries
   - Integrate a recipe API (Spoonacular, Edamam)
   - Add nutrition tracking

3. **Deploy**
   - Set up EAS Build for app stores
   - Configure push notifications
   - Set up analytics

## 🚀 Deployment

### Build for Production

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Login to Expo:
   ```bash
   eas login
   ```

3. Configure your project:
   ```bash
   eas build:configure
   ```

4. Build:
   ```bash
   # Android
   eas build --platform android
   
   # iOS
   eas build --platform ios
   
   # Both
   eas build --platform all
   ```

## 📞 Need Help?

- Check the [main README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Check Expo documentation: [docs.expo.dev](https://docs.expo.dev)
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)

## ✅ Checklist

- [ ] Dependencies installed
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Environment variables configured
- [ ] App runs successfully
- [ ] Can create an account
- [ ] Can add groceries
- [ ] Can view recipes
- [ ] Profile saved correctly

Happy coding! 🎉
