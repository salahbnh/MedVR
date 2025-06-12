import React, { useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { LOD } from "three";
import doctorVr from "../../assets/canvasBg.jpg";



import CanvasLoader from "./Loader";

const Model = () => {
  const gltf = useGLTF("/scene.gltf");
  const modelRef = useRef();

  const lod = new LOD();
  const lowDetail = gltf.scene.clone();
  const meduimDetail = gltf.scene.clone();
  const highDetail = gltf.scene.clone();
  const ultraDetail = gltf.scene.clone();

  useEffect(() => {
    lod.addLevel(lowDetail, 0);
    lod.addLevel(meduimDetail, 20);
    lod.addLevel(highDetail, 40);
    lod.addLevel(ultraDetail, 60);
    modelRef.current.add(lod);
  }, [gltf.scene]);

  return (
    <primitive
      object={gltf.scene}
      ref={modelRef}
      scale={6} 
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
    />
  );
};

const MetaQuest = () => {
  return (
    <section
      class="bg-gray-200 bottom-0 w-full md:w-[100%] h-full"
      style={{borderRadius: "40px",
      backgroundImage: `url(${doctorVr})`,
      backgroundSize: "cover",
      backgroundPosition: "center",}}
    >
      <Canvas
        frameloop="demand"
        dpr={[0, 1]}
        style={{
          display: "flex",
          zIndex: "0",
          background:'transparent',
          width: "100%",
          height: "100%",
          borderRadius: "40px"
        }}
      >
        <Suspense fallback={<CanvasLoader />}>
          <ambientLight color="white" />
          <pointLight intensity={5} position={[0, 2, 0]} color="blue" distance={20} />
          <pointLight intensity={5} position={[0, -2, 0]} color="red" distance={20} />
          <pointLight intensity={5} position={[0, 0, 1]} color="yellow" distance={20} />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={true}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Preload all />
          <Model />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default MetaQuest;
