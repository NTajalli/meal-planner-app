import { router, Tabs } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { useTheme as useAmplifyTheme } from "@aws-amplify/ui-react-native";

export default function TabLayout() {
  const { tokens } = useAmplifyTheme();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const { signOut } = useAuthenticator();

  const handleLogoutPress = useCallback(() => {
    setLogoutModalVisible(true);
  }, []);

  // HeaderRight using tokens for styling
  const headerRight = () => (
    <View style={{ marginRight: 15 }}>
      <TouchableOpacity
        onPress={handleLogoutPress}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <MaterialIcons
          name="logout"
          size={20}
          color={tokens.colors.font.primary}
        />
        <Text style={{ marginLeft: 4, color: tokens.colors.font.primary }}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Tabs
        screenOptions={{
          headerRight: headerRight,
          tabBarActiveTintColor: tokens.colors.primary[80],
          tabBarButton: HapticTab,
          headerStyle: { backgroundColor: tokens.colors.background.secondary },
          headerTitleStyle: { color: tokens.colors.font.primary },
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
              backgroundColor: tokens.colors.background.secondary,
              borderWidth: 0,
            },
            default: { backgroundColor: tokens.colors.background.secondary },
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Ingredients",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="carrot.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="appliances"
          options={{
            title: "Appliances",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="oven.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="generate"
          options={{
            title: "Assistant",
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name="sparkles.rectangle.stack"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cookware"
          options={{
            title: "Cookware",
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name="fork.knife.circle.fill"
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="preferences"
          options={{
            title: "Preferences",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="gear.circle.fill" color={color} />
            ),
          }}
        />
      </Tabs>

      <ConfirmLogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={signOut}
        tokens={tokens}
      />
    </>
  );
}

/**
 * Confirmation Modal for Logging Out
 */
const ConfirmLogoutModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tokens: any;
}> = ({ visible, onClose, onConfirm, tokens }) => {
  const styles = getLogoutModalStyles(tokens);

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirm Logout</Text>
          <Text style={styles.description}>
            Are you sure you want to log out?
          </Text>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Yes, Log Me Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const getLogoutModalStyles = (tokens: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "80%",
      backgroundColor: tokens.colors.background.secondary,
      borderRadius: 10,
      padding: 20,
      shadowColor: tokens.colors.shadow || "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 16,
      textAlign: "center",
      color: tokens.colors.font.primary,
    },
    description: {
      fontSize: 14,
      color: tokens.colors.font.secondary,
      marginBottom: 24,
      textAlign: "center",
    },
    confirmButton: {
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 8,
      backgroundColor: tokens.colors.primary[80],
    },
    confirmButtonText: {
      color: tokens.colors.background.primary,
      fontWeight: "bold",
    },
    cancelButton: {
      backgroundColor: tokens.colors.secondary[80],
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    cancelButtonText: {
      color: tokens.colors.font.primary,
      fontWeight: "bold",
    },
  });