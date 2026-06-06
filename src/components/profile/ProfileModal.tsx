'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile } from '@/hooks/useProfile';

const PRESET_AVATARS = [
  '/avatars/av1.png', '/avatars/av2.png', '/avatars/av3.png',
  '/avatars/av4.png', '/avatars/av5.png', '/avatars/av6.png',
];

interface Props {
  profile: UserProfile;
  address: string;
  onSave: (p: UserProfile) => void;
  onClose: () => void;
}

export function ProfileModal({ profile, address, onSave, onClose }: Props) {
  const [username, setUsername] = useState(profile.username);
  const [avatar, setAvatar]     = useState(profile.avatar);
  const [preview, setPreview]   = useState<string>(profile.avatar);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setAvatar(url);
      setPreview(url);
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    onSave({ username: username.trim(), avatar });
    onClose();
  }

  const shortAddr = address.length > 16
    ? `${address.slice(0, 8)}…${address.slice(-6)}`
    : address;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="bg-[#111] border border-gray-800 rounded-2xl p-6 w-full max-w-sm space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-widest text-white">Your Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-lg leading-none">✕</button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-20 h-20 rounded-full border-2 border-gray-700 overflow-hidden cursor-pointer hover:border-blue-500 transition-colors bg-gray-900 flex items-center justify-center"
          >
            {preview ? (
              <img src={preview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">Photo</span>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">Tap to upload photo</p>
        </div>

        {/* Preset avatars */}
        <div>
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-bold mb-2">Or choose a preset</p>
          <div className="flex gap-2 flex-wrap">
            {PRESET_AVATARS.map((src) => (
              <button
                key={src}
                onClick={() => { setAvatar(src); setPreview(src); }}
                className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-colors ${
                  avatar === src ? 'border-blue-400' : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-bold block mb-1.5">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.slice(0, 20))}
            placeholder="e.g. TacticsMaster"
            maxLength={20}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-gray-700">Max 20 characters</span>
            <span className="text-[9px] text-gray-700">{username.length}/20</span>
          </div>
        </div>

        {/* Wallet */}
        <div className="bg-gray-900 rounded-lg px-3 py-2">
          <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-bold mb-0.5">Wallet</p>
          <p className="text-xs font-mono text-gray-400">{shortAddr}</p>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!username.trim()}
          className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-blue-500 text-black hover:bg-blue-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save Profile
        </button>
      </motion.div>
    </div>
  );
}
