// app/(tabs)/ai/GenerateRecipesTab.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ProposedActionsList from "@/components/ProposedActionsList";
import { executeAction } from "@/helpers/actionExecutor";
import AiLoading from "@/components/AiLoading";
import { ExtendedTheme } from "@/constants/Colors";
import { generateClient } from "aws-amplify/api";
import { Schema } from "@/amplify/data/resource";
import { useAuthenticator } from "@aws-amplify/ui-react-native";



interface ApplyRecipeResponse {
  responseString: string;
  proposedActions: Array<{
    actionName: string;
    actionArgs: string;
  }>;
}

const GenerateRecipesTab = () => {
  const { colors } = useTheme() as ExtendedTheme;

  // State for the user’s query
  const [input, setInput] = useState("");
  // LLM loading state
  const [loading, setLoading] = useState(false);
  // LLM response
  const [llmResponse, setLLMResponse] = useState<Schema['GenerateRecipesResponse']['type'] | null>(null);
  // Modal details for the selected recipe
  const [selectedRecipe, setSelectedRecipe] = useState<Schema['RecipesFormat']['type'] | null>(null);
  const [notes, setNotes] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [applyResponse, setApplyResponse] =
    useState<ApplyRecipeResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  // Animation references
  const pulseAnim = useRef(new Animated.Value(1)).current; // For scaling
  const opacityAnim = useRef(new Animated.Value(1)).current; // For fading
      const client = generateClient<Schema>();
      const {user} = useAuthenticator();
  

  useEffect(() => {
    if (loading) {
      startPulse();
    } else {
      // Reset animations when not loading
      pulseAnim.setValue(1);
      opacityAnim.setValue(1);
    }
  }, [loading]);

  // Function to start pulsing and opacity animations
  const startPulse = () => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.5,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 900,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  };

  /** 1. Generate recipes from user input */
  const handleGenerateRecipes = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setLLMResponse(null);
    setApplyResponse(null);
    try {
      const response = await client.queries.GenerateRecipes({query: input, owner: user.userId}, {authMode: "userPool"});
      setLLMResponse(response.data);
    } catch (error) {
      console.error("Error generating recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  /** 2. Select a recipe (tap on the short card) to view full details in a modal */
  const handleOpenRecipeDetails = (recipe: Schema['RecipesFormat']['type'] | null) => {
    setSelectedRecipe(recipe);
    setNotes("");
    setApplyResponse(null);
    setModalVisible(true);
  };

  /** 3. Apply (persist) the recipe and optionally run proposed actions */
  const handleApplyRecipe = async () => {
    if (!selectedRecipe) {
      return;
    }

    setApplyLoading(true);
    setLoadingMessage("Storing Recipe...");

    try {
      // 3A. AI function call (applyRecipe)

      setLoadingMessage("Recipe Applied Successfully!");
      setTimeout(() => {
        setModalVisible(false);
        setApplyLoading(false);
        setLoadingMessage("");
      }, 1000);
    } catch (error) {
      console.error("Error applying recipe:", error);
      setApplyLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <View>
      {/* Title */}
      <Text style={[styles.title, { color: colors.primaryText }]}>
        Generate Recipes
      </Text>

      {/* User Input (disabled while loading to prevent changes) */}
      <TextInput
        style={[
          styles.textarea,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder,
            color: colors.primaryText,
            opacity: loading ? 0.5 : 1,
          },
        ]}
        multiline
        numberOfLines={3}
        placeholder="Enter your meal query..."
        placeholderTextColor={colors.secondaryText}
        value={input}
        onChangeText={setInput}
        editable={!loading}
      />

      {/* Generate Button and mic button (disabled while loading) */}
      <View>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: input.trim() ? colors.accent : colors.divider,
              opacity: loading ? 0.7 : 1,
            },
          ]}
          onPress={handleGenerateRecipes}
          disabled={!input.trim() || loading}
        >
          <Ionicons name="sparkles" size={18} color={colors.background} />
          <Text style={[styles.buttonText, { color: colors.background }]}>
            {"  "}Generate Recipes
          </Text>
        </TouchableOpacity>

        {/* Loading UI (sparkles pulsing) */}
        <AiLoading visible={loading} />
      </View>

      {/* AI Response */}
      {llmResponse && (
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.responseHeader, { color: colors.primaryText }]}>
            Assistant Response
          </Text>
          <Text style={{ color: colors.secondaryText, marginBottom: 8 }}>
            {llmResponse.responseString}
          </Text>

          {/* List of Recipes (Short card) */}
          {llmResponse.recipes.map((recipe, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.recipeCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              activeOpacity={0.8}
              onPress={() => handleOpenRecipeDetails(recipe || null)}
            >
              <Text style={[styles.recipeName, { color: colors.primaryText }]}>
                {recipe?.name }
              </Text>
              {/* A shorter, 2-line description */}
              <Text
                style={[
                  styles.recipeDescription,
                  { color: colors.secondaryText },
                ]}
                numberOfLines={2}
              >
                {recipe?.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal with Full Recipe Details */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContainer, { backgroundColor: colors.card }]}
          >
            {selectedRecipe && (
              <>
                {/* Scrollable content */}
                <ScrollView style={styles.modalScroll}>
                  {/* Title */}
                  <Text
                    style={[
                      styles.modalTitle,
                      { color: colors.accent, marginBottom: 6 },
                    ]}
                  >
                    {selectedRecipe.name}
                  </Text>
                  <Text style={{ color: colors.primaryText, marginBottom: 12 }}>
                    {selectedRecipe.description}
                  </Text>

                  {/* Ingredients */}
                  <Text
                    style={[
                      styles.sectionHeader,
                      { color: colors.primaryText },
                    ]}
                  >
                    Ingredients
                  </Text>
                  {selectedRecipe.ingredients.map((item, i) => (
                    <Text
                      key={i}
                      style={{ color: colors.secondaryText, marginLeft: 8 }}
                    >
                      • {item}
                    </Text>
                  ))}
                  <View style={{ marginVertical: 12 }} />

                  {/* Instructions */}
                  <Text
                    style={[
                      styles.sectionHeader,
                      { color: colors.primaryText },
                    ]}
                  >
                    Instructions
                  </Text>
                  {selectedRecipe.instructions.map((instr, i) => (
                    <Text
                      key={i}
                      style={{ color: colors.secondaryText, marginLeft: 8 }}
                    >
                      {i + 1}. {instr}
                    </Text>
                  ))}

                  {/* Notes textfield */}
                  <Text
                    style={[
                      styles.sectionHeader,
                      { color: colors.primaryText, marginTop: 16 },
                    ]}
                  >
                    Your Notes
                  </Text>
                  <TextInput
                    style={[
                      styles.textarea,
                      styles.notesInput,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.inputBorder,
                        color: colors.primaryText,
                      },
                    ]}
                    multiline
                    placeholder="Add any personal notes or adjustments..."
                    placeholderTextColor={colors.secondaryText}
                    value={notes}
                    onChangeText={setNotes}
                  />
                </ScrollView>

                {/* Action Buttons */}
                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      { backgroundColor: colors.divider },
                    ]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={[styles.buttonText, { color: colors.text }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.applyButton,
                      { backgroundColor: colors.accent },
                    ]}
                    onPress={handleApplyRecipe}
                  >
                    <Text
                      style={[styles.buttonText, { color: colors.background }]}
                    >
                      Apply Recipe
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Loading Overlay for applying */}
            {applyLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={{ color: "#fff" }}>{loadingMessage}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Applied recipe response */}
      {applyResponse && !applyLoading && (
        <View style={{ marginTop: 20 }}>
          <Text style={[styles.responseHeader, { color: colors.primaryText }]}>
            Recipe Applied
          </Text>
          <Text style={{ color: colors.secondaryText, marginBottom: 8 }}>
            {applyResponse.responseString}
          </Text>
          <Ionicons name="checkmark-circle" size={32} color={colors.accent} />
          {/* If the response has proposedActions, show them here */}
          {applyResponse.proposedActions.length > 0 && (
            <ProposedActionsList
              proposedActions={applyResponse.proposedActions}
              setLLMResponse={setApplyResponse}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default GenerateRecipesTab;

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
    marginTop: 14,
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
  },
  responseHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  recipeCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  recipeDescription: {
    marginTop: 4,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    maxHeight: "90%",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalScroll: {
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  notesInput: {
    minHeight: 60,
    marginBottom: 12,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: "center",
  },
  applyButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
});
