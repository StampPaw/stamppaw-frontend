import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDogById, updateDog } from "@/services/dogService";

export default function DogEditPage() {
  const { dogId } = useParams();  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    character: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchDog = async () => {
      const data = await getDogById(dogId);
      setFormData({
        name: data.name,
        breed: data.breed,
        age: data.age,
        character: data.character,
      });
      setPreview(data.image_url);
    };
    fetchDog();
  }, [dogId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append(
      "data",
      new Blob([JSON.stringify({
        name: formData.name,
        breed: formData.breed,
        age: Number(formData.age),
        character: formData.character,
        image_url: null
      })], { type: "application/json" })
    );

    if (imageFile) data.append("image", imageFile);

    try {
      await updateDog(dogId, data);
      navigate("/profile");
    } catch (err) {
      console.error("강아지 수정 실패:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6] px-6 py-8">
      <h2 className="text-xl font-bold text-[#4C3728] mb-5">반려견 수정</h2>

      {/* 이미지 */}
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
        <div>
          <p className="text-sm text-[#6B5B4A] font-semibold">이름</p>
          <input
            name="name"
            placeholder="이름"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white rounded-lg border border-[#E5D8C4]"
          />
        </div>

        {/* 품종 */}
        <div>
          <p className="text-sm text-[#6B5B4A] font-semibold">품종</p>
          <input
            name="breed"
            placeholder="품종"
            value={formData.breed}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white rounded-lg border border-[#E5D8C4]"
          />
        </div>

        {/* 나이 */}
        <div>
          <p className="text-sm text-[#6B5B4A] font-semibold">나이</p>
          <input
            name="age"
            type="number"
            placeholder="나이"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white rounded-lg border border-[#E5D8C4]"
          />
        </div>

        {/* 성격 */}
        <div>
          <p className="text-sm text-[#6B5B4A] font-semibold">성격</p>
          <textarea
            name="character"
            placeholder="성격"
            value={formData.character}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white rounded-lg border border-[#E5D8C4] min-h-[80px]"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#F6C343] text-[#4C3728] font-semibold rounded-lg mt-2"
        >
          수정하기
        </button>
      </form>

    </div>
  );
}
