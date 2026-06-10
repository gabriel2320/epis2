import type { Meta, StoryObj } from '@storybook/react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { EpisMobileNavDrawer } from '../clinical/EpisMobileNavDrawer.js';

const meta = {
  title: 'Clínica/EpisMobileNavDrawer',
  component: EpisMobileNavDrawer,
  tags: ['autodocs'],
  parameters: {
    // MF-NORM-403: drawer modal MD3 para viewport compact (<768px).
    viewport: { defaultViewport: 'mobile1' },
  },
} satisfies Meta<typeof EpisMobileNavDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Compact: Story = {
  args: {
    items: [
      { id: 'home', label: 'Centro de comando', icon: <HomeIcon /> },
      { id: 'agenda', label: 'Agenda', icon: <CalendarMonthIcon />, active: true },
      { id: 'sep', label: '', variant: 'divider' },
      { id: 'preferencias', label: 'Preferencias', icon: <SettingsIcon /> },
    ],
  },
};
