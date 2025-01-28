'use client';

import { useDraw } from "@/hooks/useDraw";
import React, { FC, useState, useEffect } from "react";
import { ChromePicker } from "react-color";

interface PageProps {}

const Page: FC<PageProps> = () => {
  const [color, setColor] = useState("#000000");
  const [isEraser, setIsEraser] = useState(false);
  const [eraserSize, setEraserSize] = useState(20);
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure this runs only on the client
  }, []);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = isEraser ? "#FFFFFF" : color;
    const lineWidth = isEraser ? eraserSize : 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.globalCompositeOperation = isEraser ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();
  }

  return (
    <div className="w-screen h-screen bg-white flex items-center p-6">
      <div className="flex flex-col gap-4 pr-10">
        {/* Ensure ChromePicker only renders on the client */}
        {isClient && (
          <ChromePicker
            color={color}
            onChange={(e) => setColor(e.hex)}
          />
        )}

        <button
          type="button"
          className="p-2 rounded-md bg-black text-white hover:bg-gray-700"
          onClick={clear}
        >
          Clear Canvas
        </button>

        <button
          type="button"
          className={`p-2 rounded-md ${isEraser ? 'bg-red-500' : 'bg-gray-500'} text-white`}
          onClick={() => setIsEraser(!isEraser)}
        >
          {isEraser ? "Disable Eraser" : "Enable Eraser"}
        </button>

        {isEraser && (
          <div className="flex flex-col gap-2">
            <label htmlFor="eraserSize">Eraser Size: {eraserSize}px</label>
            <input
              id="eraserSize"
              type="range"
              min="5"
              max="50"
              value={eraserSize}
              onChange={(e) => setEraserSize(parseInt(e.target.value))}
              className="cursor-pointer"
            />
          </div>
        )}
      </div>

      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-black rounded-md"
      />
    </div>
  );
};

export default Page;
