import UserAvatar from "../../components/ui/UserAvatar";

export default function CompanionCard({
  title,
  description,
  image,
  user,
  onClick,
  status,
}) {
  // 🔪 글자수 제한 처리
  const MAX_TITLE_LENGTH = 15; // 원하는 글자수로 변경 가능
  const MAX_DESC_LENGTH = 40; // 원하는 글자수로 변경 가능

  const truncatedTitle =
    title.length > MAX_TITLE_LENGTH
      ? title.substring(0, MAX_TITLE_LENGTH) + "..."
      : title;

  const truncatedDescription =
    description.length > MAX_DESC_LENGTH
      ? description.substring(0, MAX_DESC_LENGTH) + "..."
      : description;

  const statusLabel =
    {
      ONGOING: "모집중",
      CLOSED: "마감",
    }[status] || status;

  return (
    <div
      onClick={onClick} // ✅ 추가
      className="bg-white rounded-xl shadow-soft border border-border w-full cursor-pointer hover:shadow-md transition-all flex overflow-hidden"
    >
      {image && (
        <div className="aspect-square w-[30%] relative">
          <img src={image} alt="post" className="w-full h-full object-cover" />
        </div>
      )}

      {/* ✅ 오른쪽 내용 */}
      <div className="flex flex-col justify-between p-4 flex-1">
        <div>
          <div className="flex items-center mb-1">
            <h3 className="font-semibold text-base text-text line-clamp-1">
              {truncatedTitle}
            </h3>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ml-2 ${
                status === "ONGOING"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {statusLabel}
            </span>
          </div>
          <p className="text-muted text-sm leading-relaxed line-clamp-2">
            {truncatedDescription}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <UserAvatar image={user?.profileImage} size="sm" />
            <span className="text-xs font-medium text-text">
              {user.nickname}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
