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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password, rememberMe);
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
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
            SnackIt
          </Text>
          <Text className="text-base text-gray-400 text-center">
            Your smart cooking companion
          </Text>
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

        <TouchableOpacity
          className="flex-row items-center mb-6"
          onPress={() => setRememberMe(!rememberMe)}
          disabled={loading}
        >
          <View
            className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
              rememberMe
                ? 'bg-green-600 border-green-600'
                : 'bg-gray-900 border-gray-700'
            }`}
          >
            {rememberMe && <Text className="text-white text-xs">✓</Text>}
          </View>
          <Text className="text-gray-300 text-base">Remember me</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`bg-green-600 rounded-lg py-4 mb-4 ${loading ? 'opacity-50' : ''}`}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-semibold text-base">
              Login
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px bg-gray-700" />
          <Text className="mx-4 text-gray-500">OR</Text>
          <View className="flex-1 h-px bg-gray-700" />
        </View>

        <TouchableOpacity
          className={`bg-gray-900 border-2 border-gray-700 rounded-lg py-4 mb-4 ${loading ? 'opacity-50' : ''}`}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          <Text className="text-gray-300 text-center font-semibold text-base">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-400">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text className="text-green-600 font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
