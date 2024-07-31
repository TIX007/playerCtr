
import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree, RootState } from "@react-three/fiber";
import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { toFixed } from "../utils";

function Player() {
  const SPEED = 4; // 移动速度
  const JUMP = 7; // 跳跃速度
  const direction = new THREE.Vector3(); // 方向
  // 生成枚举
  enum STATUS {
    walk,
    idle,
    run
  }
  // 加载模型
  const { scene, animations } = useGLTF("./player/actor.gltf");
  const { ref, actions, names } = useAnimations(animations, scene);
  const [status, setStatus] = useState(names[STATUS.idle])

  const { camera } = useThree();

  useEffect(() => {
    if (!names || !actions) return
    // 退出上次动画
    names?.forEach(name => {
      actions[name]?.fadeOut(0.2).stop();
    })
    // 切换当前动画，从头播放,0.2s切换动画
    actions[status]?.reset().fadeIn(0.2).play()
  }, [actions, names, status])


  const player = useRef<RapierRigidBody>(null); // 玩家的引用
  useKeyboardControls((state) => move(state)) // 监听自定义键盘事件


  function move(state: {
    [key: string]: boolean;
  }): boolean {
    if (!camera || !player.current) return false
    const { forward, backward, left, right, jump } = state
    // 获取移动方向
    direction.set(Number(right) - Number(left), 0, Number(backward) - Number(forward)).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation); // 以相机方向为基准，应用欧拉角，保证前后左右的位置始终相对于你的镜头方向

    const velocity = {
      x: toFixed(direction.x),
      y: player.current.linvel().y,
      z: toFixed(direction.z),
    };
    player.current.setLinvel(velocity, true);
    // 跳跃
    if (jump) {
      player.current.setLinvel({ x: 0, y: JUMP, z: 0 }, true)
    }
    console.log(jump, '***jump');
    // 播放动画 当速度不为0或跳跃时播放 run动画
    let key = names[STATUS.idle]
    if (direction.x !== 0 || direction.z !== 0 || jump) {
      key = names[STATUS.run]
    }
    if (status != key) setStatus(key)
    return true
  }

  return <group dispose={null}>
    <RigidBody
      ref={player}
      colliders={false}
      type="dynamic"
      enabledRotations={[false, false, false]}
    >
      <primitive ref={ref} object={scene} position={[0, -1, 0]} />
      <CapsuleCollider args={[0.6, 0.3]} position={[0, -0.1, 0]} />
    </RigidBody>
  </group>
}

export default Player;
