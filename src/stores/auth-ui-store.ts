"use client";

import { create } from "zustand";

interface AuthUiState {
	isRegisterMode: boolean;
	toggleMode: () => void;
	showLoginMode: () => void;
	showRegisterMode: () => void;
}

export const useAuthUiStore = create<AuthUiState>((set) => ({
	isRegisterMode: false,
	toggleMode: () => set((state) => ({ isRegisterMode: !state.isRegisterMode })),
	showLoginMode: () => set({ isRegisterMode: false }),
	showRegisterMode: () => set({ isRegisterMode: true }),
}));