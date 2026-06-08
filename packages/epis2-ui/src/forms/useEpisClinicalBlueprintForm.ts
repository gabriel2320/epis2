import {
  buildBlueprintFormSchema,
  initialFormValues,
  type ClinicalFormBlueprint,
} from '@epis2/clinical-forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';

export type EpisClinicalFormValues = Record<string, string>;

export type UseEpisClinicalBlueprintFormOptions = {
  blueprint: ClinicalFormBlueprint;
  seed?: Record<string, string>;
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all';
};

export function useEpisClinicalBlueprintForm({
  blueprint,
  seed,
  mode = 'onBlur',
}: UseEpisClinicalBlueprintFormOptions): UseFormReturn<EpisClinicalFormValues> {
  const schema = useMemo(
    () => buildBlueprintFormSchema(blueprint),
    [blueprint.blueprintId, blueprint.fields.length, blueprint.validations.length],
  );
  const defaultValues = useMemo(
    () => initialFormValues(blueprint, seed),
    [blueprint.blueprintId, seed],
  );

  return useForm<EpisClinicalFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode,
  });
}
