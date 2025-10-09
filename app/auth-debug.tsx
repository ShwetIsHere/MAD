/**
 * DEBUG UTILITY - Auth State Checker
 * 
 * Add this temporarily to your app to check authentication state
 * You can add a button in profile.tsx or anywhere to navigate here
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';

export default function AuthDebugScreen() {
  const { session, user } = useAuth();
  const [storageData, setStorageData] = useState<any>({});

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data: any = {};

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        data[key] = value;
      }

      setStorageData(data);
    } catch (error) {
      console.error('Error loading storage:', error);
    }
  };

  const testRememberMe = async () => {
    try {
      const value = await AsyncStorage.getItem('rememberMe');
      Alert.alert('Remember Me Value', value || 'Not set');
    } catch (error) {
      Alert.alert('Error', String(error));
    }
  };

  const setRememberMeTrue = async () => {
    await AsyncStorage.setItem('rememberMe', 'true');
    Alert.alert('Success', 'Remember Me set to TRUE');
    loadStorageData();
  };

  const setRememberMeFalse = async () => {
    await AsyncStorage.setItem('rememberMe', 'false');
    Alert.alert('Success', 'Remember Me set to FALSE');
    loadStorageData();
  };

  const clearRememberMe = async () => {
    await AsyncStorage.removeItem('rememberMe');
    Alert.alert('Success', 'Remember Me cleared');
    loadStorageData();
  };

  const checkSupabaseSession = async () => {
    const { data } = await supabase.auth.getSession();
    Alert.alert(
      'Supabase Session',
      data.session ? `Logged in as: ${data.session.user.email}` : 'No session found'
    );
  };

  const clearAllStorage = async () => {
    Alert.alert(
      'Warning',
      'This will clear ALL AsyncStorage data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Success', 'All storage cleared');
            loadStorageData();
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="p-6">
        <Text className="text-2xl font-bold text-green-600 mb-6">
          Auth Debug Screen
        </Text>

        {/* Auth Context State */}
        <View className="bg-gray-900 rounded-xl p-4 mb-4 border border-gray-800">
          <Text className="text-lg font-bold text-gray-200 mb-2">
            Auth Context State
          </Text>
          <Text className="text-gray-400 mb-1">
            Session: {session ? '✅ Active' : '❌ None'}
          </Text>
          <Text className="text-gray-400 mb-1">
            User Email: {user?.email || 'Not logged in'}
          </Text>
          <Text className="text-gray-400">
            User ID: {user?.id?.substring(0, 20) || 'N/A'}...
          </Text>
        </View>

        {/* AsyncStorage Data */}
        <View className="bg-gray-900 rounded-xl p-4 mb-4 border border-gray-800">
          <Text className="text-lg font-bold text-gray-200 mb-2">
            AsyncStorage Data
          </Text>
          {Object.keys(storageData).length === 0 ? (
            <Text className="text-gray-400">No data stored</Text>
          ) : (
            Object.entries(storageData).map(([key, value]) => (
              <View key={key} className="mb-2">
                <Text className="text-green-500 font-mono text-xs">{key}</Text>
                <Text className="text-gray-400 font-mono text-xs" numberOfLines={2}>
                  {String(value).substring(0, 100)}...
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View className="bg-gray-900 rounded-xl p-4 mb-4 border border-gray-800">
          <Text className="text-lg font-bold text-gray-200 mb-3">
            Quick Actions
          </Text>

          <TouchableOpacity
            className="bg-green-600 rounded-lg py-3 mb-2"
            onPress={testRememberMe}
          >
            <Text className="text-white text-center font-semibold">
              Check Remember Me Value
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-3 mb-2"
            onPress={checkSupabaseSession}
          >
            <Text className="text-white text-center font-semibold">
              Check Supabase Session
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-700 rounded-lg py-3 mb-2"
            onPress={loadStorageData}
          >
            <Text className="text-white text-center font-semibold">
              Refresh Storage Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* Remember Me Controls */}
        <View className="bg-gray-900 rounded-xl p-4 mb-4 border border-gray-800">
          <Text className="text-lg font-bold text-gray-200 mb-3">
            Remember Me Controls
          </Text>

          <TouchableOpacity
            className="bg-green-700 rounded-lg py-3 mb-2"
            onPress={setRememberMeTrue}
          >
            <Text className="text-white text-center font-semibold">
              Set Remember Me = TRUE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-orange-600 rounded-lg py-3 mb-2"
            onPress={setRememberMeFalse}
          >
            <Text className="text-white text-center font-semibold">
              Set Remember Me = FALSE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-700 rounded-lg py-3"
            onPress={clearRememberMe}
          >
            <Text className="text-white text-center font-semibold">
              Clear Remember Me
            </Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="bg-red-900 rounded-xl p-4 border border-red-700">
          <Text className="text-lg font-bold text-red-200 mb-3">
            ⚠️ Danger Zone
          </Text>

          <TouchableOpacity
            className="bg-red-700 rounded-lg py-3"
            onPress={clearAllStorage}
          >
            <Text className="text-white text-center font-semibold">
              Clear ALL Storage Data
            </Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-800">
          <Text className="text-gray-200 font-bold mb-2">How to Use:</Text>
          <Text className="text-gray-400 text-sm mb-1">
            1. Check current Remember Me value
          </Text>
          <Text className="text-gray-400 text-sm mb-1">
            2. Test by setting it to TRUE or FALSE
          </Text>
          <Text className="text-gray-400 text-sm mb-1">
            3. Close and reopen the app
          </Text>
          <Text className="text-gray-400 text-sm">
            4. TRUE = Stay logged in, FALSE = Must login again
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
