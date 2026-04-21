export default function Placeholder({ name }: { name: string }) {
 return (
 <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
 <div className="text-6xl mb-4">🚧</div>
 <h2 className="text-xl font-bold text-slate-600">{name} 페이지 준비 중</h2>
 <p>현재 열심히 구현 중입니다. 잠시만 기다려주세요!</p>
 </div>
 );
}
