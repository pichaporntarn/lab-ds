import type { Preview } from "@storybook/react-vite";

import "./storybook.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // 'todo' shows violations in the test UI only; 'error' fails CI.
      test: "todo",
    },
  },
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => {
      // lab-ds dark mode is a `.dark` class on an ancestor.
      document.documentElement.classList.toggle("dark", context.globals.theme === "dark");
      return (
        <div className="bg-background p-4 text-foreground">
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
