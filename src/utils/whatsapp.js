/**
 * Utilidades para integracion con WhatsApp
 * Genera mensajes formateados y URLs para envio de ordenes por WhatsApp
 *
 * NOTA: Se usa solo texto plano y formato nativo de WhatsApp (*negrita*, _cursiva_)
 * para garantizar compatibilidad total en todas las plataformas.
 * Los emojis Unicode NO se usan porque se corrompen al pasar por encodeURIComponent
 * en ciertos navegadores/sistemas operativos.
 */

/**
 * Genera la URL de WhatsApp con el mensaje codificado
 * @param {string} phoneNumber - Numero de telefono en formato internacional (ej: 523310448051)
 * @param {string} message - Mensaje a enviar
 * @returns {string} URL de WhatsApp lista para abrir
 */
export const generateWhatsAppURL = (phoneNumber, message) => {
  // Limpiar el numero de telefono: quitar todo excepto digitos
  const cleanPhone = phoneNumber.replace(/[^\d]/g, '');

  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

// Separador visual usando solo caracteres ASCII
const SEPARATOR = '--------------------------------';

// Campos internos del objeto variant que NO deben mostrarse en el mensaje
const VARIANT_INTERNAL_FIELDS = new Set([
  'originalPrice', 'price', 'discount', 'quantity',
  'barcode', 'sku', 'productId', 'image', '_id',
  'id', 'stock', 'createdAt', 'updatedAt', '__v',
]);

/**
 * Detecta si un string parece un MongoDB ObjectId (24 caracteres hexadecimales)
 */
const isObjectId = (str) => /^[a-f0-9]{24}$/i.test(String(str));

/**
 * Extrae informacion legible de la variante, filtrando campos internos e IDs
 * @param {object} variant - Objeto de variante del producto
 * @param {string} currency - Simbolo de moneda
 * @returns {object|null} Objeto con nombre de variante y precio con descuento, o null
 */
const extractVariantInfo = (variant, currency = '$') => {
  if (!variant || typeof variant !== 'object') return null;

  const info = {};

  // Extraer descuento si existe
  const origPrice = Number(variant.originalPrice) || 0;
  const varPrice = Number(variant.price) || 0;
  const discount = Number(variant.discount) || 0;

  if (origPrice && varPrice && origPrice > varPrice && discount > 0) {
    info.hasDiscount = true;
    info.originalPrice = origPrice;
    info.price = varPrice;
    info.discount = discount;
  }

  // Extraer SKU de variante si es diferente
  if (variant.sku) {
    info.sku = variant.sku;
  }

  return info;
};

/**
 * Formatea el mensaje de WhatsApp para un producto individual
 * @param {object} product - Objeto del producto
 * @param {number} quantity - Cantidad del producto
 * @param {object} variant - Variante seleccionada (opcional)
 * @param {string} customerName - Nombre del cliente (opcional)
 * @param {string} currency - Simbolo de moneda (default: '$')
 * @returns {string} Mensaje formateado
 */
export const formatProductMessage = (
  product,
  quantity,
  variant = null,
  customerName = null,
  currency = '$'
) => {
  const lines = [];

  // Encabezado
  lines.push('*NUEVO PEDIDO - CROKETE*');
  lines.push(SEPARATOR);
  lines.push('');

  // Cliente
  if (customerName) {
    lines.push(`*Cliente:* ${customerName}`);
    lines.push('');
  }

  // Producto
  lines.push('*PRODUCTO*');
  lines.push(`> ${product.title}`);

  // C\u00f3digo / SKU
  if (product.sku) {
    lines.push(`> C\u00f3digo: ${product.sku}`);
  }

  // Cantidad
  lines.push(`> Cantidad: ${quantity}`);

  // Precio unitario
  const unitPrice = Number(product.prices?.price || product.price) || 0;
  lines.push(`> Precio unitario: ${currency}${unitPrice.toFixed(2)}`);

  // Info de descuento si la variante tiene
  const variantInfo = extractVariantInfo(variant, currency);
  if (variantInfo?.hasDiscount) {
    lines.push(`> Precio original: ${currency}${variantInfo.originalPrice.toFixed(2)}`);
    lines.push(`> Descuento: -${currency}${variantInfo.discount.toFixed(2)}`);
  }

  // Total
  lines.push('');
  lines.push(SEPARATOR);
  const total = unitPrice * quantity;
  lines.push(`*TOTAL: ${currency}${total.toFixed(2)}*`);
  lines.push(SEPARATOR);
  lines.push('');
  lines.push('Hola, me gustar\u00eda realizar este pedido.');
  lines.push('Quedo atento a su confirmaci\u00f3n.');

  return lines.join('\n');
};

/**
 * Formatea el mensaje de WhatsApp para el carrito completo
 * @param {array} items - Array de items del carrito
 * @param {number} cartTotal - Total del carrito
 * @param {string} currency - Simbolo de moneda (default: '$')
 * @param {string} customerName - Nombre del cliente (opcional)
 * @returns {string} Mensaje formateado
 */
export const formatCartMessage = (
  items,
  cartTotal,
  currency = '$',
  customerName = null
) => {
  const lines = [];

  // Encabezado
  lines.push('*NUEVO PEDIDO - CROKETE*');
  lines.push(SEPARATOR);
  lines.push('');

  // Cliente
  if (customerName) {
    lines.push(`*Cliente:* ${customerName}`);
    lines.push('');
  }

  // Detalle
  lines.push(`*DETALLE DEL PEDIDO* (${items.length} ${items.length === 1 ? 'producto' : 'productos'})`);
  lines.push('');

  // Listar cada item del carrito
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;

    lines.push(`*${index + 1}. ${item.title}*`);

    // C\u00f3digo / SKU
    if (item.sku) {
      lines.push(`> C\u00f3digo: ${item.sku}`);
    }

    // Cantidad
    lines.push(`> Cantidad: ${item.quantity}`);

    // Precio unitario
    lines.push(`> Precio unitario: ${currency}${item.price.toFixed(2)}`);

    // Descuento si aplica
    const variantInfo = extractVariantInfo(item.variant, currency);
    if (variantInfo?.hasDiscount) {
      lines.push(`> Precio original: ${currency}${variantInfo.originalPrice.toFixed(2)}`);
      lines.push(`> Descuento: -${currency}${variantInfo.discount.toFixed(2)}`);
    }

    // Subtotal
    lines.push(`> *Subtotal: ${currency}${itemTotal.toFixed(2)}*`);
    lines.push('');
  });

  // Total general
  lines.push(SEPARATOR);
  lines.push(`*TOTAL A PAGAR: ${currency}${cartTotal.toFixed(2)}*`);
  lines.push(SEPARATOR);
  lines.push('');
  lines.push('Hola, me gustar\u00eda realizar este pedido.');
  lines.push('Quedo atento a la confirmaci\u00f3n de disponibilidad y forma de pago.');

  return lines.join('\n');
};

