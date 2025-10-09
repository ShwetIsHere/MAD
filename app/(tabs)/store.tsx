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
import { useAuth } from '../../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StoreItem {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  discount?: number;
}

interface CartItem extends StoreItem {
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  timestamp: string;
  status: 'delivered';
}

const CART_KEY = 'meghamart_cart';
const ORDERS_KEY = 'meghamart_orders';
const INVENTORY_KEY = 'meghamart_inventory';

export default function StoreScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showCart, setShowCart] = useState(false);

  const categories = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grains', 'Spices'];

  // MeghaMart inventory
  const initialInventory: StoreItem[] = [
    {
      id: '1',
      name: 'Potato',
      category: 'Vegetables',
      price: 30,
      unit: 'kg',
      stock: 50,
      image: '🥔',
      discount: 10,
    },
    {
      id: '2',
      name: 'Onion',
      category: 'Vegetables',
      price: 40,
      unit: 'kg',
      stock: 45,
      image: '🧅',
    },
    {
      id: '3',
      name: 'Tomato',
      category: 'Vegetables',
      price: 35,
      unit: 'kg',
      stock: 40,
      image: '🍅',
      discount: 15,
    },
    {
      id: '4',
      name: 'Carrot',
      category: 'Vegetables',
      price: 50,
      unit: 'kg',
      stock: 30,
      image: '🥕',
    },
    {
      id: '5',
      name: 'Capsicum',
      category: 'Vegetables',
      price: 60,
      unit: 'kg',
      stock: 25,
      image: '🫑',
    },
    {
      id: '6',
      name: 'Cauliflower',
      category: 'Vegetables',
      price: 45,
      unit: 'kg',
      stock: 20,
      image: '🥦',
    },
    {
      id: '7',
      name: 'Apple',
      category: 'Fruits',
      price: 120,
      unit: 'kg',
      stock: 35,
      image: '🍎',
    },
    {
      id: '8',
      name: 'Banana',
      category: 'Fruits',
      price: 50,
      unit: 'dozen',
      stock: 60,
      image: '🍌',
      discount: 5,
    },
    {
      id: '9',
      name: 'Orange',
      category: 'Fruits',
      price: 80,
      unit: 'kg',
      stock: 40,
      image: '🍊',
    },
    {
      id: '10',
      name: 'Mango',
      category: 'Fruits',
      price: 150,
      unit: 'kg',
      stock: 25,
      image: '🥭',
      discount: 20,
    },
    {
      id: '11',
      name: 'Milk',
      category: 'Dairy',
      price: 60,
      unit: 'liter',
      stock: 100,
      image: '🥛',
    },
    {
      id: '12',
      name: 'Cheese',
      category: 'Dairy',
      price: 180,
      unit: '500g',
      stock: 30,
      image: '🧀',
    },
    {
      id: '13',
      name: 'Yogurt',
      category: 'Dairy',
      price: 50,
      unit: '400g',
      stock: 50,
      image: '🥛',
    },
    {
      id: '14',
      name: 'Rice',
      category: 'Grains',
      price: 70,
      unit: 'kg',
      stock: 100,
      image: '🍚',
    },
    {
      id: '15',
      name: 'Wheat Flour',
      category: 'Grains',
      price: 45,
      unit: 'kg',
      stock: 80,
      image: '🌾',
    },
    {
      id: '16',
      name: 'Lentils',
      category: 'Grains',
      price: 120,
      unit: 'kg',
      stock: 60,
      image: '🫘',
    },
    {
      id: '17',
      name: 'Turmeric',
      category: 'Spices',
      price: 200,
      unit: '100g',
      stock: 40,
      image: '🌟',
    },
    {
      id: '18',
      name: 'Chili Powder',
      category: 'Spices',
      price: 150,
      unit: '100g',
      stock: 35,
      image: '🌶️',
    },
    {
      id: '19',
      name: 'Cumin',
      category: 'Spices',
      price: 180,
      unit: '100g',
      stock: 30,
      image: '🟤',
    },
    {
      id: '20',
      name: 'Coriander',
      category: 'Spices',
      price: 100,
      unit: '100g',
      stock: 45,
      image: '🌿',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedInventory = await AsyncStorage.getItem(INVENTORY_KEY);
      if (savedInventory) {
        setStoreItems(JSON.parse(savedInventory));
      } else {
        setStoreItems(initialInventory);
        await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(initialInventory));
      }

      const savedCart = await AsyncStorage.getItem(CART_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const savedOrders = await AsyncStorage.getItem(ORDERS_KEY);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  const saveInventory = async (newInventory: StoreItem[]) => {
    setStoreItems(newInventory);
    await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(newInventory));
  };

  const saveOrders = async (newOrders: Order[]) => {
    setOrders(newOrders);
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
  };

  const addToCart = (item: StoreItem) => {
    const existingItem = cart.find((i) => i.id === item.id);

    if (existingItem) {
      if (existingItem.quantity >= item.stock) {
        Alert.alert('Stock Limit', `Only ${item.stock} ${item.unit} available`);
        return;
      }
      const newCart = cart.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      saveCart(newCart);
    } else {
      saveCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    if (item && item.quantity > 1) {
      const newCart = cart.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
      saveCart(newCart);
    } else {
      saveCart(cart.filter((i) => i.id !== itemId));
    }
  };

  const getItemQuantityInCart = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => {
      const itemPrice = item.discount
        ? item.price - (item.price * item.discount) / 100
        : item.price;
      return sum + itemPrice * item.quantity;
    }, 0);
  };

  const getTotalDiscount = () => {
    return cart.reduce((sum, item) => {
      if (item.discount) {
        return sum + ((item.price * item.discount) / 100) * item.quantity;
      }
      return sum;
    }, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Total Amount: ₹${getTotalAmount().toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          onPress: async () => {
            const order: Order = {
              id: Date.now().toString(),
              items: cart,
              total: getTotalAmount(),
              timestamp: new Date().toISOString(),
              status: 'delivered',
            };

            const newInventory = storeItems.map((item) => {
              const cartItem = cart.find((ci) => ci.id === item.id);
              if (cartItem) {
                return { ...item, stock: item.stock - cartItem.quantity };
              }
              return item;
            });

            await saveInventory(newInventory);
            await saveOrders([order, ...orders]);
            await saveCart([]);
            setShowCart(false);

            Alert.alert(
              '🎉 Order Placed!',
              'Your order has been delivered instantly!\nCheck Recent Activity below.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const filteredItems = storeItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.stock > 0;
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="bg-gray-900 border-b border-gray-800 pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold text-green-600">MeghaMart</Text>
            <Text className="text-xs text-gray-400">Instant Grocery Delivery</Text>
          </View>
          <TouchableOpacity className="relative" onPress={() => setShowCart(true)}>
            <Ionicons name="cart" size={28} color="#16a34a" />
            {cart.length > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-600 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs font-bold">{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="bg-gray-800 rounded-lg flex-row items-center px-4 py-2 border border-gray-700">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-gray-200 text-base"
            placeholder="Search for products..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-gray-900 border-b border-gray-800"
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            className={`mr-3 px-4 py-2 rounded-full ${
              selectedCategory === cat ? 'bg-green-600' : 'bg-gray-800 border border-gray-700'
            }`}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text className={selectedCategory === cat ? 'text-white font-semibold' : 'text-gray-400'}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="bg-gradient-to-r from-green-900 to-green-700 rounded-xl p-4 mb-4 border border-green-600">
            <Text className="text-white font-bold text-lg">⚡ Instant Delivery</Text>
            <Text className="text-green-200 text-sm">Order now, delivered in seconds!</Text>
          </View>

          <View className="flex-row flex-wrap -mx-2">
            {filteredItems.map((item) => {
              const quantityInCart = getItemQuantityInCart(item.id);
              const finalPrice = item.discount
                ? item.price - (item.price * item.discount) / 100
                : item.price;

              return (
                <View key={item.id} className="w-1/2 px-2 mb-4">
                  <View className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    <View className="bg-gray-800 items-center justify-center p-6">
                      <Text className="text-5xl">{item.image}</Text>
                      {item.discount && (
                        <View className="absolute top-2 left-2 bg-red-600 rounded px-2 py-1">
                          <Text className="text-white text-xs font-bold">{item.discount}% OFF</Text>
                        </View>
                      )}
                      <View className="absolute top-2 right-2 bg-gray-900/80 rounded px-2 py-1">
                        <Text className="text-green-400 text-xs font-bold">Stock: {item.stock}</Text>
                      </View>
                    </View>

                    <View className="p-3">
                      <Text className="text-white font-semibold text-sm" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-gray-400 text-xs mb-2">{item.unit}</Text>
                      
                      <View className="flex-row items-center mb-2">
                        <Text className="text-white font-bold text-base">₹{finalPrice}</Text>
                        {item.discount && (
                          <Text className="text-gray-500 text-xs line-through ml-2">₹{item.price}</Text>
                        )}
                      </View>

                      {quantityInCart === 0 ? (
                        <TouchableOpacity
                          className="bg-green-600 rounded-lg py-2"
                          onPress={() => addToCart(item)}
                        >
                          <Text className="text-white text-center font-semibold text-xs">ADD</Text>
                        </TouchableOpacity>
                      ) : (
                        <View className="bg-green-600 rounded-lg flex-row items-center justify-between px-2 py-2">
                          <TouchableOpacity onPress={() => removeFromCart(item.id)} className="px-2">
                            <Ionicons name="remove" size={16} color="white" />
                          </TouchableOpacity>
                          <Text className="text-white font-bold">{quantityInCart}</Text>
                          <TouchableOpacity onPress={() => addToCart(item)} className="px-2">
                            <Ionicons name="add" size={16} color="white" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>

          {orders.length > 0 && (
            <View className="mt-6">
              <Text className="text-white font-bold text-lg mb-3">📦 Recent Activity</Text>
              {orders.slice(0, 5).map((order) => (
                <View key={order.id} className="bg-gray-900 rounded-xl p-4 mb-3 border border-gray-800">
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center">
                      <View className="bg-green-900 rounded-full p-2 mr-3">
                        <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                      </View>
                      <View>
                        <Text className="text-white font-semibold">Order Delivered</Text>
                        <Text className="text-gray-400 text-xs">
                          {new Date(order.timestamp).toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-green-600 font-bold">₹{order.total.toFixed(2)}</Text>
                  </View>
                  <View className="flex-row flex-wrap mt-2">
                    {order.items.map((item) => (
                      <Text key={item.id} className="text-gray-400 text-xs mr-2">
                        {item.name} ({item.quantity})
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {showCart && (
        <View className="absolute inset-0 bg-black/70">
          <TouchableOpacity className="flex-1" onPress={() => setShowCart(false)} />
          <View className="bg-gray-900 rounded-t-3xl border-t border-gray-800 max-h-[80%]">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-800">
              <Text className="text-white font-bold text-lg">My Cart ({cart.length})</Text>
              <TouchableOpacity onPress={() => setShowCart(false)}>
                <Ionicons name="close" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
              <View className="items-center justify-center py-12">
                <Ionicons name="cart-outline" size={64} color="#4b5563" />
                <Text className="text-gray-400 mt-4">Your cart is empty</Text>
              </View>
            ) : (
              <>
                <ScrollView className="flex-1 p-4">
                  {cart.map((item) => {
                    const finalPrice = item.discount
                      ? item.price - (item.price * item.discount) / 100
                      : item.price;

                    return (
                      <View key={item.id} className="bg-gray-800 rounded-xl p-4 mb-3 flex-row border border-gray-700">
                        <Text className="text-4xl mr-3">{item.image}</Text>
                        <View className="flex-1">
                          <Text className="text-white font-semibold">{item.name}</Text>
                          <Text className="text-gray-400 text-xs">{item.unit}</Text>
                          <View className="flex-row items-center mt-1">
                            <Text className="text-white font-bold">₹{finalPrice}</Text>
                            {item.discount && (
                              <Text className="text-gray-500 text-xs line-through ml-2">₹{item.price}</Text>
                            )}
                          </View>
                        </View>
                        <View className="items-center">
                          <View className="bg-green-600 rounded-lg flex-row items-center px-2 py-1 mb-2">
                            <TouchableOpacity onPress={() => removeFromCart(item.id)} className="px-1">
                              <Ionicons name="remove" size={16} color="white" />
                            </TouchableOpacity>
                            <Text className="text-white font-bold mx-2">{item.quantity}</Text>
                            <TouchableOpacity onPress={() => addToCart(item)} className="px-1">
                              <Ionicons name="add" size={16} color="white" />
                            </TouchableOpacity>
                          </View>
                          <Text className="text-green-400 font-bold">₹{(finalPrice * item.quantity).toFixed(2)}</Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>

                <View className="border-t border-gray-800 p-4">
                  <View className="bg-gray-800 rounded-xl p-4 mb-3">
                    <Text className="text-white font-bold mb-2">Bill Details</Text>
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-gray-400">Item Total</Text>
                      <Text className="text-gray-200">₹{(getTotalAmount() + getTotalDiscount()).toFixed(2)}</Text>
                    </View>
                    {getTotalDiscount() > 0 && (
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-green-500">Savings</Text>
                        <Text className="text-green-500">-₹{getTotalDiscount().toFixed(2)}</Text>
                      </View>
                    )}
                    <View className="border-t border-gray-700 mt-2 pt-2 flex-row justify-between">
                      <Text className="text-white font-bold">To Pay</Text>
                      <Text className="text-white font-bold">₹{getTotalAmount().toFixed(2)}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    className="bg-green-600 rounded-xl py-4"
                    onPress={placeOrder}
                  >
                    <Text className="text-white text-center font-bold text-base">
                      PLACE ORDER • ₹{getTotalAmount().toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}