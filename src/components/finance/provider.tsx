import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { seedTransactions, INITIAL_BALANCE, type Transaction } from '@/lib/finance';
type FinanceState = { transactions: Transaction[]; initial: number; dark: boolean; toggleTheme:()=>void; save:(t:Transaction)=>void; remove:(id:string)=>void; reset:()=>void; setInitial:(value:number)=>void; };
const FinanceContext = createContext<FinanceState | null>(null);
export function FinanceProvider({children}:{children:ReactNode}) {
 const [transactions,setTransactions]=useState<Transaction[]>(seedTransactions);
 const [initial,setInitial]=useState(INITIAL_BALANCE);
 const [dark,setDark]=useState(false);
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  try { const raw=localStorage.getItem('rotary-finance-v1'); if(raw) { const saved: unknown=JSON.parse(raw); if(saved && typeof saved==='object' && 'transactions' in saved && Array.isArray(saved.transactions) && saved.transactions.every(t=>t && typeof t==='object' && typeof t.id==='string' && typeof t.amount==='number' && Number.isSafeInteger(t.amount) && t.amount>0 && (t.type==='entrada'||t.type==='saida') && typeof t.date==='string' && typeof t.description==='string' && typeof t.category==='string')) { setTransactions(saved.transactions); if('initial' in saved && typeof saved.initial==='number' && Number.isSafeInteger(saved.initial)) setInitial(saved.initial); } } setDark(localStorage.getItem('rotary-theme')==='dark'); } catch { toast.error('Não foi possível recuperar os dados salvos.'); } setReady(true);
 },[]);
 useEffect(()=>{if(!ready)return; try {localStorage.setItem('rotary-finance-v1',JSON.stringify({transactions,initial}));}catch{toast.error('O navegador não permitiu salvar os dados localmente.');}},[transactions,initial,ready]);
 useEffect(()=>{if(!ready)return;document.documentElement.classList.toggle('dark',dark);try{localStorage.setItem('rotary-theme',dark?'dark':'light');}catch{/* Preference remains for this session. */}},[dark,ready]);
 const save=(t:Transaction)=>{setTransactions(prev=>prev.some(x=>x.id===t.id)?prev.map(x=>x.id===t.id?t:x):[...prev,t]);};
 const remove=(id:string)=>setTransactions(prev=>prev.filter(t=>t.id!==id));
 const reset=()=>{setTransactions(seedTransactions.map(t=>({...t})));setInitial(INITIAL_BALANCE);toast.success('Dados da demonstração restaurados!');};
 return <FinanceContext.Provider value={{transactions,initial,dark,toggleTheme:()=>setDark(prev=>!prev),save,remove,reset,setInitial}}>{children}</FinanceContext.Provider>;
}
export function useFinance(){const context=useContext(FinanceContext);if(!context)throw new Error('FinanceProvider is required');return context;}
