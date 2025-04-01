import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@aws-amplify/ui-react-native";
import { Ionicons } from "@expo/vector-icons";

interface AppliancesListProps {
  appliance: any;
  onDelete: (appliance: any) => void;
  onToggleAvailability: (appliance: any) => void;
}

const AppliancesList: React.FC<AppliancesListProps> = ({
  appliance,
  onDelete,
  onToggleAvailability,
}) => {
  const { tokens } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: tokens.colors.background.secondary },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: tokens.colors.font.primary }]}>
          {appliance.name}
        </Text>
        <Text
          style={[
            styles.status,
            {
              color: appliance.available
                ? tokens.colors.primary[80]
                : tokens.colors.secondary[80],
            },
          ]}
        >
          {appliance.available ? "Available" : "Unavailable"}
        </Text>
      </View>

      {/* Toggle Availability Button */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onToggleAvailability(appliance);
        }}
        style={styles.toggleButton}
      >
        <Ionicons
          name={appliance.available ? "checkmark-circle" : "ellipse-outline"}
          size={24}
          color={
            appliance.available
              ? tokens.colors.primary[80]
              : tokens.colors.font.secondary
          }
        />
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onDelete(appliance);
        }}
        style={styles.deleteButton}
      >
        <Ionicons name="trash" size={20} color={tokens.colors.secondary[80]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    fontSize: 14,
    marginTop: 4,
  },
  toggleButton: {
    padding: 10,
    marginRight: 10,
  },
  deleteButton: {
    padding: 10,
  },
});

export default AppliancesList;