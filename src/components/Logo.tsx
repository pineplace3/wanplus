import Image from "next/image";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 肉球アイコン */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* メインのパッド */}
        <ellipse cx="20" cy="30" rx="8" ry="6" fill="currentColor" />
        {/* 4つの小さなパッド */}
        <ellipse cx="14" cy="18" rx="3" ry="4" fill="currentColor" />
        <ellipse cx="20" cy="15" rx="3" ry="4" fill="currentColor" />
        <ellipse cx="26" cy="18" rx="3" ry="4" fill="currentColor" />
        <ellipse cx="17" cy="12" rx="2.5" ry="3.5" fill="currentColor" />
      </svg>
      
      {/* テキスト */}
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-bold text-white">ワンプラス</span>
        <span className="text-sm font-normal text-white/90 lowercase">wanplus</span>
      </div>
    </div>
  );
}
