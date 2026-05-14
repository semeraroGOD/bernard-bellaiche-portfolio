"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SIMPLEX_3D_GLSL } from "./shaders/noise";

/**
 * R3F gradient sky — inward-facing sphere with a vertical gradient driven
 * by the world-normal Y, modulated by a very slow FBM noise so the
 * atmosphere never reads as a flat gradient.
 */
export default function Sky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          // Côte d'Azur summer afternoon — lifted a stop brighter so the
          // new near-black typography has somewhere readable to sit. Same
          // 5-stop structure, just shifted toward more luminous Mediterranean.
          zenith:   { value: new THREE.Color("#4a6094") }, // soft daylight blue (was deep navy)
          upperSky: { value: new THREE.Color("#6890c4") }, // luminous mid-deep blue
          midSky:   { value: new THREE.Color("#94c2dc") }, // milky Mediterranean
          lowerSky: { value: new THREE.Color("#cde3ef") }, // very airy pale
          horizon:  { value: new THREE.Color("#f7f1de") }, // warm sunlight haze
          uTime: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorldPos;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          ${SIMPLEX_3D_GLSL}

          uniform vec3 zenith;
          uniform vec3 upperSky;
          uniform vec3 midSky;
          uniform vec3 lowerSky;
          uniform vec3 horizon;
          uniform float uTime;
          varying vec3 vWorldPos;

          void main() {
            vec3 dir = normalize(vWorldPos);
            float h = (dir.y + 1.0) * 0.5; // 0=down, 1=up

            // Layered gradient
            vec3 baseColor;
            if (h > 0.75) {
              baseColor = mix(upperSky, zenith, smoothstep(0.75, 1.0, h));
            } else if (h > 0.55) {
              baseColor = mix(midSky, upperSky, smoothstep(0.55, 0.75, h));
            } else if (h > 0.40) {
              baseColor = mix(lowerSky, midSky, smoothstep(0.40, 0.55, h));
            } else {
              baseColor = mix(horizon, lowerSky, smoothstep(0.20, 0.40, h));
            }

            // FBM atmospheric drift — extremely slow, anisotropic
            vec3 noisePos = dir * 3.2 + vec3(uTime * 0.012, uTime * 0.006, uTime * 0.009);
            float n = fbm(noisePos);

            // Stronger noise around mid-sky where eye lingers, fading near horizon/zenith
            float bandMask = smoothstep(0.30, 0.55, h) * (1.0 - smoothstep(0.75, 0.95, h));
            float intensity = 0.045 + bandMask * 0.025;

            baseColor *= (1.0 + n * intensity);

            gl_FragColor = vec4(baseColor, 1.0);
          }
        `,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
      }),
    []
  );

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      ref={meshRef}
      material={material}
      renderOrder={-1000}
      frustumCulled={false}
    >
      <sphereGeometry args={[450, 48, 24]} />
    </mesh>
  );
}