/**
 * Abre WhatsApp con el mensaje del producto
 * @param {object} product - Objeto del producto
 * @param {number} quantity - Cantidad
 * @param {object} variant - Variante seleccionada
 * @param {string} phoneNumber - Numero de WhatsApp
 * @param {string} customerName - Nombre del cliente
 * @param {string} currency - Simbolo de moneda
 */
export const openWhatsAppProduct = (
  product,
  quantity,
  variant,
  phoneNumber,
  customerName = null,
  currency = '$'
) => {
  const message = formatProductMessage(product, quantity, variant, customerName, currency);
  const url = generateWhatsAppURL(phoneNumber, message);
  window.open(url, '_blank');
};

/**
 * Abre WhatsApp con el mensaje del carrito
 * @param {array} items - Items del carrito
 * @param {number} cartTotal - Total del carrito
 * @param {string} phoneNumber - Numero de WhatsApp
 * @param {string} currency - Simbolo de moneda
 * @param {string} customerName - Nombre del cliente
 */
export const openWhatsAppCart = (
  items,
  cartTotal,
  phoneNumber,
  currency = '$',
  customerName = null
) => {
  const message = formatCartMessage(items, cartTotal, currency, customerName);
  const url = generateWhatsAppURL(phoneNumber, message);
  window.open(url, '_blank');
};
