import { useEffect } from "react";
import { useBadgeStore } from "@/stores/useBadgeStore";

const BadgeList = () => {
  const { badges, fetchBadges, setRepresentative } = useBadgeStore();

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleClick = (badgeId, achieved) => {
    if (!achieved) return;
    setRepresentative(badgeId);
  };

  return (
    <div className="grid grid-cols-4 gap-4 px-4 py-2">
      {/* 뱃지 이미지 : 클릭하면 대표 이미지로 설정 */}
      {badges.map((b) => (
        <div
          key={b.badgeId}
          onClick={() => handleClick(b.badgeId, b.achieved)}
          className={`cursor-pointer flex flex-col items-center transition-all ${
            b.achieved ? "hover:scale-105" : "cursor-default"
          }`}
        >
          <div className="relative">
            <img
              src={b.iconUrl}
              alt={b.name}
              className={`w-14 h-14 object-cover rounded-lg ${
                b.achieved ? "" : "opacity-40 grayscale"
              }`}
            />

            {b.representative && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-[10px] px-1 py-0.5 rounded shadow">
                대표
              </div>
            )}
          </div>

          {/* 뱃지 이름 */}
          <p className="text-sm mt-1 text-primary font-semibold text-center">
            {b.name}
          </p>

          {/* 뱃지 설명 */}
          <p className="text-xs mt-1 text-center">{b.description}</p>

          {/* 프로그래스바 */}
          {!b.achieved && (
            <div className="w-12 mt-1 flex flex-col items-center h-[18px]">
              <div className="w-full h-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${b.progress}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5 text-center leading-none">
                {b.progress}%
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BadgeList;
