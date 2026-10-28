import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updatePassword,
  getAdditionalUserInfo,
} from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext();

export const isUserVerified = (user) => {
  if (!user) return false;
  const isSocial = user.providerData?.some(
    (p) => p.providerId === 'facebook.com' || p.providerId === 'google.com',
  );
  return Boolean(user.emailVerified || isSocial);
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const extractEmailFromCred = (cred) => {
    let email = cred?.user?.email;
    if (!email && cred?.user?.providerData) {
      const p = cred.user.providerData.find((item) => item?.email);
      if (p) email = p.email;
    }
    if (!email) {
      try {
        const additionalInfo = getAdditionalUserInfo(cred);
        if (additionalInfo?.profile?.email) {
          email = additionalInfo.profile.email;
        }
      } catch (err) {}
    }
    if (!email && cred?._tokenResponse?.email) {
      email = cred._tokenResponse.email;
    }
    return email && email.includes('@') ? email.toLowerCase().trim() : null;
  };

  const fetchMongoProfile = async (firebaseUser, explicitEmail) => {
    try {
      const token = await firebaseUser.getIdToken();
      const email =
        explicitEmail ||
        firebaseUser?._socialEmail ||
        firebaseUser?.email ||
        firebaseUser?.providerData?.find((p) => p.email)?.email;

      const headers = { Authorization: `Bearer ${token}` };
      if (email && email.includes('@')) {
        headers['X-User-Email'] = email.toLowerCase().trim();
      }
      if (firebaseUser.displayName) {
        headers['X-User-Name'] = firebaseUser.displayName;
      }
      if (firebaseUser.photoURL) {
        headers['X-User-Photo'] = firebaseUser.photoURL;
      }
      const res = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers,
      });
      setMongoUser(res.data);
      return res.data;
    } catch (error) {
      console.error('Error fetching MongoDB profile', error);
      return null;
    }
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const trackPopup = (signInFn) => {
    let popupRef = null;
    const originalOpen = window.open;

    window.open = function (...args) {
      const win = originalOpen.apply(this, args);
      popupRef = win;
      return win;
    };

    return new Promise((resolve, reject) => {
      let intervalId = null;
      let finished = false;

      signInFn()
        .then((res) => {
          finished = true;
          if (intervalId) clearInterval(intervalId);
          window.open = originalOpen;
          resolve(res);
        })
        .catch((err) => {
          finished = true;
          if (intervalId) clearInterval(intervalId);
          window.open = originalOpen;
          reject(err);
        });

      intervalId = setInterval(() => {
        if (popupRef && popupRef.closed) {
          clearInterval(intervalId);
          window.open = originalOpen;
          setTimeout(() => {
            if (!finished) {
              const error = new Error('Firebase: auth/popup-closed-by-user');
              error.code = 'auth/popup-closed-by-user';
              reject(error);
            }
          }, 350);
        }
      }, 250);
    });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await trackPopup(() => signInWithPopup(auth, provider));
    const email = extractEmailFromCred(cred);
    if (email) {
      cred.user._socialEmail = email;
    }
    return cred;
  };

  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    provider.addScope('public_profile');
    const cred = await trackPopup(() => signInWithPopup(auth, provider));
    const email = extractEmailFromCred(cred);
    if (email) {
      cred.user._socialEmail = email;
    }
    return cred;
  };

  const updateUserPassword = (newPassword) => {
    return updatePassword(auth.currentUser, newPassword);
  };

  const logout = () => {
    setMongoUser(null);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchMongoProfile(user);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setMongoUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    mongoUser,
    setMongoUser,
    fetchMongoProfile,
    isUserVerified: () => isUserVerified(currentUser),
    login,
    signup,
    loginWithGoogle,
    loginWithFacebook,
    updateUserPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
