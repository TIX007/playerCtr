
import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

useGLTF.preload("./world.glb"); // 预加载

function Ground({ log = true }) {
  // 加载模型
  const { scene } = useGLTF("./world.glb") //地面

  useEffect(() => {
    if (log) {
      console.log("ground:", scene);
    }
  });

  return (
    <group dispose={null}>
      <RigidBody name="环境" type="fixed" colliders="trimesh" position={[0, 0, 0]} >
        <primitive object={scene} />
      </RigidBody>
    </group>
  );
}

export default Ground;
