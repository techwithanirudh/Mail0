'use client'
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import React, { useRef, useEffect } from "react";

interface GridOffset {
  x: number;
  y: number;
}

interface MarqueeProps {
  direction?: "diagonal" | "up" | "right" | "down" | "left";
  speed?: number;
  squareSize?: number;
  textRotation?: number;
}

const Marquee: React.FC<MarqueeProps> = ({
  direction = "right",
  speed = 1,
  squareSize = 40,
  textRotation = -45,
}) => {
  const { resolvedTheme: theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const numSquaresX = useRef<number>(0);
  const numSquaresY = useRef<number>(0);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
      numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const getThemeColors = () => {
      const isDark = theme === "dark";

      return {
        textColor: isDark ? "#999" : "#555",
        hoverFillColor: isDark ? "#222" : "#e0e0e0",
        hoverTextColor: isDark ? "#fff" : "#000",
        vignetteStart: isDark ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)",
        vignetteEnd: isDark ? "#060606" : "#F9F9F9"
      };
    };

    const drawGrid = () => {
      if (!ctx) return;

      const colors = getThemeColors();

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const fontSize = Math.floor(squareSize * 0.65);
      ctx.font = `${fontSize}px Pixy, monospace, sans-serif`;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          const isHovered =
            hoveredSquareRef.current &&
            Math.floor((x - startX) / squareSize) === hoveredSquareRef.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y;

          if (isHovered) {
            ctx.fillStyle = colors.hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.save();

          ctx.translate(squareX + squareSize / 2, squareY + squareSize / 2);

          ctx.rotate(textRotation * Math.PI / 180);

          ctx.fillStyle = isHovered ? colors.hoverTextColor : colors.textColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          ctx.fillText("404", 0, 0);

          ctx.restore();
        }
      }

      // Add vignette effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
      );

      gradient.addColorStop(0, colors.vignetteStart);
      gradient.addColorStop(1, colors.vignetteEnd);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      if (shouldReduceMotion) {
        drawGrid();
        requestRef.current = requestAnimationFrame(updateAnimation);
        return;
      }

      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case "right":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.current.x =
            (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.current.y =
            (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x =
            (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y =
            (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        default:
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      const hoveredSquareX = Math.floor(
        (mouseX + gridOffset.current.x - startX) / squareSize
      );
      const hoveredSquareY = Math.floor(
        (mouseY + gridOffset.current.y - startY) / squareSize
      );

      if (
        !hoveredSquareRef.current ||
        hoveredSquareRef.current.x !== hoveredSquareX ||
        hoveredSquareRef.current.y !== hoveredSquareY
      ) {
        hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
      }
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [direction, speed, squareSize, textRotation, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full border-none block"
    ></canvas>
  );
};

export default Marquee;