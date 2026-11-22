import { useRef, useState, type FormEvent } from 'react';
import { ArrowDownLeft, ArrowUpRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { categories, money, parseAmount, REFERENCE_DATE, validateTransaction, type Transaction, type TransactionType } from '@/lib/finance';
import { useFinance } from './provider';
export function TransactionModal({open,onClose,transaction}:{open:boolean;onClose:()=>void;transaction?:Transaction}) {
 return <Dialog open={open} onOpenChange={v=>{if(!v)onClose();}}><DialogContent className="dialog-content"><TransactionForm key={transaction?.id ?? 'new'} onClose={onClose} {...(transaction ? {transaction} : {})}/></DialogContent></Dialog>;
}
function TransactionForm({onClose,transaction}:{onClose:()=>void;transaction?:Transaction}) {
 const {save}=useFinance();
 const [type,setType]=useState<TransactionType>(transaction?.type ?? 'entrada');
 const [amount,setAmount]=useState(transaction?.amount ?? 0);
 const [description,setDescription]=useState(transaction?.description ?? '');
 const [category,setCategory]=useState(transaction?.category ?? '');
 const [date,setDate]=useState(transaction?.date ?? REFERENCE_DATE);
 const [notes,setNotes]=useState(transaction?.notes ?? '');
 const [errors,setErrors]=useState<Record<string,string>>({});
 const saving=useRef(false);
 const submit=(e:FormEvent)=>{e.preventDefault();if(saving.current)return;const data={type,amount,description:description.trim(),category,date};const issues=validateTransaction(data);setErrors(issues);if(Object.keys(issues).length)return;saving.current=true;save({...data,notes:notes.trim(),id:transaction?.id ?? `RF-${crypto.randomUUID().slice(0,8).toUpperCase()}`,clubId:'rotary-cg-universidade'});onClose();toast.success(transaction?'Movimentação atualizada com sucesso!':'Movimentação registrada com sucesso!');};
 return <><DialogHeader><DialogTitle>{transaction?'Editar movimentação':'Nova movimentação'}</DialogTitle><DialogDescription>Registre uma entrada ou saída financeira do clube.</DialogDescription></DialogHeader><form onSubmit={submit} noValidate className="grid gap-5 mt-2"><div className="segmented" role="group" aria-label="Tipo da movimentação"><Button type="button" variant={type==='entrada'?'income':'ghost'} aria-pressed={type==='entrada'} onClick={()=>{setType('entrada');setCategory('');}}><ArrowDownLeft/>Entrada</Button><Button type="button" variant={type==='saida'?'expense':'ghost'} aria-pressed={type==='saida'} onClick={()=>{setType('saida');setCategory('');}}><ArrowUpRight/>Saída</Button></div><div className="form-grid"><label className="form-group full">Valor <input autoFocus className="field text-lg font-semibold" inputMode="numeric" value={money(amount)} onChange={e=>setAmount(parseAmount(e.target.value))} aria-invalid={Boolean(errors['amount'])}/>{errors['amount']&&<span className="error">{errors['amount']}</span>}</label><label className="form-group full">Descrição<input className="field" placeholder="Ex.: Compra de materiais para evento" value={description} onChange={e=>setDescription(e.target.value)} aria-invalid={Boolean(errors['description'])}/>{errors['description']&&<span className="error">{errors['description']}</span>}</label><label className="form-group">Categoria<select className="field" value={category} onChange={e=>setCategory(e.target.value)} aria-invalid={Boolean(errors['category'])}><option value="">Selecione a categoria</option>{categories[type].map(c=><option key={c}>{c}</option>)}</select>{errors['category']&&<span className="error">{errors['category']}</span>}</label><label className="form-group">Data<input className="field" type="date" value={date} onChange={e=>setDate(e.target.value)} aria-invalid={Boolean(errors['date'])}/>{errors['date']&&<span className="error">{errors['date']}</span>}</label><label className="form-group full">Observações <span className="font-normal text-muted-foreground">(opcional)</span><textarea className="field" placeholder="Detalhes adicionais sobre esta movimentação" value={notes} onChange={e=>setNotes(e.target.value)}/></label></div><div className="modal-footer"><Button type="button" variant="outline" onClick={onClose}>Cancelar</Button><Button type="submit"><Check/>Salvar movimentação</Button></div></form></>;
}
