import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier';
import { Vector3 } from 'three';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { Projectile } from './Projectile';

const MOVE_SPEED = 5;
const JUMP_FORCE = 10;
const DIAGONAL_FACTOR = Math.sqrt(2) / 2;

export function Player() {
  const playerRef = useRef<RapierRigidBody>();
  const [projectiles, setProjectiles] = useState<any[]>([]);
  const [projectileId, setProjectileId] = useState(0);
  const [isGrounded, setIsGrounded] = useState(false);
  const { forward, backward, left, right, jump } = useKeyboardControls();

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      if (!playerRef.current) return;

      const position = playerRef.current.translation();
      const target = new Vector3(
        (event.clientX / window.innerWidth) * 40 - 20,
        2,
        (event.clientY / window.innerHeight) * 40 - 20
      );

      setProjectiles(prev => [...prev, {
        id: projectileId,
        position: new Vector3(position.x, position.y, position.z),
        type: event.button === 0 ? 'bow' : 'boomerang',
        target
      }]);
      setProjectileId(prev => prev + 1);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, [projectileId]);

  useFrame(() => {
    if (!playerRef.current) return;

    let xVel = 0;
    let zVel = 0;

    if (forward) {
      xVel -= 1;
      zVel -= 1;
    }
    if (backward) {
      xVel += 1;
      zVel += 1;
    }
    if (left) {
      xVel -= 1;
      zVel += 1;
    }
    if (right) {
      xVel += 1;
      zVel -= 1;
    }

    if (xVel !== 0 && zVel !== 0) {
      xVel *= DIAGONAL_FACTOR;
      zVel *= DIAGONAL_FACTOR;
    }

    const currentVel = playerRef.current.linvel();
    
    // Apply movement
    playerRef.current.setLinvel({
      x: xVel * MOVE_SPEED,
      y: currentVel.y,
      z: zVel * MOVE_SPEED
    });

    // Apply jump
    if (jump && isGrounded) {
      playerRef.current.setLinvel({
        x: currentVel.x,
        y: JUMP_FORCE,
        z: currentVel.z
      });
    }
  });

  return (
    <>
      <RigidBody
        ref={playerRef}
        position={[0, 2, 0]}
        enabledRotations={[false, false, false]}
        mass={1}
        lockRotations
        colliders={false}
        type="dynamic"
      >
        <mesh castShadow>
          <sphereGeometry args={[0.5]} />
          <meshStandardMaterial color="blue" />
        </mesh>
        <CuboidCollider 
          args={[0.5, 0.5, 0.5]} 
          sensor
          onIntersectionEnter={() => setIsGrounded(true)}
          onIntersectionExit={() => setIsGrounded(false)}
        />
      </RigidBody>
      {projectiles.map(proj => (
        <Projectile
          key={proj.id}
          position={proj.position}
          type={proj.type}
          target={proj.target}
          onComplete={() => {
            setProjectiles(prev => prev.filter(p => p.id !== proj.id));
          }}
        />
      ))}
    </>
  );
}