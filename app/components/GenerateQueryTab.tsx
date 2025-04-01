// app/(tabs)/ai/GenerateQueryTab.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { ExtendedTheme } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import ProposedActionsList from "@/components/ProposedActionsList";
import AiLoading from "@/components/AiLoading";

interface LLMResponse {
  responseString: string;
  proposedActions: Array<{
    actionName: string;
    actionArgs: string;
  }>;
}

const GenerateQueryTab = ({}) => {
  const { colors } = useTheme() as ExtendedTheme;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [llmResponse, setLLMResponse] = useState<LLMResponse | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setLLMResponse(null);
    try {
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text style={[styles.title, { color: colors.primaryText }]}>
        Manage Inventory
      </Text>

      {/* Input */}
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
        placeholder="Enter your query..."
        placeholderTextColor={colors.secondaryText}
        value={input}
        onChangeText={setInput}
      />

      {/* Button */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: input.trim() ? colors.accent : colors.divider },
        ]}
        onPress={handleGenerate}
        disabled={!input.trim() || loading}
      >
        <Ionicons name="sparkles" size={18} color={colors.background} />
        <Text style={[styles.buttonText, { color: colors.background }]}>
          {"  "}Analyze Query
        </Text>
      </TouchableOpacity>

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

export default GenerateQueryTab;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  textarea: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
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
  loadingState: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    textAlign: "center",
    justifyContent: "center",
  },
  responseHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
