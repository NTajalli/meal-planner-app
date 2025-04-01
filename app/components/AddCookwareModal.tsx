import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "@aws-amplify/ui-react-native";

interface AddCookwareModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (cookware: { name: string; quantity: number }) => void;
}

const AddCookwareModal: React.FC<AddCookwareModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const { tokens } = useTheme();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number | string>("");

  // Helper: convert token values (e.g., "20px") to numeric values
  const parseToken = (token: string | number) =>
    typeof token === "string" ? parseFloat(token) : token;

  const handleAdd = () => {
    if (!name.trim() || Number(quantity) <= 0) return;
    onAdd({ name, quantity: Number(quantity) });
    setName("");
    setQuantity("");
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
              {
                color: tokens.colors.font.primary,
                fontSize: parseToken(tokens.fontSizes.large),
              },
            ]}
          >
            Add Cookware
          </Text>

          {/* Name Input */}
          <View style={styles.inputRow}>
            <Text
              style={[
                styles.label,
                {
                  color: tokens.colors.font.secondary,
                  fontSize: parseToken(tokens.fontSizes.medium),
                },
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
              placeholder="Enter cookware name"
              placeholderTextColor={tokens.colors.font.secondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Quantity Input */}
          <View style={styles.inputRow}>
            <Text
              style={[
                styles.label,
                {
                  color: tokens.colors.font.secondary,
                  fontSize: parseToken(tokens.fontSizes.medium),
                },
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
              value={String(quantity)}
              onChangeText={setQuantity}
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
                  {
                    color: tokens.colors.font.primary,
                    fontSize: parseToken(tokens.fontSizes.medium),
                  },
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
              disabled={Number.isNaN(parseFloat(String(quantity)))}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: tokens.colors.background.primary,
                    fontSize: parseToken(tokens.fontSizes.medium),
                  },
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

export default AddCookwareModal;

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
    fontWeight: "bold",
  },
});