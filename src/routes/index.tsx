import { createFileRoute } from '@tanstack/react-router';
import { Dashboard } from '@/components/finance/dashboard';
export const Route = createFileRoute('/')({
 head:()=>({meta:[{title:'Visão geral | Rotary Finanças'},{name:'description',content:'Acompanhe saldos, receitas e despesas do Rotary Club de Campo Grande Universidade neste protótipo acadêmico.'},{property:'og:title',content:'Visão geral | Rotary Finanças'},{property:'og:description',content:'A situação financeira do clube em uma visão integrada, com dados fictícios.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:Dashboard,
});
