import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDog } from "@/services/dogService";

export default function DogAddPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 입력 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 이미지 선택
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.breed) {
      alert("이름과 품종은 필수입니다!");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("breed", formData.breed);
    data.append("age", formData.age);
    if (imageFile) data.append("image", imageFile);

    try {
      await addDog(data);
      alert("반려견이 등록되었습니다!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("등록에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6] px-6 py-8">
      <h2 className="text-xl font-bold text-[#4C3728] mb-5">반려견 등록</h2>

      {/* 이미지 업로드 */}
      <div className="w-full flex justify-center mb-6">
        <label className="w-32 h-32 rounded-full bg-[#F4EAD7] flex items-center justify-center shadow cursor-pointer overflow-hidden">
          {preview ? (
            <img src={preview} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#C4A27F] text-sm">이미지 선택</span>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleChange}
          className="px-4 py-3 bg-white rounded-lg border border-[#E5D8C4] focus:outline-none"
        />

        <input
          name="breed"
          placeholder="품종"
          value={formData.breed}
          onChange={handleChange}
          className="px-4 py-3 bg-white rounded-lg border border-[#E5D8C4] focus:outline-none"
        />

        <input
          name="age"
          placeholder="나이"
          type="number"
          value={formData.age}
          onChange={handleChange}
          className="px-4 py-3 bg-white rounded-lg border border-[#E5D8C4] focus:outline-none"
        />

        <button
          type="submit"
          className="w-full py-3 bg-[#F6C343] text-[#4C3728] font-semibold rounded-lg mt-2"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
