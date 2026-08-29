import { createContext, useContext, useState, useCallback, useEffect } from "react";

/**
 * There is no backend yet (see plan.md — Node API is phase 2), so "signed
 * in" here just means "gave us a name and phone number, stored locally."
 * It gates the calculator's cost reveal without pretending to be real auth
 * — no password, no verification, nothing implying more security than
 * there is.
 */
const KEY = "hg-auth";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? null;
  } catch {
    return null;
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(load);

  useEffect(() => {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  }, [user]);

  const signIn = useCallback(({ name, phone }) => setUser({ name: name || "", phone }), []);
  const signOut = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isSignedIn: Boolean(user), signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
