export type DrugRouteEsCl = 'VO' | 'EV' | 'IM' | 'SC' | 'SL' | 'INH' | 'TOP' | 'RECT';

export type DrugLocalUse = 'hospitalizado' | 'urgencia' | 'ambulatorio';

export type DrugDictionaryEntry = {
  id: string;
  activeIngredient: string;
  commonNames: readonly string[];
  usualOrders: readonly string[];
  routes: readonly DrugRouteEsCl[];
  warnings: readonly string[];
  renalAdjustment?: string;
  localUse: readonly DrugLocalUse[];
};

export type DrugSearchResult = {
  entry: DrugDictionaryEntry;
  score: number;
  matchedOn: 'ingredient' | 'name' | 'order';
};
