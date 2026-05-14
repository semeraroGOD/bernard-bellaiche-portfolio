"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Distant atmospheric dust — barely-visible specks scattered across the
 * entire vertical sky world. Motion is computed in the vertex shader
 * (no per-frame JS cost beyond a single uTime uniform).
 *
 * Goal: presence > visibility. They should be felt, not noticed.
 */
const PARTICLE_COUNT = 110;

// Match the cloud-world vertical span so dust feels continuous through scroll
const Y_MIN = -25;
const Y_MAX = 220;
const X_HALF = 70;
const Z_MIN = -55;
const Z_MAX = -180;

export default function Particles() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);

    // Deterministic pseudo-random so HMR doesn't reshuffle the field
    const rand = (n: number) => {
      const s = Math.sin(n * 12.9898) * 43758.5453;
      return s - Math.floor(s);
    };

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = (rand(i * 3.1) - 0.5) * 2 * X_HALF;
      positions[i * 3 + 1] = Y_MIN + rand(i * 7.7) * (Y_MAX - Y_MIN);
      positions[i * 3 + 2] = Z_MIN + rand(i * 13.3) * (Z_MAX - Z_MIN);
      seeds[i] = rand(i * 5.4);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    // Generous bounds so frustum culling never drops the whole cloud
    geo.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(0, (Y_MIN + Y_MAX) / 2, (Z_MIN + Z_MAX) / 2),
      400
    );
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPixelRatio: {
            value: typeof window !== "undefined" ? window.devicePixelRatio : 1,
          },
        },
        vertexShader: /* glsl */ `
          attribute float aSeed;
          uniform float uTime;
          uniform float uPixelRatio;
          varying float vSeed;
          varying float vDepth;

          void main() {
            vec3 pos = position;

            // Per-particle slow Brownian drift
            float phase = aSeed * 6.2831;
            pos.y += sin(uTime * 0.07 + phase) * 1.6;
            pos.x += cos(uTime * 0.05 + phase * 1.3) * 1.1;
            pos.z += sin(uTime * 0.04 + phase * 0.7) * 0.7;

            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mv;

            // Size scales with seed for variation, and with screen-distance
            float baseSize = 0.9 + aSeed * 2.2;
            gl_PointSize = baseSize * uPixelRatio * (260.0 / -mv.z);

            vSeed = aSeed;
            vDepth = -mv.z;
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vSeed;
          varying float vDepth;

          void main() {
            // Soft circular sprite
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;

            float core = smoothstep(0.5, 0.0, d);
            float halo = smoothstep(0.5, 0.15, d) * 0.4;
            float alpha = (core * 0.55 + halo) * (0.25 + vSeed * 0.35);

            // Atmospheric depth fade — far dust is fainter
            float depthFade = 1.0 - smoothstep(120.0, 220.0, vDepth);
            alpha *= depthFade;

            vec3 color = vec3(0.94, 0.97, 1.0);
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <primitive ref={materialRef} object={material} attach="material" />
    </points>
  );
}
