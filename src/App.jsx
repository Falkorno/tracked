import { useEffect, useState } from 'react';
import { AppProvider } from './AppContext';
import AuthGate from './AuthGate';
import Shell from './components/Shell';
import HomeScreen from './screens/HomeScreen';
import PlanScreen from './screens/PlanScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import HabitsScreen from './screens/HabitsScreen';

const valid=new Set(['home','plan','activities','habits','account']);
function TrackApp(){const initial=location.hash.slice(1),[page,setPageState]=useState(valid.has(initial)?initial:'home');const setPage=(value)=>{setPageState(value);history.replaceState(null,'',`#${value}`)};useEffect(()=>{const handler=()=>{const value=location.hash.slice(1);if(valid.has(value))setPageState(value)};addEventListener('hashchange',handler);return()=>removeEventListener('hashchange',handler)},[]);let screen=<HomeScreen openHabits={()=>setPage('habits')}/>;if(page==='habits')screen=<HabitsScreen/>;if(page==='plan')screen=<PlanScreen/>;if(page==='activities')screen=<ActivitiesScreen/>;return <Shell page={page} setPage={setPage}>{screen}</Shell>}
export default function App(){return <AppProvider><AuthGate><TrackApp/></AuthGate></AppProvider>}
