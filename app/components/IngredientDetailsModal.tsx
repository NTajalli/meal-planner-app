import React, { useEffect, useState } from "react";
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

const STORAGE_OPTIONS = ["Fridge", "Freezer", "Pantry", "Counter"];

interface IngredientDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (updatedIngredient: any) => void;
  ingredient: any;
}

const IngredientDetailsModal: React.FC<IngredientDetailsModalProps> = ({
  visible,
  onClose,
  onSave,
  ingredient,
}) => {
  const { tokens } = useTheme();

  // State
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [expirary, setExpirary] = useState("");
  const [storage, setStorage] = useState(STORAGE_OPTIONS[0]);
  const [allergens, setAllergens] = useState("");

  // Initialize state whenever modal becomes visible or ingredient changes
  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name || "");
      setType(ingredient.type || "");
      setQuantity(ingredient.quantity || 0);
      setUnit(ingredient.unit || "");
      setExpirary(ingredient.expirary || "");
      setStorage(ingredient.storage || STORAGE_OPTIONS[0]);
      setAllergens(ingredient.allergens || "");
    }
  }, [ingredient]);

  const handleSave = () => {
    if (!name.trim() || quantity <= 0) {
      Alert.alert("Validation Error", "Name and quantity are required fields.");
      return;
    }

    const updatedIngredient: any = {
      ...ingredient,
      name,
      type,
      quantity,
      unit,
      expirary,
      storage,
      allergens,
    };

    onSave(updatedIngredient);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: tokens.colors.background.secondary },
          ]}
        >
          {/* Title */}
          <Text style={[styles.title, { color: tokens.colors.font.primary }]}>
            Edit Ingredient
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: tokens.colors.font.secondary }]}>
            Update details for {ingredient.name}.
          </Text>

          {/* Name Input */}
          <View style={styles.inputRow}>
            <Text style={[styles.label, { color: tokens.colors.font.secondary }]}>
              Name:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  borderColor: tokens.colors.border.primary,
                  color: tokens.colors.font.primary,
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
            <Text style={[styles.label, { color: tokens.colors.font.secondary }]}>
              Type:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  borderColor: tokens.colors.border.primary,
                  color: tokens.colors.font.primary,
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
            <Text style={[styles.label, { color: tokens.colors.font.secondary }]}>
              Quantity:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  borderColor: tokens.colors.border.primary,
                  color: tokens.colors.font.primary,
                },
              ]}
              placeholder="Enter quantity"
              placeholderTextColor={tokens.colors.font.secondary}
              keyboardType="numeric"
              value={String(quantity)}
              onChangeText={(val) => setQuantity(parseFloat(val) || 0)}
            />
          </View>

          {/* Unit Input */}
          <View style={styles.inputRow}>
            <Text style={[styles.label, { color: tokens.colors.font.secondary }]}>
              Unit:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  borderColor: tokens.colors.border.primary,
                  color: tokens.colors.font.primary,
                },
              ]}
              placeholder="Enter unit (e.g., lbs, oz)"
              placeholderTextColor={tokens.colors.font.secondary}
              value={unit}
              onChangeText={setUnit}
            />
          </View>

          {/* Expiry Date */}
          <View style={styles.inputRow}>
            <Text style={[styles.label, { color: tokens.colors.font.secondary }]}>
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
            <Text style={[styles.label, { color: tokens.colors.font.secondary }]}>
              Storage:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  borderColor: tokens.colors.border.primary,
                  color: tokens.colors.font.primary,
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
            <Text style={[styles.label, { color: tokens.colors.font.secondary }]}>
              Allergens:
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: tokens.colors.background.primary,
                  borderColor: tokens.colors.border.primary,
                  color: tokens.colors.font.primary,
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
              style={[
                styles.cancelButton,
                { backgroundColor: tokens.colors.secondary[80] },
              ]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: tokens.colors.font.primary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: tokens.colors.primary[80] },
              ]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, { color: tokens.colors.background.primary }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default IngredientDetailsModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    flex: 1,
  },
  input: {
    flex: 3,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 10,
    justifyContent: "space-between",
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
    fontSize: 16,
    fontWeight: "bold",
  },
});