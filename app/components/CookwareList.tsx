import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@aws-amplify/ui-react-native";
import { Ionicons } from "@expo/vector-icons";

interface CookwareListProps {
  cookware: any;
  onDelete: (cookware: any) => void;
  onEdit: (cookware: any) => void;
}

const CookwareList: React.FC<CookwareListProps> = ({
  cookware,
  onDelete,
  onEdit,
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
          {cookware.name}
        </Text>
        <Text style={[styles.quantity, { color: tokens.colors.font.secondary }]}>
          Quantity: {cookware.quantity}
        </Text>
      </View>

      {/* Edit Button */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onEdit(cookware);
        }}
        style={styles.editButton}
      >
        <Ionicons
          name="create-outline"
          size={20}
          color={tokens.colors.primary[80]}
        />
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onDelete(cookware);
        }}
        style={styles.deleteButton}
      >
        <Ionicons
          name="trash"
          size={20}
          color={tokens.colors.secondary[80]}
        />
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
  quantity: {
    fontSize: 14,
    marginTop: 4,
  },
  editButton: {
    padding: 10,
    marginRight: 10,
  },
  deleteButton: {
    padding: 10,
  },
});

export default CookwareList;