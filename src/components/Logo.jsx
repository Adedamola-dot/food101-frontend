export default function Logo({ variant = 'full', className = '' }) {
  // variant: 'full' | 'icon'
  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="24" fill="#FF4747" />
          <path d="M30 40 Q30 30 40 30 L55 30 Q60 30 60 35" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M30 40 L30 70 L50 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M40 20 Q42 15 45 20" stroke="#FFB800" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M50 18 Q52 13 55 18" stroke="#FFB800" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M60 20 Q62 15 65 20" stroke="#FFB800" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    );
  }

  // 'full' variant (for navbar and footer)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center w-10 h-10 bg-brand-red rounded-xl shadow-sm">
        <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
           <path d="M30 40 Q30 30 40 30 L55 30 Q60 30 60 35" stroke="white" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M30 40 L30 75 L55 75" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M42 20 Q44 14 47 20" stroke="#FFB800" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M52 18 Q54 12 57 18" stroke="#FFB800" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M62 20 Q64 14 67 20" stroke="#FFB800" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <span className="text-2xl font-black tracking-tight text-brand-dark">
        FOOD<span className="text-brand-red">101</span>
      </span>
    </div>
  );
}