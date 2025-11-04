export default function Button() {
  return (
    <>
      <section>
        <h2 className="text-xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#ff8a1e] transition">
            기본 버튼
          </button>
          <button className="border border-primary text-primary font-medium px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition">
            아웃라인 버튼
          </button>
          <button className="bg-input text-primary font-semibold px-6 py-2 rounded-lg">
            서브 버튼
          </button>
          <button className="bg-red-400 text-white px-6 py-2 rounded-lg">
            위험 버튼
          </button>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Large Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="w-full bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#ff8a1e] transition">
            기본 버튼
          </button>
          <button className="w-full border border-primary text-primary font-medium px-6 py-2 rounded-lg hover:bg-primary hover:text-white transition">
            아웃라인 버튼
          </button>
          <button className="w-full bg-input text-primary font-semibold px-6 py-2 rounded-lg">
            서브 버튼
          </button>
          <button className="w-full bg-red-400 text-white px-6 py-2 rounded-lg">
            위험 버튼
          </button>
        </div>
      </section>
    </>
  );
}
