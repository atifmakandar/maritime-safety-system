import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.querySelector<HTMLElement>('input,button,select')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close.current();
      if (event.key !== 'Tab') return;
      const items = [...(ref.current?.querySelectorAll<HTMLElement>('button,input,select,textarea') ?? [])].filter((item) => !item.hasAttribute('disabled'));
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); items[0]?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, []);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal-card" role="dialog" aria-modal="true" aria-label={title} ref={ref}><div className="modal-head"><h2>{title}</h2><button className="top-icon" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div>{children}</div></div>;
}
