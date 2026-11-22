export type TransactionType = 'entrada' | 'saida';
export type Transaction = { id: string; clubId: string; type: TransactionType; date: string; description: string; category: string; amount: number; notes: string };
export type Period = 'month' | 'previous' | 'quarter' | 'custom';
export const REFERENCE_DATE = '2026-11-22';
export const INITIAL_BALANCE = 1500000;
export const CLUB = 'Rotary Club de Campo Grande Universidade';
export const categories: Record<TransactionType, string[]> = {
  entrada: ['Contribuições de associados', 'Doações', 'Eventos beneficentes', 'Campanhas de arrecadação', 'Outras receitas'],
  saida: ['Projetos sociais', 'Materiais', 'Eventos', 'Despesas administrativas', 'Serviços', 'Outras despesas'],
};
const rows: [string, TransactionType, string, string, number][] = [
 ['2026-10-02','entrada','Contribuição mensal de associados','Contribuições de associados',420000],
 ['2026-10-05','saida','Aluguel e manutenção da sede','Despesas administrativas',120000],
 ['2026-10-08','entrada','Doação de parceiros locais','Doações',180000],
 ['2026-10-10','saida','Kits escolares para a comunidade','Projetos sociais',210000],
 ['2026-10-13','saida','Material de escritório','Materiais',35000],
 ['2026-10-16','entrada','Jantar beneficente de outubro','Eventos beneficentes',320000],
 ['2026-10-18','saida','Organização do jantar beneficente','Eventos',98000],
 ['2026-10-21','saida','Serviços de contabilidade','Serviços',45000],
 ['2026-10-24','entrada','Campanha de arrecadação','Campanhas de arrecadação',150000],
 ['2026-10-27','saida','Apoio ao projeto de alfabetização','Projetos sociais',110000],
 ['2026-10-29','entrada','Contribuição extraordinária','Outras receitas',60000],
 ['2026-10-30','saida','Reembolso de transporte','Outras despesas',22000],
 ['2026-11-02','entrada','Contribuição mensal de associados','Contribuições de associados',450000],
 ['2026-11-03','saida','Despesas da sede — novembro','Despesas administrativas',120000],
 ['2026-11-05','saida','Materiais para campanha solidária','Materiais',58000],
 ['2026-11-06','entrada','Doação de empresa parceira','Doações',200000],
 ['2026-11-09','saida','Projeto Comunidade em Ação','Projetos sociais',250000],
 ['2026-11-10','entrada','Arrecadação de campanha solidária','Campanhas de arrecadação',180000],
 ['2026-11-13','saida','Serviços de contabilidade','Serviços',50000],
 ['2026-11-15','entrada','Receita de evento beneficente','Eventos beneficentes',350000],
 ['2026-11-17','saida','Organização de evento beneficente','Eventos',150000],
 ['2026-11-19','entrada','Contribuição extraordinária','Outras receitas',65000],
 ['2026-11-20','saida','Compra de materiais para projeto','Materiais',50000],
 ['2026-11-22','entrada','Doação para campanha solidária','Doações',85000],
];
export const seedTransactions: Transaction[] = rows.map(([date,type,description,category,amount], index) => ({ id: `RF-${String(index + 1).padStart(4,'0')}`, clubId:'rotary-cg-universidade', date,type,description,category,amount,notes:'' }));
export const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style:'currency',currency:'BRL' }).format(cents / 100);
export const dateLabel = (date: string) => date.split('-').reverse().join('/');
export function periodRange(period: Period, from = '2026-11-01', to = REFERENCE_DATE) {
 if (period === 'previous') return {from:'2026-10-01',to:'2026-10-31'};
 if (period === 'quarter') return {from:'2026-09-01',to:REFERENCE_DATE};
 if (period === 'custom') return {from,to};
 return {from:'2026-11-01',to:'2026-11-30'};
}
export const signed = (t: Transaction) => t.type === 'entrada' ? t.amount : -t.amount;
export function summarize(transactions: Transaction[], initial: number, from: string, to: string) {
 const filtered = transactions.filter(t => t.date >= from && t.date <= to);
 const income = filtered.filter(t=>t.type==='entrada').reduce((sum,t)=>sum+t.amount,0);
 const expenses = filtered.filter(t=>t.type==='saida').reduce((sum,t)=>sum+t.amount,0);
 const opening = initial + transactions.filter(t=>t.date<from).reduce((sum,t)=>sum+signed(t),0);
 return {filtered,income,expenses,result:income-expenses,opening,closing:opening+income-expenses};
}
export const currentBalance = (transactions: Transaction[], initial: number) => initial + transactions.filter(t=>t.date<=REFERENCE_DATE).reduce((sum,t)=>sum+signed(t),0);
export function expenseGroups(transactions: Transaction[]) {
 const sums: Record<string,number> = {};
 for(const t of transactions) if(t.type==='saida') sums[t.category] = (sums[t.category] ?? 0)+t.amount;
 const total=Object.values(sums).reduce((a,b)=>a+b,0);
 return Object.entries(sums).map(([name,value])=>({name,value,percent:total ? value/total*100:0})).sort((a,b)=>b.value-a.value);
}
export function flowGroups(transactions: Transaction[], from:string,to:string) {
 const start = new Date(`${from}T12:00:00Z`).getTime();
 const end = new Date(`${to}T12:00:00Z`).getTime();
 if(!Number.isFinite(start)||!Number.isFinite(end)||end<start) return [];
 const days=Math.round((end-start)/86400000)+1;
 const bucketDays=days>40 ? 30 : 7;
 return Array.from({length:Math.ceil(days/bucketDays)},(_,i)=>{
  const a=new Date(start+i*bucketDays*86400000).toISOString().slice(0,10);
  const b=new Date(Math.min(end,start+((i+1)*bucketDays-1)*86400000)).toISOString().slice(0,10);
  const items=transactions.filter(t=>t.date>=a&&t.date<=b);
  return {name: days>40 ? new Date(`${a}T12:00:00Z`).toLocaleDateString('pt-BR',{month:'short', timeZone:'UTC'}) : `${a.slice(8)}–${b.slice(8)} ${new Date(`${a}T12:00:00Z`).toLocaleDateString('pt-BR',{month:'short',timeZone:'UTC'}).replace('.','')}`, receitas:items.filter(t=>t.type==='entrada').reduce((s,t)=>s+t.amount,0)/100, despesas:items.filter(t=>t.type==='saida').reduce((s,t)=>s+t.amount,0)/100};
 });
}
export function parseAmount(value:string) { return Number(value.replace(/\D/g,'')); }
export function validateTransaction(t: Pick<Transaction,'amount'|'description'|'category'|'date'|'type'>) {
 const errors: Record<string,string> = {};
 if(!Number.isSafeInteger(t.amount)||t.amount<=0) errors['amount']='Informe um valor maior que zero.';
 if(!t.description.trim()) errors['description']='Informe uma descrição.';
 if(!categories[t.type].includes(t.category)) errors['category']='Selecione uma categoria válida.';
 const date = new Date(`${t.date}T12:00:00Z`);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(t.date)||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==t.date) errors['date']='Informe uma data válida.';
 return errors;
}
