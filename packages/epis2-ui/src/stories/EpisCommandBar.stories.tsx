import { copy } from '@epis2/design-system';
import { getCommandBarAiHint } from '@epis2/command-registry';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EpisCommandBar } from '../command/EpisCommandBar.js';

function CommandBarDemo() {
  const [value, setValue] = useState('');
  return (
    <EpisCommandBar
      label={copy.commandCenter.powerBarLabel}
      placeholder={copy.commandCenter.powerBarPlaceholder}
      submitLabel={copy.commandCenter.submit}
      value={value}
      onChange={setValue}
      onSubmit={() => undefined}
      aiAvailable
      aiHint={getCommandBarAiHint('physician', true)}
      roleLabel="Médico"
      role="physician"
    />
  );
}

const meta = {
  title: 'Comando/EpisCommandBar',
  component: CommandBarDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof CommandBarDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <CommandBarDemo />,
};

export const ConError: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <EpisCommandBar
        label={copy.commandCenter.powerBarLabel}
        placeholder={copy.commandCenter.powerBarPlaceholder}
        submitLabel={copy.commandCenter.submit}
        value={value}
        onChange={setValue}
        onSubmit={() => undefined}
        error={copy.commandCenter.emptyCommand}
        roleLabel="Médico"
        role="physician"
      />
    );
  },
};
