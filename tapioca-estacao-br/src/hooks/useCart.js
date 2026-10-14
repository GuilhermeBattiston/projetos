import { useState } from "react";
import { products } from "../data/products";
import { normalizeCart } from "../utils/order";
const KEY = "tapioca-estacao-br.cart.v1";
export function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      return normalizeCart(JSON.parse(localStorage.getItem(KEY)), products);
    } catch {
      return {};
    }
  });
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const save = (next) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      setStorageUnavailable(true);
    }
    setCart(next);
  };
  const change = (id, delta) => {
    if (!products.some((p) => p.id === id) || !Number.isInteger(delta)) return;
    const next = { ...cart };
    const quantity = Math.max(0, Math.min(99, (next[id] || 0) + delta));
    if (quantity) next[id] = quantity;
    else delete next[id];
    save(next);
  };
  const remove = (id) =>
    save(
      Object.fromEntries(Object.entries(cart).filter(([key]) => key !== id)),
    );
  return { cart, change, remove, storageUnavailable };
}
