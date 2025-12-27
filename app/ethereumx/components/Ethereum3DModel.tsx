
'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, useGLTF } from '@react-three/drei'
import { Suspense } from 'react'

function EthereumModel() {
  const gltf = useGLTF('/models/ethereumx_model.glb')
  return <primitive object={gltf.scene} scale={1.5} />;
}

export default function Ethereum3DModel() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars />
      <Suspense fallback={null}>
        <EthereumModel />
      </Suspense>
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}
