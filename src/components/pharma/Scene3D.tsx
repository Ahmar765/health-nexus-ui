import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, MeshTransmissionMaterial, ContactShadows } from "@react-three/drei";
import { useRef, Suspense } from "react";
import type { Group, Mesh } from "three";

function Capsule() {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.4;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });
  return (
    <group ref={group}>
      {/* Left half - white */}
      <mesh position={[-0.55, 0, 0]}>
        <capsuleGeometry args={[0.55, 0.6, 20, 32]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.15} metalness={0.05} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      {/* Right half - cyan glass */}
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, 0]}>
        <capsuleGeometry args={[0.55, 0.6, 20, 32]} />
        <MeshTransmissionMaterial
          samples={6}
          thickness={0.5}
          chromaticAberration={0.05}
          anisotropy={0.3}
          roughness={0.05}
          transmission={1}
          ior={1.4}
          color="#7dd3fc"
        />
      </mesh>
      {/* Center seam glow */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.55, 0.02, 16, 64]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
}

function Pill({ position, color = "#ffffff", accent = "#3b82f6" }: { position: [number, number, number]; color?: string; accent?: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.z += delta * 0.3; });
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
      <group position={position}>
        <mesh ref={ref}>
          <cylinderGeometry args={[0.35, 0.35, 0.14, 48]} />
          <meshPhysicalMaterial color={color} roughness={0.2} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0.001, 0]}>
          <torusGeometry args={[0.32, 0.008, 8, 64]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      </group>
    </Float>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#38bdf8" />
        <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
          <Capsule />
        </Float>
        <Pill position={[-2.2, 1, -0.5]} color="#e0f2fe" accent="#0ea5e9" />
        <Pill position={[2.3, -0.8, -0.5]} color="#ffffff" accent="#38bdf8" />
        <Pill position={[1.8, 1.2, -1]} color="#f0f9ff" accent="#60a5fa" />
        <ContactShadows position={[0, -1.4, 0]} opacity={0.35} scale={8} blur={2.5} far={2} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

function Atom({ radius, speed, phase, color }: { radius: number; speed: number; phase: number; color: string }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 1.5) * 0.3;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshPhysicalMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.2} clearcoat={1} />
    </mesh>
  );
}

function Molecule() {
  const group = useRef<Group>(null);
  useFrame((_, delta) => { if (group.current) { group.current.rotation.y += delta * 0.2; group.current.rotation.x += delta * 0.05; } });
  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshPhysicalMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.2} roughness={0.15} />
      </mesh>
      <Atom radius={1.2} speed={0.9} phase={0} color="#38bdf8" />
      <Atom radius={1.2} speed={0.9} phase={2.1} color="#60a5fa" />
      <Atom radius={1.2} speed={0.9} phase={4.2} color="#a78bfa" />
      <Atom radius={1.6} speed={0.6} phase={1} color="#22d3ee" />
      <Atom radius={1.6} speed={0.6} phase={3.5} color="#818cf8" />
      {/* bond rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.008, 8, 96]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.6, 0.006, 8, 96]} />
        <meshBasicMaterial color="#a5b4fc" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export function MoleculeScene() {
  return (
    <Canvas camera={{ position: [0, 0.5, 4.5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={1.2} color="#38bdf8" />
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#a78bfa" />
        <Molecule />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  );
}

function Bottle() {
  const ref = useRef<Group>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.4; });
  return (
    <group ref={ref}>
      {/* Cap */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.35, 32]} />
        <meshPhysicalMaterial color="#0ea5e9" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Bottle body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 1.3, 48]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.2} clearcoat={1} />
      </mesh>
      {/* Label ring */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.56, 0.56, 0.5, 48]} />
        <meshPhysicalMaterial color="#e0f2fe" roughness={0.4} />
      </mesh>
    </group>
  );
}

function Syringe() {
  const ref = useRef<Group>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.z += d * 0.3; });
  return (
    <group ref={ref} rotation={[0, 0, Math.PI / 4]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.4, 24]} />
        <MeshTransmissionMaterial samples={4} thickness={0.3} transmission={1} roughness={0.1} ior={1.3} color="#dbeafe" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.25, 24]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.85, 0]}>
        <coneGeometry args={[0.04, 0.35, 24]} />
        <meshPhysicalMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Tablet() {
  const ref = useRef<Group>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.5; });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.7, 48, 24]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.25} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh scale={[1.01, 0.02, 1.01]}>
        <sphereGeometry args={[0.7, 48, 24]} />
        <meshBasicMaterial color="#0ea5e9" />
      </mesh>
    </group>
  );
}

export function ShowcaseScene({ item }: { item: "capsule" | "bottle" | "syringe" | "tablet" }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 3]} intensity={1} />
        <directionalLight position={[-3, 2, 2]} intensity={0.5} color="#7dd3fc" />
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
          {item === "capsule" && <Capsule />}
          {item === "bottle" && <Bottle />}
          {item === "syringe" && <Syringe />}
          {item === "tablet" && <Tablet />}
        </Float>
        <ContactShadows position={[0, -1.2, 0]} opacity={0.3} scale={6} blur={2.5} far={2} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
