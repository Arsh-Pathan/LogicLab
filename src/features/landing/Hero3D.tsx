import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================
// Premium 3D PCB Hero — animated circuit board with live signals
// ============================================================

type ChipDef = {
  position: [number, number, number];
  size: [number, number, number];
  label: string;
  color: string;
};

const CHIPS: ChipDef[] = [
  { position: [-2.2, 0.18, -0.4], size: [1.0, 0.18, 0.7], label: 'AND',  color: '#22d3ee' },
  { position: [ 2.0, 0.18,  0.5], size: [1.0, 0.18, 0.7], label: 'OR',   color: '#a78bfa' },
  { position: [ 0.1, 0.18, -1.4], size: [1.0, 0.18, 0.7], label: 'XOR',  color: '#f472b6' },
  { position: [-0.4, 0.18,  1.5], size: [1.1, 0.18, 0.7], label: 'CLK',  color: '#facc15' },
  { position: [ 2.5, 0.18, -1.4], size: [0.85, 0.18, 0.55], label: 'NOT',color: '#f87171' },
  { position: [-2.6, 0.18,  1.4], size: [0.85, 0.18, 0.55], label: 'IN', color: '#34d399' },
];

// Wire pairs: [from index, to index]
const WIRES: [number, number][] = [
  [5, 0], [0, 2], [3, 2], [2, 1], [4, 1], [0, 3],
];

