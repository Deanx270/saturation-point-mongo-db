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

    const fetchMongoProfile = async (firebaseUser) => {
        try {
            const token = await firebaseUser.getIdToken();
            const res = await axios.get(`${API_BASE_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMongoUser(res.data);
        } catch (error) {
            console.error('Error fetching MongoDB profile', error);
        }
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const loginWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    };

    const loginWithFacebook = () => {
        const provider = new FacebookAuthProvider();
        return signInWithPopup(auth, provider);
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
            setCurrentUser(user);
            if (user) {
                await fetchMongoProfile(user);
            } else {
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
