import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { logIn, logOut, observeAuth, observeHabits, register, saveHabits } from './firebase';
import { defaultHabits, normalizeHabit, toggleDate } from './habit-model';

const AppContext=createContext(null); const key='stride-habits-v1';
const localHabits=()=>{try{const value=JSON.parse(localStorage.getItem(key));return(Array.isArray(value)?value:defaultHabits).map(normalizeHabit)}catch{return defaultHabits.map(normalizeHabit)}};
export function AppProvider({children}){
 const[user,setUser]=useState(undefined),[habits,setHabitState]=useState(localHabits),[syncState,setSyncState]=useState('local');const remoteLoaded=useRef(false);
 useEffect(()=>observeAuth(setUser),[]);
 useEffect(()=>{remoteLoaded.current=false;if(!user)return;return observeHabits(user.uid,(remote)=>{if(remote===null){remoteLoaded.current=true;saveHabits(user.uid,habits).catch(()=>setSyncState('error'));return}remoteLoaded.current=true;const clean=remote.map(normalizeHabit);setHabitState(clean);localStorage.setItem(key,JSON.stringify(clean));setSyncState('synced')},()=>setSyncState('error'))},[user]);
 const commit=async(next)=>{setHabitState(next);localStorage.setItem(key,JSON.stringify(next));setSyncState(user?'syncing':'local');if(user)try{await saveHabits(user.uid,next);setSyncState('synced')}catch{setSyncState('error')}};
 const value=useMemo(()=>({user,habits,syncState,logIn,register,logOut,addHabit:(habit)=>commit([{...habit,id:crypto.randomUUID(),completedDates:[]},...habits]),updateHabit:(habit)=>commit(habits.map(item=>item.id===habit.id?habit:item)),deleteHabit:(id)=>commit(habits.filter(item=>item.id!==id)),toggleHabit:(id,date)=>commit(habits.map(item=>item.id===id?toggleDate(item,date):item))}),[user,habits,syncState]);
 return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
export const useApp=()=>useContext(AppContext);
