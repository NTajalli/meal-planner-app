import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import CookwareList from "../components/CookwareList";
import AddCookwareModal from "../components/AddCookwareModal";
import EditCookwareModal from "../components/EditCookwareModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@aws-amplify/ui-react-native";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Ionicons } from "@expo/vector-icons";

const CookwareScreen = () => {
  const { tokens } = useTheme();
  const [cookwares, setCookwares] = useState<Schema["Cookware"]["type"][]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCookware, setSelectedCookware] =
    useState<Schema["Cookware"]["type"] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const client = generateClient<Schema>();

  // Fetch cookwares from Amplify API
  const fetchCookwares = async (modifyLoading: boolean = true) => {
    if (modifyLoading) setLoading(true);
    try {
      const { data: items, errors } = await client.models.Cookware.list({
        authMode: "userPool",
      });
      if (errors) {
        setCookwares([]);
        console.error("Error fetching cookwares:", errors[0]);
      } else {
        setCookwares(items);
      }
    } catch (err) {
      setCookwares([]);
      console.error("Error fetching cookwares:", err);
    } finally {
      if (modifyLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCookwares();
  }, []);

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCookwares(false);
    setRefreshing(false);
  };

  // Handle adding a new cookware
  const handleAddCookware = async (newCookware: { name: string; quantity: number }) => {
    if (!newCookware.name.trim() || newCookware.quantity <= 0) {
      Alert.alert("Validation Error", "Please provide a valid cookware name and quantity.");
      return;
    }
    setLoading(true);
    try {
      const { errors } = await client.models.Cookware.create(
        { name: newCookware.name, quantity: newCookware.quantity },
        { authMode: "userPool" }
      );
      if (errors) {
        console.error("Error adding cookware:", errors[0]);
      } else {
        fetchCookwares();
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Error adding cookware:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle updating cookware quantity
  const handleUpdateCookware = async (newQuantity: number) => {
    if (selectedCookware) {
      setLoading(true);
      try {
        const { errors } = await client.models.Cookware.update(
          {
            id: selectedCookware.id,
            name: selectedCookware.name,
            quantity: newQuantity,
          },
          { authMode: "userPool" }
        );
        if (errors) {
          console.error("Error updating cookware quantity:", errors[0]);
        } else {
          fetchCookwares();
        }
      } catch (err) {
        console.error("Error updating cookware quantity:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle deleting cookware
  const handleDeleteCookware = async (cookware: Schema["Cookware"]["type"]) => {
    setLoading(true);
    try {
      const { errors } = await client.models.Cookware.delete(
        { id: cookware.id },
        { authMode: "userPool" }
      );
      if (errors) {
        console.error("Error deleting cookware:", errors[0]);
      } else {
        fetchCookwares();
      }
    } catch (err) {
      console.error("Error deleting cookware:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: tokens.colors.background.primary,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Header */}
      <Text style={[styles.title, { color: tokens.colors.font.primary }]}>
        Cookware
      </Text>
      <Text style={[styles.subtitle, { color: tokens.colors.font.secondary }]}>
        Manage and track your kitchen cookware.
      </Text>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={tokens.colors.primary[80]} />
        </View>
      )}

      {/* Cookware List with Pull to Refresh */}
      <FlatList
        data={cookwares}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <CookwareList
            cookware={item}
            onDelete={handleDeleteCookware}
            onEdit={() => {
              setSelectedCookware(item);
              setShowEditModal(true);
            }}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* Add Cookware Button */}
      <TouchableOpacity
        style={[
          styles.addButton,
          {
            backgroundColor: tokens.colors.primary[80],
            bottom: insets.bottom + 70,
          },
        ]}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={24} color={tokens.colors.background.primary} />
      </TouchableOpacity>

      {/* Add Cookware Modal */}
      <AddCookwareModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddCookware}
      />

      {/* Edit Cookware Modal */}
      <EditCookwareModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCookware(null);
        }}
        onSave={handleUpdateCookware}
        initialQuantity={selectedCookware?.quantity || 0}
        cookwareName={selectedCookware?.name || ""}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
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

export default CookwareScreen;