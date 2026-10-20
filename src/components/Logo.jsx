export default function Logo({ className = '', variant = 'full' }) {
  const isLight = className.includes('text-white');

  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="24" fill="#FF4747" />
          <path d="M25 40 Q25 30 35 30 L55 30 Q62 30 62 36" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M25 40 L25 75 L55 75" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M38 22 Q40 14 44 22" stroke="#FFB800" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M50 20 Q52 12 56 20" stroke="#FFB800" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M62 22 Q64 14 68 22" stroke="#FFB800" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    );
  }

  // Full Logo (Navbar & Footer)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center justify-center w-11 h-11 bg-brand-red rounded-xl shadow-sm">
        {/* SVG Icon: F with steam */}
        <svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 40 Q30 30 40 30 L55 30 Q60 30 60 35" stroke="white" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M30 40 L30 75 L55 75" stroke="white" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M42 20 Q44 14 47 20" stroke="#FFB800" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M52 18 Q54 12 57 18" stroke="#FFB800" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M62 20 Q64 14 67 20" stroke="#FFB800" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      
      {/* Text: FOOD101 */}
      <div className="flex items-end">
        <span className={`text-2xl font-black tracking-tighter ${isLight ? 'text-white' : 'text-brand-dark'} leading-none`}>
          FOOD
        </span>
        <span className="text-2xl font-black tracking-tighter text-brand-red leading-none">
          101
        </span>
      </div>
    </div>
  );
}