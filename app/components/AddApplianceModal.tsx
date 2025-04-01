import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { useTheme } from "@aws-amplify/ui-react-native";

interface AddApplianceModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (appliance: { name: string; available: boolean }) => void;
}

const AddApplianceModal: React.FC<AddApplianceModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const { tokens } = useTheme();
  const [name, setName] = useState("");
  const [available, setAvailable] = useState(false);

  // Helper: convert token values (if they are strings, e.g., "20px")
  const parseToken = (token: string | number) =>
    typeof token === "string" ? parseFloat(token) : token;

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ name, available });
    setName("");
    setAvailable(false);
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
            Add Appliance
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
              placeholder="Enter appliance name"
              placeholderTextColor={tokens.colors.font.secondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Availability Switch */}
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
              Available:
            </Text>
            <Switch
              value={available}
              onValueChange={setAvailable}
              trackColor={{
                false: tokens.colors.background.secondary,
                true: tokens.colors.primary[80],
              }}
              thumbColor={
                 tokens.colors.background.secondary
              }
              style={styles.switch}
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
                { backgroundColor: tokens.colors.primary[80]  },
              ]}            >
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

export default AddApplianceModal;

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
  switch: {
    flex: 3,
    alignItems: "flex-start",
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