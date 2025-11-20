import { useNavigate } from "react-router-dom";

/**
 * 유저 프로필 이동을 위한 공통 링크 컴포넌트
 * userId가 null/undefined → 내 프로필(/profile)
 * userId가 숫자/문자열 → 상대 프로필(/profile/{id})
 *
 * 사용 예:
 * <UserProfileLink userId={user.id}>
 *   <img src={user.profileImage} />
 *   <span>{user.nickname}</span>
 * </UserProfileLink>
 */
export default function UserProfileLink({ userId, children, className = "" }) {
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // null 또는 undefined → 내 프로필
    if (userId == null) {
      navigate("/profile");
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <button
      type="button"
      className={`cursor-pointer inline-flex items-center bg-transparent border-none p-0 ${className}`}
      onClick={handleClick}
      style={{ appearance: "none" }}
      aria-label="프로필로 이동"
    >
      {children}
    </button>
  );
}
