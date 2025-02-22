import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

function FinancePanel() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({ type: "income", amount: "", description: "", date: "" });
  const [editingTransaction, setEditingTransaction] = useState(null);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("finance_panel")}</h2>

      {/* Summary Section */}
      <div className="flex justify-between bg-gray-100 p-4 rounded-lg mb-4">
        <p className="text-green-600 font-bold">{t("total_income")}: €{transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0)}</p>
        <p className="text-red-600 font-bold">{t("total_expenses")}: €{transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0)}</p>
        <p className="font-bold">{t("balance")}: €{transactions.reduce((sum, t) => t.type === "income" ? sum + Number(t.amount) : sum - Number(t.amount), 0)}</p>
      </div>

      {/* Transaction Table */}
      <table className="w-full border border-gray-300" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border border-gray-300">{t("date")}</th>
            <th className="p-2 border border-gray-300">{t("description")}</th>
            <th className="p-2 border border-gray-300">{t("amount")}</th>
            <th className="p-2 border border-gray-300">{t("type")}</th>
            <th className="p-2 border border-gray-300">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className={transaction.type === "income" ? "bg-green-100" : "bg-red-100"}>
              <td className="p-2 border border-gray-300">{transaction.date}</td>
              <td className="p-2 border border-gray-300">{transaction.description}</td>
              <td className="p-2 border border-gray-300">€{transaction.amount}</td>
              <td className="p-2 border border-gray-300">{t(transaction.type)}</td>
              <td className="p-2 border border-gray-300 flex space-x-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEditTransaction(transaction)}>
                  {t("edit")}
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteTransaction(transaction.id)}>
                  {t("delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Transaction Form */}
      <form onSubmit={handleAddTransaction} className="mt-6 p-4 bg-white shadow-lg rounded-lg">
        <h3 className="text-lg font-bold mb-2">{editingTransaction ? t("edit_transaction") : t("add_transaction")}</h3>
        
        <div className="mb-2">
          <label className="block">{t("date")}</label>
          <input type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} className="w-full p-2 border rounded" required />
        </div>

        <div className="mb-2">
          <label className="block">{t("description")}</label>
          <input type="text" value={newTransaction.description} onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })} className="w-full p-2 border rounded" required />
        </div>

        <div className="mb-2">
          <label className="block">{t("amount")}</label>
          <input type="number" value={newTransaction.amount} onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })} className="w-full p-2 border rounded" required />
        </div>

        <div className="mb-4">
          <label className="block">{t("type")}</label>
          <select value={newTransaction.type} onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })} className="w-full p-2 border rounded">
            <option value="income">{t("income")}</option>
            <option value="expense">{t("expense")}</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition">
          {editingTransaction ? t("save_changes") : t("add_transaction")}
        </button>
      </form>

      <button
          onClick={() => window.history.back()}
          className="w-full mt-4 bg-stone-700 text-white py-2 rounded-lg hover:bg-stone-900 transition"
        >
          {t("back_to_admin_panel")}
        </button>
    </div>
  );
}

export default FinancePanel;
