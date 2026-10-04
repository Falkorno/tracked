import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getFirestore, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBdrqbNw6o3LWkBALlX2t6B1Z8O_NCdY8Q', authDomain: 'stride-562d9.firebaseapp.com', projectId: 'stride-562d9',
  storageBucket: 'stride-562d9.firebasestorage.app', messagingSenderId: '609974998361', appId: '1:609974998361:web:aafc9986b9ea47460fe848', measurementId: 'G-62LDC3VTVT'
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const plannerRef = (uid) => doc(db, 'users', uid, 'planner', 'current');

export const observeAuth = (callback) => onAuthStateChanged(auth, callback);
export const logIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logOut = () => signOut(auth);
export const observeHabits = (uid, callback, onError) => onSnapshot(plannerRef(uid), (snapshot) => {
  const value = snapshot.exists() ? snapshot.data()?.data?.habits : null;
  callback(Array.isArray(value) ? value : null);
}, onError);
export async function saveHabits(uid, habits) {
  const reference = plannerRef(uid); const meta = { revision: Date.now(), updatedAt: new Date().toISOString() };
  try { await updateDoc(reference, { 'data.habits': habits, ...meta }); }
  catch (error) { if (error.code !== 'not-found') throw error; await setDoc(reference, { data: { habits }, ...meta }, { merge: true }); }
}
