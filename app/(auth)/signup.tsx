import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, username);
    setLoading(false);

    if (error) {
      Alert.alert('Signup Failed', error.message);
    } else {
      Alert.alert(
        'Success',
        'Account created! Please check your email for verification.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-black"
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-10">
          <Text className="text-4xl font-bold text-green-600 text-center mb-2">
            Create Account
          </Text>
          <Text className="text-base text-gray-400 text-center">
            Join SnackIt and start cooking!
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-300 mb-2">
            Username
          </Text>
          <TextInput
            className="border border-gray-700 bg-gray-900 text-white rounded-lg px-4 py-3 text-base"
            placeholder="Choose a username"
            placeholderTextColor="#6b7280"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-300 mb-2">Email</Text>
          <TextInput
            className="border border-gray-700 bg-gray-900 text-white rounded-lg px-4 py-3 text-base"
            placeholder="Enter your email"
            placeholderTextColor="#6b7280"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-300 mb-2">
            Password
          </Text>
          <TextInput
            className="border border-gray-700 bg-gray-900 text-white rounded-lg px-4 py-3 text-base"
            placeholder="Enter your password"
            placeholderTextColor="#6b7280"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </Text>
          <TextInput
            className="border border-gray-700 bg-gray-900 text-white rounded-lg px-4 py-3 text-base"
            placeholder="Confirm your password"
            placeholderTextColor="#6b7280"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          className={`bg-green-600 rounded-lg py-4 mb-4 ${loading ? 'opacity-50' : ''}`}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-green-600 font-semibold">Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
