import { Theme, DefaultTheme } from "@react-navigation/native";
import { Theme as AmplifyTheme } from "@aws-amplify/ui-react-native";
import { createTheme } from "@aws-amplify/ui-react-native/dist/theme";

// Define Extended Theme Interface
export interface ExtendedTheme extends Theme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    secondary: string;
    accent: string;
    primaryText: string;
    secondaryText: string;
    inputBackground: string;
    inputBorder: string;
    cardBackground: string;
    success: string;
    warning: string;
    error: string;
    divider: string;
    highlight: string;
    shadow: string;
    icon: string;
    tabIconDefault: string;
    tabIconSelected: string;
  };
}

export interface AmplifyThemeType extends AmplifyTheme {
  tokens: {
    colors: {
      primary: Record<string, { value: string }>;
      secondary: Record<string, { value: string }>;
      font: {
        primary: { value: string };
        secondary: { value: string };
        inverse: { value: string };
        interactive: { value: string };
        error: { value: string };
        warning: { value: string };
        success: { value: string };
      };
      background: {
        primary: { value: string };
        secondary: { value: string };
        tertiary: { value: string };
        quaternary: { value: string };
      };
      border: {
        primary: { value: string };
        secondary: { value: string };
        error: { value: string };
        success: { value: string };
        warning: { value: string };
      };
      input: {
        background: { value: string };
        border: { value: string };
        text: { value: string };
        placeholder: { value: string };
      };
      button: {
        background: { value: string };
        text: { value: string };
        border: { value: string };
      };
    };
    fontSizes: Record<string, { value: string }>;
    fontWeights: Record<string, { value: string }>;
    space: Record<string, { value: number }>;
    radii: Record<string, { value: string }>;
    time: Record<string, { value: string }>;
  };
}

const tintColorLight = "#007AFF"; // Primary Blue for Light Mode
const tintColorDark = "#0A84FF"; // Primary Light Blue for Dark Mode

export type AmplifyThemeTokens = typeof amplifyTheme.tokens;

export const LightTheme: ExtendedTheme = {
  dark: false,
  colors: {
    primary: "#007AFF",
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#000000",
    border: "#D1D1D6",
    notification: "#FF9500",
    secondary: "#F2F2F7",
    accent: "#FF9500",
    primaryText: "#000000",
    secondaryText: "rgba(60, 60, 67, 0.6)", // Dark Gray with 60% Opacity
    inputBackground: "#F9F9F9",
    inputBorder: "#D1D1D6",
    cardBackground: "#FFFFFF",
    success: "#34C759",
    warning: "#FFCC00",
    error: "#FF3B30",
    divider: "#C6C6C8",
    highlight: "#E0F7FF",
    shadow: "rgba(0, 0, 0, 0.1)", // 10% Opacity
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  fonts: DefaultTheme.fonts,
};

export const DarkTheme: ExtendedTheme = {
  dark: true,
  colors: {
    primary: "#0A84FF",
    background: "#000000",
    card: "#1C1C1E",
    text: "#FFFFFF",
    border: "#3A3A3C",
    notification: "#FF9F0A",
    secondary: "#1C1C1E",
    accent: "#FF9F0A",
    primaryText: "#FFFFFF",
    secondaryText: "rgba(235, 235, 245, 0.6)", // Light Gray with 60% Opacity
    inputBackground: "#1C1C1E",
    inputBorder: "#3A3A3C",
    cardBackground: "#1C1C1E",
    success: "#30D158",
    warning: "#FFD60A",
    error: "#FF453A",
    divider: "#48484A",
    highlight: "#255B9C",
    shadow: "rgba(0, 0, 0, 0.5)", // 50% Opacity
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
  fonts: DefaultTheme.fonts,
};

/**
 * Create an Amplify UI theme using design tokens
 */
export const amplifyTheme: AmplifyTheme = {
  tokens: {
    colors: {
      // Accent colors for a modern, fresh feel
      primary: {
        10: '#e6f4ea',
        20: '#cce9d5',
        40: '#99d3ab',
        60: '#66bd81',
        80: '#33a75a',
        90: '#1d8c45',
        100: '#02762f',
      },
      secondary: {
        10: '#fff4e6',
        20: '#ffe9cc',
        40: '#ffd399',
        60: '#ffc066',
        80: '#ffad33',
        90: '#ff9900',
        100: '#e68a00',
      },
      // Background colors for a clean, modern look
      background: {
        primary: '#ffffff',
        secondary: '#f4f4f4',
      },
      // Font colors for legibility in light mode
      font: {
        primary: '#333333',
        secondary: '#555555',
      },
      // Border color to gently separate components
      border: {
        primary: '#dddddd',
      },
      button: {
        80: '#AB6E3D', // A darker variant for dark mode
      },

    },
    // Typography tokens
    fontSizes: {
      small: '12px',
      medium: '16px',
      large: '20px',
      xlarge: '24px',
    },
  },
  // Dark mode override
  overrides: [
    {
      colorMode: 'dark',
      tokens: {
        colors: {
          background: {
            primary: '#121212',
            secondary: '#1e1e1e',
          },
          font: {
            primary: '#e0e0e0',
            secondary: '#b0b0b0',
          },
          border: {
            primary: '#333333',
          },
          // Override secondary for dark mode
          secondary: {
            80: '#cc8b25', // a muted gold/brown for the "Add" button
          },
          button: {
            background: '#ff9900', // or a darker brand color
            text: '#1e1e1e',
            border: '#333333',
          },
        },
      },
    },
  ],
};