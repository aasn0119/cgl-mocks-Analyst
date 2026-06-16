import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  auth,
  db,
  googleProvider
} from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () =>
  useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

 const login = async () => {
  try {
    const result =
      await signInWithPopup(
        auth,
        googleProvider
      );

    const userRef = doc(
      db,
      "users",
      result.user.uid
    );

    const snap =
      await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: result.user.uid,
        displayName:
          result.user.displayName,
        email:
          result.user.email,
        photoURL:
          result.user.photoURL,
        joinedAt:
          serverTimestamp(),
        role: "student"
      });
    }
  } catch (error) {
    console.error(error);
  }
};

  const logout = () =>
    signOut(auth);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};