import { useCallback } from 'react';

export const useProfileActions = (
  updateConfig: (path: string, value: unknown) => void
) => {
  const addSpringProfile = useCallback((profiles: string[], profile: string) => {
    if (profile.trim() && !profiles.includes(profile.trim())) {
      const newProfiles = [...profiles, profile.trim()];
      updateConfig('springProfiles', newProfiles);
    }
  }, [updateConfig]);

  const removeSpringProfile = useCallback((profiles: string[], index: number) => {
    const newProfiles = profiles.filter((_, i) => i !== index);
    updateConfig('springProfiles', newProfiles);
  }, [updateConfig]);

  return {
    addSpringProfile,
    removeSpringProfile
  };
};