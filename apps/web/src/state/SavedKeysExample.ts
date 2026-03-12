import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SavedKeysExampleState {
	savedKeys: string[];
	save: (key: string) => void;
	remove: (key: string) => void;
	isSaved: (key: string) => boolean;
}

export const useSavedKeysExample = create<SavedKeysExampleState>()(
	persist(
		(set, get) => ({
			savedKeys: [],
			save: (key) =>
				set((state) =>
					state.savedKeys.includes(key) ? state : { savedKeys: [...state.savedKeys, key] },
				),
			remove: (key) =>
				set((state) => ({
					savedKeys: state.savedKeys.filter((k) => k !== key),
				})),
			isSaved: (key) => get().savedKeys.includes(key),
		}),
		{ name: 'saved-keys-example' },
	),
);
