// import { useEffect, useState } from "react";
// import { getDogs, deleteDog } from "@/services/dogService";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";


// export default function DogListPage() {
//   const navigate = useNavigate();
//   const [dogs, setDogs] = useState([]);

//   const fetchDogs = async () => {
//     const data = await getDogs();
//     setDogs(data);
//   };

//   useEffect(() => {
//     fetchDogs();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("삭제할까요?")) return;
//     await deleteDog(id);
//     fetchDogs();
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-semibold mb-4">내 반려견</h1>

//       <Button onClick={() => navigate("/dogs/new")} className="mb-4">
//         + 반려견 추가
//       </Button>

//       <div className="space-y-4">
//         {dogs.map((dog) => (
//           <div
//             key={dog.id}
//             className="p-4 bg-white rounded shadow flex items-center gap-4"
//           >
//             <img
//               src={dog.image_Url}
//               alt={dog.name}
//               className="w-16 h-16 rounded object-cover"
//             />

//             <div className="flex-1">
//               <p className="font-semibold">{dog.name}</p>
//               <p className="text-sm text-gray-500">{dog.breed}</p>
//             </div>

//             <Button onClick={() => navigate(`/dogs/${dog.id}/edit`)}>
//               수정
//             </Button>

//             <Button variant="destructive" onClick={() => handleDelete(dog.id)}>
//               삭제
//             </Button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