// ----------------------------------------------------------------
// Animated PCB base — subtle grid material, glowing under-light
// ----------------------------------------------------------------
function PCBBase() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Custom shader: dark substrate + glowing grid + subtle radial fade
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#0b1220') },
      uGrid:  { value: new THREE.Color('#1e3a8a') },
    }),
    [],
  );

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
      <planeGeometry args={[10, 7, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          uniform vec3 uGrid;

          float grid(vec2 uv, float div) {
            vec2 g = abs(fract(uv * div - 0.5) - 0.5) / fwidth(uv * div);
            float line = min(g.x, g.y);
            return 1.0 - min(line, 1.0);
          }

          void main() {
            vec2 uv = vUv;
            float fineGrid   = grid(uv, 30.0) * 0.25;
            float majorGrid  = grid(uv, 6.0)  * 0.6;

            float dist = distance(uv, vec2(0.5));
            float vignette = smoothstep(0.85, 0.15, dist);

            // pulsing scanline
            float scan = smoothstep(0.0, 0.02, abs(uv.y - fract(uTime * 0.07)));
            float scanGlow = (1.0 - scan) * 0.35;

            vec3 base = uColor;
            vec3 g = uGrid * (fineGrid + majorGrid);
            vec3 col = base + g * vignette + uGrid * scanGlow * vignette;

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

// ----------------------------------------------------------------
// IC chip — rounded box with glowing label and pin lights
// ----------------------------------------------------------------
function Chip({ chip, t }: { chip: ChipDef; t: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // gentle bob & sway, offset per chip
      const time = state.clock.elapsedTime + t * 100;
      groupRef.current.position.y = chip.position[1] + Math.sin(time * 0.8) * 0.04;
    }
    if (glowRef.current) {
      const pulse = 0.55 + Math.sin(state.clock.elapsedTime * 2 + t * 100) * 0.25;
      glowRef.current.opacity = pulse;
    }
  });

  const [w, h, d] = chip.size;

  return (
    <group ref={groupRef} position={chip.position}>
      {/* Body */}
      <RoundedBox args={[w, h, d]} radius={0.04} smoothness={4} castShadow>
        <meshPhysicalMaterial
          color="#0f172a"
          metalness={0.4}
          roughness={0.35}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* Top emissive plate */}
      <mesh position={[0, h / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.85, d * 0.85]} />
        <meshBasicMaterial ref={glowRef} color={chip.color} transparent opacity={0.55} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, h / 2 + 0.005, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={Math.min(w, d) * 0.32}
        color="#0b1220"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff"
      >
        {chip.label}
      </Text>

      {/* Pin lights along the longer edge */}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = (-w / 2) + (w / 5) * i;
        return (
          <mesh key={`pl-${i}`} position={[x, 0, d / 2 + 0.01]}>
            <boxGeometry args={[0.04, 0.04, 0.04]} />
            <meshStandardMaterial
              color={chip.color}
              emissive={chip.color}
              emissiveIntensity={1.5}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ----------------------------------------------------------------
// Glowing wire trace + traveling signal pulse
// ----------------------------------------------------------------
function WireTrace({
  from,
  to,
  color,
  offset,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  offset: number;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);

  // Build a gentle L-shape path on the PCB plane
  const points = useMemo(() => {
    const a = new THREE.Vector3(from[0], 0.005, from[2]);
    const b = new THREE.Vector3(to[0], 0.005, to[2]);
    const mid = new THREE.Vector3(b.x, 0.005, a.z);
    return [a, mid, b];
  }, [from, to]);

  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  // Pre-compute curve for pulse interpolation
  const curve = useMemo(() => {
    const segs: THREE.Vector3[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      segs.push(points[i]);
    }
    segs.push(points[points.length - 1]);
    return new THREE.CatmullRomCurve3(segs, false, 'catmullrom', 0.0);
  }, [points]);

  useFrame((state) => {
    if (!pulseRef.current) return;
    const t = (state.clock.elapsedTime * 0.25 + offset) % 1;
    const p = curve.getPoint(t);
    pulseRef.current.position.set(p.x, 0.04, p.z);
  });

  return (
    <group>
      <line>
        <primitive object={lineGeo} attach="geometry" />
        <lineBasicMaterial color={color} transparent opacity={0.45} />
      </line>
      {/* Glowing pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------
// Scene with mouse parallax tilt
// ----------------------------------------------------------------
function Scene() {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!groupRef.current) return;
    // ease toward mouse target
    const cur = groupRef.current.rotation;
    cur.x += (target.current.y * 0.3 - cur.x) * 0.05;
    cur.y += (target.current.x * 0.5 - cur.y) * 0.05;

    // gentle ambient drift
    cur.y += Math.sin(state.clock.elapsedTime * 0.15) * 0.0006;
  });

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    // viewport: x in [-1, 1], y in [-1, 1]
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    target.current.x = x;
    target.current.y = y;
  };

  return (
    <group onPointerMove={onPointerMove}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
        <group ref={groupRef} rotation={[-0.35, 0.4, 0]}>
          <PCBBase />

          {CHIPS.map((chip, i) => (
            <Chip key={i} chip={chip} t={i / CHIPS.length} />
          ))}

          {WIRES.map(([from, to], i) => (
            <WireTrace
              key={`w-${i}`}
              from={CHIPS[from].position}
              to={CHIPS[to].position}
              color={CHIPS[from].color}
              offset={i / WIRES.length}
            />
          ))}
        </group>
      </Float>
    </group>
  );
}

// ----------------------------------------------------------------
// Top-level canvas — owns lights and camera
// ----------------------------------------------------------------
export default function Hero3D() {
  return (
    <div className="relative w-full" style={{ height: 480 }}>
      <Canvas
        camera={{ position: [0, 3.2, 5.2], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[4, 6, 3]}
            intensity={1.1}
            color="#a5b4fc"
            castShadow
          />
          <pointLight position={[-3, 2, -2]} intensity={1.5} color="#22d3ee" distance={8} />
          <pointLight position={[3, 1.5, 2]} intensity={1.2} color="#a78bfa" distance={8} />
          <fog attach="fog" args={['#020617', 6, 14]} />

          <Scene />
        </Suspense>
      </Canvas>

      {/* Soft vignette to blend into page */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          boxShadow: 'inset 0 0 80px 30px var(--bg-app)',
        }}
      />
    </div>
  );
}
