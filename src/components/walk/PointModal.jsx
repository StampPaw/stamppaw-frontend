import { useEffect } from "react";
import { usePointStore } from "../../stores/usePointStore";
import { X } from "lucide-react";

export default function PointModal({ onClose }) {
  const total = usePointStore((s) => s.total);
  const history = usePointStore((s) => s.history);
  const fetchHistory = usePointStore((s) => s.fetchHistory);
  const fetchTotal = usePointStore((s) => s.fetchTotal);

  useEffect(() => {
    fetchTotal();
    fetchHistory();
  }, [fetchTotal]);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[99999]">
      <div className="bg-white rounded-2xl p-6 w-80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">포인트 내역</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <p className="text-lg font-semibold mb-2">총 {total}P</p>

        <div className="max-h-60 overflow-y-auto space-y-2 scrollbar-hide">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-yellow-50 rounded-xl px-4 py-2 shadow-sm"
            >
              <span className="font-bold text-yellow-600">+{item.amount}P</span>
              <span className="text-sm text-gray-500">{item.reason}</span>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
