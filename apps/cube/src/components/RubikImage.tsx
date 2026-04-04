

interface Props {
  src: string;
  spin?: number;
  className?: string;
  alt?: string;
}

export function RubikImage({ src, spin = 0, className = '', alt = 'rubik case' }: Props) {
  return (
    <img 
      src={src} 
      alt={alt}
      className={`transition-transform duration-300 ease-spring ${className}`}
      style={{ transform: `rotate(${spin}deg)` }}
      draggable={false}
    />
  );
}
