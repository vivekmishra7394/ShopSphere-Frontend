import { useCallback, useEffect, useState } from "react";
import api from "../api/Axios";
import ConfirmDialog from "../Components/ConfirmDialog";

const blankUser = { name: "", email: "", phone: "", password: "" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(blankUser);
  const [editingUser, setEditingUser] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0);
  const [pageInfo, setPageInfo] = useState({ totalPages: 1, totalElements: 0 });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/users", { params: { page, size: 10 } });
      const result = data?.data;
      const list = Array.isArray(result) ? result : result?.content;
      if (!Array.isArray(list)) throw new Error("Unexpected users response");
      setUsers(list);
      setPageInfo({ totalPages: result.totalPages ?? 1, totalElements: result.totalElements ?? list.length });
      setAuthorized(true);
      setError("");
    } catch (requestError) {
      const status = requestError.response?.status;
      if (status === 401 || status === 403) {
        setAuthorized(false);
        setError("You need an administrator account to view and manage users.");
      } else {
        setError("We couldn’t load users. Check that the backend is running, then try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  function startEdit(user) {
    setPendingAction({ type: "edit", user });
  }

  function beginEdit(user) {
    setEditingUser(user);
    setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "", password: "" });
    setNotice("");
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      if (editingUser) {
        await api.put(`/api/users/update-user/${editingUser.id}`, {
          name: form.name, email: form.email, phone: form.phone,
        });
        setNotice("User details updated successfully.");
      } else {
        await api.post("/api/users/create-user", form);
        setNotice("User account created successfully.");
      }
      setForm(blankUser);
      setEditingUser(null);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Couldn’t save this user. Check the details and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmAction() {
    if (!pendingAction) return;
    setSaving(true);
    setError("");
    try {
      if (pendingAction.type === "edit") {
        beginEdit(pendingAction.user);
      } else {
        await api.delete(`/api/users/delete-user/${pendingAction.user.id}`);
        if (editingUser?.id === pendingAction.user.id) {
          setEditingUser(null);
          setForm(blankUser);
        }
        setNotice(`${pendingAction.user.name || "User"} was deleted.`);
        await loadUsers();
      }
      setPendingAction(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Couldn’t delete this user. Please try again.");
      setPendingAction(null);
    } finally {
      setSaving(false);
    }
  }

  const changeField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-7">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-rose-950 to-rose-800 px-6 py-8 text-white shadow-xl shadow-rose-950/10 sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-10 -top-28 h-72 w-72 rounded-full border-[36px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-36 right-40 h-64 w-64 rounded-full bg-rose-400/10 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-rose-200">Administration · Access control</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">User management</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-rose-100/80">Manage the people and permissions behind your ShopSphere workspace.</p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg" aria-hidden="true">♙</span>
              <div><p className="text-2xl font-bold leading-none">{pageInfo.totalElements}</p><p className="mt-1 text-xs text-rose-100/75">Total accounts</p></div>
            </div>
          </div>
        </section>

        {error && <div role="alert" className="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800"><span>{error}</span>{authorized !== false && <button onClick={loadUsers} className="shrink-0 font-semibold underline underline-offset-2">Retry</button>}</div>}
        {notice && <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">{notice}</div>}

        {authorized === true && <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div><h2 className="text-lg font-bold text-slate-900">Accounts</h2><p className="mt-1 text-sm text-slate-500">Review and manage registered users.</p></div>
              <span className="w-fit rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">Page {page + 1} of {Math.max(pageInfo.totalPages, 1)}</span>
            </div>
            {loading ? <div className="space-y-4 p-7" aria-label="Loading users"><div className="h-5 w-40 animate-pulse rounded bg-slate-100" /><div className="h-14 animate-pulse rounded-xl bg-slate-50" /><div className="h-14 animate-pulse rounded-xl bg-slate-50" /><div className="h-14 animate-pulse rounded-xl bg-slate-50" /></div> : users.length === 0 ? (
              <div className="px-6 py-16 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500" aria-hidden="true">♙</span><h3 className="mt-4 font-semibold text-slate-900">No users on this page</h3><p className="mt-1 text-sm text-slate-500">Create an account to get started.</p></div>
            ) : <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-3.5 font-semibold">Account</th><th className="px-4 py-3.5 font-semibold">Phone</th><th className="px-4 py-3.5 font-semibold">Role</th><th className="px-6 py-3.5 text-right font-semibold">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">{users.map((user) => <tr key={user.id} className="transition hover:bg-slate-50/70">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-100 to-violet-100 text-sm font-bold text-rose-700">{(user.name || user.email || "U").slice(0, 1).toUpperCase()}</span><div className="min-w-0"><p className="truncate font-semibold text-slate-900">{user.name || "Unnamed user"}</p><p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p></div></div></td>
                  <td className="px-4 py-4 text-slate-600">{user.phone || <span className="text-slate-400">—</span>}</td>
                  <td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.role === "ADMIN" ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-600"}`}>{user.role || "USER"}</span></td>
                  <td className="px-6 py-4"><div className="flex justify-end gap-2"><button onClick={() => startEdit(user)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700">Edit</button><button onClick={() => setPendingAction({ type: "delete", user })} className="rounded-lg border border-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50">Delete</button></div></td>
                </tr>)}</tbody>
              </table>
            </div>}
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 sm:px-7"><p className="text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{users.length}</span> of <span className="font-semibold text-slate-700">{pageInfo.totalElements}</span> accounts</p><div className="flex gap-2"><button disabled={page === 0 || loading} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">← Previous</button><button disabled={page + 1 >= pageInfo.totalPages || loading} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Next →</button></div></div>
          </section>

          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/[0.03]">
            <div className="mb-5 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-rose-600">{editingUser ? "Edit account" : "New account"}</p><h2 className="mt-1 text-lg font-bold text-slate-900">{editingUser ? "Update user details" : "Create a user"}</h2></div><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-lg text-rose-600" aria-hidden="true">＋</span></div>
            <p className="mb-5 text-sm leading-5 text-slate-500">{editingUser ? "Save the latest contact details for this account." : "Add a teammate to your workspace with a new account."}</p>
            <form onSubmit={submit} className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700">Full name<input name="name" value={form.name} onChange={changeField} placeholder="e.g. Asha Sharma" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10" required /></label>
              <label className="block text-xs font-semibold text-slate-700">Email address<input name="email" type="email" value={form.email} onChange={changeField} placeholder="name@company.com" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10" required /></label>
              <label className="block text-xs font-semibold text-slate-700">Phone number<input name="phone" value={form.phone} onChange={changeField} placeholder="Add a contact number" className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10" required /></label>
              {!editingUser && <label className="block text-xs font-semibold text-slate-700">Temporary password<input name="password" type="password" autoComplete="new-password" value={form.password} onChange={changeField} placeholder="At least 6 characters" minLength={6} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10" required /></label>}
              <div className="flex gap-2 pt-1"><button disabled={saving} className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-600/15 transition hover:bg-rose-700 disabled:opacity-60">{saving ? "Saving..." : editingUser ? "Save changes" : "Create account"}</button>{editingUser && <button type="button" onClick={() => { setEditingUser(null); setForm(blankUser); }} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Cancel</button>}</div>
            </form>
            <div className="mt-5 flex gap-2 rounded-xl bg-slate-50 p-3.5"><span className="text-rose-600" aria-hidden="true">ⓘ</span><p className="text-xs leading-5 text-slate-500">New accounts receive the standard user role. Administrator access is managed by your backend.</p></div>
          </section>
        </div>}
      </div>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.type === "edit" ? "Edit this account?" : "Delete this account?"}
        message={pendingAction?.type === "edit"
          ? `You’re about to update the details for ${pendingAction.user.name || pendingAction.user.email}.`
          : `This will permanently remove ${pendingAction?.user?.name || pendingAction?.user?.email} from the user list.`}
        confirmLabel={pendingAction?.type === "edit" ? "Continue to edit" : "Delete user"}
        danger={pendingAction?.type === "delete"}
        busy={saving}
        onCancel={() => setPendingAction(null)}
        onConfirm={confirmAction}
      />
    </main>
  );
}

