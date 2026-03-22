/**
 * useTranslation.js: Simplified translation wrapper
 */
import { useGlobalContext } from './useGlobalContext';

export const useTranslation = () => {
  const { t } = useGlobalContext();
  return { t };
};