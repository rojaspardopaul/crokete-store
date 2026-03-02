"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useSetting } from "@context/SettingContext";

const FloatingWhatsApp = () => {
  const pathname = usePathname();
  const { globalSetting, storeCustomization } = useSetting();
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const widgetRef = useRef(null);

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Stop pulse animation after some time
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  // Hide when a modal/drawer is open
  useEffect(() => {
    const check = () => {
      const hasDialog = document.querySelector("[data-headlessui-state='open']");
      const hasDrawer = document.querySelector(".drawer-open");
      setOverlayVisible(!!(hasDialog || hasDrawer));
    };
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "data-headlessui-state"] });
    check();
    return () => observer.disconnect();
  }, []);

  // Solo mostrar en la página principal y sin popups abiertos
  if (pathname !== "/" || overlayVisible) return null;

  const shopName =
    globalSetting?.shop_name || storeCustomization?.setting?.shop_name || "Crokete";
  const whatsappNumber =
    globalSetting?.whatsapp || globalSetting?.phone || "+523310448051";
  const cleanPhone = whatsappNumber.replace(/[^\d]/g, "");
  const predefinedText = `Hola ${shopName}, quiero contactarlos`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(predefinedText)}`;

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-20 right-6 z-[9990] flex flex-col items-end"
    >
      {/* Chat widget popup */}
      {isOpen && (
        <div className="wa-widget mb-3 w-[300px] rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="wa-widget__header bg-[#075e54] px-4 py-3 flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                <Image
                  src="/logo/logo-color.png"
                  alt={shopName}
                  width={44}
                  height={44}
                  className="object-cover rounded-full"
                />
              </div>
              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] border-2 border-[#075e54] rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">
                {shopName}
              </p>
              <p className="text-[#a8d8b9] text-xs">En línea</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Cerrar"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Chat body */}
          <div className="wa-widget__body bg-[#e5ddd5] px-4 py-5 relative">
            {/* WhatsApp background pattern */}
            <div className="absolute inset-0 opacity-5 bg-repeat" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
            
            {/* Message bubble */}
            <div className="relative bg-white rounded-lg rounded-tl-none px-3 py-2 shadow-sm max-w-[220px]">
              <p className="text-[#303030] text-sm leading-relaxed">
                ¡Hola! 👋
                <br />
                ¿En qué podemos ayudarte?
              </p>
              <span className="text-[10px] text-gray-400 float-right mt-1">
                {new Date().toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          </div>

          {/* Footer / CTA */}
          <div className="wa-widget__footer bg-white px-4 py-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25d366] hover:bg-[#1da851] text-white font-medium text-sm py-2.5 px-4 rounded-full transition-colors"
            >
              <FaWhatsapp size={18} />
              Iniciar conversación
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowPulse(false);
        }}
        className="wa-fab group relative flex items-center gap-2 bg-[#25d366] hover:bg-[#1da851] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Contactar por WhatsApp"
      >
        {/* Pulse ring */}
        {showPulse && !isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-40" />
        )}

        {/* Icon */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          {isOpen ? (
            <IoClose size={26} className="transition-transform duration-300" />
          ) : (
            <FaWhatsapp
              size={28}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          )}
        </div>

        {/* Label — only visible on desktop when widget is closed */}
        {!isOpen && (
          <span className="hidden lg:inline-block pr-5 text-sm font-medium whitespace-nowrap">
            ¿Necesitas ayuda?
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingWhatsApp;
