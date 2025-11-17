import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDog } from "@/services/dogService";

export default function DogAddPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    character: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 에러 메시지
  const [nameError, setNameError] = useState("");
  const [breedError, setBreedError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "name") setNameError("");
    if (name === "breed") setBreedError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!formData.name.trim()) {
      setNameError("반려견 이름을 입력해주세요.");
      hasError = true;
    }
    if (!formData.breed.trim()) {
      setBreedError("반려견 품종을 입력해주세요.");
      hasError = true;
    }

    if (hasError) return;

    const data = new FormData();

    const jsonData = {
      name: formData.name,
      breed: formData.breed,
      age: Number(formData.age),
      character: formData.character,
      image_url: null,
    };

    data.append(
      "data",
      new Blob([JSON.stringify(jsonData)], { type: "application/json" })
    );

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      await addDog(data);
      navigate("/profile");
    } catch (err) {
      console.error(err);
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

        {/* 이름 */}
        <div className="w-full">
          <input
            name="name"
            placeholder="이름"
            value={formData.name}
            onChange={handleChange}
            className={`px-4 py-3 bg-white rounded-lg border ${
              nameError ? "border-red-400" : "border-[#E5D8C4]"
            } w-full`}
          />
          {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
        </div>

        {/* 품종 */}
        <div className="w-full">
          <input
            name="breed"
            placeholder="품종"
            value={formData.breed}
            onChange={handleChange}
            className={`px-4 py-3 bg-white rounded-lg border ${
              breedError ? "border-red-400" : "border-[#E5D8C4]"
            } w-full`}
          />
          {breedError && <p className="text-sm text-red-500 mt-1">{breedError}</p>}
        </div>

        {/* 나이 */}
        <input
          name="age"
          placeholder="나이"
          type="number"
          value={formData.age}
          onChange={handleChange}
          className="px-4 py-3 bg-white rounded-lg border border-[#E5D8C4]"
        />

        {/* 성격 */}
        <textarea
          name="character"
          placeholder="성격"
          value={formData.character}
          onChange={handleChange}
          className="px-4 py-3 bg-white rounded-lg border border-[#E5D8C4] min-h-[80px]"
        />

        {/* 등록 버튼 */}
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
