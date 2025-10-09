import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';

interface RecipeData {
  name: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  cuisine: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
}

export default function RecipeDetailScreen() {
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
  const [isFavorite, setIsFavorite] = useState(false);

  let recipe: RecipeData | null = null;
  try {
    recipe = JSON.parse(params.recipeData as string);
  } catch (error) {
    console.error('Error parsing recipe data:', error);
  }

  if (!recipe) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Recipe not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-900 rounded-full items-center justify-center">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View className="flex-row">
          <TouchableOpacity className="w-10 h-10 bg-gray-900 rounded-full items-center justify-center mr-2">
            <Ionicons name="share-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-10 h-10 bg-gray-900 rounded-full items-center justify-center"
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={22} 
              color={isFavorite ? "#dc2626" : "white"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Image Placeholder */}
        <View className="w-full h-64 bg-gray-800 items-center justify-center">
          <Ionicons name="restaurant" size={80} color="#4b5563" />
        </View>

        {/* Recipe Info */}
        <View className="p-6">
          <Text className="text-3xl font-bold text-white mb-3">
            {recipe.name}
          </Text>
          
          <Text className="text-gray-400 mb-4 leading-6">
            {recipe.description}
          </Text>

          {/* Info Pills */}
          <View className="flex-row flex-wrap gap-2 mb-6">
            <View className="flex-row items-center bg-gray-900 rounded-full px-4 py-2">
              <Ionicons name="time-outline" size={18} color="#10b981" />
              <Text className="text-white text-sm ml-2 font-medium">
                {recipe.cookingTime}
              </Text>
            </View>
            
            <View className="flex-row items-center bg-gray-900 rounded-full px-4 py-2">
              <Ionicons name="bar-chart-outline" size={18} color="#3b82f6" />
              <Text className="text-white text-sm ml-2 font-medium capitalize">
                {recipe.difficulty}
              </Text>
            </View>
            
            <View className="flex-row items-center bg-gray-900 rounded-full px-4 py-2">
              <Ionicons name="restaurant-outline" size={18} color="#8b5cf6" />
              <Text className="text-white text-sm ml-2 font-medium">
                {recipe.cuisine}
              </Text>
            </View>
            
            <View className="flex-row items-center bg-gray-900 rounded-full px-4 py-2">
              <Ionicons name="people-outline" size={18} color="#f59e0b" />
              <Text className="text-white text-sm ml-2 font-medium">
                {recipe.servings} servings
              </Text>
            </View>
          </View>

          {/* Nutrition (Mock Data) */}
          <View className="bg-gray-900 rounded-xl p-4 mb-6 border border-gray-800">
            <Text className="text-white font-semibold text-base mb-3">
              Nutrition per serving
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-white font-bold text-lg">280</Text>
                <Text className="text-gray-400 text-xs">Calories</Text>
              </View>
              <View className="items-center">
                <Text className="text-white font-bold text-lg">12g</Text>
                <Text className="text-gray-400 text-xs">Protein</Text>
              </View>
              <View className="items-center">
                <Text className="text-white font-bold text-lg">35g</Text>
                <Text className="text-gray-400 text-xs">Carbs</Text>
              </View>
              <View className="items-center">
                <Text className="text-white font-bold text-lg">10g</Text>
                <Text className="text-gray-400 text-xs">Fat</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row border-b border-gray-800 mb-4">
            <TouchableOpacity
              className="flex-1 pb-3"
              onPress={() => setActiveTab('ingredients')}
            >
              <Text
                className={`text-center font-semibold text-base ${
                  activeTab === 'ingredients' ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                Ingredients ({recipe.ingredients?.length || 0})
              </Text>
              {activeTab === 'ingredients' && (
                <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              className="flex-1 pb-3"
              onPress={() => setActiveTab('instructions')}
            >
              <Text
                className={`text-center font-semibold text-base ${
                  activeTab === 'instructions' ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                Instructions ({recipe.instructions?.length || 0})
              </Text>
              {activeTab === 'instructions' && (
                <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
              )}
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'ingredients' ? (
            <View>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <View
                    key={index}
                    className="flex-row items-start py-3 border-b border-gray-800"
                  >
                    <View className="w-2 h-2 rounded-full bg-green-600 mt-2 mr-3" />
                    <Text className="flex-1 text-white text-base leading-6">
                      {ingredient}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400 text-center py-4">
                  No ingredients listed
                </Text>
              )}
            </View>
          ) : (
            <View>
              {recipe.instructions && recipe.instructions.length > 0 ? (
                recipe.instructions.map((instruction, index) => (
                  <View key={index} className="flex-row items-start mb-6">
                    <View className="w-10 h-10 rounded-full bg-green-600 items-center justify-center mr-4">
                      <Text className="text-white font-bold text-base">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="flex-1 text-white text-base leading-6 pt-2">
                      {instruction}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400 text-center py-4">
                  No instructions available
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
