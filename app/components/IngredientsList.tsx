import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@aws-amplify/ui-react-native";
import { Ionicons } from "@expo/vector-icons";
import { Schema } from "@/amplify/data/resource";

interface IngredientListProps {
  type: string;
  ingredients: Schema['Ingredient']["type"][];
  onSelect: (ingredient: Schema['Ingredient']["type"]) => void;
  onDelete: (ingredient: Schema['Ingredient']["type"]) => void;
}

const MAX_DATE = "2099-12-31";

const IngredientList: React.FC<IngredientListProps> = ({
  type,
  ingredients,
  onSelect,
  onDelete,
}) => {
  const { tokens } = useTheme();

  if (ingredients.length === 0) return null;

  const styles = getStyles(tokens);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionHeader}>{type.toUpperCase()}</Text>
      {ingredients.map((ingredient) => (
        <TouchableOpacity
          key={ingredient.id}
          style={styles.ingredientRow}
          onPress={() => onSelect(ingredient)}
        >
          <View style={styles.rowContent}>
            <View
              style={[
                styles.circle,
                {
                  backgroundColor: getStatusColor(
                    ingredient.expiration_date || MAX_DATE,
                    tokens.colors
                  ),
                },
              ]}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{ingredient.name}</Text>
              <Text style={styles.details}>
                {ingredient.quantity} {ingredient.unit} - {ingredient.storage}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => onDelete(ingredient)}>
            <Ionicons
              name="trash"
              size={20}
              color={tokens.colors.error || "#dc3545"}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Returns a status color based on the ingredient's expirary date.
// Falls back to hard-coded values if tokens are unavailable.
const getStatusColor = (
  expirary: string,
  colors: any // Using "any" since token shape may vary
): string => {
  const daysUntilExpirary = calculateDaysUntilExpirary(expirary);
  if (daysUntilExpirary > 3) return colors.success || (colors.primary && colors.primary[80]) || "#28a745";
  if (daysUntilExpirary > 0) return colors.warning || "#ffc107";
  return colors.error || "#dc3545";
};

// Calculates days until the provided expirary date.
const calculateDaysUntilExpirary = (expiraryDate: string): number => {
  const date = new Date(expiraryDate);
  if (isNaN(date.getTime())) return 0;
  return Math.floor(
    (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
};

// Generates styles using the provided tokens.
// If certain token values are not available, fallback values are used.
const getStyles = (tokens: any) =>
  StyleSheet.create({
    section: {
      marginBottom: 20,
    },
    sectionHeader: {
      fontSize: 18,
      fontFamily: tokens.fontFamilyBold || "System",
      color:
        (tokens.colors.primary && tokens.colors.primary[80]) || "#007bff",
      marginBottom: 8,
    },
    ingredientRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        (tokens.colors.background && tokens.colors.background.secondary) ||
        "#f8f9fa",
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
      shadowColor: tokens.colors.shadow || "#000",
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    },
    rowContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    circle: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 12,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontFamily: tokens.fontFamilyBold || "System",
      color: (tokens.colors.font && tokens.colors.font.primary) || "#212529",
    },
    details: {
      fontSize: 14,
      fontFamily: tokens.fontFamilyRegular || "System",
      color:
        (tokens.colors.font && tokens.colors.font.secondary) || "#6c757d",
    },
  });

export default IngredientList;