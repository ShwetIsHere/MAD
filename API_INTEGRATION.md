# API Integration Guide

## 🌐 Future API Integrations

This guide shows how to integrate external APIs to enhance SnackIt's functionality.

---

## 1. Recipe APIs

### Spoonacular API

**Purpose**: Get thousands of recipes, nutritional information, and ingredients

**Setup:**
```bash
npm install axios
```

**Usage Example:**
```typescript
// utils/recipeApi.ts
import axios from 'axios';

const SPOONACULAR_API_KEY = process.env.EXPO_PUBLIC_SPOONACULAR_KEY;
const BASE_URL = 'https://api.spoonacular.com';

export const searchRecipesByIngredients = async (ingredients: string[]) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/findByIngredients`, {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        ingredients: ingredients.join(','),
        number: 10,
        ranking: 2, // Maximize used ingredients
      },
    });
    return response.data;
  } catch (error) {
    console.error('Recipe API error:', error);
    throw error;
  }
};

export const getRecipeDetails = async (recipeId: number) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/recipes/${recipeId}/information`,
      {
        params: {
          apiKey: SPOONACULAR_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Recipe details error:', error);
    throw error;
  }
};
```

**Integration in Recipes Screen:**
```typescript
// In app/(tabs)/recipes.tsx
import { searchRecipesByIngredients } from '../../utils/recipeApi';

const loadRecipesFromAPI = async () => {
  const ingredientNames = groceries.map((g) => g.name);
  const apiRecipes = await searchRecipesByIngredients(ingredientNames);
  
  // Transform API data to match your Recipe type
  const transformedRecipes = apiRecipes.map(recipe => ({
    id: recipe.id.toString(),
    title: recipe.title,
    image_url: recipe.image,
    // ... map other fields
  }));
  
  setRecipes([...localRecipes, ...transformedRecipes]);
};
```

**Cost**: Free tier available, paid plans for higher usage

---

### Edamam Recipe API

**Purpose**: Recipe search with nutritional analysis

```typescript
// utils/edamamApi.ts
const EDAMAM_APP_ID = process.env.EXPO_PUBLIC_EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EXPO_PUBLIC_EDAMAM_APP_KEY;

export const searchRecipes = async (query: string, dietType?: string) => {
  const response = await fetch(
    `https://api.edamam.com/search?q=${query}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&diet=${dietType || ''}`
  );
  return response.json();
};
```

---

## 2. Barcode/Product APIs

### Open Food Facts API

**Purpose**: Get product information from barcodes (free, open-source)

```typescript
// utils/productApi.ts
export const getProductByBarcode = async (barcode: string) => {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    const data = await response.json();
    
    if (data.status === 1) {
      return {
        name: data.product.product_name,
        category: data.product.categories_tags?.[0] || 'other',
        brand: data.product.brands,
        imageUrl: data.product.image_url,
      };
    }
    return null;
  } catch (error) {
    console.error('Product lookup error:', error);
    return null;
  }
};
```

**Integration in Barcode Scanner:**
```typescript
// In app/barcode-scanner.tsx
import { getProductByBarcode } from '../utils/productApi';
import { supabase } from '../utils/supabase';

const handleBarCodeScanned = async ({ data }: { data: string }) => {
  setScanned(true);
  
  const product = await getProductByBarcode(data);
  
  if (product) {
    // Auto-add to groceries
    const { error } = await supabase.from('groceries').insert({
      user_id: user?.id,
      name: product.name,
      category: product.category,
      quantity: 1,
      unit: 'piece',
      barcode: data,
      created_at: new Date().toISOString(),
    });
    
    if (!error) {
      Alert.alert('Success!', `Added ${product.name} to groceries`);
    }
  }
};
```

---

## 3. Location & Maps APIs

### Google Places API

**Purpose**: Find nearby grocery stores, restaurants

```bash
npm install react-native-maps
```

```typescript
// utils/locationApi.ts
import * as Location from 'expo-location';

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_KEY;

export const getNearbyStores = async () => {
  // Get user location
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return [];
  
  const location = await Location.getCurrentPositionAsync({});
  
  // Search nearby grocery stores
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.coords.latitude},${location.coords.longitude}&radius=5000&type=grocery_or_supermarket&key=${GOOGLE_PLACES_API_KEY}`
  );
  
  const data = await response.json();
  return data.results;
};

export const getLocalRecipes = async (latitude: number, longitude: number) => {
  // Query your recipes table for local recipes near this location
  const { data } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_local', true)
    .ilike('location', `%${latitude},${longitude}%`);
    
  return data || [];
};
```

**Integration Example:**
```typescript
// New screen: app/nearby-stores.tsx
import { getNearbyStores } from '../utils/locationApi';

export default function NearbyStoresScreen() {
  const [stores, setStores] = useState([]);
  
  useEffect(() => {
    loadStores();
  }, []);
  
  const loadStores = async () => {
    const nearbyStores = await getNearbyStores();
    setStores(nearbyStores);
  };
  
  // Display stores on map or list
}
```

---

## 4. Voice Input API

### Expo Speech Recognition

```bash
npm install expo-speech
```

