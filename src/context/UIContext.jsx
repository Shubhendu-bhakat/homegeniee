import { createContext, useContext, useReducer, useCallback, useEffect } from "react";

/**
 * Global UI state: consultation modal, mobile nav, mega menu, cookie bar.
 *
 * Reducers are written in Redux shape ({type, payload}) so that when the
 * Node API lands in phase 2 this moves into createSlice unchanged —
 * only the `useUI()` call sites swap to useSelector/useDispatch.
 */

const initialState = {
  modal: null,        // null | 'consultation' | 'design-upload'
  modalPreset: "",    // pre-selects the "Interest In" field
  mobileNavOpen: false,
  megaMenuOpen: false,
  cookiesAccepted: false,
};

function uiReducer(state, action) {
  switch (action.type) {
    case "ui/openModal":
      return { ...state, modal: action.payload.name, modalPreset: action.payload.preset ?? "", mobileNavOpen: false };
    case "ui/closeModal":
      return { ...state, modal: null, modalPreset: "" };
    case "ui/toggleMobileNav":
      return { ...state, mobileNavOpen: !state.mobileNavOpen, megaMenuOpen: false };
    case "ui/closeMobileNav":
      return { ...state, mobileNavOpen: false };
    case "ui/setMegaMenu":
      return { ...state, megaMenuOpen: action.payload };
    case "ui/acceptCookies":
      return { ...state, cookiesAccepted: true };
    default:
      return state;
  }
}

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, initialState, (init) => ({
    ...init,
    cookiesAccepted: typeof localStorage !== "undefined" && localStorage.getItem("hg-cookies") === "1",
  }));

  const openModal = useCallback((name, preset) => dispatch({ type: "ui/openModal", payload: { name, preset } }), []);
  const closeModal = useCallback(() => dispatch({ type: "ui/closeModal" }), []);
  const toggleMobileNav = useCallback(() => dispatch({ type: "ui/toggleMobileNav" }), []);
  const closeMobileNav = useCallback(() => dispatch({ type: "ui/closeMobileNav" }), []);
  const setMegaMenu = useCallback((v) => dispatch({ type: "ui/setMegaMenu", payload: v }), []);
  const acceptCookies = useCallback(() => {
    localStorage.setItem("hg-cookies", "1");
    dispatch({ type: "ui/acceptCookies" });
  }, []);

  // Lock body scroll behind any overlay.
  const locked = Boolean(state.modal) || state.mobileNavOpen;
  useEffect(() => {
    document.body.classList.toggle("hg-locked", locked);
    return () => document.body.classList.remove("hg-locked");
  }, [locked]);

  // Escape closes whatever is open — every overlay needs an escape route.
  useEffect(() => {
    if (!locked) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (state.modal) closeModal();
      else closeMobileNav();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [locked, state.modal, closeModal, closeMobileNav]);

  return (
    <UIContext.Provider
      value={{ ...state, openModal, closeModal, toggleMobileNav, closeMobileNav, setMegaMenu, acceptCookies }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
};
