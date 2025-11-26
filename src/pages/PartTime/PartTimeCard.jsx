import UserAvatar from "../../components/ui/UserAvatar";

export default function PartTimeCard({
  title,
  description,
  image,
  user,
  onClick,
  status,
}) {
  // 글자수 제한 처리
  const MAX_TITLE_LENGTH = 15;
  const MAX_DESC_LENGTH = 40;

  const truncatedTitle =
    title?.length > MAX_TITLE_LENGTH
      ? title.substring(0, MAX_TITLE_LENGTH) + "..."
      : title ?? "";

  const truncatedDescription =
    description?.length > MAX_DESC_LENGTH
      ? description.substring(0, MAX_DESC_LENGTH) + "..."
      : description ?? "";

  // 상태 라벨
  const statusLabel =
    {
      ONGOING: "모집중",
      CLOSED: "마감",
    }[status] || status;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-soft border border-border w-full cursor-pointer hover:shadow-md transition-all flex overflow-hidden"
    >
      {Boolean(image) && image !== "" && (
        <div className="aspect-square w-[30%] relative">
          <img src={image} alt="post" className="w-full h-full object-cover" />
        </div>
      )}

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
            <UserAvatar image={user?.image} size="md" />
            <span className="text-xs font-medium text-text">
              {user?.nickname}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
