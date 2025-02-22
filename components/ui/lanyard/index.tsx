"use client";
import Spline from "@splinetool/react-spline";
import { Suspense } from "react";

export default function Lanyard() {
  return (
    <Suspense fallback={<p>Loadin</p>}>
      <Spline
        scene="https://prod.spline.design/iYYVHpYLyGIvh5sX/scene.splinecode"
        style={{ width: "150%", height: "160%" }}
        className="absolute -left-1/4 -top-1/4 scale-[.5] md:scale-[.8]"
        onSplineMouseDown={() => {
          alert("Thank yall");
        }}
      />
    </Suspense>
  );
}
