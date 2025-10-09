import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const quickActions = [
    {
      id: 1,
      title: 'MeghaMart Store',
      icon: 'cart',
      color: '#10b981',
      route: '/(tabs)/store',
    },
    {
      id: 2,
      title: 'Find Recipes',
      icon: 'search',
      color: '#f59e0b',
      route: '/(tabs)/recipes',
    },
    {
      id: 3,
      title: 'Scan Barcode',
      icon: 'barcode',
      color: '#3b82f6',
      route: '/barcode-scanner',
    },
    {
      id: 4,
      title: 'Community',
      icon: 'people',
      color: '#8b5cf6',
      route: '/(tabs)/community',
    },
  ];

  return (
    <ScrollView
      className="flex-1 bg-black"
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#16a34a"
        />
      }
    >
      <View className="p-6">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white mb-1">
            Welcome back! 👋
          </Text>
          <Text className="text-base text-gray-400">
            What would you like to cook today?
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="w-1/2 px-2 mb-4"
                onPress={() => router.push(action.route as any)}
              >
                <View className="bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-800">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: action.color + '20' }}
                  >
                    <Ionicons
                      name={action.icon as any}
                      size={24}
                      color={action.color}
                    />
                  </View>
                  <Text className="text-sm font-semibold text-white">
                    {action.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-white mb-3">
            Recent Activity
          </Text>
          <View className="bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-800">
            <Text className="text-gray-400 text-center py-4">
              No recent activity yet. Start by adding your groceries!
            </Text>
          </View>
        </View>

        {/* Suggested Recipes */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-white">
              Suggested Recipes
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/recipes')}>
              <Text className="text-green-600 font-medium">See All</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-800">
            <Text className="text-gray-400 text-center py-4">
              Add groceries to get personalized recipe suggestions!
            </Text>
          </View>
        </View>

        {/* Tips Section */}
        <View className="bg-green-900 rounded-xl p-4 border border-green-700">
          <View className="flex-row items-start">
            <Ionicons name="bulb" size={24} color="#16a34a" />
            <View className="flex-1 ml-3">
              <Text className="text-base font-semibold text-green-400 mb-1">
                Pro Tip
              </Text>
              <Text className="text-sm text-green-300">
                Keep your grocery list updated to get the best recipe
                suggestions based on what you have!
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
