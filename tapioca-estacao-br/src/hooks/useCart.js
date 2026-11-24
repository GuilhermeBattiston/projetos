import { useEffect, useState } from "react";
import { products } from "../data/products";
import {
  CART_KEY,
  CART_VERSION,
  LEGACY_CART_KEY,
  normalizeCart,
} from "../utils/order";
export function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const data = raw ? JSON.parse(raw) : null;
      return data?.version === CART_VERSION
        ? normalizeCart(data, products)
        : [];
    } catch {
      return [];
    }
  });
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    try {
      localStorage.setItem(
        CART_KEY,
        JSON.stringify({ version: CART_VERSION, items: cart }),
      );
      localStorage.removeItem(LEGACY_CART_KEY);
    } catch {
      queueMicrotask(() => {
        if (active) setStorageUnavailable(true);
      });
    }
    return () => {
      active = false;
    };
  }, [cart]);
  const add = (
    productId,
    { quantity = 1, semTempero = false, notes = "" } = {},
  ) => {
    if (
      !products.some((p) => p.id === productId && p.available !== false) ||
      !Number.isInteger(quantity) ||
      quantity < 1
    )
      return;
    const item = {
      id: crypto.randomUUID(),
      productId,
      quantity,
      semTempero,
      notes,
    };
    setCart((current) => normalizeCart([...current, item], products));
  };
  const change = (lineId, delta) => {
    if (!Number.isInteger(delta)) return;
    setCart((current) =>
      normalizeCart(
        current.map((line) =>
          line.id === lineId
            ? {
                ...line,
                quantity: Math.max(0, Math.min(99, line.quantity + delta)),
              }
            : line,
        ),
        products,
      ),
    );
  };
  const remove = (lineId) =>
    setCart((current) => current.filter((line) => line.id !== lineId));
  const clear = () => setCart([]);
  return { cart, add, change, remove, clear, storageUnavailable };
}
