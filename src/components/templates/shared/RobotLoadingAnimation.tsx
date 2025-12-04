interface RobotLoadingAnimationProps {
  color?: string;
}

export function RobotLoadingAnimation({ color = '#06b6d4' }: RobotLoadingAnimationProps) {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-pulse"
        >
          <circle cx="60" cy="60" r="40" fill={color} fillOpacity="0.1" />
          <circle cx="60" cy="60" r="30" fill={color} fillOpacity="0.2" />

          <rect x="40" y="50" width="40" height="35" rx="8" fill={color} />

          <circle cx="50" cy="63" r="4" fill="white">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="70" cy="63" r="4" fill="white">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              repeatCount="indefinite"
              begin="0.3s"
            />
          </circle>

          <path
            d="M 50 73 Q 60 78 70 73"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          >
            <animate
              attributeName="d"
              values="M 50 73 Q 60 78 70 73;M 50 75 Q 60 77 70 75;M 50 73 Q 60 78 70 73"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          <rect x="35" y="45" width="8" height="15" rx="4" fill={color} />
          <rect x="77" y="45" width="8" height="15" rx="4" fill={color} />

          <circle cx="60" cy="35" r="3" fill={color}>
            <animate
              attributeName="r"
              values="3;5;3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-full h-full rounded-full animate-ping opacity-20"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
