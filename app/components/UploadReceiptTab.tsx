// app/(tabs)/ai/UploadReceiptTab.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { ExtendedTheme } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import ProposedActionsList from "@/components/ProposedActionsList";
import * as ImagePicker from "expo-image-picker";
import AiLoading from "@/components/AiLoading";

interface LLMResponse {
  responseString: string;
  proposedActions: Array<{
    actionName: string;
    actionArgs: string;
  }>;
}

const UploadReceiptTab = ({}) => {
  const { colors } = useTheme() as ExtendedTheme;

  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [llmResponse, setLLMResponse] = useState<LLMResponse | null>(null);

  // Replace with real logic from expo-image-picker or react-native-image-picker
  const handleImagePick = async () => {
    try {
      // Ask for permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.status !== "granted") {
        alert("Permission to access the camera roll is required!");
        return;
      }

      // Show an action sheet for choosing the source
      const options = ["Photo Library", "Take Photo", "Cancel"];
      const choice = await new Promise<string | undefined>((resolve) => {
        // Simulate a custom action sheet
        Alert.alert(
          "Select Image Source",
          "Choose where to get your receipt image from:",
          [
            { text: options[0], onPress: () => resolve(options[0]) },
            { text: options[1], onPress: () => resolve(options[1]) },
            {
              text: options[2],
              onPress: () => resolve(undefined),
              style: "cancel",
            },
          ]
        );
      });

      // Handle the user's choice
      if (choice === "Photo Library") {
        // Open the media library
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: "images",
          base64: true,
        });

        if (!result.canceled) {
          setBase64Image(result.assets[0].base64 || null);
        }
      } else if (choice === "Take Photo") {
        // Ask for camera permissions
        const cameraPermissionResult =
          await ImagePicker.requestCameraPermissionsAsync();

        if (cameraPermissionResult.status !== "granted") {
          alert("Permission to access the camera is required!");
          return;
        }

        // Open the camera
        const result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          base64: true,
        });

        if (!result.canceled) {
          setBase64Image(result.assets[0].base64 || null);
        }
      }
    } catch (error) {
      console.error("Error picking an image:", error);
      alert("An error occurred while selecting an image. Please try again.");
    }
  };
  const handleSubmitReceipt = async () => {
    if (!base64Image) {
      return;
    }
    setLoading(true);
    setLLMResponse(null);

    try {
    } catch (error) {
      console.error("Error analyzing receipt:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text style={[styles.title, { color: colors.primaryText }]}>
        Upload Receipt
      </Text>

      {/* "Pick an image" */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={handleImagePick}
      >
        <Ionicons name="cloud-upload" size={18} color={colors.background} />
        <Text style={[styles.buttonText, { color: colors.background }]}>
          {"  "}Pick an Image
        </Text>
      </TouchableOpacity>
      {base64Image && (
        <Text style={{ color: colors.secondaryText, marginVertical: 8 }}>
          Receipt image is ready for analysis.
        </Text>
      )}

      {/* Additional prompt */}
      <TextInput
        style={[
          styles.textarea,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            color: colors.primaryText,
          },
        ]}
        multiline
        numberOfLines={3}
        placeholder="Enter additional details (optional)..."
        placeholderTextColor={colors.secondaryText}
        value={prompt}
        onChangeText={setPrompt}
      />

      {/* Analyze button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: base64Image ? colors.accent : colors.divider,
          },
        ]}
        onPress={handleSubmitReceipt}
        disabled={!base64Image || loading}
      >
        <>
          <Ionicons name="eye" size={18} color={colors.background} />
          <Text style={[styles.buttonText, { color: colors.background }]}>
            {"  "}Analyze Receipt
          </Text>
        </>
      </TouchableOpacity>

      {/* Loading indicator */}
      {/* Loading Indicator */}
      <AiLoading visible={loading} />
      {/* AI Response */}
      {llmResponse && (
        <View style={{ marginTop: 16 }}>
          <Text style={[styles.responseHeader, { color: colors.primaryText }]}>
            Assistant Response
          </Text>
          <Text style={{ color: colors.secondaryText, marginBottom: 12 }}>
            {llmResponse.responseString}
          </Text>

          <ProposedActionsList
            proposedActions={llmResponse.proposedActions}
            setLLMResponse={setLLMResponse}
          />
        </View>
      )}
    </View>
  );
};

export default UploadReceiptTab;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  textarea: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  loadingState: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "center",
  },
  responseHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
