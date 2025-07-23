import { create } from 'zustand';

const useAvatarStore = create((set) => ({
  avatars: [],
  setAvatars: (avatars) => set({ avatars }),
}));

export default useAvatarStore;