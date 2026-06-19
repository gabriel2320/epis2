/** Screen review is an internal dev tool for route/paper QA. */
export function isScreenReviewEnabled(): boolean {
  const flag = import.meta.env.VITE_ENABLE_SCREEN_REVIEW;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return import.meta.env.DEV;
}
