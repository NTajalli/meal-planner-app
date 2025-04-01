import { ExtendedTheme } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Easing } from "react-native-reanimated";

interface AiLoadingProps {
  visible: boolean;
}

const AiLoading: React.FC<AiLoadingProps> = ({ visible }) => {
  const { colors } = useTheme() as ExtendedTheme;

  const pulseAnim = useRef(new Animated.Value(1)).current; // For scaling
  const opacityAnim = useRef(new Animated.Value(1)).current; // For fading

  useEffect(() => {
    if (visible) {
      startPulse();
    } else {
      // Reset animations when not visible
      pulseAnim.setValue(1);
      opacityAnim.setValue(1);
    }
  }, [visible]);

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
  if (!visible) return <></>;

  return (
    <View style={styles.loadingState}>
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          opacity: opacityAnim,
        }}
      >
        <Ionicons name="sparkles" size={28} color={colors.accent} />
      </Animated.View>
      <Animated.Text
        style={[
          styles.loadingText,
          {
            color: colors.secondaryText,
            marginLeft: 8,
            opacity: opacityAnim,
          },
        ]}
      >
        Analyzing...
      </Animated.Text>
    </View>
  );
};

export default AiLoading;

const styles = StyleSheet.create({
  loadingState: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 14,
  },
});
