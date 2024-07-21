"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float, Environment, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useDrag } from "react-use-gesture";

export function Shapes() {
  return (
    <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
      <Canvas
        className="z-0"
        shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}
      >
        <Suspense fallback={null}>
          <Geometries />
          <ContactShadows
            position={[0, -3.5, 0]}
            opacity={0.65}
            scale={40}
            blur={1}
            far={9}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Geometries() {
  const geometries = [
    {
      position: [0, 0, 0],
      r: 0.25,
      url: "/models/earth.glb",
      scale: [3, 3, 3], // Larger scale factor for the Earth
    },
    {
      position: [3, -2, 0],
      r: 0.5,
      url: "/models/rocket.glb",
      scale: [0.25, 0.25, 0.25], // Adjust scale as needed
    },
    {
      position: [-3, 0, 0],
      r: 0.5,
      url: "/models/astronaut.glb",
      scale: [1, 1, 1], // Adjust scale as needed
    },
    {
      position: [0, 3, 0],
      r: 0.5,
      url: "/models/ufo.glb",
      scale: [0.5, 0.5, 0.5], // Adjust scale as needed
    },
  ];

  return geometries.map(({ position, r, url, scale }) => (
    <Geometry key={url} position={position} url={url} r={r} scale={scale} />
  ));
}

function Geometry({ r, position, url, scale }) {
  const meshRef = useRef();
  const [visible, setVisible] = useState(false);
  const { scene } = useGLTF(url);

  const bind = useDrag(({ offset: [x, y] }) => {
    scene.rotation.y = x / 100;
    scene.rotation.x = y / 100;
  });

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      setVisible(true);
      gsap.from(meshRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: gsap.utils.random(0.8, 1.2),
        ease: "elastic.out(1,0.3)",
        delay: gsap.utils.random(0, 0.5),
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <group position={position} ref={meshRef} scale={scale}>
      <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
        <primitive
          object={scene}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          visible={visible}
          {...bind()}
        />
      </Float>
    </group>
  );
}

useGLTF.preload([
  "/models/earth.glb",
  "/models/rocket.glb",
  "/models/astronaut.glb",
  "/models/ufo.glb",
]);
