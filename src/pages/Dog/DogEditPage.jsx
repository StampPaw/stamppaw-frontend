// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";


// export default function DogEditPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [dog, setDog] = useState(null);
//   const [name, setName] = useState("");
//   const [breed, setBreed] = useState("");
//   const [image, setImage] = useState(null);

//   useEffect(() => {
//     const loadDog = async () => {
//       const dogs = await getDogs();
//       const target = dogs.find((d) => d.id === Number(id));
//       setDog(target);
//       setName(target.name);
//       setBreed(target.breed);
//     };
//     loadDog();
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("breed", breed);
//     if (image) formData.append("image", image);

//     await updateDog(id, formData);
//     alert("수정 완료!");
//     navigate("/dogs");
//   };

//   if (!dog) return <div>Loading...</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-semibold mb-4">반려견 수정</h1>

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

//         <img
//           src={dog.image_Url}
//           alt={dog.name}
//           className="w-24 h-24 rounded object-cover"
//         />

//         <input type="file" onChange={(e) => setImage(e.target.files[0])} />

//         <Button type="submit">수정하기</Button>
//       </form>
//     </div>
//   );
// }
