import { useEffect } from "react";
import { useMissionStore } from "../../stores/useMissionStore";
import { Check, X} from "lucide-react";

export default function MissionModal({ onClose }) {
  const missions = useMissionStore((s) => s.missions);
  const fetchMissions = useMissionStore((s) => s.fetchMissions);
  const completeMission = useMissionStore((s) => s.completeMission);

  useEffect(() => {
    fetchMissions();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-xl">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">오늘의 미션</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* 미션 목록 */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {missions.length === 0 && (
            <p className="text-gray-500 text-center py-6">
              진행 중인 미션이 없습니다.
            </p>
          )}

          {missions.map((m) => (
            <div
              key={m.id}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                m.status
                  ? "bg-green-100 border-green-300"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div>
                <p className="font-semibold">{m.missionContent}</p>
                <p className="text-sm text-gray-600">{m.rewardPoint} 포인트</p>
              </div>

              {!m.status ? (
                <span className="text-gray-500"></span>
              ) : (
                <Check size={28} className="text-green-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
