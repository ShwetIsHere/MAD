import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { UserProfile } from '../../types';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const imageSize = (width - 6) / 3;

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    full_name: '',
  });
  const [activeTab, setActiveTab] = useState<'grid' | 'saved'>('grid');

  // Mock posts data
  const mockPosts = Array(12).fill(null).map((_, i) => ({
    id: i.toString(),
    image: `https://images.unsplash.com/photo-${1565299624946 + i * 100}-b28f40a0ae38?w=400`,
  }));

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <ScrollView>
        {/* Profile Header */}
        <View className="p-4">
          {/* Profile Info */}
          <View className="flex-row items-center mb-4">
            {/* Profile Picture */}
            <View className="w-20 h-20 rounded-full bg-gray-800 items-center justify-center mr-4">
              <Text className="text-white text-3xl">
                {(profile.username || profile.full_name || user?.email || 'U')[0].toUpperCase()}
              </Text>
            </View>

            {/* Stats */}
            <View className="flex-1 flex-row justify-around">
              <View className="items-center">
                <Text className="text-white font-bold text-base">210</Text>
                <Text className="text-gray-400 text-xs">Posts</Text>
              </View>
              <View className="items-center">
                <Text className="text-white font-bold text-base">600</Text>
                <Text className="text-gray-400 text-xs">Followers</Text>
              </View>
              <View className="items-center">
                <Text className="text-white font-bold text-base">500</Text>
                <Text className="text-gray-400 text-xs">Following</Text>
              </View>
            </View>
          </View>

          {/* Name and Bio */}
          <View className="mb-4">
            <Text className="text-white font-semibold text-base">
              {profile.username || profile.full_name || 'User'}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              {profile.full_name || user?.email}
            </Text>
            <Text className="text-white text-sm mt-2">
              🍳 Food lover | Recipe creator
            </Text>
            <Text className="text-white text-sm">
              📍 Your kitchen adventures
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-2 mb-4">
            <TouchableOpacity 
              className="flex-1 bg-gray-800 rounded-lg py-2"
              onPress={() => router.push('/edit-profile')}
            >
              <Text className="text-white text-center font-semibold text-sm">
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-gray-800 rounded-lg py-2"
              onPress={handleSignOut}
            >
              <Text className="text-white text-center font-semibold text-sm">
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>

          {/* DEBUG BUTTON - Remove after testing */}
          <TouchableOpacity 
            className="bg-yellow-600 rounded-lg py-2 mb-4"
            onPress={() => router.push('/auth-debug')}
          >
            <Text className="text-black text-center font-semibold text-sm">
              🐛 Auth Debug (Remove Later)
            </Text>
          </TouchableOpacity>

          {/* Story Highlights (optional) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            <View className="flex-row">
              {['Recipes', 'Meals', 'Tips', 'Favorites'].map((highlight, index) => (
                <View key={index} className="items-center mr-4">
                  <View className="w-16 h-16 rounded-full bg-gray-800 items-center justify-center border-2 border-gray-700">
                    <Ionicons name="restaurant" size={24} color="#6b7280" />
                  </View>
                  <Text className="text-white text-xs mt-1">{highlight}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Tabs */}
        <View className="flex-row border-t border-gray-800">
          <TouchableOpacity 
            className="flex-1 py-3 items-center border-b-2"
            style={{ borderBottomColor: activeTab === 'grid' ? '#fff' : 'transparent' }}
            onPress={() => setActiveTab('grid')}
          >
            <Ionicons 
              name="grid" 
              size={24} 
              color={activeTab === 'grid' ? '#fff' : '#6b7280'} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 py-3 items-center border-b-2"
            style={{ borderBottomColor: activeTab === 'saved' ? '#fff' : 'transparent' }}
            onPress={() => setActiveTab('saved')}
          >
            <Ionicons 
              name="bookmark" 
              size={24} 
              color={activeTab === 'saved' ? '#fff' : '#6b7280'} 
            />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <View className="flex-row flex-wrap">
          {mockPosts.map((post, index) => (
            <TouchableOpacity
              key={post.id}
              style={{ 
                width: imageSize, 
                height: imageSize,
                margin: 1,
              }}
            >
              <Image
                source={{ uri: post.image }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
