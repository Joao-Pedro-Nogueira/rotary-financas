import { useState } from 'react';
import { Plus, Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp, RefreshCw, CalendarDays, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFinance } from './provider';
import { StatCard } from './stat-card';
import { PeriodSelect, CustomDates } from './period';
import { FlowChart, ExpenseChart } from './charts';
import { TransactionModal } from './transaction-modal';
import { TransactionTable } from './transaction-table';
import { ViewAllLink } from './shell';
import { currentBalance, summarize, periodRange, REFERENCE_DATE, type Period } from '@/lib/finance';
export function Dashboard(){
 const {transactions,initial}=useFinance();const [period,setPeriod]=useState<Period>('month'),[from,setFrom]=useState('2026-11-01'),[to,setTo]=useState(REFERENCE_DATE),[open,setOpen]=useState(false);
 const range=periodRange(period,from,to),summary=summarize(transactions,initial,range.from,range.to);
 const recent=[...summary.filtered].sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id)).slice(0,5);
 return <><div className="page-heading"><div><h1>Visão geral</h1><p>Acompanhe a saúde financeira do seu clube em um só lugar.</p></div><div className="page-controls"><PeriodSelect value={period} onChange={setPeriod}/><Button onClick={()=>setOpen(true)}><Plus/>Nova movimentação</Button></div></div>{period==='custom'&&<CustomDates from={from} to={to} onFrom={setFrom} onTo={setTo}/>}<div className="stat-grid"><StatCard title="Saldo atual" value={currentBalance(transactions,initial)} icon={Wallet} note="Atualizado em 22 de novembro" tone="balance" noteIcon={RefreshCw}/><StatCard title="Total de entradas" value={summary.income} icon={ArrowDownLeft} note="Receitas do período" tone="income" noteIcon={CalendarDays}/><StatCard title="Total de saídas" value={summary.expenses} icon={ArrowUpRight} note="Despesas do período" tone="expense" noteIcon={CalendarDays}/><StatCard title="Resultado do período" value={summary.result} icon={TrendingUp} note="Entradas − saídas" tone={summary.result>=0?'positive':'expense'} noteIcon={ArrowLeftRight}/></div><div className="chart-grid"><FlowChart transactions={summary.filtered} from={range.from} to={range.to}/><ExpenseChart transactions={summary.filtered}/></div><section className="panel"><div className="table-heading"><div><h2>Movimentações recentes</h2><p>Últimos registros financeiros do clube</p></div><ViewAllLink/></div><TransactionTable transactions={recent} onNew={()=>setOpen(true)}/><div className="table-bottom"><span>Exibindo {recent.length} de {summary.filtered.length} movimentações do período</span><span className="flex items-center gap-1"><RefreshCw size={10}/>Atualizado agora</span></div></section><TransactionModal open={open} onClose={()=>setOpen(false)}/></>;
}
