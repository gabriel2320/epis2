import { EPIS2_DATA_ORIGIN_SYSTEM } from './constants.js';

export type ChileInteropMetaTag = {
  system: string;
  code: string;
  display?: string;
};

/** Tag DEMO/SINTÉTICO compartido por export MINSAL y SNRE staging. */
export function syntheticOriginTag(isSynthetic: boolean): ChileInteropMetaTag | undefined {
  if (!isSynthetic) return undefined;
  return {
    system: EPIS2_DATA_ORIGIN_SYSTEM,
    code: 'synthetic',
    display: 'DEMO/SINTÉTICO',
  };
}

export function buildChileProfileMeta(
  profile: string,
  options?: { isSynthetic?: boolean; tags?: ChileInteropMetaTag[] },
): { profile: string[]; tag?: ChileInteropMetaTag[] } {
  const meta: { profile: string[]; tag?: ChileInteropMetaTag[] } = { profile: [profile] };
  const tagList: ChileInteropMetaTag[] = [...(options?.tags ?? [])];
  const synthetic = syntheticOriginTag(options?.isSynthetic ?? false);
  if (synthetic) tagList.push(synthetic);
  if (tagList.length) meta.tag = tagList;
  return meta;
}
