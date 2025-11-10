// src/components/walk/BottomSheet.jsx
import { motion, animate } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  Camera,
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
  children,
}) {
  // 기본: 열린 상태
  const [isOpen, setIsOpen] = useState(true);
  const sheetRef = useRef(null);

  // ====== 레이아웃 상수 (프로젝트에 맞게 조절 가능) ======
  const BUTTON_CONTAINER_BOTTOM = 70; // 버튼 컨테이너의 bottom: [70px]
  const BUTTON_HEIGHT = 52; // 버튼 실제 높이 (rounded-full 버튼)
  const BUTTON_GAP = 12; // 버튼 위 여유 간격
  const HANDLE_VISIBLE = 36; // 닫힌 상태에서 화면에 남길 핸들 영역 높이
  const MAX_SHEET_OPEN = 600; // 너무 길면 캡 (px)

  // 실제 렌더된 시트 높이
  const [sheetHeight, setSheetHeight] = useState(360);
  // 버튼 영역 전체 높이
  const bottomGap = BUTTON_CONTAINER_BOTTOM + BUTTON_HEIGHT + BUTTON_GAP;
  // 닫힘 위치(양수로 아래로 이동)
  const closedY = Math.max(0, sheetHeight - (HANDLE_VISIBLE + bottomGap));

  // 시트 높이를 ResizeObserver로 실시간 측정
  useEffect(() => {
    if (!sheetRef.current) return;
    const el = sheetRef.current;

    const update = () => {
      // 실제 렌더 높이 측정
      const h = el.getBoundingClientRect().height;
      // 컨텐츠 추가될 때 자연스러운 오픈을 위해 캡 적용
      setSheetHeight(Math.min(Math.ceil(h), MAX_SHEET_OPEN));
    };

    update();

    // ResizeObserver로 높이 변화 추적
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, [stage, memo, distance, elapsed, isOpen]);

  // 열림/닫힘 토글
  const toggleSheet = () => {
    setIsOpen((prev) => !prev);
  };

  // 열림/닫힘 애니메이션
  useEffect(() => {
    const target = isOpen ? 0 : closedY;
    animate(
      ".bottom-sheet", // motion.div에 className으로 타겟팅
      { y: target },
      { type: "spring", stiffness: 240, damping: 28 }
    );
  }, [isOpen, closedY]);

  // 드래그 종료 시 스냅 (0 또는 closedY)
  const onDragEnd = (_e, info) => {
    const currentY = info.point.y; // 화면 좌표가 아닌 translateY가 필요 → 아래 방식 사용
  };

  // framer-motion에서 translateY 값을 직접 읽으려면 ref 대신 onUpdate 사용
  const [currentY, setCurrentY] = useState(0);

  const snapOnDragEnd = () => {
    const halfway = closedY / 2;
    const target = currentY > halfway ? closedY : 0;
    setIsOpen(target === 0);
    animate(
      ".bottom-sheet",
      { y: target },
      { type: "spring", stiffness: 260, damping: 30 }
    );
  };

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}시간 ${minutes}분 ${secs}초`;
    if (minutes > 0) return `${minutes}분 ${secs}초`;
    return `${secs}초`;
  };

  return (
    <>
      {/* ✅ 바텀시트 */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: closedY }}
        dragElastic={0.12}
        onDragEnd={snapOnDragEnd}
        onUpdate={(latest) => {
          // latest.transform.y는 제공되지 않으므로 style 속성에서 읽힘
          if (latest?.y !== undefined) setCurrentY(latest.y);
        }}
        className="bottom-sheet absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md rounded-t-3xl shadow-2xl z-20 overflow-hidden"
        style={{ y: isOpen ? 0 : closedY }}
      >
        {/* 핸들 + 토글 버튼 (항상 맨 위) */}
        <div
          onClick={toggleSheet}
          className="relative w-full py-2 flex items-center justify-center cursor-pointer select-none"
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        

        {/* 시트 콘텐츠 (실제 높이 측정 영역) */}
        <div
          ref={sheetRef}
          className="px-6 pb-40 max-h-[70vh] overflow-y-auto transition-all"
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

                {/* 시간 */}
                <div className="flex flex-col items-center w-1/2 justify-center text-center">
                  <Clock className="w-8 h-8 text-primary" />
                  <p className="text-2xl font-extrabold text-primary mt-1">
                    {formatElapsedTime(elapsed)}
                  </p>
                </div>

                {/*  거리 */}
                <div className="flex flex-col items-center w-1/2 justify-center text-center">
                  <Ruler className="w-8 h-8 text-primary" />
                  <p className="text-2xl font-extrabold text-primary mt-1">
                    {(distance / 1000).toFixed(2)} km
                  </p>
                </div>
              </div>

              <textarea
                placeholder="산책 메모를 작성해보세요 📝"
                rows={4}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full bg-white border border-border rounded-lg px-4 py-2 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {stage === "finished" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                산책 기록하기
              </h3>

              <div className="relative w-full flex justify-center mt-1">
                <div className="flex flex-col items-center w-1/2 justify-center text-center">
                  <Clock className="w-8 h-8 text-primary" />
                  <p className="text-2xl font-extrabold text-primary mt-1">
                    {formatElapsedTime(elapsed)}
                  </p>
                </div>
                <div className="flex flex-col items-center w-1/2 justify-center text-center">
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
                className="w-full border border-gray-300 rounded-lg p-3 resize-none"
              />

              {/* ✅ 사진 첨부 + 미리보기 캐러셀 */}
              <div className="space-y-3">
                {/* ✅ 파일 선택 input */}
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (!files.length) return;
                    // 기존 사진 + 새로 추가된 사진 합치기
                    const newPhotos = [...(photo || []), ...files];
                    setPhoto(newPhotos);
                  }}
                  className="hidden"
                />

                {/* ✅ 업로드 버튼 */}
                <label
                  htmlFor="photoInput"
                  className="block w-full text-center py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                >
                  + 사진 추가하기
                </label>

                {/* ✅ 캐러셀 미리보기 */}
                {photo && photo.length > 0 && (
                  <PhotoCarousel photos={photo} setPhoto={setPhoto} />
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* ✅ 하단 고정 버튼 (항상 보임) */}
      <div className="absolute bottom-[70px] left-0 w-full flex justify-center z-30 px-6 py-5 bg-linear-to-t from-white via-white/80 to-transparent">
        {stage === "idle" && (
          <motion.button
            onClick={startWalk}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:max-w-[500px] flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-full shadow-lg hover:bg-[#ff8a1e] transition"
          >
            <Footprints className="w-5 h-5" strokeWidth={2.5} />
            산책 시작
          </motion.button>
        )}

        {stage === "walking" && (
          <motion.button
            onClick={endWalk}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:max-w-[500px] flex items-center justify-center gap-2 bg-input text-primary border border-border font-semibold py-3 rounded-full shadow-lg hover:bg-secondary transition"
          >
            <SquareStop className="w-5 h-5" strokeWidth={2.5} />
            산책 종료
          </motion.button>
        )}

        {stage === "finished" && (
          <motion.button
            onClick={recordWalk}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:max-w-[500px] flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-full shadow-lg hover:bg-[#ff8a1e] transition"
          >
            <Save className="w-5 h-5" strokeWidth={2.5} />
            기록 저장
          </motion.button>
        )}
      </div>
    </>
  );
}
