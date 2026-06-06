'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  username: string;
  avatar: string; // url or preset key
}

const DEFAULT: UserProfile = { username: '', avatar: '' };

function storageKey(address: string) {
  return `injmatch_profile_${address}`;
}

export function useProfile(address: string | null) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT);

  useEffect(() => {
    if (!address) { setProfile(DEFAULT); return; }
    try {
      const raw = localStorage.getItem(storageKey(address));
      setProfile(raw ? JSON.parse(raw) : DEFAULT);
    } catch {
      setProfile(DEFAULT);
    }
  }, [address]);

  const saveProfile = useCallback((next: UserProfile) => {
    if (!address) return;
    localStorage.setItem(storageKey(address), JSON.stringify(next));
    setProfile(next);
  }, [address]);

  return { profile, saveProfile };
}
