import { createFileRoute } from '@tanstack/react-router';
import { Movements } from '@/components/finance/movements';
export const Route = createFileRoute('/movimentacoes')({
 head:()=>({meta:[{title:'Movimentações | Rotary Finanças'},{name:'description',content:'Consulte e registre entradas e saídas fictícias do clube com histórico financeiro detalhado.'},{property:'og:title',content:'Movimentações | Rotary Finanças'},{property:'og:description',content:'Histórico, pesquisa e gestão de movimentações financeiras da demonstração.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:Movements,
});
