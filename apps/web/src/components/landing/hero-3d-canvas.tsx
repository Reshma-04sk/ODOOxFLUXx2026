"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // 1. Reduced motion check
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setIsReducedMotion(true);
      setHasWebGL(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // 2. WebGL capability check
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // 3. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090a, 0.035);

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 16);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLightEmerald = new THREE.PointLight(0x10b981, 3.5, 30);
    pointLightEmerald.position.set(5, 5, 4);
    scene.add(pointLightEmerald);

    const pointLightCyan = new THREE.PointLight(0x06b6d4, 3.5, 30);
    pointLightCyan.position.set(-6, -4, 3);
    scene.add(pointLightCyan);

    const pointLightAmber = new THREE.PointLight(0xf59e0b, 1.8, 25);
    pointLightAmber.position.set(0, -6, 5);
    scene.add(pointLightAmber);

    // 5. Dynamic Ledger Ring (Concentric Rings representing Billing Cycles)
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    // Outer Ledger Orbit
    const outerRingGeo = new THREE.TorusGeometry(6.5, 0.035, 16, 120);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI / 2.3;
    ringGroup.add(outerRing);

    // Inner Ledger Ring (Electric Cyan)
    const innerRingGeo = new THREE.TorusGeometry(4.2, 0.025, 16, 100);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.7,
      roughness: 0.1,
      metalness: 0.95,
      transparent: true,
      opacity: 0.6,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2.6;
    ringGroup.add(innerRing);

    // Core Pulsing Node (Transaction Settlement Core)
    const coreGeo = new THREE.IcosahedronGeometry(1.3, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x022c22,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const coreNode = new THREE.Mesh(coreGeo, coreMat);
    ringGroup.add(coreNode);

    // 6. Instanced Ledger Transaction Nodes
    const nodeCount = 55;
    const nodeGeo = new THREE.OctahedronGeometry(0.18, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x10b981,
      emissiveIntensity: 0.8,
    });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);

    const dummy = new THREE.Object3D();
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const radius = 3.6 + Math.random() * 4.2;
      const height = (Math.random() - 0.5) * 2.8;

      const x = Math.cos(angle) * radius;
      const y = height;
      const z = Math.sin(angle) * radius;

      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos);

      dummy.position.copy(pos);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      const scale = 0.6 + Math.random() * 0.8;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      instancedNodes.setMatrixAt(i, dummy.matrix);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    ringGroup.add(instancedNodes);

    // 7. Dynamic Transaction Flow Lines (Constellations between nearest nodes)
    const linePositions: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 2.5) {
          linePositions.push(
            nodePositions[i].x,
            nodePositions[i].y,
            nodePositions[i].z,
            nodePositions[j].x,
            nodePositions[j].y,
            nodePositions[j].z
          );
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const transactionLines = new THREE.LineSegments(lineGeo, lineMat);
    ringGroup.add(transactionLines);

    // 8. Floating Micro Particles (Financial Mint Dust)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cEmerald = new THREE.Color(0x10b981);
    const cCyan = new THREE.Color(0x06b6d4);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePos[i3] = (Math.random() - 0.5) * 24;
      particlePos[i3 + 1] = (Math.random() - 0.5) * 16;
      particlePos[i3 + 2] = (Math.random() - 0.5) * 18;

      const col = Math.random() > 0.4 ? cEmerald : cCyan;
      particleColors[i3] = col.r;
      particleColors[i3 + 1] = col.g;
      particleColors[i3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 9. Pointer Reactivity & Lerp Physics
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotation.y = x * 0.35;
      targetRotation.x = -y * 0.25;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    // 10. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth camera / group tilt damping
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

      ringGroup.rotation.y = elapsed * 0.09 + currentRotation.y;
      ringGroup.rotation.x = Math.sin(elapsed * 0.06) * 0.12 + currentRotation.x;

      outerRing.rotation.z = elapsed * 0.14;
      innerRing.rotation.z = -elapsed * 0.18;

      // Pulsing core node scale
      const pulse = 1 + Math.sin(elapsed * 2.2) * 0.07;
      coreNode.scale.set(pulse, pulse, pulse);
      coreNode.rotation.y = elapsed * 0.25;
      coreNode.rotation.x = elapsed * 0.18;

      // Subtle particle float
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = Math.sin(elapsed * 0.015) * 0.04;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 11. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      outerRingGeo.dispose();
      outerRingMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      instancedNodes.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {(!hasWebGL || isReducedMotion) && (
        <div className="w-full h-full bg-radial-vignette flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-transparent blur-3xl" />
        </div>
      )}
    </div>
  );
}
