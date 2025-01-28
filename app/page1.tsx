'use client';

import { useDraw } from "@/hooks/useDraw";
import React, { FC } from "react";
import { ChromePicker } from 'react-color';

interface PageProps {}

const page: FC<PageProps> = () => {
  const [color, setColor] = React.useState('#000000'); // Default line color
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = color;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  return (
    <div className="w-screen h-screen bg-white flex items-center p-6">
      {/* Sidebar for color picker and button */}
      <div className="flex flex-col gap-10 pr-10">
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <button
          type="button"
          className="p-2 rounded-md bg-black text-white hover:bg-gray-700"
          onClick={clear}
        >
          Clear Canvas
        </button>
      </div>

      {/* Canvas */}
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

export default page;
