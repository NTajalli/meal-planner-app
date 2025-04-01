import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { ExtendedTheme } from "@/constants/Colors";

import { executeAction } from "@/helpers/actionExecutor";

interface ProposedAction {
  actionName: string;
  actionArgs: string;
}

interface ProposedActionsListProps {
  proposedActions: ProposedAction[];
  setLLMResponse: React.Dispatch<React.SetStateAction<any>>;
}

const ProposedActionsList: React.FC<ProposedActionsListProps> = ({
  proposedActions,
  setLLMResponse,
}) => {
  const { colors } = useTheme() as ExtendedTheme;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loadingAll, setLoadingAll] = useState(false);

  const handleActionConfirm = async (action: ProposedAction, index: number) => {
    try {
      await executeAction(action.actionName, action.actionArgs);
      removeActionBlock(index);
    } catch (error) {
      console.error("Error executing action:", error);
    }
  };

  const removeActionBlock = (index: number) => {
    setLLMResponse((prev: any) =>
      prev
        ? {
            ...prev,
            proposedActions: prev.proposedActions.filter(
              (_: any, i: number) => i !== index
            ),
          }
        : null
    );
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const handleConfirmAll = async () => {
    setLoadingAll(true);
    try {
      for (const [index, action] of proposedActions.entries()) {
        await executeAction(action.actionName, action.actionArgs);
        removeActionBlock(index);
      }
    } catch (error) {
      console.error("Error confirming all actions:", error);
    } finally {
      setLoadingAll(false);
    }
  };

  const handleRejectAll = () => {
    setLLMResponse((prev: any) =>
      prev
        ? {
            ...prev,
            proposedActions: [],
          }
        : null
    );
  };

  if (!proposedActions.length) {
    return null;
  }

  return (
    <View style={{ marginTop: 12 }}>
      {/* Confirm All / Reject All Buttons */}
      <View style={styles.allButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.allButton,
            { backgroundColor: colors.accent, marginRight: 8 },
          ]}
          onPress={handleConfirmAll}
          disabled={loadingAll}
        >
          <MaterialIcons
            name="check-circle"
            size={18}
            color={colors.background}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.buttonText, { color: colors.background }]}>
            {loadingAll ? "Processing..." : "Confirm All"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.allButton, { backgroundColor: colors.error }]}
          onPress={handleRejectAll}
          disabled={loadingAll}
        >
          <MaterialIcons
            name="cancel"
            size={18}
            color={colors.background}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.buttonText, { color: colors.background }]}>
            Reject All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Individual Action Cards */}
      {proposedActions.map((action, index) => {
        const isExpanded = index === expandedIndex;

        // Parse and format actionArgs into a more user-friendly structure
        const args = action.actionArgs
          .split(";")
          .filter((arg) => !arg.toLowerCase().includes("primarykey"))
          .map((arg) => {
            const [key, value] = arg.split("=");
            return { key: key.trim(), value: value.trim() };
          });

        return (
          <View
            key={index}
            style={[
              styles.actionCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <Ionicons
                name="settings-outline"
                size={20}
                color={colors.accent}
              />
              <Text style={[styles.actionTitle, { color: colors.accent }]}>
                {action.actionName.replace("_", " ")}
              </Text>
              <TouchableOpacity
                style={{ padding: 6 }}
                onPress={() => toggleExpand(index)}
              >
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.secondaryText}
                />
              </TouchableOpacity>
            </View>

            {/* Condensed View */}
            {!isExpanded && (
              <View style={styles.condensedRow}>
                {args.slice(0, 2).map((arg, i) => (
                  <Text
                    key={i}
                    style={[
                      styles.condensedText,
                      { color: colors.secondaryText },
                    ]}
                  >
                    {arg.key.charAt(0).toLocaleUpperCase() +
                      arg.key.substring(1)}
                    : {arg.value}
                  </Text>
                ))}
                {args.length > 2 && (
                  <Text style={{ color: colors.secondaryText }}>
                    ...more details
                  </Text>
                )}
              </View>
            )}

            {/* Expanded View */}
            {isExpanded && (
              <View style={{ marginVertical: 10 }}>
                {args.map((arg, i) => (
                  <View key={i} style={styles.argRow}>
                    <Text
                      style={[styles.argKey, { color: colors.primaryText }]}
                    >
                      {arg.key.charAt(0).toLocaleUpperCase() +
                        arg.key.substring(1)}
                      :
                    </Text>
                    <Text
                      style={[styles.argValue, { color: colors.secondaryText }]}
                    >
                      {arg.value}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.rejectButton, { backgroundColor: colors.error }]}
                onPress={() => removeActionBlock(index)}
              >
                <MaterialIcons
                  name="close"
                  size={16}
                  color={colors.background}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.buttonText, { color: colors.background }]}>
                  Reject
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  { backgroundColor: colors.accent },
                ]}
                onPress={() => handleActionConfirm(action, index)}
              >
                <MaterialIcons
                  name="check"
                  size={16}
                  color={colors.background}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.buttonText, { color: colors.background }]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ProposedActionsList;

const styles = StyleSheet.create({
  allButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  allButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  actionCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  condensedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  condensedText: {
    fontSize: 14,
    marginBottom: 4,
  },
  argRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  argKey: {
    fontSize: 14,
    fontWeight: "600",
  },
  argValue: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  rejectButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
