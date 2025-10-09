import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { Recipe, RecipeIngredient, RecipeInstruction } from '../../types';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>(
    'ingredients'
  );

  useEffect(() => {
    loadRecipe();
    checkIfFavorite();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setRecipe(data);
    } catch (error: any) {
      Alert.alert('Error', error.message);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const { data } = await supabase
        .from('favorite_recipes')
        .select('*')
        .eq('user_id', user?.id)
        .eq('recipe_id', id)
        .single();

      setIsFavorite(!!data);
    } catch (error) {
      // Not a favorite
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorite_recipes')
          .delete()
          .eq('user_id', user?.id)
          .eq('recipe_id', id);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        const { error } = await supabase.from('favorite_recipes').insert({
          user_id: user?.id,
          recipe_id: id,
          created_at: new Date().toISOString(),
        });

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const shareRecipe = async () => {
    try {
      await Share.share({
        message: `Check out this recipe: ${recipe?.title}\n\n${recipe?.description}`,
        title: recipe?.title,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-600">Recipe not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header Image */}
      <View className="relative">
        {recipe.image_url ? (
          <Image
            source={{ uri: recipe.image_url }}
            className="w-full h-64"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-64 bg-gray-200 items-center justify-center">
            <Ionicons name="image-outline" size={64} color="#9ca3af" />
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity
          className="absolute top-12 left-4 bg-white/90 rounded-full p-2"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="absolute top-12 right-4 flex-row">
          <TouchableOpacity
            className="bg-white/90 rounded-full p-2 mr-2"
            onPress={shareRecipe}
          >
            <Ionicons name="share-outline" size={24} color="#1f2937" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white/90 rounded-full p-2"
            onPress={toggleFavorite}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#dc2626' : '#1f2937'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Title and Info */}
        <View className="p-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {recipe.title}
          </Text>

          <Text className="text-base text-gray-600 mb-4">
            {recipe.description}
          </Text>

          {/* Quick Info */}
          <View className="flex-row flex-wrap mb-6">
            <View className="bg-green-50 rounded-lg px-3 py-2 mr-2 mb-2 flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#16a34a" />
              <Text className="text-green-700 font-medium ml-1">
                {recipe.cooking_time} min
              </Text>
            </View>

            <View className="bg-blue-50 rounded-lg px-3 py-2 mr-2 mb-2 flex-row items-center">
              <Ionicons name="bar-chart-outline" size={18} color="#3b82f6" />
              <Text className="text-blue-700 font-medium ml-1 capitalize">
                {recipe.difficulty}
              </Text>
            </View>

            <View className="bg-orange-50 rounded-lg px-3 py-2 mr-2 mb-2 flex-row items-center">
              <Ionicons name="people-outline" size={18} color="#f59e0b" />
              <Text className="text-orange-700 font-medium ml-1">
                {recipe.servings} servings
              </Text>
            </View>

            <View className="bg-purple-50 rounded-lg px-3 py-2 mb-2 flex-row items-center">
              <Ionicons name="restaurant-outline" size={18} color="#8b5cf6" />
              <Text className="text-purple-700 font-medium ml-1">
                {recipe.cuisine_type}
              </Text>
            </View>
          </View>

          {/* Nutrition Info */}
          {recipe.nutrition_info && (
            <View className="bg-gray-50 rounded-xl p-4 mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-3">
                Nutrition per serving
              </Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-xl font-bold text-gray-800">
                    {recipe.nutrition_info.calories}
                  </Text>
                  <Text className="text-xs text-gray-600">Calories</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-gray-800">
                    {recipe.nutrition_info.protein}g
                  </Text>
                  <Text className="text-xs text-gray-600">Protein</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-gray-800">
                    {recipe.nutrition_info.carbs}g
                  </Text>
                  <Text className="text-xs text-gray-600">Carbs</Text>
                </View>
                <View className="items-center">
                  <Text className="text-xl font-bold text-gray-800">
                    {recipe.nutrition_info.fat}g
                  </Text>
                  <Text className="text-xs text-gray-600">Fat</Text>
                </View>
              </View>
            </View>
          )}

          {/* Tabs */}
          <View className="flex-row mb-4">
            <TouchableOpacity
              className={`flex-1 py-3 border-b-2 ${
                activeTab === 'ingredients'
                  ? 'border-green-600'
                  : 'border-gray-200'
              }`}
              onPress={() => setActiveTab('ingredients')}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === 'ingredients'
                    ? 'text-green-600'
                    : 'text-gray-600'
                }`}
              >
                Ingredients ({recipe.ingredients.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-3 border-b-2 ${
                activeTab === 'instructions'
                  ? 'border-green-600'
                  : 'border-gray-200'
              }`}
              onPress={() => setActiveTab('instructions')}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === 'instructions'
                    ? 'text-green-600'
                    : 'text-gray-600'
                }`}
              >
                Instructions ({recipe.instructions.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'ingredients' ? (
            <View>
              {recipe.ingredients.map((ingredient: RecipeIngredient, index: number) => (
                <View
                  key={index}
                  className="flex-row items-center py-3 border-b border-gray-100"
                >
                  <View className="w-2 h-2 rounded-full bg-green-600 mr-3" />
                  <Text className="flex-1 text-base text-gray-800">
                    {ingredient.name}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {ingredient.quantity} {ingredient.unit}
                  </Text>
                  {ingredient.optional && (
                    <Text className="text-xs text-gray-500 ml-2">
                      (optional)
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View>
              {recipe.instructions.map((instruction: RecipeInstruction) => (
                <View key={instruction.step} className="mb-4">
                  <View className="flex-row items-start mb-2">
                    <View className="w-8 h-8 rounded-full bg-green-600 items-center justify-center mr-3">
                      <Text className="text-white font-bold">
                        {instruction.step}
                      </Text>
                    </View>
                    <Text className="flex-1 text-base text-gray-800 leading-6">
                      {instruction.description}
                    </Text>
                  </View>

                  {instruction.duration && (
                    <View className="flex-row items-center ml-11">
                      <Ionicons name="time-outline" size={14} color="#6b7280" />
                      <Text className="text-sm text-gray-600 ml-1">
                        {instruction.duration} minutes
                      </Text>
                    </View>
                  )}

                  {instruction.image_url && (
                    <Image
                      source={{ uri: instruction.image_url }}
                      className="w-full h-48 rounded-lg ml-11 mt-2"
                      resizeMode="cover"
                    />
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
