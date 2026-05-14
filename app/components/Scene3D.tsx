"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useMotionValue, type MotionValue } from "framer-motion";
import * as THREE from "three";
import Sky from "./Sky";
import CloudLayer from "./CloudLayer";
import Atmosphere from "./Atmosphere";
import Particles from "./Particles";
import LightRays from "./LightRays";
import FloatingArtObjects from "./FloatingArtObjects";
import FloatingModels from "./FloatingModels";
import { jsNoise3D } from "./shaders/noise";

// Total vertical world distance the camera travels from scroll=0 → scroll=1
const SCROLL_WORLD_TRAVEL = 200;

// Deterministic pseudo-random seeded by integer seed
function seededRand(seed: number, n: number): number {
  const s = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// Organic easeInOut for floating loops — feels like breath
const ORGANIC_EASE = [0.45, 0, 0.55, 1] as const;

// =====================================================================
//  Cloud3D — identical visual design, opacity now configurable per cloud
// =====================================================================
interface CloudProps {
  basePos: [number, number, number];
  scale: number;
  opacity: number;
  driftDuration: number; // seconds for one full drift cycle
  driftAmplitudeX: number;
  driftAmplitudeY: number;
  seed: number;
}

function Cloud3D({
  basePos,
  scale,
  opacity,
  driftDuration,
  driftAmplitudeX,
  driftAmplitudeY,
  seed,
}: CloudProps) {
  const group = useRef<THREE.Group>(null);

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  const puffs = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const radius = 1.6 + seededRand(seed, i * 3 + 10) * 2.8;
      const pos: [number, number, number] = [
        (seededRand(seed, i * 3) - 0.5) * 7,
        (seededRand(seed, i * 3 + 1) - 0.5) * 1.4,
        (seededRand(seed, i * 3 + 2) - 0.5) * 3,
      ];

      const geo = new THREE.SphereGeometry(radius, 16, 12);
      const positions = geo.attributes.position;
      const puffSeed = seed * 17.3 + i * 4.1;

      for (let v = 0; v < positions.count; v++) {
        const px = positions.getX(v);
        const py = positions.getY(v);
        const pz = positions.getZ(v);

        const n = jsNoise3D(px * 0.55, py * 0.55, pz * 0.55, puffSeed);
        const factor = 1.0 + n * 0.22;

        positions.setXYZ(v, px * factor, py * factor, pz * factor);
      }
      geo.computeVertexNormals();

      return { pos, geometry: geo };
    });
  }, [seed]);

  useEffect(() => {
    return () => {
      puffs.forEach((p) => p.geometry.dispose());
    };
  }, [puffs]);

  useEffect(() => {
    const phaseX = seededRand(seed, 7) * driftDuration;
    const phaseY = seededRand(seed, 13) * driftDuration * 1.3;

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
        duration: driftDuration * 1.45,
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

  useFrame(() => {
    if (!group.current) return;
    group.current.position.x = basePos[0] + offsetX.get();
    group.current.position.y = basePos[1] + offsetY.get();
  });

  return (
    <group ref={group} position={basePos} scale={scale}>
      {puffs.map((puff, i) => (
        <mesh
          key={i}
          position={puff.pos}
          scale={[1, 0.62, 1]}
          geometry={puff.geometry}
        >
          <meshStandardMaterial
            color="#f6faff"
            transparent
            opacity={opacity}
            depthWrite={false}
            roughness={1}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

// =====================================================================
//  CameraRig — travels SCROLL_WORLD_TRAVEL units vertically over the scroll
// =====================================================================
interface CameraRigProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scroll: MotionValue<number>;
}

function CameraRig({ mouseX, mouseY, scroll }: CameraRigProps) {
  const { camera } = useThree();
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, -30), []);

  // Cinematic breath — independent of mouse/scroll. Three desynced loops
  // on X / Y / Z create a faint floating sensation. Amplitudes deliberately
  // tiny so the effect lives below conscious perception.
  const breathX = useMotionValue(0);
  const breathY = useMotionValue(0);
  const breathZ = useMotionValue(0);

  useEffect(() => {
    const cx = animate(breathX, [0, 0.55, 0, -0.55, 0], {
      duration: 19,
      ease: [...ORGANIC_EASE],
      repeat: Infinity,
      repeatType: "loop",
    });
    const cy = animate(breathY, [0, 0.4, 0, -0.4, 0], {
      duration: 13,
      ease: [...ORGANIC_EASE],
      repeat: Infinity,
      repeatType: "loop",
    });
    const cz = animate(breathZ, [0, 0.85, 0, -0.5, 0], {
      duration: 24,
      ease: [...ORGANIC_EASE],
      repeat: Infinity,
      repeatType: "loop",
    });
    return () => {
      cx.stop();
      cy.stop();
      cz.stop();
    };
  }, [breathX, breathY, breathZ]);

  useFrame(() => {
    if (!mouseX || !mouseY || !scroll || !camera) return;
    const mx = mouseX.get();
    const my = mouseY.get();
    const sp = scroll.get();

    const bx = breathX.get();
    const by = breathY.get();
    const bz = breathZ.get();

    camera.position.x = mx * 3.5 + bx;
    camera.position.y = -my * 2 + sp * SCROLL_WORLD_TRAVEL + by;
    camera.position.z = bz;

    // Look slightly toward the breath-z so the parallax feels alive
    lookTarget.set(
      mx * 0.6 + bx * 0.3,
      camera.position.y - my * 0.6 + by * 0.4,
      -30 + bz * 0.4
    );
    camera.lookAt(lookTarget);
  });

  return null;
}

// =====================================================================
//  Cloud distribution
// =====================================================================
//
//  Y is the world-vertical axis. The camera travels from Y≈0 → Y≈200
//  as the user scrolls. Clouds spread across that full range with
//  generous negative space between them. X & Z & scale all vary, no
//  obvious grid, no repeated pattern.
//
//  Some clouds sit at X ≥ ±55 → partially off-screen edges.
//  Z varies from -42 (close) → -135 (distant horizon layer).
//

const DESKTOP_CLOUDS: CloudProps[] = [
  // Opening view — clouds at the entrance "sea-level"
  { basePos: [-34, -10, -54], scale: 1.4, opacity: 0.62, driftDuration: 48, driftAmplitudeX: 2.4, driftAmplitudeY: 0.5, seed: 1 },
  { basePos: [42, -4, -72], scale: 1.7, opacity: 0.56, driftDuration: 56, driftAmplitudeX: 2.7, driftAmplitudeY: 0.6, seed: 2 },
  { basePos: [-58, 4, -98], scale: 2.5, opacity: 0.5, driftDuration: 78, driftAmplitudeX: 3.5, driftAmplitudeY: 0.75, seed: 3 },

  // Low altitude (y 18-32)
  { basePos: [10, 22, -45], scale: 1.0, opacity: 0.68, driftDuration: 38, driftAmplitudeX: 1.9, driftAmplitudeY: 0.45, seed: 4 },
  { basePos: [-22, 30, -82], scale: 2.1, opacity: 0.55, driftDuration: 66, driftAmplitudeX: 3.1, driftAmplitudeY: 0.65, seed: 5 },

  // Mid (y 44-58) — note the wide X spread and varied Z
  { basePos: [52, 46, -58], scale: 1.5, opacity: 0.6, driftDuration: 54, driftAmplitudeX: 2.6, driftAmplitudeY: 0.6, seed: 6 },
  { basePos: [-46, 54, -118], scale: 2.9, opacity: 0.46, driftDuration: 92, driftAmplitudeX: 4.2, driftAmplitudeY: 0.85, seed: 7 },

  // Mid-high (y 68-86)
  { basePos: [-14, 70, -48], scale: 1.2, opacity: 0.66, driftDuration: 44, driftAmplitudeX: 2.2, driftAmplitudeY: 0.5, seed: 8 },
  { basePos: [30, 80, -78], scale: 1.9, opacity: 0.58, driftDuration: 70, driftAmplitudeX: 3.2, driftAmplitudeY: 0.7, seed: 9 },
  { basePos: [60, 86, -135], scale: 3.4, opacity: 0.4, driftDuration: 100, driftAmplitudeX: 4.8, driftAmplitudeY: 0.95, seed: 10 },

  // High (y 96-114)
  { basePos: [-50, 100, -64], scale: 1.6, opacity: 0.62, driftDuration: 60, driftAmplitudeX: 2.8, driftAmplitudeY: 0.6, seed: 11 },
  { basePos: [18, 112, -96], scale: 2.3, opacity: 0.52, driftDuration: 82, driftAmplitudeX: 3.6, driftAmplitudeY: 0.8, seed: 12 },

  // Higher (y 124-148)
  { basePos: [-24, 130, -52], scale: 1.3, opacity: 0.66, driftDuration: 50, driftAmplitudeX: 2.3, driftAmplitudeY: 0.55, seed: 13 },
  { basePos: [46, 142, -88], scale: 2.1, opacity: 0.56, driftDuration: 72, driftAmplitudeX: 3.3, driftAmplitudeY: 0.75, seed: 14 },
  { basePos: [-55, 148, -125], scale: 3.1, opacity: 0.44, driftDuration: 94, driftAmplitudeX: 4.4, driftAmplitudeY: 0.9, seed: 15 },

  // Very high (y 158-178)
  { basePos: [8, 160, -68], scale: 1.7, opacity: 0.62, driftDuration: 64, driftAmplitudeX: 3.0, driftAmplitudeY: 0.7, seed: 16 },
  { basePos: [-35, 176, -100], scale: 2.5, opacity: 0.52, driftDuration: 86, driftAmplitudeX: 3.8, driftAmplitudeY: 0.85, seed: 17 },

  // Closing view (y 188-208)
  { basePos: [28, 190, -58], scale: 1.5, opacity: 0.6, driftDuration: 56, driftAmplitudeX: 2.6, driftAmplitudeY: 0.6, seed: 18 },
  { basePos: [-12, 202, -92], scale: 2.2, opacity: 0.5, driftDuration: 78, driftAmplitudeX: 3.5, driftAmplitudeY: 0.8, seed: 19 },
];

// Mobile — fewer clouds, smaller |X|, larger vertical spacing for breathing
const MOBILE_CLOUDS: CloudProps[] = [
  { basePos: [-18, -8, -48], scale: 1.3, opacity: 0.62, driftDuration: 46, driftAmplitudeX: 1.6, driftAmplitudeY: 0.5, seed: 1 },
  { basePos: [22, 10, -70], scale: 1.7, opacity: 0.55, driftDuration: 60, driftAmplitudeX: 2.0, driftAmplitudeY: 0.6, seed: 3 },
  { basePos: [-26, 32, -58], scale: 1.4, opacity: 0.6, driftDuration: 50, driftAmplitudeX: 1.7, driftAmplitudeY: 0.5, seed: 5 },
  { basePos: [16, 56, -82], scale: 1.9, opacity: 0.5, driftDuration: 70, driftAmplitudeX: 2.2, driftAmplitudeY: 0.65, seed: 7 },
  { basePos: [-14, 82, -52], scale: 1.3, opacity: 0.62, driftDuration: 48, driftAmplitudeX: 1.7, driftAmplitudeY: 0.55, seed: 9 },
  { basePos: [24, 108, -88], scale: 2.0, opacity: 0.5, driftDuration: 74, driftAmplitudeX: 2.3, driftAmplitudeY: 0.7, seed: 11 },
  { basePos: [-22, 138, -62], scale: 1.5, opacity: 0.6, driftDuration: 56, driftAmplitudeX: 1.9, driftAmplitudeY: 0.6, seed: 13 },
  { basePos: [20, 168, -76], scale: 1.7, opacity: 0.56, driftDuration: 66, driftAmplitudeX: 2.0, driftAmplitudeY: 0.65, seed: 15 },
  { basePos: [-16, 198, -58], scale: 1.4, opacity: 0.6, driftDuration: 54, driftAmplitudeX: 1.8, driftAmplitudeY: 0.55, seed: 17 },
];

// =====================================================================
//  Responsive selector
// =====================================================================
function useCloudPlacements(): CloudProps[] {
  const [clouds, setClouds] = useState<CloudProps[]>(DESKTOP_CLOUDS);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setClouds(mq.matches ? MOBILE_CLOUDS : DESKTOP_CLOUDS);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return clouds;
}

// =====================================================================
//  Scene3D
// =====================================================================
export interface Scene3DProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scroll: MotionValue<number>;
}

function Clouds() {
  const clouds = useCloudPlacements();
  return (
    <>
      {clouds.map((cloud, i) => (
        <Cloud3D key={`${cloud.seed}-${i}`} {...cloud} />
      ))}
    </>
  );
}

export default function Scene3D({ mouseX, mouseY, scroll }: Scene3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 0], fov: 60, near: 0.1, far: 800 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Slightly tighter fog — adds layered depth without flattening clouds */}
      <fog attach="fog" args={["#5aa6dc", 55, 250]} />

      <ambientLight color="#a8d4f5" intensity={2.5} />
      <directionalLight position={[20, 40, 10]} intensity={3.5} color="#fff8e8" />
      <directionalLight position={[-15, 10, 5]} intensity={0.8} color="#c5e3ff" />

      <CameraRig mouseX={mouseX} mouseY={mouseY} scroll={scroll} />

      <Sky />

      <Clouds />

      {/* Floating painter's objects — sky-gallery world */}
      <FloatingArtObjects mouseX={mouseX} mouseY={mouseY} />

      {/* GLB/GLTF-loaded painter objects (drop files into /public/models/) */}
      <FloatingModels mouseX={mouseX} mouseY={mouseY} />

      {/* Distant atmospheric dust */}
      <Particles />

      {/* Soft beams of light near the sun */}
      <LightRays />

      <CloudLayer />

      <Atmosphere />
    </Canvas>
  );
}
