# SnackIt - Your Smart Cooking Companion 🍽️

A comprehensive React Native mobile application built with Expo that helps users manage their groceries and discover personalized recipe suggestions based on available ingredients.

## 📱 Features

### ✅ Completed Features

#### 1. **User Authentication & Profile Management**
- Email-based signup/login with Supabase
- Google OAuth integration ready
- User profile with dietary preferences
- Support for diet types: Vegetarian, Vegan, Non-Veg, Pescatarian, Any
- Allergy and dislike tracking
- Preferred cuisine selection

#### 2. **Grocery Management**
- Manual entry with text input
- Category-based organization (vegetables, fruits, grains, dairy, meat, seafood, spices, condiments, beverages)
- Quantity tracking with multiple units (kg, g, l, ml, piece, cup, tbsp, tsp, oz)
- Expiry date tracking with visual warnings
- Barcode scanner integration (ready for implementation)
- Edit and delete functionality

#### 3. **Recipe Discovery & Suggestions**
- Smart recipe matching based on available groceries
- Match percentage calculation
- Advanced filtering by:
  - Cuisine type (Indian, Italian, Chinese, Mexican, Thai, Japanese, Mediterranean, American)
  - Cooking time (Quick, Medium, Long)
  - Difficulty level (Easy, Medium, Hard)
- Search functionality
- Recipe sorting by ingredient match score

#### 4. **Recipe Details**
- Step-by-step cooking instructions
- Complete ingredients list with quantities
- Nutritional information display
- Cooking time and difficulty indicators
- Servings information
- Favorite/save functionality
- Social sharing capabilities

#### 5. **Meal Planning**
- Weekly meal planner
- Multiple meal slots: Breakfast, Lunch, Dinner, Snack
- Visual calendar interface
- Week navigation
- Shopping list generation from meal plans

#### 6. **Additional Features**
- Shopping list generator
- Quick action shortcuts on home screen
- Recent activity tracking
- Pro tips and suggestions
- Responsive UI with NativeWind (TailwindCSS)

### 🚧 Future Enhancements

- Voice input for grocery items
- Advanced barcode scanning with product database
- GPS-based local recipe suggestions
- Community recipe sharing
- Recipe ratings and reviews
- Nutrition tracking
- Push notifications for expiring items
- Multi-language support

## 🏗️ Tech Stack

- **Framework**: React Native with Expo
- **Router**: Expo Router (file-based routing)
- **UI**: NativeWind (TailwindCSS for React Native)
- **Backend**: Supabase
  - Authentication
  - PostgreSQL Database
  - Row Level Security (RLS)
- **State Management**: React Context API
- **TypeScript**: Full type safety
- **Additional Libraries**:
  - expo-location (for GPS features)
  - expo-barcode-scanner (for barcode scanning)
  - expo-camera (for camera features)
  - @react-native-community/datetimepicker
  - expo-image-picker

## 📁 Project Structure

```
SnackIt/
├── app/
│   ├── (auth)/              # Authentication screens
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx        # Home screen
│   │   ├── groceries.tsx    # Grocery management
│   │   ├── recipes.tsx      # Recipe discovery
│   │   ├── meal-plan.tsx    # Meal planner
│   │   └── profile.tsx      # User profile
│   ├── recipe/              # Recipe details
│   │   └── [id].tsx
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Entry point
│   └── barcode-scanner.tsx  # Barcode scanner
├── components/              # Reusable components
├── contexts/                # React contexts
│   └── AuthContext.tsx
├── types/                   # TypeScript types
│   └── index.ts
├── utils/                   # Utility functions
│   └── supabase.ts
├── database/                # Database schema
│   └── schema.sql
└── assets/                  # Images and fonts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for mobile testing)
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   cd "SnackIt"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
   
   c. Enable Google OAuth (optional):
      - Go to Authentication > Providers
      - Enable Google provider
      - Add your OAuth credentials

4. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on your device**
   - Scan the QR code with Expo Go (Android)
   - Scan with Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator

## 📊 Database Schema

The app uses the following main tables:

- **profiles**: User profile and dietary preferences
- **groceries**: User's grocery inventory
- **recipes**: Recipe database
- **favorite_recipes**: User's favorite recipes
- **meal_plans**: Weekly meal planning
- **shopping_list**: Generated shopping lists

See `database/schema.sql` for complete schema with RLS policies.

## 🎨 Design Patterns

- **Atomic Design**: Component organization
- **Context API**: Global state management
- **File-based Routing**: Expo Router
- **Row Level Security**: Data protection at database level
- **TypeScript**: Type-safe development

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- User data isolation
- Secure authentication with Supabase
- Protected routes with authentication guards

## 📱 Screenshots & Demo

[Add your screenshots here after testing]

## 🧪 Testing

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type check
npx tsc --noEmit
```

## 📦 Building for Production

### Android
```bash
npm run prebuild
eas build --platform android
```

### iOS
```bash
npm run prebuild
eas build --platform ios
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- Expo team for the amazing framework
- Supabase for the backend infrastructure
- NativeWind for styling solution

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

Built with ❤️ using React Native and Expo
"# MAD" 
"# MAD" 
