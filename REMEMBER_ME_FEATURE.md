# Remember Me Feature Documentation

## Overview
The Remember Me feature allows users to stay logged in across app restarts. When enabled, users won't need to sign in again. When disabled, users will be logged out automatically when the app is closed and reopened.

## How It Works

### 1. Login Screen
- Added a "Remember Me" checkbox on the login screen
- Default state: **Checked (enabled)**
- User can toggle this before logging in
- Visual feedback: Green checkmark when enabled, gray border when disabled

### 2. Storage Mechanism
- Uses **AsyncStorage** to store the user's preference
- Storage Key: `rememberMe`
- Values: `'true'` or `'false'` (stored as string)

### 3. Authentication Flow

#### When User Logs In:
1. User enters email and password
2. User checks/unchecks "Remember Me" checkbox
3. On successful login:
   - The `rememberMe` preference is saved to AsyncStorage
   - Supabase session is created normally

#### On App Restart:
1. AuthContext checks AsyncStorage for `rememberMe` preference
2. **If `rememberMe` is `'false'`**:
   - Immediately signs out the user
   - Clears the session
   - User sees login screen
3. **If `rememberMe` is `'true'` or not set**:
   - Retrieves existing session from Supabase
   - User stays logged in

#### On Sign Out:
- Clears the `rememberMe` preference from AsyncStorage
- Signs out from Supabase
- Next app restart will require login

#### On New Signup:
- `rememberMe` is automatically set to `'true'`
- New users stay logged in by default

## Technical Implementation

### Files Modified

#### 1. `app/(auth)/login.tsx`
```tsx
// Added state
const [rememberMe, setRememberMe] = useState(true);

// Updated login handler
const { error } = await signIn(email, password, rememberMe);

// Added UI checkbox
<TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
  <View className={rememberMe ? 'bg-green-600' : 'bg-gray-900'}>
    {rememberMe && <Text>✓</Text>}
  </View>
  <Text>Remember me</Text>
</TouchableOpacity>
```

#### 2. `contexts/AuthContext.tsx`
```tsx
// Added AsyncStorage import and key
import AsyncStorage from '@react-native-async-storage/async-storage';
const REMEMBER_ME_KEY = 'rememberMe';

// Updated signIn signature
signIn: (email: string, password: string, rememberMe: boolean)

// Enhanced useEffect to check preference on app start
useEffect(() => {
  const checkRememberMe = async () => {
    const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
    if (rememberMe === 'false') {
      await supabase.auth.signOut();
      // User not remembered
    }
    // Otherwise, load existing session
  };
  checkRememberMe();
}, []);

// Save preference on login
const signIn = async (email, password, rememberMe) => {
  await AsyncStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
  // Proceed with Supabase login
};

// Clear preference on sign out
const signOut = async () => {
  await AsyncStorage.removeItem(REMEMBER_ME_KEY);
  await supabase.auth.signOut();
};
```

#### 3. `app/(auth)/signup.tsx`
- Fixed to pass username parameter: `signUp(email, password, username)`
- Sets `rememberMe` to `'true'` automatically for new users

## User Experience

### Scenario 1: Remember Me Enabled (Default)
1. User logs in with checkbox checked
2. App stores session persistently
3. User closes app
4. User reopens app → **Stays logged in** ✅

### Scenario 2: Remember Me Disabled
1. User logs in with checkbox unchecked
2. App stores `rememberMe: false`
3. User closes app
4. User reopens app → **Logged out, sees login screen** 🔒

### Scenario 3: User Signs Out
1. User clicks "Log Out" button
2. App clears remember preference
3. User reopens app → **Must log in again**

## Benefits

1. **User Control**: Users explicitly choose whether to stay logged in
2. **Security**: Users can opt-out on shared devices
3. **Convenience**: Default "checked" state for better UX
4. **Persistent**: Works across app restarts and phone reboots
5. **Clean Logout**: Signing out clears the preference

## Testing Instructions

### Test 1: Remember Me Enabled
1. Open app and go to login screen
2. Verify "Remember me" checkbox is checked by default
3. Enter credentials and login
4. Force close the app (swipe away from app switcher)
5. Reopen the app
6. **Expected**: User should be logged in automatically

### Test 2: Remember Me Disabled
1. Open app and go to login screen
2. Uncheck the "Remember me" checkbox
3. Enter credentials and login
4. Force close the app
5. Reopen the app
6. **Expected**: User should see login screen

### Test 3: Sign Out
1. While logged in, click "Log Out"
2. Force close the app
3. Reopen the app
4. **Expected**: User should see login screen

### Test 4: New Signup
1. Create a new account
2. Force close the app
3. Reopen the app
4. **Expected**: User should be logged in automatically

## Storage Details

- **Location**: AsyncStorage (persistent storage)
- **Key**: `rememberMe`
- **Type**: String (`'true'` or `'false'`)
- **Cleared on**: Sign out, app uninstall

## Future Enhancements (Optional)

1. **Biometric Authentication**: Add Face ID/Touch ID for remembered users
2. **Auto-logout Timer**: Option to auto-logout after X days of inactivity
3. **Multiple Accounts**: Remember multiple accounts with quick switching
4. **Security Options**: Add option to require password for sensitive actions even when remembered

## Dependencies

- `@react-native-async-storage/async-storage`: Already installed
- Supabase session management: Already configured with `persistSession: true`

## Notes

- The Supabase client already has `persistSession: true` configured
- This feature builds on top of Supabase's existing session persistence
- AsyncStorage is used only to store the user's preference, not the actual session
- The actual authentication tokens are managed by Supabase's secure storage
