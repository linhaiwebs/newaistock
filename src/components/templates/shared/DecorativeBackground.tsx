interface DecorativeBackgroundProps {
  color: string;
  opacity?: number;
}

export function DecorativeBackground({ color, opacity = 0.1 }: DecorativeBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
        style={{
          background: `radial-gradient(circle, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          animationDuration: '4s',
        }}
      />
      <div
        className="absolute top-1/3 -left-32 w-96 h-96 rounded-full blur-3xl animate-pulse"
        style={{
          background: `radial-gradient(circle, ${color}${Math.round(opacity * 0.6 * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          animationDuration: '6s',
          animationDelay: '1s',
        }}
      />
      <div
        className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse"
        style={{
          background: `radial-gradient(circle, ${color}${Math.round(opacity * 0.8 * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          animationDuration: '5s',
          animationDelay: '2s',
        }}
      />
    </div>
  );
}
