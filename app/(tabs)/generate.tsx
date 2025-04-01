// app/(tabs)/ai/AiAssistantScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { ExtendedTheme } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GenerateRecipesTab from "../components/GenerateRecipesTab";
import GenerateQueryTab from "../components/GenerateQueryTab";
import UploadReceiptTab from "../components/UploadReceiptTab";
import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { fetchAuthSession, JWT } from "aws-amplify/auth";

/**
 * AiAssistantScreen
 * -----------------
 * Acts as the main container with a tab-like switcher for:
 * - Generate Recipes
 * - Manage Inventory
 * - Upload Receipt
 */
const AiAssistantScreen = () => {
  const { colors } = useTheme() as ExtendedTheme;
  const insets = useSafeAreaInsets();
    const client = generateClient<Schema>();
    const {user} = useAuthenticator();
      const [token, setToken] = useState<JWT | null>(null);
  

  // Instead of "recipes" | "generate" | "upload", store them in an array so we can map them.
  const tabs = [
    { key: "recipes", label: "Generate Recipes" },
    { key: "generate", label: "Manage Inventory" },
    { key: "upload", label: "Upload Receipt" },
  ];

  const [activeTab, setActiveTab] = useState<string>("recipes");

  // Basic auth check

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Page Header */}
        <Text style={[styles.title, { color: colors.primaryText }]}>
          Meal AI Assistant
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Generate meals, manage inventory, and analyze grocery receipts with
          AI.
        </Text>

        {/* Segmented Tabs Container */}
        <View
          style={[styles.segmentedContainer, { backgroundColor: colors.card }]}
        >
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.segmentButton,
                  {
                    backgroundColor: isActive
                      ? colors.accent
                      : colors.inputBackground,
                    borderTopLeftRadius: index === 0 ? 8 : 0,
                    borderBottomLeftRadius: index === 0 ? 8 : 0,
                    borderTopRightRadius: index === tabs.length - 1 ? 8 : 0,
                    borderBottomRightRadius: index === tabs.length - 1 ? 8 : 0,
                  },
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  style={[
                    styles.segmentButtonText,
                    {
                      color: isActive ? colors.background : colors.text,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Content Card */}
        <View
          style={[styles.contentContainer, { backgroundColor: colors.card }]}
        >
          {activeTab === "recipes" && <GenerateRecipesTab />}
          {activeTab === "generate" && <GenerateQueryTab />}
          {activeTab === "upload" && <UploadReceiptTab />}
        </View>
      </ScrollView>
    </View>
  );
};

export default AiAssistantScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },

  /* Segmented Control */
  segmentedContainer: {
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 8,
    overflow: "hidden",
    // You might add some shadow or elevation for a "raised" effect:
    marginBottom: 16,
  },
  segmentButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* The card that holds the tab content */
  contentContainer: {
    borderRadius: 8,
    padding: 16,
    // Optional: Add a bit of shadow or border:
    // borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.1)",
  },
});
