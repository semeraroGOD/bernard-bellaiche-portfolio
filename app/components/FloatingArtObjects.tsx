"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { animate, useMotionValue, type MotionValue } from "framer-motion";
import * as THREE from "three";
import { jsNoise3D } from "./shaders/noise";

const ORGANIC_EASE = [0.45, 0, 0.55, 1] as const;

// =====================================================================
//  Material palette — premium clay / glass / polished feel
// =====================================================================
const MATERIALS = {
  wood: { color: "#6b4225", roughness: 0.65, metalness: 0.05 },
  walnut: { color: "#4e2f1c", roughness: 0.7, metalness: 0.05 },
  brushedSteel: { color: "#b8b8b8", roughness: 0.32, metalness: 0.85 },
  cream: { color: "#f0e6d2", roughness: 0.85, metalness: 0 },
  bristle: { color: "#e8dcc8", roughness: 0.78, metalness: 0 },
};

// Soft accent palette — muted painterly tones with controlled chroma
const ACCENTS = [
  "#c9594b", // vermillion
  "#4a5d7e", // navy
  "#d6a956", // ochre
  "#7d8c5c", // sap green
  "#b88aa6", // mauve
  "#e8b8a3", // dusty peach
  "#c2cfd9", // cool grey
  "#8a6a92", // dusty violet
];

const TUBE_BODY = [
  "#cf7373",
  "#7a8c9e",
  "#c4a868",
  "#8a9b78",
  "#a48ba0",
];

// =====================================================================
//  Sub-geometries — each one is a small <group> of primitives
// =====================================================================

function PaintBrush({ accent }: { accent: string }) {
  return (
    <group>
      {/* Handle — long tapered cylinder */}
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[0.11, 0.16, 1.5, 16]} />
        <meshStandardMaterial {...MATERIALS.wood} />
      </mesh>
      {/* Ferrule */}
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.18, 0.16, 0.26, 16]} />
        <meshStandardMaterial {...MATERIALS.brushedSteel} />
      </mesh>
      {/* Bristles base */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.17, 0.13, 0.28, 14]} />
        <meshStandardMaterial {...MATERIALS.bristle} />
      </mesh>
      {/* Paint-loaded tip */}
      <mesh position={[0, 0.7, 0]}>
        <coneGeometry args={[0.13, 0.22, 14]} />
        <meshStandardMaterial color={accent} roughness={0.45} metalness={0.05} />
      </mesh>
    </group>
  );
}

function PaintTube({ color }: { color: string }) {
  return (
    <group>
      {/* Body — cylinder rotated horizontal */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 1.4, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.42}
          metalness={0.12}
        />
      </mesh>
      {/* Crimped bottom — flattened cone */}
      <mesh position={[-0.78, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.18, 24]} />
        <meshStandardMaterial color={color} roughness={0.45} />
      </mesh>
      {/* Neck */}
      <mesh position={[0.78, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.18, 0.18, 16]} />
        <meshStandardMaterial {...MATERIALS.brushedSteel} />
      </mesh>
      {/* Cap */}
      <mesh position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.22, 16]} />
        <meshStandardMaterial color="#3a3a3a" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}

function CanvasFrame({ paintColor }: { paintColor: string }) {
  return (
    <group>
      {/* Outer wood frame */}
      <mesh>
        <boxGeometry args={[1.45, 1.05, 0.1]} />
        <meshStandardMaterial {...MATERIALS.walnut} />
      </mesh>
      {/* Canvas surface */}
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[1.18, 0.82, 0.02]} />
        <meshStandardMaterial {...MATERIALS.cream} />
      </mesh>
      {/* Painted stroke on canvas */}
      <mesh position={[-0.05, 0.08, 0.075]} scale={[0.7, 0.45, 0.05]}>
        <sphereGeometry args={[0.5, 16, 10]} />
        <meshStandardMaterial color={paintColor} roughness={0.55} />
      </mesh>
      {/* Secondary smaller dab */}
      <mesh position={[0.28, -0.18, 0.075]} scale={[0.25, 0.18, 0.05]}>
        <sphereGeometry args={[0.5, 12, 8]} />
        <meshStandardMaterial color="#c2cfd9" roughness={0.55} />
      </mesh>
    </group>
  );
}

