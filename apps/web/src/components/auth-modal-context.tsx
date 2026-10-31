"use client";

import React, { createContext, useContext, useState } from "react";
import { AuthModal } from "@/components/auth-modal";

interface AuthModalContextType {
  openAuthModal: (defaultTab?: "login" | "register") => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  openAuthModal: () => {},
  closeAuthModal: () => {},
});

export const useAuthModal = () => useContext(AuthModalContext);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"login" | "register">("login");

  const openAuthModal = (tab: "login" | "register" = "login") => {
    setDefaultTab(tab);
    setIsOpen(true);
  };

  const closeAuthModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={closeAuthModal} defaultTab={defaultTab} />
    </AuthModalContext.Provider>
  );
}