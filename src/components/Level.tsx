import { useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { useGameStore } from '../store/gameStore';

const LEVEL_CONFIGS = {
  1: {
    platforms: [
      { position: [0, 0, 0], scale: [20, 1, 20] },
      { position: [-8, 1, -8], scale: [4, 0.5, 4] },
      { position: [8, 1, 8], scale: [4, 0.5, 4] },
    ],
    spawnerPosition: [-8, 2, -8],
    portalPosition: [8, 2, 8],
  },
  2: {
    platforms: [
      { position: [0, 0, 0], scale: [30, 1, 30] },
      { position: [-12, 1, -12], scale: [6, 0.5, 6] },
      { position: [12, 1, 12], scale: [6, 0.5, 6] },
      { position: [0, 2, 0], scale: [4, 0.5, 4] },
    ],
    spawnerPosition: [-12, 2, -12],
    portalPosition: [12, 2, 12],
  },
};

export function Level() {
  const { currentLevel, timer, setTimer, isSpawning, setIsSpawning } = useGameStore();
  const config = LEVEL_CONFIGS[currentLevel as keyof typeof LEVEL_CONFIGS];

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0 && isSpawning) {
        setTimer(timer - 1);
      } else if (timer === 0 && isSpawning) {
        setIsSpawning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isSpawning]);

  return (
    <group>
      {config.platforms.map((platform, index) => (
        <RigidBody key={index} type="fixed">
          <mesh position={platform.position} castShadow>
            <boxGeometry args={platform.scale}  />
            <meshStandardMaterial color="cornflowerblue" />
          </mesh>
        </RigidBody>
      ))}
      
      {/* Spawner */}
      <mesh position={config.spawnerPosition}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* Portal */}
      <mesh position={config.portalPosition}>
        <torusGeometry args={[1, 0.2, 16, 32]} />
        <meshStandardMaterial color="purple" emissive="purple" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}