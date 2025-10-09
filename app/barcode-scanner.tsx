import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function BarcodeScannerScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert(
      'Barcode Scanned!',
      `Type: ${type}\nData: ${data}\n\nThis feature will look up product information and add it to your groceries.`,
      [
        {
          text: 'Scan Again',
          onPress: () => setScanned(false),
        },
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-black p-6">
        <Ionicons name="camera-outline" size={64} color="white" />
        <Text className="text-white text-lg font-semibold mt-4 text-center">
          No access to camera
        </Text>
        <Text className="text-gray-400 text-center mt-2">
          Please enable camera permissions in your device settings
        </Text>
        <TouchableOpacity
          className="bg-green-600 rounded-lg px-6 py-3 mt-6"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: [
            'ean13',
            'ean8',
            'upc_a',
            'upc_e',
            'qr',
            'code128',
            'code39',
          ],
        }}
      />

      {/* Header */}
      <View className="absolute top-0 left-0 right-0 bg-black/60 p-4 pt-12">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="bg-white/20 rounded-full p-2"
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">
            Scan Barcode
          </Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Scanning Frame */}
      <View className="flex-1 justify-center items-center">
        <View className="w-64 h-64 border-2 border-white rounded-lg">
          <View className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-green-500" />
          <View className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-green-500" />
          <View className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-green-500" />
          <View className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-green-500" />
        </View>
      </View>

      {/* Instructions */}
      <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-6">
        <Text className="text-white text-center text-base">
          Position the barcode within the frame to scan
        </Text>
        {scanned && (
          <TouchableOpacity
            className="bg-green-600 rounded-lg py-3 mt-4"
            onPress={() => setScanned(false)}
          >
            <Text className="text-white text-center font-semibold">
              Tap to Scan Again
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
