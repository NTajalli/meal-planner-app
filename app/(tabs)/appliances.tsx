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
import { Ionicons } from "@expo/vector-icons";
import AppliancesList from "../components/AppliancesList";
import AddApplianceModal from "../components/AddApplianceModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { useTheme } from "@aws-amplify/ui-react-native";

const AppliancesScreen = () => {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();
  const [appliances, setAppliances] = useState<Schema["Appliance"]["type"][]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const client = generateClient<Schema>();

  // Helper: convert token string values (like "24px") to numbers
  const parseToken = (token: string | number) =>
    typeof token === "string" ? parseFloat(token) : token;

  // Fetch appliances from Amplify API
  const fetchAppliances = async (modifyLoading: boolean = true) => {
    if (modifyLoading) setLoading(true);
    try {
      const { data: items, errors } = await client.models.Appliance.list({
        authMode: "userPool",
      });
      if (errors) {
        setAppliances([]);
        console.error("Error fetching appliances:", errors[0]);
      } else {
        setAppliances(items);
      }
    } catch (err) {
      setAppliances([]);
      console.error("Error fetching appliances:", err);
    } finally {
      if (modifyLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliances();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppliances(false);
    setRefreshing(false);
  };

  // Handle adding a new appliance
  const handleAddAppliance = async (newAppliance: { name: string }) => {
    if (!newAppliance.name.trim()) {
      Alert.alert("Validation Error", "Please provide a valid appliance name.");
      return;
    }
    setLoading(true);
    try {
      const { errors } = await client.models.Appliance.create(
        {
          name: newAppliance.name,
          available: true, // Default to available
        },
        { authMode: "userPool" }
      );
      if (errors) {
        console.error("Error adding appliance:", errors[0]);
      } else {
        fetchAppliances();
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Error adding appliance:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle updating an appliance (toggle availability)
  const handleUpdateAppliance = async (
    updatedAppliance: Schema["Appliance"]["type"]
  ) => {
    setLoading(true);
    try {
      const { errors } = await client.models.Appliance.update(
        {
          id: updatedAppliance.id,
          name: updatedAppliance.name,
          available: !updatedAppliance.available, // Toggle availability
        },
        {
          authMode: "userPool",
        }
      );
      if (errors) {
        console.error("Error updating appliance:", errors[0]);
      } else {
        fetchAppliances();
      }
    } catch (err) {
      console.error("Error updating appliance:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an appliance
  const handleDeleteAppliance = async (
    appliance: Schema["Appliance"]["type"]
  ) => {
    setLoading(true);
    try {
      const { errors } = await client.models.Appliance.delete(
        { id: appliance.id },
        { authMode: "userPool" }
      );
      if (errors) {
        console.error("Error deleting appliance:", errors[0]);
      } else {
        fetchAppliances();
      }
    } catch (err) {
      console.error("Error deleting appliance:", err);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic styles using tokens for colors and font sizes
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
      <Text style={dynamicStyles.title}>Appliances</Text>
      <Text style={dynamicStyles.subtitle}>
        Manage and track your kitchen appliances.
      </Text>

      {/* Overlay Loading Indicator */}
      {loading && (
        <View style={dynamicStyles.loadingOverlay}>
          <ActivityIndicator
            size="large"
            color={tokens.colors.primary[80]}
          />
        </View>
      )}

      {/* Appliance List with Pull to Refresh */}
      <FlatList
        data={appliances}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <AppliancesList
            appliance={item}
            onDelete={handleDeleteAppliance}
            onToggleAvailability={handleUpdateAppliance}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Add Appliance Button */}
      <TouchableOpacity
        style={dynamicStyles.addButton}
        onPress={(e) => {
          e.stopPropagation();
          setShowAddModal(true);
        }}
      >
        <Ionicons name="add" size={24} color={tokens.colors.background.primary} />
      </TouchableOpacity>

      {/* Add Appliance Modal */}
      <AddApplianceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAppliance}
      />
    </View>
  );
};

export default AppliancesScreen;