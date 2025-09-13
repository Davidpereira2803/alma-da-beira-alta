import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Papa from "papaparse";
import AdminLayout from "./AdminLayout";

function FinancePanel() {
  const { t } = useTranslation();

  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: "income",
    amount: "",
    description: "",
    date: "",
    isRecurring: false,
    recurringInterval: "monthly",
    recurringEndDate: "",
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  const showNotice = (message, type = "success") => {
    setNotice({ type, message });
    window.clearTimeout(showNotice._t);
    showNotice._t = window.setTimeout(() => setNotice({ type: "", message: "" }), 2500);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "transactions"));
      const transactionsList = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      // Sort by date desc (YYYY-MM-DD or ISO)
      transactionsList.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
      setTransactions(transactionsList);
    } catch (e) {
      console.error(e);
      showNotice(t("loading_error") || "Failed to load transactions.", "error");
    } finally {
      setLoading(false);
    }
  };

  const currency = (n) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(
      Number(n || 0)
    );

  const sanitizeTransaction = (tx) => {
    const amount = Number(tx.amount);
    return {
      type: tx.type === "expense" ? "expense" : "income",
      amount: isFinite(amount) ? amount : 0,
      description: (tx.description || "").trim(),
      date: (tx.date || "").trim(), // expect YYYY-MM-DD
      isRecurring: !!tx.isRecurring,
      recurringInterval: tx.isRecurring ? (tx.recurringInterval || "monthly") : "",
      recurringEndDate: tx.isRecurring ? (tx.recurringEndDate || "") : "",
      updatedAt: serverTimestamp(),
    };
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    // basic validation
    if (!newTransaction.date || !newTransaction.description || !newTransaction.amount) {
      showNotice(t("all_fields_required") || "Please fill all required fields.", "error");
      return;
    }
    const amt = Number(newTransaction.amount);
    if (!isFinite(amt) || amt === 0) {
      showNotice(t("invalid_amount") || "Amount must be a valid number.", "error");
      return;
    }
    const payload = sanitizeTransaction(newTransaction);

    try {
      if (editingTransaction) {
        await updateDoc(doc(db, "transactions", editingTransaction.id), payload);
        setTransactions((prev) => prev.map((t) => (t.id === editingTransaction.id ? { ...t, ...payload } : t)));
        setEditingTransaction(null);
        showNotice(t("saved") || "Saved.");
      } else {
        const ref = await addDoc(collection(db, "transactions"), { ...payload, createdAt: serverTimestamp() });
        setTransactions((prev) => [{ id: ref.id, ...payload }, ...prev]);
        showNotice(t("added_success") || "Added.");
      }
      setNewTransaction({
        type: "income",
        amount: "",
        description: "",
        date: "",
        isRecurring: false,
        recurringInterval: "monthly",
        recurringEndDate: "",
      });
    } catch (e) {
      console.error(e);
      showNotice(t("event_save_error") || "Error saving. Try again.", "error");
    }
  };

  const handleEditTransaction = (transaction) => {
    setNewTransaction({
      type: transaction.type || "income",
      amount: String(transaction.amount ?? ""),
      description: transaction.description || "",
      date: transaction.date || "",
      isRecurring: !!transaction.isRecurring,
      recurringInterval: transaction.recurringInterval || "monthly",
      recurringEndDate: transaction.recurringEndDate || "",
    });
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm(t("confirm_delete") || "Delete this record?")) return;
    try {
      await deleteDoc(doc(db, "transactions", id));
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showNotice(t("deleted_success") || "Deleted.");
    } catch (e) {
      console.error(e);
      showNotice(t("delete_failed") || "Delete failed.", "error");
    }
  };

  const groupByMonth = (list) => {
    const result = {};
    list.forEach((t) => {
      const key = (t.date || "").slice(0, 7) || "Unknown"; // YYYY-MM
      if (!result[key]) result[key] = { month: key, income: 0, expense: 0 };
      if (t.type === "income") result[key].income += Number(t.amount || 0);
      if (t.type === "expense") result[key].expense += Number(t.amount || 0);
    });
    return Object.values(result).sort((a, b) => a.month.localeCompare(b.month));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = filterType === "all" || t.type === filterType;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (t.description || "").toLowerCase().includes(q) ||
        String(t.amount || "").includes(q) ||
        String(t.date || "").includes(q);
      return matchesType && matchesSearch;
    });
  }, [transactions, filterType, searchQuery]);

  const totals = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const exportData = transactions.map((t) => ({
      date: t.date || "",
      description: t.description || "",
      amount: t.amount ?? "",
      type: t.type || "",
      isRecurring: t.isRecurring ? "TRUE" : "FALSE",
      recurringInterval: t.recurringInterval || "",
      recurringEndDate: t.recurringEndDate || "",
    }));
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let imported = 0;
        for (const row of results.data) {
          if (!row) continue;
          const base = {
            date: (row.date || "").trim(),
            description: (row.description || "").trim(),
            amount: Number(row.amount || 0),
            type: row.type === "expense" ? "expense" : "income",
            isRecurring: String(row.isRecurring || "").toUpperCase() === "TRUE",
            recurringInterval: row.recurringInterval || (String(row.isRecurring || "").toUpperCase() === "TRUE" ? "monthly" : ""),
            recurringEndDate: row.recurringEndDate || "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          if (base.date && base.description && isFinite(base.amount)) {
            try {
              const ref = await addDoc(collection(db, "transactions"), base);
              setTransactions((prev) => [{ id: ref.id, ...base }, ...prev]);
              imported++;
            } catch (e) {
              console.error("Import row failed:", e);
            }
          }
        }
        showNotice(`${t("imported") || "Imported"} ${imported} ${t("records") || "records"}.`);
        e.target.value = "";
      },
      error: () => {
        showNotice(t("import_failed") || "Import failed.", "error");
      },
    });
  };

  return (
    <AdminLayout title={t("finance_panel")} description={t("finance_panel_hint") || "Track income, expenses, and balance."}>
      {notice.message && (
        <div
          role="status"
          className={`mb-4 rounded-lg p-3 text-sm ${
            notice.type === "error" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {notice.message}
        </div>
      )}

      {/* Analytics Chart */}
      <div className="bg-white rounded-2xl shadow border-t-4 border-[#BCA88D] p-4 mb-6">
        <h3 className="text-lg font-bold text-[#3E3F29] mb-2">{t("monthly_income_expense")}</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={groupByMonth(transactions)}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" name={t("income")} />
            <Bar dataKey="expense" fill="#ef4444" name={t("expense")} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border-t-4 border-[#BCA88D] shadow p-4">
          <div className="text-sm text-[#7D8D86]">{t("total_income")}</div>
          <div className="text-2xl font-serif font-bold text-[#3E3F29]">{currency(totals.income)}</div>
        </div>
        <div className="bg-white rounded-xl border-t-4 border-[#BCA88D] shadow p-4">
          <div className="text-sm text-[#7D8D86]">{t("total_expenses")}</div>
          <div className="text-2xl font-serif font-bold text-[#3E3F29]">{currency(totals.expense)}</div>
        </div>
        <div className="bg-white rounded-xl border-t-4 border-[#BCA88D] shadow p-4">
          <div className="text-sm text-[#7D8D86]">{t("balance")}</div>
          <div className="text-2xl font-serif font-bold text-[#3E3F29]">{currency(totals.balance)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <div>
          <label className="block text-[#3E3F29] font-medium mb-1">{t("filter_by_type")}</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 px-3 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D] bg-white"
          >
            <option value="all">{t("all")}</option>
            <option value="income">{t("income")}</option>
            <option value="expense">{t("expense")}</option>
          </select>
        </div>
        <div className="flex-1 w-full">
          <label className="block text-[#3E3F29] font-medium mb-1">{t("search")}</label>
          <div className="flex items-center bg-white rounded-full border border-[#BCA88D]/30 px-3">
            <svg width="16" height="16" className="text-[#7D8D86] mr-2" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" d="M21 21l-4.3-4.3M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search_placeholder") || "Search..."}
              className="w-full h-9 outline-none text-sm bg-transparent placeholder-[#7D8D86]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-[#BCA88D] rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#7D8D86] text-[#3E3F29]">
              <th className="p-2 border border-[#BCA88D]">{t("date")}</th>
              <th className="p-2 border border-[#BCA88D]">{t("description")}</th>
              <th className="p-2 border border-[#BCA88D]">{t("amount")}</th>
              <th className="p-2 border border-[#BCA88D]">{t("type")}</th>
              <th className="p-2 border border-[#BCA88D]">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-[#7D8D86]">{t("loading") || "Loading..."}</td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-[#7D8D86]">{t("no_data") || "No transactions"}</td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className={transaction.type === "income" ? "bg-green-50" : "bg-red-50"}>
                  <td className="p-2 border border-[#BCA88D]">{transaction.date || "-"}</td>
                  <td className="p-2 border border-[#BCA88D]">{transaction.description}</td>
                  <td className="p-2 border border-[#BCA88D]">{currency(transaction.amount)}</td>
                  <td className="p-2 border border-[#BCA88D]">{t(transaction.type)}</td>
                  <td className="p-2 border border-[#BCA88D]">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold bg-[#BCA88D] text-[#3E3F29] hover:bg-[#7D8D86]"
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        {t("edit")}
                      </button>
                      <button
                        className="inline-flex items-center gap-2 rounded-full h-9 px-3 text-xs font-semibold bg-white border border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <form onSubmit={handleAddTransaction} className="mt-6 p-4 bg-[#7D8D86] shadow rounded-lg">
        <h3 className="text-lg font-bold mb-3 text-[#3E3F29]">
          {editingTransaction ? t("edit_transaction") : t("add_transaction")}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#3E3F29] font-medium">{t("date")}</label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              className="w-full h-10 px-3 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              required
            />
          </div>

          <div>
            <label className="block text-[#3E3F29] font-medium">{t("amount")}</label>
            <input
              type="number"
              step="0.01"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
              className="w-full h-10 px-3 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[#3E3F29] font-medium">{t("description")}</label>
            <input
              type="text"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              className="w-full h-10 px-3 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
              required
            />
          </div>

          <div>
            <label className="block text-[#3E3F29] font-medium">{t("type")}</label>
            <select
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              className="w-full h-10 px-3 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D] bg-white"
            >
              <option value="income">{t("income")}</option>
              <option value="expense">{t("expense")}</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-center flex-wrap gap-2">
            <label className="inline-flex items-center gap-2 text-sm text-[#3E3F29]">
              <input
                type="checkbox"
                checked={newTransaction.isRecurring || false}
                onChange={(e) => setNewTransaction({ ...newTransaction, isRecurring: e.target.checked })}
                className="accent-[#3E3F29]"
              />
              {t("recurring_transaction")}
            </label>

            {newTransaction.isRecurring && (
              <>
                <select
                  value={newTransaction.recurringInterval || "monthly"}
                  onChange={(e) => setNewTransaction({ ...newTransaction, recurringInterval: e.target.value })}
                  className="h-10 px-3 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D] bg-white"
                >
                  <option value="monthly">{t("monthly")}</option>
                  <option value="yearly">{t("yearly")}</option>
                  <option value="weekly">{t("weekly")}</option>
                </select>
                <input
                  type="date"
                  value={newTransaction.recurringEndDate || ""}
                  onChange={(e) => setNewTransaction({ ...newTransaction, recurringEndDate: e.target.value })}
                  className="h-10 px-3 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                  placeholder={t("end_date")}
                />
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
          >
            {editingTransaction ? t("save_changes") : t("add_transaction")}
          </button>
          {editingTransaction && (
            <button
              type="button"
              onClick={() => {
                setEditingTransaction(null);
                setNewTransaction({
                  type: "income",
                  amount: "",
                  description: "",
                  date: "",
                  isRecurring: false,
                  recurringInterval: "monthly",
                  recurringEndDate: "",
                });
              }}
              className="flex-1 bg-white border border-[#3E3F29]/20 hover:bg-[#F1F0E4] py-2 rounded-lg transition font-semibold"
            >
              {t("cancel")}
            </button>
          )}
        </div>
      </form>

      {/* Footer actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
        <button
          onClick={() => window.history.back()}
          className="w-full md:w-auto bg-[#BCA88D] text-[#3E3F29] py-2 px-6 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
        >
          {t("back_to_admin_panel")}
        </button>

        <button
          onClick={handleExportCSV}
          className="w-full md:w-auto inline-flex items-center justify-center rounded-full h-11 px-6 bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
        >
          {t("export_csv")}
        </button>

        <label className="w-full md:w-auto inline-flex items-center justify-center rounded-full h-11 px-6 bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition cursor-pointer">
          {t("import_csv")}
          <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
        </label>
      </div>
    </AdminLayout>
  );
}

export default FinancePanel;
