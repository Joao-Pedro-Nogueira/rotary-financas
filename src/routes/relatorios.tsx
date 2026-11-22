import { createFileRoute } from '@tanstack/react-router';
import { Reports } from '@/components/finance/reports';
export const Route = createFileRoute('/relatorios')({
 head:()=>({meta:[{title:'Relatórios financeiros | Rotary Finanças'},{name:'description',content:'Consolide receitas, despesas e saldos por período e imprima o relatório financeiro da demonstração.'},{property:'og:title',content:'Relatórios financeiros | Rotary Finanças'},{property:'og:description',content:'Análise financeira por período e demonstrativo imprimível com dados fictícios.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:Reports,
});
