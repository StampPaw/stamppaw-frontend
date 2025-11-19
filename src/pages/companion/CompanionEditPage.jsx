import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import {
  getCompanionDetail,
  updateCompanion,
} from "../../services/companionService";

export default function CompanionEditPage() {
  const { id } = useParams(); // 수정할 글 ID
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // 파일 객체
  const [previewImage, setPreviewImage] = useState(null); // 미리보기 URL
  const [originalImage, setOriginalImage] = useState(null); // 기존 이미지 URL

  // 🔥 기존 글 내용 불러오기
  useEffect(() => {
    const fetchCompanion = async () => {
      try {
        const data = await getCompanionDetail(id);
        setTitle(data.title);
        setContent(data.content);
        setOriginalImage(data.image);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCompanion();
  }, [id]);

  // 🔥 이미지 선택 시 미리보기
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // 🔥 수정 요청
  const handleSubmit = async (e) => {
    console.log(localStorage.getItem("token"));
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    try {
      await updateCompanion(id, formData);
      alert("수정이 완료되었습니다!");
      navigate(`/companion/${id}`);
    } catch (error) {
      console.error("수정 오류:", error);
      alert("수정 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EE] p-4 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          동행 글 수정하기
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🔸 제목 */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">제목</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* 🔸 내용 */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">내용</label>
            <textarea
              className="w-full p-2 border rounded-md h-40 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* 🔸 이미지 업로드 */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              이미지 (선택)
            </label>

            {previewImage ? (
              <img
                src={previewImage}
                alt="preview"
                className="w-full rounded-md mb-2"
              />
            ) : originalImage ? (
              <img
                src={originalImage}
                alt="original"
                className="w-full rounded-md mb-2"
              />
            ) : null}

            {(previewImage || originalImage) && (
              <div
                onClick={() => {
                  setImage(null);
                  setPreviewImage(null);
                  setOriginalImage(null);
                }}
                className="mb-2 flex items-center gap-1 text-red-500 text-sm cursor-pointer hover:text-red-600"
              >
                <Trash2 size={16} />
                <span>이미지 삭제</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0 file:text-sm file:font-semibold
                file:bg-primary file:text-white hover:file:bg-[#e59545]"
            />
          </div>

          {/* 🔸 버튼들 */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-1/2 mr-2 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            >
              취소
            </button>

            <button
              type="submit"
              className="w-1/2 ml-2 px-4 py-2 bg-orange-400 text-white rounded-md hover:bg-orange-500"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
