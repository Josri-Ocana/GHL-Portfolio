"use client";
import { useMotionScene } from "@/hooks/useMotionScene";
import { editorialTimeline } from "./editorialTimeline";
export function PageMotion({ children }: { children: React.ReactNode }) {
  const root = useMotionScene<HTMLDivElement>(editorialTimeline);
  return <div ref={root}>{children}</div>;
}
