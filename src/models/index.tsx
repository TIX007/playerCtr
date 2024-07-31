
import * as THREE from 'three'
import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Environment, KeyboardControls, OrbitControls, Sky } from '@react-three/drei'
import Ground from './ground'
import Player from './player'

function Models() {
  const autoRotate = false
  const actions = [
    { name: "forward", keys: ["ArrowUp", "w", "W"] },
    { name: "backward", keys: ["ArrowDown", "s", "S"] },
    { name: "left", keys: ["ArrowLeft", "a", "A"] },
    { name: "right", keys: ["ArrowRight", "d", "D"] },
    { name: "jump", keys: ["Space"] },
  ]
  // 控制器
  const controlConfig = useMemo(
    () => ({
      reverseOrbit: true,
      enableZoom: true,
      enableRotate: true,
      autoRotate: autoRotate,
      autoRotateSpeed: 0.5,
      enableDamping: true,
      dampingFactor: 0.2,
      rotateSpeed: 0.5,
    }),
    [autoRotate]
  );

  return <Canvas
    style={{ width: '100%', height: '100%' }}
    camera={{ fov: 60, position: [3, 1, 3] }}
    onCreated={({ gl }) => {
      gl.toneMapping = THREE.ReinhardToneMapping
      gl.setClearColor(new THREE.Color('#020209'))
    }}
  >
    <KeyboardControls map={actions}>
      <Physics debug={true}>
        <Player />
        <Ground />
      </Physics>
    </KeyboardControls>

    <OrbitControls {...controlConfig} makeDefault />
    <Sky sunPosition={[100, 20, 100]} distance={1000} />
    {/* // 环境光的反射 */}
    <Environment preset="city" />

    <ambientLight intensity={1} />
    <directionalLight
      position={[100, 100, 100]}
      intensity={1.5}
    />
    <axesHelper args={[500]} />
  </Canvas>
}
export default Models
