import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Papa from "papaparse";

function FinancePanel() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({ type: "income", amount: "", description: "", date: "" });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const querySnapshot = await getDocs(collection(db, "transactions"));
    const transactionsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTransactions(transactionsList);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (editingTransaction) {
      await updateDoc(doc(db, "transactions", editingTransaction.id), newTransaction);
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? { id: t.id, ...newTransaction } : t));
      setEditingTransaction(null);
    } else {
      const docRef = await addDoc(collection(db, "transactions"), newTransaction);
      setTransactions([...transactions, { id: docRef.id, ...newTransaction }]);
    }
    setNewTransaction({ type: "income", amount: "", description: "", date: "" });
  };

  const handleEditTransaction = (transaction) => {
    setNewTransaction(transaction);
    setEditingTransaction(transaction);
  };

  const handleDeleteTransaction = async (id) => {
    await deleteDoc(doc(db, "transactions", id));
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const groupByMonth = (transactions) => {
    const result = {};
    transactions.forEach(t => {
      const month = t.date ? t.date.slice(0, 7) : "Unknown"; // YYYY-MM
      if (!result[month]) result[month] = { month, income: 0, expense: 0 };
      if (t.type === "income") result[month].income += Number(t.amount);
      if (t.type === "expense") result[month].expense += Number(t.amount);
    });
    return Object.values(result).sort((a, b) => a.month.localeCompare(b.month));
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.amount.toString().includes(searchQuery);
    return matchesType && matchesSearch;
  });

  const handleExportCSV = () => {
    // Only export relevant fields, including recurring
    const exportData = transactions.map(t => ({
      date: t.date,
      description: t.description,
      amount: t.amount,
      type: t.type,
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
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        for (const row of results.data) {
          if (row.date && row.description && row.amount && row.type) {
            await addDoc(collection(db, "transactions"), {
              date: row.date,
              description: row.description,
              amount: row.amount,
              type: row.type,
              isRecurring: row.isRecurring === "TRUE",
              recurringInterval: row.recurringInterval || "",
              recurringEndDate: row.recurringEndDate || "",
            });
          }
        }
        fetchTransactions();
      },
    });
  };

  return (
    <div className="bg-[#F1F0E4] min-h-screen py-10">
      <div className="max-w-4xl mx-auto p-6 bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl">
        <h2 className="text-2xl font-serif font-bold text-[#3E3F29] mb-4">{t("finance_panel")}</h2>

        {/* Analytics Chart */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-bold text-[#3E3F29] mb-2">{t("monthly_income_expense")}</h3>
          <ResponsiveContainer width="100%" height={250}>
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

        <div className="flex flex-col md:flex-row justify-between bg-[#7D8D86] p-4 rounded-lg mb-4 gap-2">
          <p className="text-green-700 font-bold">{t("total_income")}: €{transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0)}</p>
          <p className="text-red-700 font-bold">{t("total_expenses")}: €{transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0)}</p>
          <p className="font-bold text-[#3E3F29]">{t("balance")}: €{transactions.reduce((sum, t) => t.type === "income" ? sum + Number(t.amount) : sum - Number(t.amount), 0)}</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <div>
            <label className="block text-[#3E3F29] font-medium mb-1">{t("filter_by_type")}</label>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
            >
              <option value="all">{t("all")}</option>
              <option value="income">{t("income")}</option>
              <option value="expense">{t("expense")}</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-[#3E3F29] font-medium mb-1">{t("search")}</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
            />
          </div>
        </div>

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
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className={transaction.type === "income" ? "bg-green-50" : "bg-red-50"}>
                  <td className="p-2 border border-[#BCA88D]">{transaction.date}</td>
                  <td className="p-2 border border-[#BCA88D]">{transaction.description}</td>
                  <td className="p-2 border border-[#BCA88D]">€{transaction.amount}</td>
                  <td className="p-2 border border-[#BCA88D]">{t(transaction.type)}</td>
                  <td className="p-2 border border-[#BCA88D] flex space-x-2 justify-center">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded font-semibold shadow hover:bg-blue-700 transition" onClick={() => handleEditTransaction(transaction)}>
                      {t("edit")}
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded font-semibold shadow hover:bg-red-700 transition" onClick={() => handleDeleteTransaction(transaction.id)}>
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleAddTransaction} className="mt-6 p-4 bg-[#7D8D86] shadow-lg rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-[#3E3F29]">{editingTransaction ? t("edit_transaction") : t("add_transaction")}</h3>
          
          <div className="mb-2">
            <label className="block text-[#3E3F29] font-medium">{t("date")}</label>
            <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]" required />
          </div>

          <div className="mb-2">
            <label className="block text-[#3E3F29] font-medium">{t("description")}</label>
            <input type="text" value={newTransaction.description} onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })} className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]" required />
          </div>

          <div className="mb-2">
            <label className="block text-[#3E3F29] font-medium">{t("amount")}</label>
            <input type="number" value={newTransaction.amount} onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })} className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]" required />
          </div>

          <div className="mb-4">
            <label className="block text-[#3E3F29] font-medium">{t("type")}</label>
            <select value={newTransaction.type} onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })} className="w-full p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]">
              <option value="income">{t("income")}</option>
              <option value="expense">{t("expense")}</option>
            </select>
          </div>

          <div className="mb-2 flex items-center">
            <input
              type="checkbox"
              checked={newTransaction.isRecurring || false}
              onChange={e => setNewTransaction({ ...newTransaction, isRecurring: e.target.checked })}
              className="mr-2"
            />
            <label className="text-[#3E3F29] font-medium mr-4">{t("recurring_transaction")}</label>
            {newTransaction.isRecurring && (
              <>
                <select
                  value={newTransaction.recurringInterval || "monthly"}
                  onChange={e => setNewTransaction({ ...newTransaction, recurringInterval: e.target.value })}
                  className="p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D] mr-2"
                >
                  <option value="monthly">{t("monthly")}</option>
                  <option value="yearly">{t("yearly")}</option>
                  <option value="weekly">{t("weekly")}</option>
                </select>
                <input
                  type="date"
                  value={newTransaction.recurringEndDate || ""}
                  onChange={e => setNewTransaction({ ...newTransaction, recurringEndDate: e.target.value })}
                  className="p-2 border border-[#BCA88D] rounded focus:outline-none focus:ring-2 focus:ring-[#BCA88D]"
                  placeholder={t("end_date")}
                />
              </>
            )}
          </div>

          <button type="submit" className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition">
            {editingTransaction ? t("save_changes") : t("add_transaction")}
          </button>
        </form>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <button
            onClick={() => window.history.back()}
            className="w-full md:w-auto bg-[#BCA88D] text-[#3E3F29] py-2 px-6 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
          >
            {t("back_to_admin_panel")}
          </button>
          <button
            onClick={handleExportCSV}
            className="w-full md:w-auto bg-green-500 text-white py-2 px-6 rounded-lg font-semibold shadow hover:bg-green-700 transition"
          >
            {t("export_csv")}
          </button>
          <label className="w-full md:w-auto bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold shadow hover:bg-blue-700 transition cursor-pointer text-center">
            {t("import_csv")}
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default FinancePanel;