function ColorPalette() {
  const dabs: { pos: [number, number, number]; color: string; scale: number }[] = [
    { pos: [-0.42, 0.06, 0.18], color: ACCENTS[0], scale: 0.13 },
    { pos: [-0.18, 0.06, 0.32], color: ACCENTS[2], scale: 0.11 },
    { pos: [0.15, 0.06, 0.28], color: ACCENTS[3], scale: 0.12 },
    { pos: [0.4, 0.06, 0.05], color: ACCENTS[1], scale: 0.13 },
    { pos: [0.3, 0.06, -0.25], color: ACCENTS[4], scale: 0.1 },
    { pos: [-0.05, 0.06, -0.32], color: ACCENTS[7], scale: 0.11 },
  ];
  return (
    <group>
      {/* Kidney-shaped palette base — slightly squashed disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.78, 1]}>
        <cylinderGeometry args={[0.78, 0.78, 0.07, 32]} />
        <meshStandardMaterial color="#d4b896" roughness={0.55} metalness={0.05} />
      </mesh>
      {/* Paint dabs */}
      {dabs.map((d, i) => (
        <mesh key={i} position={d.pos} scale={d.scale}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color={d.color} roughness={0.4} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

function PaintStroke({ color, seed }: { color: string; seed: number }) {
  const geometry = useMemo(() => {
    // Curved ribbon path — varied per seed
    const offset = (seed % 1) * 0.5;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.0, -0.1 + offset * 0.3, 0),
      new THREE.Vector3(-0.4, 0.3 - offset * 0.2, 0.15),
      new THREE.Vector3(0.2, -0.25 + offset * 0.4, -0.1),
      new THREE.Vector3(0.9, 0.15 - offset * 0.3, 0.1),
    ]);
    return new THREE.TubeGeometry(curve, 36, 0.13, 10, false);
  }, [seed]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.05} />
    </mesh>
  );
}

function PigmentCluster({ color, seed }: { color: string; seed: number }) {
  const dots = useMemo(() => {
    const rand = (n: number) => {
      const s = Math.sin(seed * 12.9 + n * 78.2) * 43758.5;
      return s - Math.floor(s);
    };
    return Array.from({ length: 8 }, (_, i) => ({
      pos: [
        (rand(i * 3) - 0.5) * 1.4,
        (rand(i * 3 + 1) - 0.5) * 1.1,
        (rand(i * 3 + 2) - 0.5) * 0.9,
      ] as [number, number, number],
      scale: 0.08 + rand(i * 7) * 0.16,
      hueShift: (rand(i * 11) - 0.5) * 0.15,
    }));
  }, [seed]);

  return (
    <group>
      {dots.map((d, i) => (
        <mesh key={i} position={d.pos} scale={d.scale}>
          <sphereGeometry args={[1, 14, 10]} />
          <meshStandardMaterial color={color} roughness={0.45} metalness={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function AbstractBlob({ color, seed }: { color: string; seed: number }) {
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.65, 28, 18);
    const positions = geo.attributes.position;
    for (let v = 0; v < positions.count; v++) {
      const px = positions.getX(v);
      const py = positions.getY(v);
      const pz = positions.getZ(v);
      const n = jsNoise3D(px * 1.6, py * 1.6, pz * 1.6, seed);
      const f = 1 + n * 0.32;
      positions.setXYZ(v, px * f, py * f, pz * f);
    }
    geo.computeVertexNormals();
    return geo;
  }, [seed]);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}

// =====================================================================
//  Single floating object — Framer Motion drives float + spin,
//  useFrame applies values + camera-tracked Y + mouse parallax
// =====================================================================
export type ArtType =
  | "brush"
  | "tube"
  | "canvas"
  | "palette"
  | "stroke"
  | "pigment"
  | "blob";

export interface ArtObjectPlacement {
  type: ArtType;
  x: number;
  y: number;
  z: number;
  scale: number;
  rotation: [number, number, number];
  opacity: number;
  animationDelay: number;
  color?: string;
  seed?: number;
}

interface FloatingArtObjectProps extends ArtObjectPlacement {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

function renderShape(p: ArtObjectPlacement): React.ReactNode {
  const accent = p.color ?? ACCENTS[(p.seed ?? 0) % ACCENTS.length];
  const tubeColor =
    p.color ?? TUBE_BODY[(p.seed ?? 0) % TUBE_BODY.length];
  const seed = p.seed ?? 1;

  switch (p.type) {
    case "brush":
      return <PaintBrush accent={accent} />;
    case "tube":
      return <PaintTube color={tubeColor} />;
    case "canvas":
      return <CanvasFrame paintColor={accent} />;
    case "palette":
      return <ColorPalette />;
    case "stroke":
      return <PaintStroke color={accent} seed={seed} />;
    case "pigment":
      return <PigmentCluster color={accent} seed={seed} />;
    case "blob":
      return <AbstractBlob color={accent} seed={seed} />;
  }
}

function FloatingArtObject(props: FloatingArtObjectProps) {
  const {
    x,
    y,
    z,
    scale,
    rotation,
    opacity,
    animationDelay,
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
      duration: 14 + (animationDelay % 6),
      ease: [...ORGANIC_EASE],
      repeat: Infinity,
      repeatType: "loop",
      delay: -animationDelay,
    });
    const sX = animate(
      spinX,
      [rotation[0], rotation[0] + 0.12, rotation[0], rotation[0] - 0.12, rotation[0]],
      {
        duration: 22 + (animationDelay % 8),
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
        duration: 26 + (animationDelay % 10),
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
        duration: 30 + (animationDelay % 7),
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

  // Closer objects parallax more with mouse
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

  // Apply opacity to all child materials once (cheap traversal at mount)
  const onShapeRef = (g: THREE.Group | null) => {
    innerRef.current = g;
    if (!g) return;
    g.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mat = obj.material as THREE.MeshStandardMaterial;
        if (mat && opacity < 1) {
          mat.transparent = true;
          mat.opacity = opacity;
          mat.depthWrite = opacity > 0.85;
        }
      }
    });
  };

  return (
    <group ref={groupRef} position={[x, y, z]} scale={scale}>
      <group ref={onShapeRef}>{renderShape(props)}</group>
    </group>
  );
}

// =====================================================================
//  Placements — left and right of center, asymmetric, varied depth
// =====================================================================
//
//  X = ±25 → ±55 (some partially off-screen)
//  Y spread across the entire scroll travel (-10 → 200)
//  Z varies for depth, mostly closer than clouds (-25 → -75)
//

const DESKTOP_ART_OBJECTS: ArtObjectPlacement[] = [
  // Opening section
  { type: "brush", x: -36, y: -2, z: -38, scale: 4.2, rotation: [0.3, 0.5, -0.4], opacity: 0.95, animationDelay: 0, color: ACCENTS[0] },
  { type: "tube", x: 32, y: 12, z: -32, scale: 3.4, rotation: [-0.15, 0.6, 0.2], opacity: 0.95, animationDelay: 1.4, seed: 1 },
  { type: "stroke", x: -48, y: 28, z: -58, scale: 5.0, rotation: [0.4, -0.25, 0.5], opacity: 0.7, animationDelay: 2.9, color: ACCENTS[3], seed: 2 },

  // Lower-mid
  { type: "pigment", x: 44, y: 38, z: -42, scale: 3.6, rotation: [0, 0, 0], opacity: 0.9, animationDelay: 0.6, color: ACCENTS[5], seed: 3 },
  { type: "blob", x: -42, y: 56, z: -50, scale: 3.0, rotation: [0.2, 0.4, 0.1], opacity: 0.85, animationDelay: 2.2, color: ACCENTS[6], seed: 4 },

  // Mid section
  { type: "canvas", x: 40, y: 72, z: -36, scale: 3.6, rotation: [-0.1, -0.35, 0.15], opacity: 0.95, animationDelay: 1.8, color: ACCENTS[0] },
  { type: "palette", x: -38, y: 92, z: -45, scale: 4.0, rotation: [0.6, 0.3, -0.2], opacity: 0.95, animationDelay: 3.5 },
  { type: "tube", x: 50, y: 102, z: -65, scale: 4.0, rotation: [0.1, -0.8, 0.4], opacity: 0.75, animationDelay: 0.9, seed: 5 },

  // Upper-mid
  { type: "brush", x: -44, y: 124, z: -40, scale: 4.0, rotation: [-0.4, 0.7, 0.6], opacity: 0.95, animationDelay: 2.6, color: ACCENTS[1] },
  { type: "stroke", x: 38, y: 140, z: -50, scale: 4.5, rotation: [-0.3, 0.4, -0.4], opacity: 0.78, animationDelay: 1.2, color: ACCENTS[4], seed: 6 },
  { type: "pigment", x: -46, y: 158, z: -38, scale: 3.0, rotation: [0, 0, 0], opacity: 0.88, animationDelay: 3.0, color: ACCENTS[7], seed: 7 },

  // Closing
  { type: "blob", x: 42, y: 175, z: -55, scale: 3.4, rotation: [0.5, -0.2, 0.3], opacity: 0.82, animationDelay: 0.4, color: ACCENTS[2], seed: 8 },
  { type: "canvas", x: -40, y: 192, z: -42, scale: 3.2, rotation: [0.2, 0.4, -0.1], opacity: 0.95, animationDelay: 2.0, color: ACCENTS[3] },

  // A couple partially off-screen accents
  { type: "tube", x: -56, y: 50, z: -34, scale: 3.2, rotation: [0.3, 0.5, -0.7], opacity: 0.7, animationDelay: 1.6, seed: 9 },
  { type: "brush", x: 54, y: 168, z: -36, scale: 3.8, rotation: [0.4, -0.6, 0.8], opacity: 0.85, animationDelay: 3.3, color: ACCENTS[2] },
];

// Mobile portrait has a narrow horizontal FOV (~±5 world units visible
// at z=-20). Objects are brought closer and X tightened to frame the
// sides without invading the center. Two pieces are deliberately
// half-off the edge for that sky-gallery feeling.
const MOBILE_ART_OBJECTS: ArtObjectPlacement[] = [
  { type: "brush", x: -6, y: 4, z: -22, scale: 3.0, rotation: [0.3, 0.5, -0.4], opacity: 0.95, animationDelay: 0, color: ACCENTS[0] },
  { type: "blob", x: 6, y: 46, z: -26, scale: 2.6, rotation: [0.2, 0.4, 0.1], opacity: 0.85, animationDelay: 1.6, color: ACCENTS[6], seed: 2 },
  { type: "canvas", x: -7, y: 92, z: -24, scale: 2.4, rotation: [-0.1, -0.35, 0.15], opacity: 0.95, animationDelay: 2.4, color: ACCENTS[1] },
  { type: "stroke", x: 7, y: 138, z: -28, scale: 3.2, rotation: [-0.3, 0.4, -0.4], opacity: 0.78, animationDelay: 0.8, color: ACCENTS[4], seed: 4 },
  { type: "palette", x: -6, y: 182, z: -25, scale: 2.6, rotation: [0.6, 0.3, -0.2], opacity: 0.95, animationDelay: 3.2 },
];

function useArtPlacements(): ArtObjectPlacement[] {
  const [list, setList] = useState<ArtObjectPlacement[]>(DESKTOP_ART_OBJECTS);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setList(mq.matches ? MOBILE_ART_OBJECTS : DESKTOP_ART_OBJECTS);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return list;
}

// =====================================================================
//  Main exported component
// =====================================================================
export interface FloatingArtObjectsProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

export default function FloatingArtObjects({
  mouseX,
  mouseY,
}: FloatingArtObjectsProps) {
  const objects = useArtPlacements();
  return (
    <>
      {objects.map((o, i) => (
        <FloatingArtObject
          key={`${o.type}-${i}-${o.seed ?? 0}`}
          {...o}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </>
  );
}
