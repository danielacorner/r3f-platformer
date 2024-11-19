import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

interface ProjectileProps {
  position: Vector3;
  type: 'bow' | 'boomerang';
  target: Vector3;
  onComplete: () => void;
}

export function Projectile({ position, type, target, onComplete }: ProjectileProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const startPos = position.clone();
  const direction = target.sub(startPos).normalize();
  const speed = type === 'bow' ? 20 : 15;
  const lifetime = type === 'bow' ? 2 : 1;
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    timeRef.current += delta;

    if (timeRef.current >= lifetime) {
      onComplete();
      return;
    }

    if (type === 'bow') {
      meshRef.current.position.add(direction.multiplyScalar(speed * delta));
    } else {
      // Boomerang path
      const t = timeRef.current / lifetime;
      const radius = 2;
      meshRef.current.position.x = startPos.x + Math.cos(t * Math.PI * 2) * radius;
      meshRef.current.position.z = startPos.z + Math.sin(t * Math.PI * 2) * radius;
      meshRef.current.rotation.y += delta * 10;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      {type === 'bow' ? (
        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
      ) : (
        <torusGeometry args={[0.2, 0.05, 16, 32]} />
      )}
      <meshStandardMaterial color={type === 'bow' ? 'brown' : 'gold'} />
    </mesh>
  );
}