import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { DietaryPreferences, UserProfile } from '../types';
import { router } from 'expo-router';

export default function EditProfileScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    username: '',
    full_name: '',
    dietary_preferences: {
      diet_type: 'any',
      allergies: [],
      dislikes: [],
      preferred_cuisines: [],
    },
  });

  const [allergyInput, setAllergyInput] = useState('');
  const [dislikeInput, setDislikeInput] = useState('');

  const dietTypes = [
    { value: 'any', label: 'Any', icon: '🍽️' },
    { value: 'veg', label: 'Vegetarian', icon: '🥗' },
    { value: 'vegan', label: 'Vegan', icon: '🌱' },
    { value: 'non-veg', label: 'Non-Veg', icon: '🍖' },
    { value: 'pescatarian', label: 'Pescatarian', icon: '🐟' },
  ];

  const cuisineTypes = [
    'Indian',
    'Italian',
    'Chinese',
    'Mexican',
    'Thai',
    'Japanese',
    'Mediterranean',
    'American',
  ];

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

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        email: user?.email,
        username: profile.username,
        full_name: profile.full_name,
        dietary_preferences: profile.dietary_preferences,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const addAllergy = () => {
    if (allergyInput.trim()) {
      setProfile({
        ...profile,
        dietary_preferences: {
          ...profile.dietary_preferences!,
          allergies: [
            ...profile.dietary_preferences!.allergies,
            allergyInput.trim(),
          ],
        },
      });
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setProfile({
      ...profile,
      dietary_preferences: {
        ...profile.dietary_preferences!,
        allergies: profile.dietary_preferences!.allergies.filter(
          (a) => a !== allergy
        ),
      },
    });
  };

  const addDislike = () => {
    if (dislikeInput.trim()) {
      setProfile({
        ...profile,
        dietary_preferences: {
          ...profile.dietary_preferences!,
          dislikes: [
            ...profile.dietary_preferences!.dislikes,
            dislikeInput.trim(),
          ],
        },
      });
      setDislikeInput('');
    }
  };

  const removeDislike = (dislike: string) => {
    setProfile({
      ...profile,
      dietary_preferences: {
        ...profile.dietary_preferences!,
        dislikes: profile.dietary_preferences!.dislikes.filter(
          (d) => d !== dislike
        ),
      },
    });
  };

  const toggleCuisine = (cuisine: string) => {
    const cuisines = profile.dietary_preferences!.preferred_cuisines;
    const updated = cuisines.includes(cuisine)
      ? cuisines.filter((c) => c !== cuisine)
      : [...cuisines, cuisine];

    setProfile({
      ...profile,
      dietary_preferences: {
        ...profile.dietary_preferences!,
        preferred_cuisines: updated,
      },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="p-6">
        {/* Header */}
        <View className="bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-800 mb-6">
          <View className="items-center mb-4">
            <View className="w-20 h-20 rounded-full bg-green-900 items-center justify-center mb-3">
              <Ionicons name="person" size={40} color="#16a34a" />
            </View>
            <Text className="text-xl font-bold text-gray-200">
              {user?.email}
            </Text>
          </View>

          <TextInput
            className="border border-gray-700 bg-gray-800 text-gray-200 rounded-lg px-4 py-3 text-base mb-3"
            placeholder="Username"
            placeholderTextColor="#6b7280"
            value={profile.username}
            onChangeText={(text) => setProfile({ ...profile, username: text })}
            autoCapitalize="none"
          />

          <TextInput
            className="border border-gray-700 bg-gray-800 text-gray-200 rounded-lg px-4 py-3 text-base"
            placeholder="Full Name"
            placeholderTextColor="#6b7280"
            value={profile.full_name}
            onChangeText={(text) => setProfile({ ...profile, full_name: text })}
          />
        </View>

        {/* Diet Type */}
        <View className="bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-800 mb-6">
          <Text className="text-lg font-semibold text-gray-200 mb-4">
            Diet Type
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            {dietTypes.map((diet) => (
              <TouchableOpacity
                key={diet.value}
                className="w-1/3 px-2 mb-3"
                onPress={() =>
                  setProfile({
                    ...profile,
                    dietary_preferences: {
                      ...profile.dietary_preferences!,
                      diet_type: diet.value as any,
                    },
                  })
                }
              >
                <View
                  className={`border-2 rounded-lg p-3 items-center ${
                    profile.dietary_preferences?.diet_type === diet.value
                      ? 'border-green-600 bg-green-900'
                      : 'border-gray-700 bg-gray-800'
                  }`}
                >
                  <Text className="text-2xl mb-1">{diet.icon}</Text>
                  <Text
                    className={`text-xs font-medium ${
                      profile.dietary_preferences?.diet_type === diet.value
                        ? 'text-green-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {diet.label}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Allergies */}
        <View className="bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-800 mb-6">
          <Text className="text-lg font-semibold text-gray-200 mb-4">
            Allergies
          </Text>
          <View className="flex-row mb-3">
            <TextInput
              className="flex-1 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg px-4 py-2 text-base mr-2"
              placeholder="Add allergy"
              placeholderTextColor="#6b7280"
              value={allergyInput}
              onChangeText={setAllergyInput}
            />
            <TouchableOpacity
              className="bg-green-600 rounded-lg px-4 justify-center"
              onPress={addAllergy}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap">
            {profile.dietary_preferences?.allergies.map((allergy, index) => (
              <View
                key={index}
                className="bg-red-900 rounded-full px-3 py-2 mr-2 mb-2 flex-row items-center"
              >
                <Text className="text-red-300 text-sm mr-1">{allergy}</Text>
                <TouchableOpacity onPress={() => removeAllergy(allergy)}>
                  <Ionicons name="close-circle" size={16} color="#fca5a5" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Dislikes */}
        <View className="bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-800 mb-6">
          <Text className="text-lg font-semibold text-gray-200 mb-4">
            Dislikes
          </Text>
          <View className="flex-row mb-3">
            <TextInput
              className="flex-1 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg px-4 py-2 text-base mr-2"
              placeholder="Add dislike"
              placeholderTextColor="#6b7280"
              value={dislikeInput}
              onChangeText={setDislikeInput}
            />
            <TouchableOpacity
              className="bg-green-600 rounded-lg px-4 justify-center"
              onPress={addDislike}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap">
            {profile.dietary_preferences?.dislikes.map((dislike, index) => (
              <View
                key={index}
                className="bg-orange-900 rounded-full px-3 py-2 mr-2 mb-2 flex-row items-center"
              >
                <Text className="text-orange-300 text-sm mr-1">{dislike}</Text>
                <TouchableOpacity onPress={() => removeDislike(dislike)}>
                  <Ionicons name="close-circle" size={16} color="#fdba74" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Preferred Cuisines */}
        <View className="bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-800 mb-6">
          <Text className="text-lg font-semibold text-gray-200 mb-4">
            Preferred Cuisines
          </Text>
          <View className="flex-row flex-wrap -mx-1">
            {cuisineTypes.map((cuisine) => (
              <TouchableOpacity
                key={cuisine}
                className="px-1 mb-2"
                onPress={() => toggleCuisine(cuisine)}
              >
                <View
                  className={`rounded-full px-4 py-2 ${
                    profile.dietary_preferences?.preferred_cuisines.includes(
                      cuisine
                    )
                      ? 'bg-green-600'
                      : 'bg-gray-800'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      profile.dietary_preferences?.preferred_cuisines.includes(
                        cuisine
                      )
                        ? 'text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    {cuisine}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          className={`bg-green-600 rounded-lg py-4 mb-4 ${saving ? 'opacity-50' : ''}`}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Save Profile
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
