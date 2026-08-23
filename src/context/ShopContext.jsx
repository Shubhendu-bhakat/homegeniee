import { createContext, useContext, useReducer, useCallback, useEffect } from "react";

/**
 * Wishlist + Compare.
 *
 * Note this is NOT a cart. HomeGeniee has no online checkout — the site is a
 * pre-order showcase, so both lists exist to be carried into a WhatsApp or
 * phone enquiry, not to a payment step.
 */

const KEY = "hg-shop";
const MAX_COMPARE = 4;

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? { wishlist: [], compare: [] };
  } catch {
    return { wishlist: [], compare: [] };
  }
};

function shopReducer(state, action) {
  switch (action.type) {
    case "shop/toggleWishlist": {
      const id = action.payload;
      const wishlist = state.wishlist.includes(id)
        ? state.wishlist.filter((x) => x !== id)
        : [...state.wishlist, id];
      return { ...state, wishlist };
    }
    case "shop/toggleCompare": {
      const id = action.payload;
      if (state.compare.includes(id)) {
        return { ...state, compare: state.compare.filter((x) => x !== id) };
      }
      // ponytail: silently drops the oldest at the cap. Add a toast when
      // there's a notification system to hang it on.
      const compare = [...state.compare, id].slice(-MAX_COMPARE);
      return { ...state, compare };
    }
    case "shop/clearCompare":
      return { ...state, compare: [] };
    default:
      return state;
  }
}

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(shopReducer, undefined, load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const toggleWishlist = useCallback((id) => dispatch({ type: "shop/toggleWishlist", payload: id }), []);
  const toggleCompare = useCallback((id) => dispatch({ type: "shop/toggleCompare", payload: id }), []);
  const clearCompare = useCallback(() => dispatch({ type: "shop/clearCompare" }), []);

  const inWishlist = useCallback((id) => state.wishlist.includes(id), [state.wishlist]);
  const inCompare = useCallback((id) => state.compare.includes(id), [state.compare]);

  return (
    <ShopContext.Provider
      value={{ ...state, toggleWishlist, toggleCompare, clearCompare, inWishlist, inCompare, maxCompare: MAX_COMPARE }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
};
