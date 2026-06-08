import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form';
import {
  ClinicalRichTextEditor,
  type ClinicalRichTextEditorProps,
} from './ClinicalRichTextEditor.js';

export type ClinicalRichTextFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  minRows?: number;
  testId?: ClinicalRichTextEditorProps['testId'];
};

/** Campo clínico enriquecido integrado con React Hook Form. */
export function ClinicalRichTextField<T extends FieldValues>({
  name,
  control,
  label,
  minRows,
  testId,
}: ClinicalRichTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ClinicalRichTextEditor
          label={label}
          value={field.value ?? ''}
          onChange={(value) => field.onChange(value)}
          {...(minRows !== undefined ? { minRows } : {})}
          {...(testId ? { testId } : {})}
        />
      )}
    />
  );
}
