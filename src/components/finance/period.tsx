import { CalendarDays } from 'lucide-react';
import { type Period } from '@/lib/finance';
export function PeriodSelect({value,onChange}:{value:Period;onChange:(v:Period)=>void}) {
 return <div className="period-control"><CalendarDays/><select aria-label="Período" value={value} onChange={e=>onChange(e.target.value as Period)}><option value="month">Novembro de 2026</option><option value="previous">Outubro de 2026</option><option value="quarter">Últimos 3 meses</option><option value="custom">Personalizado</option></select></div>;
}
export function CustomDates({from,to,onFrom,onTo}:{from:string;to:string;onFrom:(v:string)=>void;onTo:(v:string)=>void}) {return <div className="custom-dates"><label className="flex items-center gap-2">De<input type="date" aria-label="Data inicial" className="field" value={from} onChange={e=>onFrom(e.target.value)}/></label><label className="flex items-center gap-2">Até<input type="date" aria-label="Data final" className="field" value={to} min={from} onChange={e=>onTo(e.target.value)}/></label>{(!from||!to||from>to)&&<span className="expense">Selecione um intervalo válido.</span>}</div>;}
