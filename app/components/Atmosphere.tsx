"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import * as THREE from "three";
import { EffectComposer, Vignette, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

const ORGANIC_EASE = [0.45, 0, 0.55, 1] as const;

/**
 * Warm radial glow texture for the horizon sun.
 */
function makeSunGlowTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255, 240, 200, 1)");
  g.addColorStop(0.2, "rgba(255, 225, 170, 0.5)");
  g.addColorStop(0.5, "rgba(255, 210, 160, 0.15)");
  g.addColorStop(1, "rgba(255, 200, 140, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

/**
 * Sun glow with a slow Framer Motion–driven breathing (opacity + scale).
 */
function SunGlow() {
  const texture = useMemo(() => makeSunGlowTexture(), []);

  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const opacity = useMotionValue(0.45);
  const scale = useMotionValue(1);

  useEffect(() => {
    const oCtrl = animate(opacity, [0.45, 0.62, 0.45], {
      duration: 9,
      ease: [...ORGANIC_EASE],
      repeat: Infinity,
      repeatType: "loop",
    });
    const sCtrl = animate(scale, [1, 1.06, 1], {
      duration: 11,
      ease: [...ORGANIC_EASE],
      repeat: Infinity,
      repeatType: "loop",
    });
    return () => {
      oCtrl.stop();
      sCtrl.stop();
    };
  }, [opacity, scale]);

  // Lock sun to camera Y so it always sits on the horizon during scroll.
  // Slight offset gives a "down at horizon line" feel.
  const SUN_BASE_Y_OFFSET = 8;
  const SUN_X = 14;
  const SUN_Z = -160;

  useFrame((state) => {
    if (materialRef.current) materialRef.current.opacity = opacity.get();
    if (meshRef.current) {
      const s = scale.get();
      meshRef.current.scale.setScalar(s);
      meshRef.current.position.set(
        SUN_X,
        state.camera.position.y + SUN_BASE_Y_OFFSET,
        SUN_Z
      );
    }
  });

  return (
    <mesh ref={meshRef} position={[SUN_X, SUN_BASE_Y_OFFSET, SUN_Z]}>
      <planeGeometry args={[120, 120]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * R3F atmosphere — fog (in Scene3D) + breathing sun glow + cinematic post-processing.
 */
export default function Atmosphere() {
  return (
    <>
      <SunGlow />

      <EffectComposer multisampling={0}>
        {/* Subtle bloom — lifts highlights without going flashy */}
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.62}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
        <Vignette
          offset={0.28}
          darkness={0.58}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}
