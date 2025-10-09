import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { MealPlan, Recipe } from '../../types';

export default function MealPlanScreen() {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  useEffect(() => {
    loadMealPlans();
  }, [selectedDate]);

  const loadMealPlans = async () => {
    try {
      const startOfWeek = getStartOfWeek(selectedDate);
      const endOfWeek = getEndOfWeek(selectedDate);

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*, recipe:recipes(*)')
        .eq('user_id', user?.id)
        .gte('date', startOfWeek.toISOString().split('T')[0])
        .lte('date', endOfWeek.toISOString().split('T')[0]);

      if (error) throw error;
      setMealPlans(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date: Date) => {
    const start = getStartOfWeek(date);
    return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  };

  const getWeekDates = () => {
    const start = getStartOfWeek(selectedDate);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getMealForSlot = (date: Date, mealType: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return mealPlans.find(
      (meal) => meal.date === dateStr && meal.meal_type === mealType
    );
  };

  const generateShoppingList = async () => {
    Alert.alert(
      'Generate Shopping List',
      'This will create a shopping list based on your meal plan for the week.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            try {
              // Get all recipes for the week
              const recipes = mealPlans
                .map((meal) => meal.recipe)
                .filter(Boolean);

              // Aggregate ingredients
              const ingredients: Record<string, any> = {};

              recipes.forEach((recipe: any) => {
                recipe.ingredients?.forEach((ing: any) => {
                  const key = `${ing.name}_${ing.unit}`;
                  if (ingredients[key]) {
                    ingredients[key].quantity += ing.quantity;
                  } else {
                    ingredients[key] = { ...ing };
                  }
                });
              });

              // Insert into shopping list
              const shoppingListItems = Object.values(ingredients).map(
                (ing: any) => ({
                  user_id: user?.id,
                  name: ing.name,
                  quantity: ing.quantity,
                  unit: ing.unit,
                  category: 'other',
                  is_purchased: false,
                  created_at: new Date().toISOString(),
                })
              );

              const { error } = await supabase
                .from('shopping_list')
                .insert(shoppingListItems);

              if (error) throw error;

              Alert.alert('Success', 'Shopping list generated!');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const previousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  const weekDates = getWeekDates();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Week Navigation */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={previousWeek} className="p-2">
            <Ionicons name="chevron-back" size={24} color="#16a34a" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-gray-800">
            {getStartOfWeek(selectedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}{' '}
            -{' '}
            {getEndOfWeek(selectedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>

          <TouchableOpacity onPress={nextWeek} className="p-2">
            <Ionicons name="chevron-forward" size={24} color="#16a34a" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-green-600 rounded-lg py-2"
          onPress={generateShoppingList}
        >
          <Text className="text-white text-center font-semibold">
            Generate Shopping List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Meal Plan Grid */}
      <ScrollView className="flex-1">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="p-4">
            {/* Header Row - Days */}
            <View className="flex-row mb-2">
              <View className="w-24" />
              {weekDates.map((date, index) => (
                <View
                  key={index}
                  className={`w-32 mx-1 p-2 rounded-lg items-center ${
                    date.toDateString() === new Date().toDateString()
                      ? 'bg-green-100'
                      : 'bg-white'
                  }`}
                >
                  <Text className="text-xs text-gray-600">
                    {daysOfWeek[date.getDay()]}
                  </Text>
                  <Text className="text-base font-bold text-gray-800">
                    {date.getDate()}
                  </Text>
                </View>
              ))}
            </View>

            {/* Meal Rows */}
            {mealTypes.map((mealType) => (
              <View key={mealType} className="flex-row mb-2">
                <View className="w-24 justify-center">
                  <Text className="text-sm font-semibold text-gray-700 capitalize">
                    {mealType}
                  </Text>
                </View>

                {weekDates.map((date, index) => {
                  const meal = getMealForSlot(date, mealType);

                  return (
                    <TouchableOpacity
                      key={index}
                      className="w-32 h-24 mx-1 bg-white rounded-lg border border-gray-200 p-2"
                      onPress={() => {
                        // Navigate to recipe selection
                      }}
                    >
                      {meal && meal.recipe ? (
                        <View className="flex-1">
                          <Text
                            className="text-xs font-semibold text-gray-800"
                            numberOfLines={2}
                          >
                            {meal.recipe.title}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <Ionicons
                              name="time-outline"
                              size={12}
                              color="#6b7280"
                            />
                            <Text className="text-xs text-gray-600 ml-1">
                              {meal.recipe.cooking_time} min
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View className="flex-1 items-center justify-center">
                          <Ionicons name="add" size={24} color="#d1d5db" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Empty State */}
      {mealPlans.length === 0 && (
        <View className="absolute inset-0 items-center justify-center pointer-events-none">
          <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
          <Text className="text-lg font-semibold text-gray-800 mt-4">
            No Meal Plans Yet
          </Text>
          <Text className="text-sm text-gray-600 text-center px-8 mt-2">
            Start planning your meals by tapping on any slot above!
          </Text>
        </View>
      )}
    </View>
  );
}
