import { useContext, useState } from "react";
import { useCart } from "react-use-cart";

import { notifyError, notifySuccess } from "@utils/toast";
import { SidebarContext } from "@context/SidebarContext";

const useAddToCart = () => {
  const [item, setItem] = useState(1);
  const { addItem, items, updateItemQuantity, totalItems } = useCart();
  const { setCartDrawerOpen } = useContext(SidebarContext);

  const openCartOnDesktop = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 640)
      setCartDrawerOpen(true);
  };
  // console.log('products',products)
  // console.log("items", items);

  const handleAddItem = (product, quantity = item, { openCart = true } = {}) => {
    const result = items.find((i) => i.id === product.id);
    const { variants, categories, description, ...updatedProduct } = product;

    const availableStock = product?.variant?.quantity ?? product?.stock;

    if (result !== undefined) {
      if (result?.quantity + quantity <= availableStock) {
        addItem(updatedProduct, quantity);
        notifySuccess(`${quantity} ${product.title} agregado al carrito!`);
        if (openCart) openCartOnDesktop();
      } else {
        notifyError("Stock no válido!");
      }
    } else {
      if (quantity <= availableStock) {
        addItem(updatedProduct, quantity);
        notifySuccess(`${quantity} ${product.title} agregado al carrito!`);
        if (openCart) openCartOnDesktop();
      } else {
        notifyError("Stock no válido!");
      }
    }
  };

  const handleIncreaseQuantity = (product) => {
    const result = items?.find((p) => p.id === product.id);
    // console.log(
    //   "handleIncreaseQuantity",
    //   product,
    //   result?.quantity + item,
    //   product?.variants?.length > 0
    //     ? product?.variant?.quantity
    //     : product?.stock
    // );
    if (result) {
      const availableStock = product?.variant?.quantity ?? product?.stock;
      if (result?.quantity + item <= availableStock) {
        updateItemQuantity(product.id, product.quantity + 1);
        notifySuccess(`${product.title} actualizado en el carrito!`);
        openCartOnDesktop();
      } else {
        notifyError("Stock no válido!");
      }
    }
  };

  return {
    item,
    setItem,
    totalItems,
    handleAddItem,
    handleIncreaseQuantity,
  };
};

export default useAddToCart;
