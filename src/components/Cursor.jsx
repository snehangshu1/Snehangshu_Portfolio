import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import { isTouchDevice } from "../hooks/useMobile";

const Cursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Skip cursor entirely on touch devices — no RAF loop, no listeners
    if (isTouchDevice()) return;

    let hover = false;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    const onMouseDown = () => {
      cursor.classList.add("cursor-clicking");
    };

    const onMouseUp = () => {
      cursor.classList.remove("cursor-clicking");
    };

    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    let animationFrameId;
    const loop = () => {
      if (!hover) {
        const delay = 6;
        cursorPos.x += (mousePos.x - cursorPos.x) / delay;
        cursorPos.y += (mousePos.y - cursorPos.y) / delay;
        cursor.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    const onMouseOver = (e) => {
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();

      if (target.dataset.cursor === "icons") {
        cursor.classList.add("cursor-icons");
        cursor.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        hover = true;
      }
      if (target.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };

    const onMouseOut = () => {
      cursor.classList.remove("cursor-disable", "cursor-icons");
      hover = false;
    };

    const items = document.querySelectorAll("[data-cursor]");
    items.forEach((item) => {
      item.addEventListener("mouseover", onMouseOver);
      item.addEventListener("mouseout", onMouseOut);
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      cancelAnimationFrame(animationFrameId);
      items.forEach((item) => {
        item.removeEventListener("mouseover", onMouseOver);
        item.removeEventListener("mouseout", onMouseOut);
      });
    };
  }, []);

  // Return null on touch devices — no invisible cursor element in DOM
  if (isTouchDevice()) return null;

  return (
    <div className="cursor-main" ref={cursorRef}>
      <div className="cursor-inner"></div>
    </div>
  );
};

export default Cursor;
