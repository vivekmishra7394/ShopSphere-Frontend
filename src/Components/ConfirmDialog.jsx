export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !busy && onCancel()}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message" className="w-full max-w-md rounded-2xl border border-white/70 bg-white p-6 shadow-2xl shadow-slate-950/20">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold ${danger ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"}`} aria-hidden="true">
          {danger ? "!" : "?"}
        </div>
        <h2 id="confirm-title" className="text-xl font-bold tracking-tight text-slate-900">{title}</h2>
        <p id="confirm-message" className="mt-2 leading-6 text-slate-600">{message}</p>
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={busy} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={busy} className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${danger ? "bg-rose-600 hover:bg-rose-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            {busy ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
