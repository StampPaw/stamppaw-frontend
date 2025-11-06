export default function CompanionCard({
  title,
  description,
  image,
  user,
  onClick,
}) {
  return (
    <div
      onClick={onClick} // ✅ 추가
      className="bg-white rounded-xl shadow-soft border border-border w-full cursor-pointer hover:shadow-md transition-all flex overflow-hidden"
    >
      {/* ✅ 왼쪽 이미지 */}
      <div className="aspect-square w-[30%] relative">
        <img src={image} alt="post" className="w-full h-full object-cover" />
      </div>

      {/* ✅ 오른쪽 내용 */}
      <div className="flex flex-col justify-between p-4 flex-1">
        <div>
          <h3 className="font-semibold text-base text-text line-clamp-1">
            {title}
          </h3>
          <p className="text-muted text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <img
              src="https://randomuser.me/api/portraits/women/65.jpg"
              alt="author"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs font-medium text-text">
              {user?.nickName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
