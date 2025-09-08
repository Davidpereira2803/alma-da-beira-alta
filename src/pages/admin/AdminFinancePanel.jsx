import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
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
    <div className="bg-[#F1F0E4] min-h-screen py-10">
      <div className="max-w-4xl mx-auto p-6 bg-[#F1F0E4] border-t-4 border-[#BCA88D] shadow-lg rounded-xl">
        <h2 className="text-2xl font-serif font-bold text-[#3E3F29] mb-4">{t("finance_panel")}</h2>

        <div className="flex flex-col md:flex-row justify-between bg-[#7D8D86] p-4 rounded-lg mb-4 gap-2">
          <p className="text-green-700 font-bold">{t("total_income")}: €{transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0)}</p>
          <p className="text-red-700 font-bold">{t("total_expenses")}: €{transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0)}</p>
          <p className="font-bold text-[#3E3F29]">{t("balance")}: €{transactions.reduce((sum, t) => t.type === "income" ? sum + Number(t.amount) : sum - Number(t.amount), 0)}</p>
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
              {transactions.map((transaction) => (
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

          <button type="submit" className="w-full bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition">
            {editingTransaction ? t("save_changes") : t("add_transaction")}
          </button>
        </form>

        <button
          onClick={() => window.history.back()}
          className="w-full mt-4 bg-[#BCA88D] text-[#3E3F29] py-2 rounded-lg font-semibold shadow hover:bg-[#7D8D86] transition"
        >
          {t("back_to_admin_panel")}
        </button>
      </div>
    </div>
  );
}

export default FinancePanel;
