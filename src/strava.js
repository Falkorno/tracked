import { auth } from './firebase';
const base=(import.meta.env.VITE_STRAVA_API_URL||(location.hostname==='localhost'||location.hostname==='127.0.0.1'?'http://localhost:8787':'https://api.track.jamestd.co.uk')).replace(/\/$/,'');
async function request(path,options={}){const user=auth.currentUser;if(!user)throw new Error('Sign in required.');const token=await user.getIdToken();const response=await fetch(`${base}${path}`,{...options,headers:{...options.headers,Authorization:`Bearer ${token}`}});const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||'Strava request failed.');return data}
export const stravaStatus=()=>request('/api/strava/status');
export const connectStrava=async()=>{const{url}=await request('/api/strava/connect',{method:'POST'});location.assign(url)};
export const loadStravaActivities=(page=1,perPage=30)=>request(`/api/strava/activities?page=${page}&per_page=${perPage}`);
export const disconnectStrava=()=>request('/api/strava/disconnect',{method:'POST'});
