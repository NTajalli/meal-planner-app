import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DatePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@aws-amplify/ui-react-native";

interface AddIngredientModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (ingredient: {
    name: string;
    type: string;
    quantity: number;
    unit: string;
    expirary: string;
    storage: string;
    allergens: string;
  }) => void;
}

const STORAGE_OPTIONS = ["Fridge", "Freezer", "Pantry", "Counter"];

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const { tokens } = useTheme();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [expirary, setExpirary] = useState("");
  const [storage, setStorage] = useState(STORAGE_OPTIONS[0]);
  const [allergens, setAllergens] = useState("");

  // Helper: convert token values (if they are strings, e.g., "20px")
  const parseToken = (token: string | number) =>
    typeof token === "string" ? parseFloat(token) : token;

  const handleAdd = () => {
    if (!name.trim() || !type.trim() || !quantity.trim() || !unit.trim()) {
      Alert.alert(
        "Validation Error",
        "All fields except allergens are required."
      );
      return;
    }

    onAdd({
      name,
      type,
      quantity: parseFloat(quantity),
      unit,
      expirary,
      storage,
      allergens,
    });

    // Reset fields on success
    setName("");
    setType("");
    setQuantity("");
    setUnit("");
    setExpirary("");
    setStorage(STORAGE_OPTIONS[0]);
    setAllergens("");

    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            { backgroundColor: tokens.colors.background.secondary },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: tokens.colors.font.primary /*, fontSize: parseToken(tokens.fontSizes.large) */ },
            ]}
          >
            Add Ingredient
          </Text>

          {/* Name Input */}
          <View style={styles.inputRow}>
            <Text
              style={[
                styles.label,
                { color: tokens.colors.font.secondary },
              ]}
            >
              Name:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.font.primary,
                  borderColor: tokens.colors.border.primary,
                },
              ]}
              placeholder="Enter ingredient name"
              placeholderTextColor={tokens.colors.font.secondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Type Input */}
          <View style={styles.inputRow}>
            <Text
              style={[
                styles.label,
                { color: tokens.colors.font.secondary },
              ]}
            >
              Type:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.font.primary,
                  borderColor: tokens.colors.border.primary,
                },
              ]}
              placeholder="Enter ingredient type"
              placeholderTextColor={tokens.colors.font.secondary}
              value={type}
              onChangeText={setType}
            />
          </View>

          {/* Quantity Input */}
          <View style={styles.inputRow}>
            <Text
              style={[
                styles.label,
                { color: tokens.colors.font.secondary },
              ]}
            >
              Quantity:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.font.primary,
                  borderColor: tokens.colors.border.primary,
                },
              ]}
              placeholder="Enter quantity"
              placeholderTextColor={tokens.colors.font.secondary}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>

          {/* Unit Input */}
          <View style={styles.inputRow}>
            <Text
              style={[
                styles.label,
                { color: tokens.colors.font.secondary },
              ]}
            >
              Unit:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.font.primary,
                  borderColor: tokens.colors.border.primary,
                },
              ]}
              placeholder="Enter unit (e.g., lbs, oz, etc.)"
              placeholderTextColor={tokens.colors.font.secondary}
              value={unit}
              onChangeText={setUnit}
            />
          </View>

          {/* Expiry Date */}
          <View style={styles.inputRow}>
            <Text
              style={[
                styles.label,
                { color: tokens.colors.font.secondary },
              ]}
            >
              Expiry:
            </Text>
            <DatePicker
              value={expirary ? new Date(expirary) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setExpirary(selectedDate.toISOString().split("T")[0]);
                }
              }}
              minimumDate={new Date()}
              maximumDate={new Date("2099-12-31")}
            />
          </View>

          {/* Storage Input */}
          <View style={styles.inputRow}>
            <Text
              style={[
                styles.label,
                { color: tokens.colors.font.secondary },
              ]}
            >
              Storage:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.font.primary,
                  borderColor: tokens.colors.border.primary,
                },
              ]}
              placeholder="Enter storage location"
              placeholderTextColor={tokens.colors.font.secondary}
              value={storage}
              onChangeText={setStorage}
            />
          </View>

          {/* Allergens Input */}
          <View style={styles.inputRow}>
            <Text
              style={[
                styles.label,
                { color: tokens.colors.font.secondary },
              ]}
            >
              Allergens:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.font.primary,
                  borderColor: tokens.colors.border.primary,
                },
              ]}
              placeholder="Enter allergens (optional)"
              placeholderTextColor={tokens.colors.font.secondary}
              value={allergens}
              onChangeText={setAllergens}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.cancelButton,
                { backgroundColor: tokens.colors.secondary[80] },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: tokens.colors.font.primary },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAdd}
              style={[
                styles.saveButton,
                { backgroundColor: tokens.colors.primary[80] },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: tokens.colors.background.primary },
                ]}
              >
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddIngredientModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20, // You can also use a token value for font size if available.
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16, // Consider using a token (e.g., tokens.fontSizes.medium) if desired.
    marginRight: 10,
    flex: 1,
  },
  input: {
    flex: 3,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 5,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16, // Replace with token value if desired.
    fontWeight: "bold",
  },
});