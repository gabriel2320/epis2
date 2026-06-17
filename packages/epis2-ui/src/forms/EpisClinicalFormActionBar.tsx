import { EpisPrimaryActionBar, type EpisPrimaryActionBarProps } from './EpisPrimaryActionBar.js';

export type EpisClinicalFormActionBarOverflowItem = {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  testId?: string;
};

export type EpisClinicalFormActionBarProps = {
  saveLabel: string;
  onSave: () => void;
  saveDisabled?: boolean;
  signLabel?: string;
  onSign?: () => void;
  signDisabled?: boolean;
  overflow?: EpisClinicalFormActionBarOverflowItem[];
  overflowAriaLabel?: string;
};

/** UX-G03 / MF-AEST-01 — delega en EpisPrimaryActionBar. */
export function EpisClinicalFormActionBar({
  saveLabel,
  onSave,
  saveDisabled,
  signLabel,
  onSign,
  signDisabled,
  overflow = [],
  overflowAriaLabel = 'Más acciones',
}: EpisClinicalFormActionBarProps) {
  const primary: EpisPrimaryActionBarProps['primary'] = {
    id: 'save',
    label: saveLabel,
    onClick: onSave,
    ...(saveDisabled ? { disabled: true } : {}),
    testId: 'epis2-form-save',
  };

  const secondary: EpisPrimaryActionBarProps['secondary'] = [];
  if (signLabel && onSign) {
    secondary.push({
      id: 'sign',
      label: signLabel,
      onClick: onSign,
      appearance: 'outlined',
      ...(signDisabled ? { disabled: true } : {}),
      testId: 'epis2-form-sign',
    });
  }

  return (
    <EpisPrimaryActionBar
      primary={primary}
      secondary={secondary}
      overflow={overflow}
      overflowLabel={overflowAriaLabel}
      testId="epis2-clinical-form-action-bar"
    />
  );
}
