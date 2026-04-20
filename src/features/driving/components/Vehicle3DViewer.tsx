import { Canvas } from "@react-three/fiber";
import { Stage, PresentationControls, ContactShadows, Html, useGLTF } from "@react-three/drei";
import React, { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Car, Loader2 } from "lucide-react";

function AvanteObjModel() {
 // 유저가 새롭게 업로드한 최고 품질의 PBR GLB 파일을 로드합니다.
 const { scene } = useGLTF("/media/avante/base_basic_pbr.glb");

 const clonedScene = useMemo(() => {
 const clone = scene.clone();
 clone.traverse((child: any) => {
 if (child.isMesh) {
 child.castShadow = false;
 child.receiveShadow = false;
 }
 });
 return clone;
 }, [scene]);

 return <primitive object={clonedScene} />;
}
useGLTF.preload("/media/avante/base_basic_pbr.glb");

function LoaderFallback() {
 return (
 <Html center>
 <div className="flex flex-col items-center justify-center text-slate-400 gap-3 whitespace-nowrap pointer-events-none">
 <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
 <span className="font-bold text-sm text-slate-700 bg-white/90 backdrop-blur px-5 py-2.5 rounded-full border border-slate-100">
 고사양 3D 모델 불러오는 중 ...
 </span>
 </div>
 </Html>
 );
}

export function Vehicle3DViewer({ hideTitle = false }: { hideTitle?: boolean }) {
 return (
 <div className="w-full h-[400px] md:h-[500px] bg-white rounded-[40px] border-[0.5px] border-[#A0C878] relative overflow-hidden my-8 cursor-grab active:cursor-grabbing">
 {!hideTitle && (
 <div className="absolute top-6 left-6 z-10 bg-white border border-slate-200 px-4 py-2 rounded-2xl pointer-events-none">
 <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
 <Car size={24} className="text-blue-600" /> 아반떼 3D Studio
 </h3>
 <p className="text-[11px] font-bold text-slate-500 mt-1 pb-0.5">
 완전한 3D 모델! 마우스로 이리저리 빙빙 돌려보세요! 🚀
 </p>
 </div>
 )}

 <Canvas dpr={[1, 2]} camera={{ position: [5, 2, 6], fov: 45 }} gl={{ antialias: true }}>
 <color attach="background" args={["#ffffff"]} />
 
 {/* Suspense는 반드시 Canvas '내부'에 위치해야 합니다 */}
 <Suspense fallback={<LoaderFallback />}>
 <PresentationControls 
 speed={1.5} 
 global 
 zoom={0.8} 
 polar={[0, 0]} 
 azimuth={[-Infinity, Infinity]}
 >
 <Stage environment="city" intensity={0.8} shadows={false}>
 <AvanteObjModel />
 </Stage>
 </PresentationControls>
 </Suspense>
 </Canvas>
 </div>
 );
}
