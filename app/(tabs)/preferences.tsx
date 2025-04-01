import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { ExtendedTheme } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import NotificationStack from "../components/NotificationStack";

const PreferencesScreen = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme() as ExtendedTheme;
  // If using a custom notification system, reference it here:
  // const notificationRef = useRef<any>(null);

  // Preferences from the server (if any)
  const [preferences, setPreferences] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Local form data
  const [formState, setFormState] = useState({
    calorie_limit: 2000,
    dietary_restrictions: "",
    exclude_ingredients: "",
    favorite_ingredients: "",
    preferred_cuisines: "",
  });

  // Fetch existing preferences on mount (only if authenticated)

  // Update formState fields
  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Save (create or edit) preferences
  const handleSubmit = async () => {
    setLoading(true);

    const updatedPreferences = {
      calorie_limit: parseInt(formState.calorie_limit.toString(), 10),
      dietary_restrictions: formState.dietary_restrictions
        .split(",")
        .map((str) => str.trim()),
      exclude_ingredients: formState.exclude_ingredients
        .split(",")
        .map((str) => str.trim()),
      favorite_ingredients: formState.favorite_ingredients
        .split(",")
        .map((str) => str.trim()),
      preferred_cuisines: formState.preferred_cuisines
        .split(",")
        .map((str) => str.trim()),
    };

    try {
      if (preferences) {
        // Update existing preferences
      } else {
        // Create new preferences
      }
      Alert.alert("Success", "Preferences saved successfully!");
      // If using NotificationStack:
      // notificationRef.current.addNotification("Preferences saved successfully!", "success");
    } catch (err) {
      console.error("Error saving preferences:", err);
      Alert.alert(
        "Error",
        "Failed to save preferences. Please check your network or try again."
      );
      // notificationRef.current.addNotification("Failed to save preferences.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
      ]}
    >
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Page Header */}
        <Text style={[styles.title, { color: colors.primaryText }]}>
          Preferences
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Manage your dietary and cuisine preferences.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PreferencesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  authMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
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
  formContainer: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    // shadowOffset, shadowOpacity, etc. can be added if you want more shadow
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
