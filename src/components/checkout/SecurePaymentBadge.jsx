"use client";

import React from "react";
import { FiLock, FiShield } from "react-icons/fi";

const SecurePaymentBadge = () => {
  return (
    <div className="mt-4 space-y-3">
      {/* Security indicators */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 text-green-600">
          <FiLock className="w-4 h-4" />
          <span className="text-xs font-medium">Pago 100% seguro</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <FiShield className="w-4 h-4" />
          <span className="text-xs">Conexión cifrada SSL</span>
        </div>
      </div>

      {/* Privacy note */}
      <p className="text-[11px] text-gray-400 leading-tight">
        Tus datos de tarjeta nunca se almacenan en nuestros servidores. Son
        procesados directamente por Stripe, líder mundial en pagos seguros.
      </p>

      {/* Accepted cards */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-gray-400">Aceptamos:</span>
        <div className="flex gap-1.5">
          {/* Visa */}
          <div className="w-9 h-6 bg-white border border-gray-200 rounded flex items-center justify-center">
            <svg viewBox="0 0 48 32" className="w-6 h-4">
              <rect width="48" height="32" rx="4" fill="#fff" />
              <path d="M19.5 21.5h-3.2l2-12.3h3.2l-2 12.3z" fill="#1A1F71" />
              <path
                d="M32.7 9.5c-.6-.2-1.6-.5-2.9-.5-3.2 0-5.4 1.7-5.4 4.1 0 1.8 1.6 2.8 2.8 3.4 1.2.6 1.7 1 1.7 1.6 0 .8-1 1.2-1.9 1.2-1.3 0-2-.2-3-.6l-.4-.2-.5 2.8c.8.3 2.2.6 3.6.6 3.4 0 5.5-1.7 5.5-4.2 0-1.4-.8-2.5-2.7-3.4-1.1-.6-1.8-1-1.8-1.5 0-.5.6-1.1 1.8-1.1 1 0 1.8.2 2.4.5l.3.1.5-2.8z"
                fill="#1A1F71"
              />
              <path
                d="M37.3 9.2h-2.5c-.8 0-1.3.2-1.7 1l-4.7 11.3h3.4l.7-1.9h4.1l.4 1.9H40l-2.7-12.3zm-3.8 7.9l1.7-4.6.9 4.6h-2.6z"
                fill="#1A1F71"
              />
              <path
                d="M15.6 9.2l-3.2 8.4-.3-1.7c-.6-2-2.5-4.2-4.6-5.2l2.9 10.8h3.4l5.1-12.3h-3.3z"
                fill="#1A1F71"
              />
            </svg>
          </div>
          {/* Mastercard */}
          <div className="w-9 h-6 bg-white border border-gray-200 rounded flex items-center justify-center">
            <svg viewBox="0 0 48 32" className="w-6 h-4">
              <rect width="48" height="32" rx="4" fill="#fff" />
              <circle cx="19" cy="16" r="8" fill="#EB001B" />
              <circle cx="29" cy="16" r="8" fill="#F79E1B" />
              <path
                d="M24 10.3a8 8 0 0 1 0 11.4 8 8 0 0 1 0-11.4z"
                fill="#FF5F00"
              />
            </svg>
          </div>
          {/* AMEX */}
          <div className="w-9 h-6 bg-[#006FCF] border border-gray-200 rounded flex items-center justify-center">
            <span className="text-white text-[8px] font-bold tracking-tight">
              AMEX
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurePaymentBadge;
