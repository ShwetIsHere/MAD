# Remember Me Troubleshooting Guide

## Issue: User has to enter credentials again and again

### What I've Fixed:

#### 1. **Improved AuthContext Logic**
- Fixed the initialization logic to properly handle `null` rememberMe values (first-time users)
- Added error handling with try-catch blocks
- Added comprehensive console logging for debugging
- Ensured session check happens after verifying remember preference

#### 2. **Enhanced SignIn Function**
- Stores remember preference BEFORE attempting login
- Clears preference if login fails (prevents false positives)
- Added proper error handling

#### 3. **Updated OAuth Flow**
- Google Sign-In now automatically enables "Remember Me"

### Debug Console Logs

When the app starts, you should see these logs:

```
🔐 AuthContext: Remember Me preference: true/false/null
🔍 AuthContext: Checking for existing session...
✅ AuthContext: Session found: Yes/No
👤 AuthContext: User email: user@example.com
```

When logging in:

```
🔑 AuthContext: Signing in with Remember Me: true/false
✅ AuthContext: Sign in successful!
```

When auth state changes:

```
🔄 AuthContext: Auth state changed: SIGNED_IN/SIGNED_OUT
```

## How to Test & Debug

### Step 1: Clear All Storage (Fresh Start)

Run this in your terminal to clear all cached data:

```bash
# For Android
adb shell pm clear host.exp.exponent

# For iOS Simulator
xcrun simctl uninstall booted host.exp.exponent

# Or simply uninstall and reinstall the app
```

### Step 2: Enable Metro Console Logs

1. Open your terminal where Metro bundler is running
2. Watch for the console logs mentioned above
3. Press 'j' to open Chrome DevTools for more detailed logs

### Step 3: Test Remember Me = TRUE (Default)

1. Open the app
2. Go to login screen
3. **Verify checkbox is CHECKED** ✓
4. Enter credentials and login
5. **Expected Console Log**: `🔑 AuthContext: Signing in with Remember Me: true`
6. Close the app completely (swipe away from app switcher)
7. Reopen the app
8. **Expected Console Log**: 
   ```
   🔐 AuthContext: Remember Me preference: true
   🔍 AuthContext: Checking for existing session...
   ✅ AuthContext: Session found: Yes
   ```
9. **Expected Result**: Should go directly to home screen WITHOUT login

### Step 4: Test Remember Me = FALSE

1. Logout if logged in
2. Go to login screen
3. **Uncheck the checkbox** ☐
4. Enter credentials and login
5. **Expected Console Log**: `🔑 AuthContext: Signing in with Remember Me: false`
6. Close the app completely
7. Reopen the app
8. **Expected Console Log**: 
   ```
   🔐 AuthContext: Remember Me preference: false
   🚪 AuthContext: Remember Me is false, signing out...
   ```
9. **Expected Result**: Should show login screen

### Step 5: Verify AsyncStorage

Add this test function to verify AsyncStorage is working:

```tsx
// Add to login.tsx temporarily for testing
import AsyncStorage from '@react-native-async-storage/async-storage';

const testStorage = async () => {
  try {
    await AsyncStorage.setItem('test_key', 'test_value');
    const value = await AsyncStorage.getItem('test_key');
    console.log('✅ AsyncStorage test:', value); // Should print "test_value"
    await AsyncStorage.removeItem('test_key');
  } catch (error) {
    console.error('❌ AsyncStorage test failed:', error);
  }
};

// Call it in useEffect
useEffect(() => {
  testStorage();
}, []);
```

## Common Issues & Solutions

### Issue 1: "Session not persisting at all"

**Possible Causes:**
- Supabase configuration issue
- Environment variables not loaded
- AsyncStorage not working

**Solution:**
1. Check `utils/supabase.ts` has `persistSession: true` ✓ (Already correct)
2. Verify `.env` file exists with correct Supabase credentials
3. Check console for AsyncStorage errors
4. Restart Metro bundler: Press Ctrl+C, then `npm start --clear`

### Issue 2: "Session persists even when Remember Me is unchecked"

**Possible Causes:**
- AsyncStorage write failed silently
- RememberMe key not being checked on startup