```typescript
// utils/voiceInput.ts
import * as Speech from 'expo-speech';

export const startVoiceInput = (onResult: (text: string) => void) => {
  // Note: Expo doesn't have built-in speech recognition
  // Use react-native-voice or Google Cloud Speech-to-Text
  
  // Alternative: Use Google Cloud Speech-to-Text API
  // 1. Record audio with expo-av
  // 2. Send to Google Cloud Speech API
  // 3. Get transcription
};
```

**Better Alternative - Google Cloud Speech:**
```typescript
// utils/speechToText.ts
import { Audio } from 'expo-av';

const GOOGLE_CLOUD_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_KEY;

export const recordAndTranscribe = async () => {
  // Request permissions
  await Audio.requestPermissionsAsync();
  
  // Start recording
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(
    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
  );
  await recording.startAsync();
  
  // Stop after user stops speaking (implement your own detection)
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  
  // Convert to base64 and send to Google Cloud Speech
  const audioBase64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  
  const response = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_CLOUD_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
        },
        audio: {
          content: audioBase64,
        },
      }),
    }
  );
  
  const data = await response.json();
  return data.results?.[0]?.alternatives?.[0]?.transcript || '';
};
```

---

## 5. Nutrition API

### Nutritionix API

**Purpose**: Get detailed nutrition information

```typescript
// utils/nutritionApi.ts
const NUTRITIONIX_APP_ID = process.env.EXPO_PUBLIC_NUTRITIONIX_APP_ID;
const NUTRITIONIX_APP_KEY = process.env.EXPO_PUBLIC_NUTRITIONIX_APP_KEY;

export const getNutritionInfo = async (query: string) => {
  const response = await fetch(
    'https://trackapi.nutritionix.com/v2/natural/nutrients',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_APP_KEY,
      },
      body: JSON.stringify({ query }),
    }
  );
  
  return response.json();
};
```

---

## 6. Image Recognition API

### Clarifai Food Recognition

**Purpose**: Identify food items from photos

```bash
npm install clarifai
```

```typescript
// utils/imageRecognition.ts
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: process.env.EXPO_PUBLIC_CLARIFAI_KEY,
});

export const identifyFood = async (imageUri: string) => {
  const response = await app.models.predict(
    Clarifai.FOOD_MODEL,
    imageUri
  );
  
  return response.outputs[0].data.concepts.map((concept: any) => ({
    name: concept.name,
    confidence: concept.value,
  }));
};
```

**Integration with Camera:**
```typescript
// Add to groceries screen
import * as ImagePicker from 'expo-image-picker';
import { identifyFood } from '../../utils/imageRecognition';

const takePhotoAndIdentify = async () => {
  const result = await ImagePicker.launchCameraAsync();
  
  if (!result.canceled) {
    const foods = await identifyFood(result.assets[0].uri);
    
    // Show identified foods and let user select to add
    Alert.alert(
      'Food Identified',
      `We found: ${foods.map(f => f.name).join(', ')}`,
      [
        {
          text: 'Add All',
          onPress: () => addMultipleGroceries(foods),
        },
      ]
    );
  }
};
```

---

## 7. Push Notifications

### Expo Notifications

```bash
npm install expo-notifications
```

```typescript
// utils/notifications.ts
import * as Notifications from 'expo-notifications';

export const scheduleExpiryNotification = async (
  itemName: string,
  expiryDate: Date
) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🍎 Item Expiring Soon!',
      body: `Your ${itemName} will expire tomorrow`,
      data: { type: 'expiry' },
    },
    trigger: {
      date: new Date(expiryDate.getTime() - 24 * 60 * 60 * 1000), // 1 day before
    },
  });
};

// Call this when adding groceries with expiry dates
```

---

## 💡 Implementation Tips

### Environment Variables

Add to your `.env`:
```env
# Recipe APIs
EXPO_PUBLIC_SPOONACULAR_KEY=your_key
EXPO_PUBLIC_EDAMAM_APP_ID=your_id
EXPO_PUBLIC_EDAMAM_APP_KEY=your_key

# Location
EXPO_PUBLIC_GOOGLE_PLACES_KEY=your_key

# Nutrition
EXPO_PUBLIC_NUTRITIONIX_APP_ID=your_id
EXPO_PUBLIC_NUTRITIONIX_APP_KEY=your_key

# Image Recognition
EXPO_PUBLIC_CLARIFAI_KEY=your_key

# Speech
EXPO_PUBLIC_GOOGLE_CLOUD_KEY=your_key
```

### Error Handling

Always wrap API calls in try-catch:
```typescript
const loadData = async () => {
  try {
    setLoading(true);
    const data = await apiCall();
    setData(data);
  } catch (error) {
    console.error('API Error:', error);
    Alert.alert('Error', 'Failed to load data. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### Rate Limiting

Implement debouncing for search:
```typescript
import { debounce } from 'lodash';

const debouncedSearch = debounce(async (query: string) => {
  const results = await searchAPI(query);
  setResults(results);
}, 500);
```

---

## 🎯 Recommended Order of Implementation

1. **Open Food Facts** - Free, easy to integrate
2. **Expo Notifications** - Enhance user engagement
3. **Spoonacular/Edamam** - Expand recipe database
4. **Google Places** - Local store finder
5. **Voice/Image Recognition** - Advanced features

---

Choose APIs based on your budget and requirements. Many offer free tiers perfect for development and testing!
