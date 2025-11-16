import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CompanionWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  // ✅ 이미지 파일 선택
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // ✅ 글 등록 요청 (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://localhost:8080/api/companion", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("글이 성공적으로 등록되었습니다!");
        navigate("/companion");
      } else {
        const errorText = await response.text();
        console.error("등록 실패:", errorText);
        alert("등록 실패 😢");
      }
    } catch (err) {
      console.error("글 등록 실패:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-text font-sans flex justify-center">
      <div className="w-full sm:max-w-[500px] flex flex-col relative mx-auto h-screen">
        {/* ✅ 상단 헤더 */}
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold">동행 글쓰기</h2>
        </div>

        {/* ✅ 폼 영역 */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 space-y-5 pb-32"
        >
          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 h-40 resize-none focus:ring-2 focus:ring-primary outline-none"
              placeholder="내용을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-primary file:text-white hover:file:bg-[#e59545]"
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="mt-3 w-full h-40 object-cover rounded-lg border"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-[#e59545] transition"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
}
