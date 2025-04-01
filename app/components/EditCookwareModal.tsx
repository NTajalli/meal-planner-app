import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "@aws-amplify/ui-react-native";

interface EditCookwareModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (newQuantity: number) => void;
  initialQuantity: number;
  cookwareName: string;
}

const EditCookwareModal: React.FC<EditCookwareModalProps> = ({
  visible,
  onClose,
  onSave,
  initialQuantity,
  cookwareName,
}) => {
  const { tokens } = useTheme();
  const [quantity, setQuantity] = useState<string>(String(initialQuantity));

  const handleSave = () => {
    const parsedQuantity = parseInt(quantity, 10);
    if (!isNaN(parsedQuantity) && parsedQuantity >= 0) {
      onSave(parsedQuantity);
      onClose();
    } else {
      alert("Please enter a valid number for the quantity.");
    }
  };

  useEffect(() => {
    setQuantity(String(initialQuantity));
  }, [initialQuantity]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: tokens.colors.background.secondary },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: tokens.colors.font.primary },
            ]}
          >
            Edit Quantity
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: tokens.colors.font.secondary },
            ]}
          >
            Update quantity for {cookwareName}.
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
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Enter quantity"
            placeholderTextColor={tokens.colors.font.secondary}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.cancelButton,
                { backgroundColor: tokens.colors.secondary[80] },
              ]}
              onPress={onClose}
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
              style={[
                styles.saveButton,
                { backgroundColor: tokens.colors.primary[80] },
              ]}
              onPress={handleSave}
              disabled={Number.isNaN(parseFloat(quantity))}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: tokens.colors.background.primary },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditCookwareModal;