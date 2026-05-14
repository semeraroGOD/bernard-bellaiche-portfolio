"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { animate, useMotionValue, type MotionValue } from "framer-motion";
import * as THREE from "three";

const ORGANIC_EASE = [0.45, 0, 0.55, 1] as const;

// =====================================================================
//  Public API
// =====================================================================
//
//  Drop GLB/GLTF files into /public/models/ and reference them by URL
//  (e.g. "/models/paint-brush.glb"). When `modelPath` is set, the file
//  is loaded via Drei's useGLTF (which handles caching and Draco). When
//  it's missing, a labeled primitive placeholder is rendered instead so
//  the placement remains visible during authoring.
//

export type FloatingModelType = "brush" | "canvas" | "palette" | "tube" | "custom";

export interface FloatingModelPlacement {
  /** Path to GLB/GLTF in /public, e.g. "/models/brush.glb". Omit to show fallback. */
  modelPath?: string;
  type: FloatingModelType;
  x: number;
  y: number;
  z: number;
  scale: number;
  rotation: [number, number, number];
  opacity?: number;
  animationDelay: number;
}

interface FloatingModelProps extends FloatingModelPlacement {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

// =====================================================================
//  GLTF content — inner renderer (must live under <Suspense>)
// =====================================================================
function GLTFContent({
  url,
  opacity = 1,
}: {
  url: string;
  opacity?: number;
}) {
  const { scene } = useGLTF(url);

  // Clone so the same GLB can be reused across instances without
  // sharing transforms, and so we can safely mutate materials for opacity.
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    if (opacity < 1) {
      c.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.material) {
          const mat = (obj.material as THREE.Material).clone() as
            | THREE.MeshStandardMaterial
            | THREE.MeshPhysicalMaterial;
          mat.transparent = true;
          mat.opacity = opacity;
          mat.depthWrite = opacity > 0.85;
          obj.material = mat;
        }
      });
    }
    return c;
  }, [scene, opacity]);

  return <primitive object={cloned} />;
}

// =====================================================================
//  Fallback — when modelPath is missing or still authoring. Each type
//  gets a distinct hint colour so empty slots remain visually identifiable.
// =====================================================================
const FALLBACK_COLOR: Record<FloatingModelType, string> = {
  brush: "#c9594b",
  canvas: "#4a5d7e",
  palette: "#d6a956",
  tube: "#7d8c5c",
  custom: "#b88aa6",
};

function ModelPlaceholder({
  type,
  opacity = 1,
}: {
  type: FloatingModelType;
  opacity?: number;
}) {
  const color = FALLBACK_COLOR[type];
  return (
    <mesh>
      <icosahedronGeometry args={[0.7, 1]} />
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        metalness={0.15}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity > 0.85}
      />
    </mesh>
  );
}

// =====================================================================
//  FloatingModel — reusable wrapper. Same float/spin/parallax pattern
//  as the procedural FloatingArtObject so motion is consistent.
// =====================================================================
function FloatingModel(props: FloatingModelProps) {
  const {
    x,
    y,
    z,
    scale,
    rotation,
    opacity = 0.95,
    animationDelay,
    modelPath,
    type,
    mouseX,
    mouseY,
  } = props;

  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);

  const floatY = useMotionValue(0);
  const spinX = useMotionValue(rotation[0]);
  const spinY = useMotionValue(rotation[1]);
  const spinZ = useMotionValue(rotation[2]);

  useEffect(() => {
    const f = animate(floatY, [0, 0.35, 0, -0.35, 0], {
      duration: 15 + (animationDelay % 6),
      ease: [...ORGANIC_EASE],
      repeat: Infinity,
      repeatType: "loop",
      delay: -animationDelay,
    });
    const sX = animate(
      spinX,
      [rotation[0], rotation[0] + 0.12, rotation[0], rotation[0] - 0.12, rotation[0]],
      {
        duration: 24 + (animationDelay % 8),
        ease: [...ORGANIC_EASE],
        repeat: Infinity,
        repeatType: "loop",
        delay: -animationDelay * 0.7,
      }
    );
    const sY = animate(
      spinY,
      [rotation[1], rotation[1] + 0.2, rotation[1], rotation[1] - 0.2, rotation[1]],
      {
        duration: 28 + (animationDelay % 10),
        ease: [...ORGANIC_EASE],
        repeat: Infinity,
        repeatType: "loop",
        delay: -animationDelay,
      }
    );
    const sZ = animate(
      spinZ,
      [rotation[2], rotation[2] + 0.08, rotation[2], rotation[2] - 0.08, rotation[2]],
      {
        duration: 32 + (animationDelay % 7),
        ease: [...ORGANIC_EASE],
        repeat: Infinity,
        repeatType: "loop",
        delay: -animationDelay * 0.5,
      }
    );
    return () => {
      f.stop();
      sX.stop();
      sY.stop();
      sZ.stop();
    };
  }, [floatY, spinX, spinY, spinZ, animationDelay, rotation]);

  const parallaxFactor = Math.max(0.4, 1 - Math.abs(z) / 90);

  useFrame(() => {
    if (!groupRef.current || !innerRef.current) return;
    const mx = mouseX?.get() ?? 0;
    const my = mouseY?.get() ?? 0;

    groupRef.current.position.set(
      x + mx * 0.7 * parallaxFactor,
      y + floatY.get() - my * 0.45 * parallaxFactor,
      z
    );
    innerRef.current.rotation.set(spinX.get(), spinY.get(), spinZ.get());
  });

  return (
    <group ref={groupRef} position={[x, y, z]} scale={scale}>
      <group ref={innerRef}>
        <Suspense fallback={<ModelPlaceholder type={type} opacity={opacity} />}>
          {modelPath ? (
            <GLTFContent url={modelPath} opacity={opacity} />
          ) : (
            <ModelPlaceholder type={type} opacity={opacity} />
          )}
        </Suspense>
      </group>
    </group>
  );
}

// =====================================================================
//  Placements — one placeholder per breakpoint. Drop a GLB into
//  /public/models/ and add `modelPath: "/models/your-file.glb"` to any
//  entry to swap the primitive for the loaded asset.
// =====================================================================
const DESKTOP_MODELS: FloatingModelPlacement[] = [
  // Right-side placeholder, off-mid, partially in view
  {
    type: "brush",
    x: 36,
    y: 26,
    z: -42,
    scale: 3.6,
    rotation: [0.3, 0.5, -0.3],
    opacity: 0.95,
    animationDelay: 0.7,
    // modelPath: "/models/paint-brush.glb",
  },
];

const MOBILE_MODELS: FloatingModelPlacement[] = [
  // Right side, easily noticeable but doesn't crowd the centre
  {
    type: "brush",
    x: 7,
    y: 26,
    z: -24,
    scale: 2.6,
    rotation: [0.3, 0.5, -0.3],
    opacity: 0.95,
    animationDelay: 0.7,
    // modelPath: "/models/paint-brush.glb",
  },
];

function useModelPlacements(): FloatingModelPlacement[] {
  const [list, setList] = useState<FloatingModelPlacement[]>(DESKTOP_MODELS);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setList(mq.matches ? MOBILE_MODELS : DESKTOP_MODELS);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return list;
}

// =====================================================================
//  Main exported component
// =====================================================================
export interface FloatingModelsProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export default function FloatingModels({
  mouseX,
  mouseY,
}: FloatingModelsProps) {
  const placements = useModelPlacements();

  // Preload every distinct modelPath so first paint isn't blocked by
  // network roundtrips. Re-runs whenever the placement list changes.
  useEffect(() => {
    const paths = Array.from(
      new Set(placements.map((p) => p.modelPath).filter(Boolean) as string[])
    );
    paths.forEach((p) => useGLTF.preload(p));
  }, [placements]);

  return (
    <>
      {placements.map((p, i) => (
        <FloatingModel
          key={`${p.type}-${i}-${p.modelPath ?? "ph"}`}
          {...p}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </>
  );
}
