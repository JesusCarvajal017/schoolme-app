import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { tokenValido, manejarToken } from "../util/TokenManager";
import { login as apiLogin, AuthResponse } from "../api/services/authService";
import { getPersonById } from "../api/services/personService";
import { User } from "../api/types/User";
import { navigationRef } from "../navigation/RootNavigation";
import { getAllUsers } from "../api/services/UserService";
import { Person } from "../api/types";

type AuthContextType = {
  token: string | null;
  user: User | null;
  person: Person | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUserPhoto: (photo: string) => Promise<void>;
  updateUserEmailInContext: (newEmail: string) => Promise<void>;
  loading: boolean;
  error: string | null;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  const [logoutTimer, setLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  const logout = useCallback(async () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    await AsyncStorage.multiRemove(["token", "user", "person", "lastEmail", "expiracion"]);
    setToken(null);
    setUser(null);
    setPerson(null);
    setLastEmail(null);
    setError(null);

    if (navigationRef.isReady()) {
      navigationRef.reset({ index: 0, routes: [{ name: "Inicio" }] });
    }
  }, [logoutTimer]);

  const startLogoutTimer = useCallback((expiracion: string) => {
    if (logoutTimer) clearTimeout(logoutTimer);
    const expTime = new Date(expiracion).getTime();
    const now = Date.now();
    const msUntilLogout = expTime - now;
    if (msUntilLogout > 0) {
      const timer = setTimeout(() => {
        Alert.alert("Sesión expirada", "Tu sesión ha caducado.", [
          { text: "Entendido", onPress: () => logout() },
        ]);
      }, msUntilLogout);
      setLogoutTimer(timer);
    }
  }, [logout, logoutTimer]);

  const fetchUserAndPerson = useCallback(async (email: string) => {
    const users = await getAllUsers();
    let foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    // Fallback: buscar por ID si no encuentra por email
    if (!foundUser && user) {
      foundUser = users.find((u) => u.id === user.id);
    }

    if (!foundUser) throw new Error("Usuario no encontrado");

    setUser(foundUser);
    await AsyncStorage.setItem("user", JSON.stringify(foundUser));

    if (foundUser.personId) {
      const p = await getPersonById(foundUser.personId);
      setPerson(p);
      await AsyncStorage.setItem("person", JSON.stringify(p));
    }
  }, [user]);

  const refreshUserData = useCallback(async () => {
    if (!lastEmail && !user) return;
    try {
      if (!user || !person) setLoading(true);
      await fetchUserAndPerson(lastEmail || user!.email);
    } catch (err) {
      console.error("Error al refrescar datos:", err);
      setError("Error al refrescar datos");
    } finally {
      if (!user || !person) setLoading(false);
    }
  }, [lastEmail, fetchUserAndPerson, user, person]);

  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      const savedToken = await AsyncStorage.getItem("token");
      const savedUser = await AsyncStorage.getItem("user");
      const savedPerson = await AsyncStorage.getItem("person");
      const savedEmail = await AsyncStorage.getItem("lastEmail");
      const savedExp = await AsyncStorage.getItem("expiracion");

      if (savedToken && tokenValido(savedToken)) {
        setToken(savedToken);
        manejarToken(savedToken, logout);
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedPerson) setPerson(JSON.parse(savedPerson));
        if (savedEmail) setLastEmail(savedEmail);
        if (savedExp) startLogoutTimer(savedExp);
      } else {
        await logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout, startLogoutTimer]);

  useEffect(() => {
    loadSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data: AuthResponse = await apiLogin(email, password);
      if (!data?.token) throw new Error("Token no recibido");
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("lastEmail", email);
      setToken(data.token);
      setLastEmail(email);
      manejarToken(data.token, logout);
      if ((data as any).expiracion) {
        const exp = (data as any).expiracion;
        await AsyncStorage.setItem("expiracion", exp);
        startLogoutTimer(exp);
      }
      await fetchUserAndPerson(email);
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserPhoto = async (photo: string) => {
    if (!user) return;
    const hasTimestamp = photo.includes("?t=");
    const finalPhoto = hasTimestamp ? photo : `${photo}?t=${Date.now()}`;
    const updatedUser = { ...user, photo: finalPhoto };
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateUserEmailInContext = async (newEmail: string) => {
  if (!user) return;
  const updatedUser = { ...user, email: newEmail };
  setUser(updatedUser);
  setLastEmail(newEmail);
  await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  await AsyncStorage.setItem("lastEmail", newEmail);
};


  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        person,
        login,
        logout,
        refreshUserData,
        updateUserPhoto,
        updateUserEmailInContext,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
