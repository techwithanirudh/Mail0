"use client";

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

interface GridPosition {
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
  const animationRef = useRef<number | null>(null);
  const gridDimensions = useRef({ width: 0, height: 0 });
  const gridOffset = useRef<GridPosition>({ x: 0, y: 0 });
  const hoveredSquare = useRef<GridPosition | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gridDimensions.current = {
        width: Math.ceil(canvas.width / squareSize) + 1,
        height: Math.ceil(canvas.height / squareSize) + 1,
      };
    };

    const getThemeColors = () => {
      const isDark = theme === "dark";
      return {
        textColor: isDark ? "#999" : "#555",
        hoverFillColor: isDark ? "#222" : "#e0e0e0",
        hoverTextColor: isDark ? "#fff" : "#000",
        vignetteStart: isDark ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)",
        vignetteEnd: isDark ? "#060606" : "#F9F9F9",
      };
    };

    const drawSquare = (
      x: number,
      y: number,
      isHovered: boolean,
      colors: ReturnType<typeof getThemeColors>,
    ) => {
      ctx.save();

      if (isHovered) {
        ctx.fillStyle = colors.hoverFillColor;
        ctx.fillRect(x, y, squareSize, squareSize);
      }

      ctx.translate(x + squareSize / 2, y + squareSize / 2);
      ctx.rotate((textRotation * Math.PI) / 180);

      const fontSize = Math.floor(squareSize * 0.65);
      ctx.font = `${fontSize}px Pixy, monospace, sans-serif`;
      ctx.fillStyle = isHovered ? colors.hoverTextColor : colors.textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("404", 0, 0);

      ctx.restore();
    };

    const drawVignette = (colors: ReturnType<typeof getThemeColors>) => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2,
      );

      gradient.addColorStop(0, colors.vignetteStart);
      gradient.addColorStop(1, colors.vignetteEnd);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawGrid = () => {
      const colors = getThemeColors();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
        for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x - (gridOffset.current.x % squareSize);
          const squareY = y - (gridOffset.current.y % squareSize);

          const isHovered =
            hoveredSquare.current &&
            Math.floor((x - startX) / squareSize) === hoveredSquare.current.x &&
            Math.floor((y - startY) / squareSize) === hoveredSquare.current.y;

          drawSquare(squareX, squareY, isHovered ?? false, colors);
        }
      }

      drawVignette(colors);
    };

    const updateAnimation = () => {
      if (shouldReduceMotion) {
        drawGrid();
        return;
      }

      const effectiveSpeed = Math.max(speed, 0.1);

      switch (direction) {
        case "right":
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          break;
        case "left":
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
          break;
        case "up":
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
          break;
        case "down":
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
        case "diagonal":
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
          break;
      }

      drawGrid();
      animationRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      hoveredSquare.current = {
        x: Math.floor((mouseX + gridOffset.current.x - startX) / squareSize),
        y: Math.floor((mouseY + gridOffset.current.y - startY) / squareSize),
      };
    };

    const handleMouseLeave = () => {
      hoveredSquare.current = null;
    };

    resizeCanvas();
    const handleResize = () => {
      resizeCanvas();
      drawGrid();
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    if (!shouldReduceMotion) {
      animationRef.current = requestAnimationFrame(updateAnimation);
    } else {
      drawGrid();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [direction, speed, squareSize, textRotation, theme, shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="block h-full w-full"
      aria-label="Decorative animated grid background"
      role="img"
    />
  );
};

export default Marquee;
