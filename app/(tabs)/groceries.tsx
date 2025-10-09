import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';
import { GroceryItem, GroceryCategory } from '../../types';

export default function GroceriesScreen() {
  const { user } = useAuth();
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'other' as GroceryCategory,
    quantity: '1',
    unit: 'piece',
    expiry_date: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories: GroceryCategory[] = [
    'vegetables',
    'fruits',
    'grains',
    'dairy',
    'meat',
    'seafood',
    'spices',
    'condiments',
    'beverages',
    'other',
  ];

  const units = ['piece', 'kg', 'g', 'l', 'ml', 'cup', 'tbsp', 'tsp', 'oz'];

  useEffect(() => {
    loadGroceries();
  }, []);

  const loadGroceries = async () => {
    try {
      const { data, error } = await supabase
        .from('groceries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroceries(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'other',
      quantity: '1',
      unit: 'piece',
      expiry_date: new Date(),
    });
    setModalVisible(true);
  };

  const openEditModal = (item: GroceryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category as GroceryCategory,
      quantity: item.quantity.toString(),
      unit: item.unit,
      expiry_date: item.expiry_date ? new Date(item.expiry_date) : new Date(),
    });
    setModalVisible(true);
  };

  const saveGrocery = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter item name');
      return;
    }

    try {
      const groceryData = {
        user_id: user?.id,
        name: formData.name.trim(),
        category: formData.category,
        quantity: parseFloat(formData.quantity) || 1,
        unit: formData.unit,
        expiry_date: formData.expiry_date.toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (editingItem) {
        const { error } = await supabase
          .from('groceries')
          .update(groceryData)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('groceries')
          .insert({ ...groceryData, created_at: new Date().toISOString() });

        if (error) throw error;
      }

      setModalVisible(false);
      loadGroceries();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const deleteGrocery = async (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('groceries')
              .delete()
              .eq('id', id);

            if (error) throw error;
            loadGroceries();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      vegetables: '🥬',
      fruits: '🍎',
      grains: '🌾',
      dairy: '🥛',
      meat: '🥩',
      seafood: '🐟',
      spices: '🌶️',
      condiments: '🧂',
      beverages: '☕',
      other: '📦',
    };
    return icons[category] || '📦';
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 3 && diffDays >= 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const groupByCategory = () => {
    const grouped: Record<string, GroceryItem[]> = {};
    groceries.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  const groupedGroceries = groupByCategory();

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6">
        {groceries.length === 0 ? (
          <View className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 items-center">
            <Ionicons name="cart-outline" size={64} color="#d1d5db" />
            <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">
              No Groceries Yet
            </Text>
            <Text className="text-sm text-gray-600 text-center mb-4">
              Start adding your groceries to get personalized recipe
              suggestions!
            </Text>
            <TouchableOpacity
              className="bg-green-600 rounded-lg px-6 py-3"
              onPress={openAddModal}
            >
              <Text className="text-white font-semibold">Add First Item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {Object.entries(groupedGroceries).map(([category, items]) => (
              <View key={category} className="mb-6">
                <View className="flex-row items-center mb-3">
                  <Text className="text-2xl mr-2">
                    {getCategoryIcon(category)}
                  </Text>
                  <Text className="text-lg font-semibold text-gray-800 capitalize">
                    {category}
                  </Text>
                  <Text className="text-sm text-gray-500 ml-2">
                    ({items.length})
                  </Text>
                </View>

                {items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="bg-white rounded-xl p-4 mb-2 shadow-sm border border-gray-100"
                    onPress={() => openEditModal(item)}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-800 mb-1">
                          {item.name}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {item.quantity} {item.unit}
                        </Text>
                        {item.expiry_date && (
                          <View className="flex-row items-center mt-1">
                            <Ionicons
                              name="calendar-outline"
                              size={14}
                              color={
                                isExpired(item.expiry_date)
                                  ? '#dc2626'
                                  : isExpiringSoon(item.expiry_date)
                                    ? '#f59e0b'
                                    : '#6b7280'
                              }
                            />
                            <Text
                              className={`text-xs ml-1 ${
                                isExpired(item.expiry_date)
                                  ? 'text-red-600'
                                  : isExpiringSoon(item.expiry_date)
                                    ? 'text-orange-600'
                                    : 'text-gray-500'
                              }`}
                            >
                              {isExpired(item.expiry_date)
                                ? 'Expired'
                                : isExpiringSoon(item.expiry_date)
                                  ? 'Expiring Soon'
                                  : new Date(
                                      item.expiry_date
                                    ).toLocaleDateString()}
                            </Text>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        onPress={() => deleteGrocery(item.id)}
                        className="p-2"
                      >
                        <Ionicons name="trash-outline" size={20} color="#dc2626" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-green-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={openAddModal}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                {editingItem ? 'Edit Item' : 'Add Item'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                  placeholder="e.g., Tomatoes"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                />
              </View>

              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Category
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      className={`mr-2 px-4 py-2 rounded-lg ${
                        formData.category === cat
                          ? 'bg-green-600'
                          : 'bg-gray-200'
                      }`}
                      onPress={() => setFormData({ ...formData, category: cat })}
                    >
                      <Text
                        className={`capitalize ${
                          formData.category === cat
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                    placeholder="1"
                    value={formData.quantity}
                    onChangeText={(text) =>
                      setFormData({ ...formData, quantity: text })
                    }
                    keyboardType="numeric"
                  />
                </View>

                <View className="flex-1 ml-2">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {units.map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        className={`mr-2 px-3 py-3 rounded-lg ${
                          formData.unit === unit ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                        onPress={() => setFormData({ ...formData, unit })}
                      >
                        <Text
                          className={
                            formData.unit === unit
                              ? 'text-white'
                              : 'text-gray-700'
                          }
                        >
                          {unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Expiry Date (Optional)
                </Text>
                <TouchableOpacity
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text className="text-base text-gray-800">
                    {formData.expiry_date.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={formData.expiry_date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selectedDate) {
                        setFormData({ ...formData, expiry_date: selectedDate });
                      }
                    }}
                  />
                )}
              </View>

              <TouchableOpacity
                className="bg-green-600 rounded-lg py-4"
                onPress={saveGrocery}
              >
                <Text className="text-white text-center font-semibold text-base">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
