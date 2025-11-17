import api from "./api";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // { url: "S3경로" }
};
