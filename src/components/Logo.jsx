export default function Logo({ className = '', variant = 'full' }) {
  return (
    <img 
      src="/logo.png" 
      alt="Food 101" 
      className={`object-contain ${variant === 'icon' ? 'h-10 w-10' : 'h-12 md:h-14 w-auto'} ${className}`} 
    />
  );
}