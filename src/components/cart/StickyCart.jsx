"use client";

import dynamic from "next/dynamic";
import React, { useContext } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { useCart } from "react-use-cart";

//internal import
import CartDrawer from "@components/drawer/CartDrawer";
import { SidebarContext } from "@context/SidebarContext";

const StickyCart = ({ currency }) => {
  const { totalItems, cartTotal } = useCart();
  const { cartDrawerOpen, setCartDrawerOpen } = useContext(SidebarContext);

  return (
    <>
      <CartDrawer
        currency={currency}
        open={cartDrawerOpen}
        setOpen={setCartDrawerOpen}
      />
      {!cartDrawerOpen && (
        <button
          aria-label="Cart"
          onClick={() => setCartDrawerOpen(true)}
          className="absolute"
        >
          <div className="right-0 w-35 float-right fixed top-2/4 bottom-2/4 align-middle shadow-xl cursor-pointer z-30 hidden lg:block xl:block animate-float rounded-l-2xl overflow-hidden">
            <div className="flex flex-col items-center justify-center bg-kachabazar-50 p-3 text-kachabazar-800 border-b border-kachabazar-200">
              <span className="text-2xl mb-1 text-kachabazar-600">
                <IoBagHandleOutline />
              </span>
              <span className="px-2 text-sm font-semibold">
                {totalItems} {totalItems === 1 ? "producto" : "productos"}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-kachabazar-600 p-3 text-white text-base font-bold">
              {currency}
              {cartTotal.toFixed(2)}
            </div>
          </div>
        </button>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(StickyCart), { ssr: false });
