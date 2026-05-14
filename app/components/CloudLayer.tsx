"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { animate, useMotionValue } from "framer-motion";
import * as THREE from "three";

const ORGANIC_EASE = [0.45, 0, 0.55, 1] as const;

/**
 * Soft canvas-generated radial gradient texture shared across all wisps.
 */
function makeWispTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255, 255, 255, 1.0)");
  g.addColorStop(0.25, "rgba(248, 252, 255, 0.7)");
  g.addColorStop(0.55, "rgba(220, 235, 255, 0.25)");
  g.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

interface WispProps {
  position: [number, number, number];
  scaleX: number;
  scaleY: number;
  opacity: number;
  driftDuration: number;
  driftAmplitudeX: number;
  driftAmplitudeY: number;
  seed: number;
  texture: THREE.Texture;
}

function Wisp({
  position,
  scaleX,
  scaleY,
  opacity,
  driftDuration,
  driftAmplitudeX,
  driftAmplitudeY,
  seed,
  texture,
}: WispProps) {
  const ref = useRef<THREE.Group>(null);

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  useEffect(() => {
    // Phase offsets keep wisps desynchronised
    const phaseX = (Math.sin(seed * 12.9) * 0.5 + 0.5) * driftDuration;
    const phaseY = (Math.sin(seed * 7.7) * 0.5 + 0.5) * driftDuration * 1.3;

    const xCtrl = animate(
      offsetX,
      [0, driftAmplitudeX, 0, -driftAmplitudeX, 0],
      {
        duration: driftDuration,
        ease: [...ORGANIC_EASE],
        repeat: Infinity,
        repeatType: "loop",
        delay: -phaseX,
      }
    );
    const yCtrl = animate(
      offsetY,
      [0, driftAmplitudeY, 0, -driftAmplitudeY, 0],
      {
        duration: driftDuration * 1.3,
        ease: [...ORGANIC_EASE],
        repeat: Infinity,
        repeatType: "loop",
        delay: -phaseY,
      }
    );

    return () => {
      xCtrl.stop();
      yCtrl.stop();
    };
  }, [offsetX, offsetY, driftDuration, driftAmplitudeX, driftAmplitudeY, seed]);

  // Track camera Y so foreground wisps remain present throughout the
  // long vertical scroll (otherwise they'd vanish past scroll≈0.05)
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = position[0] + offsetX.get();
    ref.current.position.y =
      position[1] + offsetY.get() + state.camera.position.y;
  });

  return (
    <group ref={ref} position={position}>
      <Billboard>
        <mesh>
          <planeGeometry args={[scaleX, scaleY]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={opacity}
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </mesh>
      </Billboard>
    </group>
  );
}

/**
 * Foreground soft wisps — close to camera, drift driven by Framer Motion.
 */
export default function CloudLayer() {
  const texture = useMemo(() => makeWispTexture(), []);

  const wisps: Omit<WispProps, "texture">[] = [
    {
      position: [-7, 3, -9],
      scaleX: 18,
      scaleY: 7,
      opacity: 0.18,
      driftDuration: 26,
      driftAmplitudeX: 0.8,
      driftAmplitudeY: 0.4,
      seed: 1.1,
    },
    {
      position: [6, -4, -11],
      scaleX: 16,
      scaleY: 6,
      opacity: 0.14,
      driftDuration: 32,
      driftAmplitudeX: 0.9,
      driftAmplitudeY: 0.45,
      seed: 2.7,
    },
    {
      position: [-4, -7, -8],
      scaleX: 20,
      scaleY: 8,
      opacity: 0.12,
      driftDuration: 38,
      driftAmplitudeX: 1.0,
      driftAmplitudeY: 0.5,
      seed: 4.2,
    },
    {
      position: [9, 5, -12],
      scaleX: 15,
      scaleY: 6,
      opacity: 0.11,
      driftDuration: 30,
      driftAmplitudeX: 0.85,
      driftAmplitudeY: 0.4,
      seed: 5.9,
    },
    {
      position: [0, -10, -14],
      scaleX: 24,
      scaleY: 9,
      opacity: 0.09,
      driftDuration: 44,
      driftAmplitudeX: 1.2,
      driftAmplitudeY: 0.55,
      seed: 0.3,
    },
  ];

  return (
    <>
      {wisps.map((w, i) => (
        <Wisp key={i} {...w} texture={texture} />
      ))}
    </>
  );
}
