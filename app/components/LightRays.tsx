"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import * as THREE from "three";

const ORGANIC_EASE = [0.45, 0, 0.55, 1] as const;

// Sun anchor (matches Atmosphere.tsx SunGlow)
const SUN_X = 14;
const SUN_BASE_Y_OFFSET = 8;
const SUN_Z = -158;

/**
 * Soft elongated beam — tall radial gradient that gives the
 * impression of light cutting through atmospheric dust.
 */
function makeRayTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Horizontal gradient: bright central spine, soft edges
  const gradH = ctx.createLinearGradient(0, 0, 128, 0);
  gradH.addColorStop(0, "rgba(255, 240, 210, 0)");
  gradH.addColorStop(0.5, "rgba(255, 246, 222, 1)");
  gradH.addColorStop(1, "rgba(255, 240, 210, 0)");
  ctx.fillStyle = gradH;
  ctx.fillRect(0, 0, 128, 1024);

  // Vertical taper applied as a mask
  const gradV = ctx.createLinearGradient(0, 0, 0, 1024);
  gradV.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradV.addColorStop(0.18, "rgba(0, 0, 0, 0.55)");
  gradV.addColorStop(0.5, "rgba(0, 0, 0, 1)");
  gradV.addColorStop(0.82, "rgba(0, 0, 0, 0.55)");
  gradV.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillStyle = gradV;
  ctx.fillRect(0, 0, 128, 1024);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

interface RayProps {
  baseAngle: number;
  width: number;
  height: number;
  opacity: number;
  driftDuration: number;
  driftAmplitude: number;
  seed: number;
  texture: THREE.Texture;
}

function Ray({
  baseAngle,
  width,
  height,
  opacity,
  driftDuration,
  driftAmplitude,
  seed,
  texture,
}: RayProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = useMotionValue(baseAngle);

  useEffect(() => {
    const ctrl = animate(
      angle,
      [
        baseAngle,
        baseAngle + driftAmplitude,
        baseAngle,
        baseAngle - driftAmplitude,
        baseAngle,
      ],
      {
        duration: driftDuration,
        ease: [...ORGANIC_EASE],
        repeat: Infinity,
        repeatType: "loop",
        delay: -seed * driftDuration,
      }
    );
    return () => ctrl.stop();
  }, [angle, baseAngle, driftAmplitude, driftDuration, seed]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = angle.get();
    // Anchor near sun, follow camera vertically
    meshRef.current.position.set(
      SUN_X,
      state.camera.position.y + SUN_BASE_Y_OFFSET,
      SUN_Z
    );
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * 3 soft beams of light emanating from the sun area. Very low opacity,
 * slow continuous angular drift via Framer Motion. Designed to be
 * almost subliminal — felt as atmospheric warmth, not seen as rays.
 */
export default function LightRays() {
  const texture = useMemo(() => makeRayTexture(), []);

  const rays: Omit<RayProps, "texture">[] = [
    {
      baseAngle: -0.18,
      width: 26,
      height: 200,
      opacity: 0.055,
      driftDuration: 28,
      driftAmplitude: 0.05,
      seed: 0.21,
    },
    {
      baseAngle: 0.07,
      width: 20,
      height: 220,
      opacity: 0.04,
      driftDuration: 36,
      driftAmplitude: 0.04,
      seed: 0.57,
    },
    {
      baseAngle: 0.28,
      width: 22,
      height: 190,
      opacity: 0.045,
      driftDuration: 32,
      driftAmplitude: 0.06,
      seed: 0.83,
    },
  ];

  return (
    <>
      {rays.map((r, i) => (
        <Ray key={i} {...r} texture={texture} />
      ))}
    </>
  );
}