**Solution:**
1. Check console logs for `🔐 AuthContext: Remember Me preference:`
2. Should see "false" when unchecked
3. Should see `🚪 AuthContext: Remember Me is false, signing out...`
4. If not, AsyncStorage write may have failed

### Issue 3: "App crashes on startup"

**Possible Causes:**
- Supabase URL/Key missing
- AsyncStorage not linked properly

**Solution:**
1. Check `.env` file has both:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
2. Restart Metro: `npm start --clear`
3. Rebuild app: `npx expo prebuild --clean`

### Issue 4: "Remember Me checkbox doesn't appear"

**Possible Causes:**
- login.tsx not updated properly

**Solution:**
1. Check login.tsx has `const [rememberMe, setRememberMe] = useState(true);`
2. Check for the checkbox UI component
3. Clear Metro cache: `npm start --clear`

## Verification Checklist

Before testing, verify these files are correct:

### ✅ `contexts/AuthContext.tsx`
- [ ] Imports `AsyncStorage`
- [ ] Has `REMEMBER_ME_KEY = 'rememberMe'`
- [ ] `signIn` has 3 parameters: `(email, password, rememberMe)`
- [ ] `useEffect` checks rememberMe preference on startup
- [ ] Console logs are present

### ✅ `app/(auth)/login.tsx`
- [ ] Has `const [rememberMe, setRememberMe] = useState(true)`
- [ ] Has checkbox UI component
- [ ] Passes `rememberMe` to `signIn(email, password, rememberMe)`

### ✅ `utils/supabase.ts`
- [ ] Has `storage: AsyncStorage`
- [ ] Has `persistSession: true`
- [ ] Has `autoRefreshToken: true`

## Advanced Debugging

### Check Supabase Session Storage

Add this to your login success handler:

```tsx
const checkSupabaseStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  console.log('📦 All AsyncStorage keys:', keys);
  
  for (const key of keys) {
    if (key.includes('supabase')) {
      const value = await AsyncStorage.getItem(key);
      console.log(`📦 ${key}:`, value?.substring(0, 50) + '...');
    }
  }
};
```

You should see keys like:
- `supabase.auth.token`
- `rememberMe`

### Monitor Auth State Changes

The `onAuthStateChange` listener logs all auth events:
- `SIGNED_IN` - User logged in
- `SIGNED_OUT` - User logged out
- `TOKEN_REFRESHED` - Token auto-refreshed
- `USER_UPDATED` - User data changed

## Expected Behavior Summary

| Scenario | Remember Me | App Restart | Expected Result |
|----------|-------------|-------------|-----------------|
| First login | ✓ Checked | Close & Reopen | Stay logged in ✅ |
| Login | ☐ Unchecked | Close & Reopen | Logged out ✅ |
| After logout | N/A | Close & Reopen | Logged out ✅ |
| New signup | Auto ✓ | Close & Reopen | Stay logged in ✅ |
| Google login | Auto ✓ | Close & Reopen | Stay logged in ✅ |

## Still Not Working?

If none of the above works, try these steps:

1. **Complete App Reset**:
   ```bash
   # Clear Metro cache
   npm start -- --clear
   
   # Clear watchman (if on macOS)
   watchman watch-del-all
   
   # Reinstall node_modules
   rm -rf node_modules
   npm install
   
   # Rebuild
   npx expo prebuild --clean
   ```

2. **Check Supabase Dashboard**:
   - Go to Authentication → Settings
   - Verify "Session timeout" is not too short
   - Check if "Secure session cookie" is appropriate for your setup

3. **Test with Production Build**:
   Development mode might have caching issues
   ```bash
   npx expo build:android --type apk
   # or
   npx expo build:ios
   ```

4. **Enable Verbose Supabase Logs**:
   Add to `utils/supabase.ts`:
   ```typescript
   export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
     auth: {
       storage: AsyncStorage,
       autoRefreshToken: true,
       persistSession: true,
       detectSessionInUrl: false,
       debug: true, // Add this line
     },
   });
   ```

## Contact Info

If the issue persists after trying all above:
1. Share the console logs (especially the 🔐 emoji logs)
2. Share your Supabase project settings (auth timeouts, etc.)
3. Confirm Expo SDK version: `expo --version`
4. Confirm React Native version from package.json
