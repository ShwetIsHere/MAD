import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';

interface Post {
  id: string;
  user_id: string;
  username: string;
  user_avatar?: string;
  image_url: string;
  caption: string;
  likes: number;
  comments: number;
  created_at: string;
  liked_by_user: boolean;
}

export default function CommunityScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // This is mock data - you'll need to create a posts table in Supabase
      const mockPosts: Post[] = [
        {
          id: '1',
          user_id: 'user1',
          username: 'pieroborgo',
          user_avatar: undefined,
          image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500',
          caption: 'Thanks for donating! #recipe #delicious',
          likes: 2345,
          comments: 123,
          created_at: new Date().toISOString(),
          liked_by_user: false,
        },
        {
          id: '2',
          user_id: 'user2',
          username: 'foodlover',
          user_avatar: undefined,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
          caption: 'Homemade pasta! Best recipe ever 🍝',
          likes: 1823,
          comments: 89,
          created_at: new Date().toISOString(),
          liked_by_user: true,
        },
        {
          id: '3',
          user_id: 'user3',
          username: 'chefmaster',
          user_avatar: undefined,
          image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500',
          caption: 'Perfect breakfast bowl 🥗 #healthy #breakfast',
          likes: 3421,
          comments: 234,
          created_at: new Date().toISOString(),
          liked_by_user: false,
        },
      ];
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked_by_user: !post.liked_by_user,
            likes: post.liked_by_user ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
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
      {/* Stories Section */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-800 py-3"
      >
        <View className="flex-row px-3">
          {/* Your Story */}
          <View className="items-center mr-4">
            <View className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-pink-600 p-0.5">
              <View className="w-full h-full rounded-full bg-gray-800 items-center justify-center">
                <Ionicons name="add" size={24} color="#16a34a" />
              </View>
            </View>
            <Text className="text-white text-xs mt-1">Your Story</Text>
          </View>

          {/* Other Stories */}
          {['pieroborgo', 'foodlover', 'chefmaster', 'recipes', 'tavishthej'].map((name, index) => (
            <View key={index} className="items-center mr-4">
              <View className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-pink-600 p-0.5">
                <View className="w-full h-full rounded-full bg-gray-700 items-center justify-center">
                  <Text className="text-white text-2xl">
                    {name[0].toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text className="text-white text-xs mt-1 max-w-[64px]" numberOfLines={1}>
                {name}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Posts Feed */}
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#16a34a"
          />
        }
      >
        {posts.map((post) => (
          <View key={post.id} className="mb-4">
            {/* Post Header */}
            <View className="flex-row items-center justify-between px-3 py-2">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center mr-2">
                  <Text className="text-white text-sm">
                    {post.username[0].toUpperCase()}
                  </Text>
                </View>
                <Text className="text-white font-semibold">{post.username}</Text>
                <Text className="text-gray-400 ml-1">• 5m</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Post Image */}
            <Image
              source={{ uri: post.image_url }}
              className="w-full aspect-square"
              resizeMode="cover"
            />

            {/* Post Actions */}
            <View className="flex-row items-center justify-between px-3 py-2">
              <View className="flex-row items-center">
                <TouchableOpacity 
                  className="mr-4"
                  onPress={() => toggleLike(post.id)}
                >
                  <Ionicons 
                    name={post.liked_by_user ? "heart" : "heart-outline"} 
                    size={28} 
                    color={post.liked_by_user ? "#dc2626" : "white"} 
                  />
                </TouchableOpacity>
                <TouchableOpacity className="mr-4">
                  <Ionicons name="chatbubble-outline" size={26} color="white" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="paper-plane-outline" size={26} color="white" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Ionicons name="bookmark-outline" size={26} color="white" />
              </TouchableOpacity>
            </View>

            {/* Likes Count */}
            <View className="px-3">
              <Text className="text-white font-semibold">
                {post.likes.toLocaleString()} likes
              </Text>
            </View>

            {/* Caption */}
            <View className="px-3 mt-1">
              <Text className="text-white">
                <Text className="font-semibold">{post.username}</Text>
                {' '}
                {post.caption}
              </Text>
            </View>

            {/* Comments */}
            {post.comments > 0 && (
              <TouchableOpacity className="px-3 mt-1">
                <Text className="text-gray-400">
                  View all {post.comments} comments
                </Text>
              </TouchableOpacity>
            )}

            {/* Time */}
            <View className="px-3 mt-1">
              <Text className="text-gray-500 text-xs">
                {new Date(post.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
