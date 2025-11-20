// src/components/walk/BottomSheet.jsx
import { motion, animate } from "framer-motion";
import {
  Clock,
  Ruler,
  Footprints,
  SquareStop,
  Save,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";
import PhotoCarousel from "./PhotoCarousel";

export default function BottomSheet({
  stage,
  elapsed,
  distance,
  memo,
  setMemo,
  photo,
  setPhoto,
  startWalk,
  endWalk,
  recordWalk,
}) {
  // 기본은 열린 상태
  const [isOpen, setIsOpen] = useState(true);
  const sheetRef = useRef(null);

  // ====== 레이아웃 상수 ======
  const NAVBAR_HEIGHT = 80;   // 실제 네비바 높이 (App.jsx에서 고정됨)
  const BOTTOM_SAFE = 12;      // 네비바 위에 띄울 여백
  const SAFE_BOTTOM = NAVBAR_HEIGHT + BOTTOM_SAFE;

  // 디바이스 화면 높이 기반 시트 최대 높이 계산
  const MAX_SHEET_OPEN = window.innerHeight - SAFE_BOTTOM;

  // 버튼 높이 관련
  const BUTTON_CONTAINER_BOTTOM = 70;
  const BUTTON_HEIGHT = 52;
  const BUTTON_GAP = 12;
  const HANDLE_VISIBLE = 36;

  const [sheetHeight, setSheetHeight] = useState(360);

  // 버튼 영역 전체 높이
  const bottomGap = BUTTON_CONTAINER_BOTTOM + BUTTON_HEIGHT + BUTTON_GAP;

  // 닫힌 상태의 Y 오프셋 값
  const closedY = Math.max(0, sheetHeight - (HANDLE_VISIBLE + bottomGap));

  // 시트 높이를 실시간 측정
  useEffect(() => {
    if (!sheetRef.current) return;
    const el = sheetRef.current;

    const update = () => {
      const h = el.getBoundingClientRect().height;
      // 화면 기반으로 최대 높이 제한 적용
      setSheetHeight(Math.min(Math.ceil(h), MAX_SHEET_OPEN));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, [stage, memo, distance, elapsed, isOpen]);

  // 열림/닫힘 토글
  const toggleSheet = () => setIsOpen((prev) => !prev);

  // 열림/닫힘 애니메이션
  useEffect(() => {
    const target = isOpen ? 0 : closedY;
    animate(".bottom-sheet", { y: target }, { type: "spring", stiffness: 240, damping: 28 });
  }, [isOpen, closedY]);

  // 드래그 상태 추적
  const [currentY, setCurrentY] = useState(0);

  const snapOnDragEnd = () => {
    const halfway = closedY / 2;
    const target = currentY > halfway ? closedY : 0;
    setIsOpen(target === 0);

    animate(".bottom-sheet", { y: target }, { type: "spring", stiffness: 260, damping: 30 });
  };

  const formatElapsedTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}시간 ${m}분 ${s}초`;
    if (m > 0) return `${m}분 ${s}초`;
    return `${s}초`;
  };

  return (
    <>
      {/* ====== BottomSheet 본체 ====== */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: closedY }}
        dragElastic={0.12}
        onUpdate={(latest) => {
          if (latest?.y !== undefined) setCurrentY(latest.y);
        }}
        onDragEnd={snapOnDragEnd}
        className="bottom-sheet absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md rounded-t-3xl shadow-2xl z-20 overflow-hidden"
        style={{ y: isOpen ? 0 : closedY }}
      >
        {/* 핸들 */}
        <div
          onClick={toggleSheet}
          className="relative w-full py-2 flex items-center justify-center cursor-pointer select-none"
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* 실제 내용 (여기 높이를 측정함) */}
        <div
          ref={sheetRef}
          className="px-6 pb-21 max-h-[70vh] overflow-y-auto transition-all"
        >
          {stage === "idle" && (
            <div className="space-y-3 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                산책을 시작해볼까요?
              </h3>
              <p className="text-sm text-gray-500">
                버튼을 누르면 위치 추적이 시작됩니다.
              </p>
            </div>
          )}

          {stage === "walking" && (
            <div className="text-center space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                산책중...
              </h3>

              <div className="relative w-full flex justify-center mt-1">
                <div className="flex flex-col items-center w-1/2 text-center">
                  <Clock className="w-8 h-8 text-primary" />
                  <p className="text-2xl font-extrabold text-primary mt-1">
                    {formatElapsedTime(elapsed)}
                  </p>
                </div>

                <div className="flex flex-col items-center w-1/2 text-center">
                  <Ruler className="w-8 h-8 text-primary" />
                  <p className="text-2xl font-extrabold text-primary mt-1">
                    {(distance / 1000).toFixed(2)} km
                  </p>
                </div>
              </div>

              <textarea
                placeholder="산책 메모를 작성해보세요"
                rows={4}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full bg-white border border-border rounded-lg px-4 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          )}

          {stage === "finished" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                산책 기록하기
              </h3>

              <div className="relative w-full flex justify-center mt-1">
                <div className="flex flex-col items-center w-1/2 text-center">
                  <Clock className="w-8 h-8 text-primary" />
                  <p className="text-2xl font-extrabold text-primary mt-1">
                    {formatElapsedTime(elapsed)}
                  </p>
                </div>
                <div className="flex flex-col items-center w-1/2 text-center">
                  <Ruler className="w-8 h-8 text-primary" />
                  <p className="text-2xl font-extrabold text-primary mt-1">
                    {(distance / 1000).toFixed(2)} km
                  </p>
                </div>
              </div>

              <textarea
                placeholder="메모를 수정하거나 추가해보세요"
                rows={4}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full bg-white border border-border rounded-lg px-4 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />

              <div className="space-y-3">
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (!files.length) return;
                    setPhoto([...(photo || []), ...files]);
                  }}
                  className="hidden"
                />

                <label
                  htmlFor="photoInput"
                  className="block w-full text-center py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  + 사진 추가하기
                </label>

                {photo && photo.length > 0 && (
                  <PhotoCarousel photos={photo} setPhoto={setPhoto} />
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ====== 하단 고정 버튼 ====== */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-30 px-6 py-5 bg-linear-to-t from-white via-white/80 to-transparent">
        {stage === "idle" && (
          <motion.button
            onClick={startWalk}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:max-w-[500px] flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-full shadow-lg"
          >
            <Footprints className="w-5 h-5" strokeWidth={2.5} />
            산책 시작
          </motion.button>
        )}

        {stage === "walking" && (
          <motion.button
            onClick={endWalk}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:max-w-[500px] flex items-center justify-center gap-2 bg-input text-primary border border-border font-semibold py-3 rounded-full shadow-lg"
          >
            <SquareStop className="w-5 h-5" strokeWidth={2.5} />
            산책 종료
          </motion.button>
        )}

        {stage === "finished" && (
          <motion.button
            onClick={recordWalk}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:max-w-[500px] flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-full shadow-lg"
          >
            <Save className="w-5 h-5" strokeWidth={2.5} />
            기록 저장
          </motion.button>
        )}
      </div>
    </>
  );
}
