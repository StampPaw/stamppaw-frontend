import { useState, useEffect } from "react";

export default function KakaoAddressSearch({ value, onChange }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!keyword) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      searchAddress(keyword);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  async function searchAddress(query) {
    try {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_KEY}`,
          },
        }
      );

      const data = await res.json();
      setResults(data.documents || []);
    } catch (e) {
      console.error("주소 검색 실패:", e);
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setKeyword(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="예: 서울 강동구"
        className="w-full border px-4 py-2 rounded"
      />

      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full rounded shadow-lg max-h-60 overflow-auto mt-1">
          {results.map((addr) => (
            <li
              key={addr.address_name}
              onClick={() => {
                onChange(addr.address_name);
                setKeyword("");
                setResults([]);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {addr.address_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
