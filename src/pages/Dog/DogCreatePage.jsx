// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { createDog } from "@/services/dogService";

// export default function DogCreatePage() {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [breed, setBreed] = useState("");
//   const [image, setImage] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("breed", breed);
//     if (image) formData.append("image", image);

//     try {
//       await createDog(formData);
//       alert("반려견이 등록되었습니다!");
//       navigate("/dogs");
//     } catch (err) {
//       alert("등록 실패");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-semibold mb-4">반려견 등록</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           label="이름"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />

//         <Input
//           label="품종"
//           value={breed}
//           onChange={(e) => setBreed(e.target.value)}
//         />

//         <input
//           type="file"
//           onChange={(e) => setImage(e.target.files[0])}
//           className="block"
//         />

//         <Button type="submit">등록하기</Button>
//       </form>
//     </div>
//   );
// }
