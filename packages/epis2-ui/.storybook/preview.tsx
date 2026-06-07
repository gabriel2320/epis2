import type { Preview } from '@storybook/react';
import { Epis2ThemeProvider } from '../src/providers/Epis2ThemeProvider.js';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
  },
  decorators: [
    (Story) => (
      <Epis2ThemeProvider disablePreferences>
        <Story />
      </Epis2ThemeProvider>
    ),
  ],
};

export default preview;
