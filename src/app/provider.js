"use client";

import { CartProvider } from "react-use-cart";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";

//internal imports
import { UserProvider } from "@context/UserContext";
import { SidebarProvider } from "@context/SidebarContext";
import { LanguageProvider } from "@context/LanguageContext";
import { LoyaltyProvider } from "@context/LoyaltyContext";
import { VetProvider } from "@context/VetContext";

const Providers = ({ children, storeSetting }) => {
  return (
    <>
      <ToastContainer />
      <SessionProvider>
        <LanguageProvider>
          <SidebarProvider>
            <UserProvider>
              <LoyaltyProvider>
                <VetProvider>
                  <CartProvider>{children}</CartProvider>
                </VetProvider>
              </LoyaltyProvider>
            </UserProvider>
          </SidebarProvider>
        </LanguageProvider>
      </SessionProvider>
    </>
  );
};

export default Providers;
