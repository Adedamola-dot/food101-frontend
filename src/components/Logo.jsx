export default function Logo({ className = '', variant = 'full' }) {
  // Check if the logo is being placed on a dark background (e.g., Footer)
  const isDarkBg = className.includes('text-white');

  return (
    <div className={`inline-flex items-center justify-center ${isDarkBg ? 'bg-white p-1.5 rounded-2xl' : ''}`}>
      <img 
        src="/logo.png" 
        alt="Food 101" 
        className={`object-contain ${variant === 'icon' ? 'h-10 w-10' : 'h-12 md:h-14 w-auto'} ${className}`} 
      />
    </div>
  );
}