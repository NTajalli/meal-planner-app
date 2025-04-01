import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import IngredientList from "../components/IngredientsList";
import AddIngredientModal from "../components/AddIngredientModal";
import IngredientDetailsModal from "../components/IngredientDetailsModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthenticator, useTheme } from "@aws-amplify/ui-react-native";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Ionicons } from "@expo/vector-icons";
import { fetchAuthSession, JWT } from 'aws-amplify/auth';


const MAX_DATE = "2099-12-31";

const IngredientsScreen = () => {
  const { tokens } = useTheme();
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<
    Schema["Ingredient"]["type"] | null
  >(null);
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const client = generateClient<Schema>();

    // Helper to convert token values (if they come as strings with "px")
  const parseToken = (token: string | number) =>
    typeof token === "string" ? parseFloat(token) : token;

  // Fetch ingredients from API
  const fetchIngredients = async (modifyLoading: boolean = true) => {
    if (modifyLoading) setLoading(true);
    try {
      const { data: items, errors } = await client.models.Ingredient.list({
        authMode: "userPool",
      });
      if (errors) {
        setIngredients([]);
        console.error("Error fetching ingredients:", errors[0]);
      } else {
        setIngredients(items);
      }
    } catch (err) {
      setIngredients([]);
      console.error("Error fetching ingredients:", err);
    } finally {
      if (modifyLoading) setLoading(false);
    }
  };

  useEffect(() => {

    fetchIngredients();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchIngredients(false);
    setRefreshing(false);
  };

  // Handle adding a new ingredient
  const handleAddIngredient = async (newIngredient: {
    name: string;
    type: string;
    quantity: number;
    unit: string;
    expirary: string;
    storage: string;
    allergens: string;
  }) => {
    if (!newIngredient.name.trim() || newIngredient.quantity <= 0) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const { errors } = await client.models.Ingredient.create(
        {
          name: newIngredient.name,
          quantity: newIngredient.quantity,
          unit: newIngredient.unit,
          type: newIngredient.type,
          storage: newIngredient.storage,
          expiration_date: newIngredient.expirary,
          allergens: newIngredient.allergens.split(""),
        },
        { authMode: "userPool" }
      );
      if (errors) {
        console.error("Error adding ingredient:", errors[0]);
      } else {
        fetchIngredients();
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Error adding ingredient:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle updating an ingredient
  const handleUpdateIngredient = async (
    updatedIngredient: Schema["Ingredient"]["type"]
  ) => {
    setLoading(true);
    if (selectedIngredient != null) {
      try {
        const { errors } = await client.models.Ingredient.update(
          {
            id: selectedIngredient.id,
            name: updatedIngredient.name,
            quantity: updatedIngredient.quantity,
            unit: updatedIngredient.unit,
            type: updatedIngredient.type,
            allergens: updatedIngredient.allergens,
            storage: updatedIngredient.storage,
            expiration_date: updatedIngredient.expiration_date,
          },
          { authMode: "userPool" }
        );
        if (errors) {
          console.error("Error updating ingredient:", errors[0]);
        } else {
          fetchIngredients();
          setSelectedIngredient(null);
        }
      } catch (err) {
        console.error("Error updating ingredient:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle deleting an ingredient
  const handleDeleteIngredient = async (
    ingredient: Schema["Ingredient"]["type"]
  ) => {
    setLoading(true);
    try {
      const { errors } = await client.models.Ingredient.delete(
        { id: ingredient.id },
        { authMode: "userPool" }
      );
      if (errors) {
        console.error("Error deleting ingredient:", errors[0]);
      } else {
        fetchIngredients();
      }
    } catch (err) {
      console.error("Error deleting ingredient:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create dynamic styles using the new design tokens
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      backgroundColor: tokens.colors.background.primary,
      paddingBottom: insets.bottom,
    },
    title: {
      fontSize: parseToken(tokens.fontSizes.xlarge),
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 8,
      textAlign: "center",
      color: tokens.colors.font.primary,
    },
    subtitle: {
      fontSize: parseToken(tokens.fontSizes.medium),
      marginBottom: 16,
      textAlign: "center",
      color: tokens.colors.font.secondary,
    },
    addButton: {
      position: "absolute",
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      elevation: 3,
      backgroundColor: tokens.colors.primary[80],
      bottom: insets.bottom + 70,
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      {/* Header */}
      <Text style={dynamicStyles.title}>Ingredients</Text>
      <Text style={dynamicStyles.subtitle}>
        Manage and organize your kitchen ingredients.
      </Text>

      {/* Overlay Loading Indicator */}
      {loading && (
        <View style={dynamicStyles.loadingOverlay}>
          <ActivityIndicator size="large" color={tokens.colors.secondary[80]} />
        </View>
      )}

      <FlatList
        data={Array.from(new Set(ingredients.map((item) => item.type)))}
        keyExtractor={(item) => item || ""}
        renderItem={({ item }) => (
          <IngredientList
            type={item || ""}
            ingredients={ingredients.filter(
              (ingredient) => ingredient.type === item
            )}
            onSelect={(ingredient: Schema["Ingredient"]["type"]) =>
              setSelectedIngredient(ingredient)
            }
            onDelete={handleDeleteIngredient}
          />
        )}
        ListFooterComponent={<View style={{ height: 20 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={dynamicStyles.addButton}
        onPress={(e) => {
          e.stopPropagation();
          setShowAddModal(true);
        }}
      >
        <Ionicons name="add" size={24} color={tokens.colors.background.primary} />
      </TouchableOpacity>
      <AddIngredientModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddIngredient}
      />
      {selectedIngredient && (
        <IngredientDetailsModal
          ingredient={selectedIngredient}
          visible={!!selectedIngredient}
          onClose={() => setSelectedIngredient(null)}
          onSave={handleUpdateIngredient}
        />
      )}
    </View>
  );
};

export default IngredientsScreen;