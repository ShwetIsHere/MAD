import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

const OPENROUTER_API_KEY = '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';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  category: string;
}

interface RecipeSuggestion {
  id: string;
  name: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  cuisine: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
}

const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Seafood'];
const units = ['piece', 'kg', 'g', 'l', 'ml'];

export default function RecipesScreen() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipes, setRecipes] = useState<RecipeSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [selectedUnit, setSelectedUnit] = useState('piece');
  const [selectedCategory, setSelectedCategory] = useState('Vegetables');

  const openAddModal = () => {
    setItemName('');
    setQuantity('1');
    setSelectedUnit('piece');
    setSelectedCategory('Vegetables');
    setModalVisible(true);
  };

  const addIngredient = () => {
    if (!itemName.trim()) {
      Alert.alert('Error', 'Please enter ingredient name');
      return;
    }

    const newIngredient: Ingredient = {
      name: itemName.trim(),
      quantity: quantity || '1',
      unit: selectedUnit,
      category: selectedCategory,
    };

    setIngredients([...ingredients, newIngredient]);
    setModalVisible(false);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const searchRecipes = async () => {
    if (ingredients.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return;
    }

    setLoading(true);
    try {
      const ingredientList = ingredients.map(ing => `${ing.quantity} ${ing.unit} ${ing.name}`).join(', ');
      const ingredientNames = ingredients.map(ing => ing.name).join(', ');
      
      const prompt = `Given these ingredients: ${ingredientList}, suggest 5 recipes that use ONLY these ingredients: ${ingredientNames} (excluding common spices and seasonings which are allowed). For each recipe provide: name, brief description, cooking time, difficulty level, cuisine type, servings, list of ingredients with amounts, and step-by-step instructions. Format as JSON array with keys: name, description, cookingTime, difficulty, cuisine, servings, ingredients (array of strings), instructions (array of strings). Keep descriptions under 50 words.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://snackit.app',
          'X-Title': 'SnackIt Recipe App',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'API request failed');
      }

      const content = data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from API');
      }

      // Extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedRecipes = JSON.parse(jsonMatch[0]);
        // Add IDs to recipes
        const recipesWithIds = parsedRecipes.map((recipe: any, index: number) => ({
          ...recipe,
          id: `recipe-${index}`,
          ingredients: recipe.ingredients || [],
          instructions: recipe.instructions || [],
        }));
        setRecipes(recipesWithIds);
      } else {
        throw new Error('Could not parse recipes from response');
      }
    } catch (error: any) {
      console.error('Recipe search error:', error);
      Alert.alert('Error', error.message || 'Failed to search recipes');
    } finally {
      setLoading(false);
    }
  };

  const openRecipeDetail = (recipe: RecipeSuggestion) => {
    router.push({
      pathname: '/recipe-detail' as any,
      params: {
        recipeData: JSON.stringify(recipe),
      },
    });
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1">
        {/* Ingredients Section */}
        <View className="p-6 border-b border-gray-800">
          <Text className="text-2xl font-bold text-white mb-2">
            Your Ingredients
          </Text>
          <Text className="text-gray-400 mb-4">
            Add ingredients to find matching recipes
          </Text>

          {/* Ingredients List */}
          {ingredients.length > 0 && (
            <View className="mb-4">
              {ingredients.map((ingredient, index) => (
                <View
                  key={index}
                  className="bg-gray-900 rounded-lg p-3 mb-2 flex-row items-center justify-between border border-gray-800"
                >
                  <View className="flex-1">
                    <Text className="text-white font-semibold">
                      {ingredient.name}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {ingredient.quantity} {ingredient.unit} • {ingredient.category}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeIngredient(index)}
                    className="p-2"
                  >
                    <Ionicons name="trash-outline" size={20} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add Button */}
          <TouchableOpacity
            className="bg-green-600 rounded-lg py-4 mb-2"
            onPress={openAddModal}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="add" size={24} color="white" />
              <Text className="text-white text-center font-semibold text-base ml-2">
                Add Ingredient
              </Text>
            </View>
          </TouchableOpacity>

          {/* Search Button */}
          {ingredients.length > 0 && (
            <TouchableOpacity
              className={`bg-gray-800 border-2 border-green-600 rounded-lg py-4 ${loading ? 'opacity-50' : ''}`}
              onPress={searchRecipes}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#16a34a" />
              ) : (
                <Text className="text-green-600 text-center font-semibold text-base">
                  Search Recipes
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Recipes Results */}
        {recipes.length > 0 && (
          <View className="p-6">
            <Text className="text-xl font-bold text-white mb-4">
              Suggested Recipes
            </Text>
            {recipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                className="bg-gray-900 rounded-xl mb-4 overflow-hidden border border-gray-800"
                onPress={() => openRecipeDetail(recipe)}
              >
                {/* Placeholder Image */}
                <View className="w-full h-48 bg-gray-800 items-center justify-center">
                  <Ionicons name="restaurant" size={64} color="#4b5563" />
                </View>

                <View className="p-4">
                  <Text className="text-xl font-bold text-white mb-2">
                    {recipe.name}
                  </Text>
                  
                  <Text className="text-gray-400 mb-3">
                    {recipe.description}
                  </Text>

                  {/* Recipe Info */}
                  <View className="flex-row flex-wrap gap-2">
                    <View className="flex-row items-center bg-gray-800 rounded-full px-3 py-1">
                      <Ionicons name="time-outline" size={16} color="#10b981" />
                      <Text className="text-gray-300 text-sm ml-1">
                        {recipe.cookingTime}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center bg-gray-800 rounded-full px-3 py-1">
                      <Ionicons name="bar-chart-outline" size={16} color="#f59e0b" />
                      <Text className="text-gray-300 text-sm ml-1 capitalize">
                        {recipe.difficulty}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center bg-gray-800 rounded-full px-3 py-1">
                      <Ionicons name="restaurant-outline" size={16} color="#8b5cf6" />
                      <Text className="text-gray-300 text-sm ml-1">
                        {recipe.cuisine}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center bg-gray-800 rounded-full px-3 py-1">
                      <Ionicons name="people-outline" size={16} color="#3b82f6" />
                      <Text className="text-gray-300 text-sm ml-1">
                        {recipe.servings} servings
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State */}
        {recipes.length === 0 && !loading && ingredients.length === 0 && (
          <View className="p-6 items-center">
            <Ionicons name="restaurant-outline" size={80} color="#374151" />
            <Text className="text-gray-400 text-center mt-4 text-base">
              Add ingredients to discover amazing recipes!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Ingredient Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/70">
          <View className="bg-gray-900 rounded-t-3xl p-6 max-h-[85%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-white">
                Add Ingredient
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Item Name */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-300 mb-2">
                  Item Name
                </Text>
                <TextInput
                  className="border border-gray-700 bg-gray-800 text-white rounded-lg px-4 py-3 text-base"
                  placeholder="e.g., Tomatoes"
                  placeholderTextColor="#6b7280"
                  value={itemName}
                  onChangeText={setItemName}
                />
              </View>

              {/* Category */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-300 mb-2">
                  Category
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row">
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        className={`mr-2 px-4 py-2 rounded-lg ${
                          selectedCategory === cat
                            ? 'bg-green-600'
                            : 'bg-gray-800'
                        }`}
                        onPress={() => setSelectedCategory(cat)}
                      >
                        <Text
                          className={`${
                            selectedCategory === cat
                              ? 'text-white'
                              : 'text-gray-300'
                          }`}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Quantity and Unit */}
              <View className="flex-row mb-6">
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-medium text-gray-300 mb-2">
                    Quantity
                  </Text>
                  <TextInput
                    className="border border-gray-700 bg-gray-800 text-white rounded-lg px-4 py-3 text-base"
                    placeholder="1"
                    placeholderTextColor="#6b7280"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                  />
                </View>

                <View className="flex-1 ml-2">
                  <Text className="text-sm font-medium text-gray-300 mb-2">
                    Unit
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row">
                      {units.map((unit) => (
                        <TouchableOpacity
                          key={unit}
                          className={`mr-2 px-4 py-3 rounded-lg ${
                            selectedUnit === unit ? 'bg-green-600' : 'bg-gray-800'
                          }`}
                          onPress={() => setSelectedUnit(unit)}
                        >
                          <Text
                            className={
                              selectedUnit === unit
                                ? 'text-white'
                                : 'text-gray-300'
                            }
                          >
                            {unit}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>

              <TouchableOpacity
                className="bg-green-600 rounded-lg py-4"
                onPress={addIngredient}
              >
                <Text className="text-white text-center font-semibold text-base">
                  Add Ingredient
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
