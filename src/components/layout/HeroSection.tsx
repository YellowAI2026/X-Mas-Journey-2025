export function HeroSection() {
  return (
    <div className="relative mb-12 overflow-hidden rounded-3xl glass-effect">
      {/* Munich Christmas Scene SVG */}
      <div className="relative h-64 md:h-80 flex items-center justify-center bg-gradient-to-br from-christmas-red/10 via-christmas-green/10 to-christmas-gold/10">
        <svg
          viewBox="0 0 800 320"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sky with gradient */}
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2C5F8D" />
              <stop offset="100%" stopColor="#5A8FC4" />
            </linearGradient>
            <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B7355" />
              <stop offset="100%" stopColor="#6B5745" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="800" height="320" fill="url(#skyGradient)" />

          {/* Snowflakes */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={`snow-${i}`}
              cx={40 + i * 40}
              cy={20 + (i % 3) * 30}
              r="2"
              fill="white"
              opacity="0.8"
            >
              <animate
                attributeName="cy"
                from={20 + (i % 3) * 30}
                to="320"
                dur={`${3 + (i % 3)}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Marienplatz - Neues Rathaus (simplified) */}
          <g id="rathaus">
            {/* Main building */}
            <rect x="250" y="120" width="300" height="200" fill="url(#buildingGradient)" />

            {/* Tower */}
            <rect x="370" y="40" width="60" height="80" fill="#6B5745" />

            {/* Tower top */}
            <polygon points="400,20 370,40 430,40" fill="#C41E3A" />

            {/* Cross on top */}
            <rect x="398" y="10" width="4" height="12" fill="#FFD700" />
            <rect x="393" y="15" width="14" height="4" fill="#FFD700" />

            {/* Windows */}
            {[...Array(6)].map((_, row) =>
              [...Array(8)].map((_, col) => (
                <rect
                  key={`window-${row}-${col}`}
                  x={265 + col * 35}
                  y={135 + row * 30}
                  width="20"
                  height="25"
                  fill="#FFD700"
                  opacity="0.9"
                />
              ))
            )}
          </g>

          {/* Christmas tree in front */}
          <g id="christmasTree">
            {/* Tree */}
            <polygon points="400,250 380,280 420,280" fill="#165B33" />
            <polygon points="400,230 375,265 425,265" fill="#165B33" />
            <polygon points="400,210 370,250 430,250" fill="#165B33" />

            {/* Tree trunk */}
            <rect x="395" y="280" width="10" height="20" fill="#6B5745" />

            {/* Ornaments */}
            <circle cx="390" cy="240" r="3" fill="#C41E3A" />
            <circle cx="410" cy="245" r="3" fill="#FFD700" />
            <circle cx="400" cy="260" r="3" fill="#C41E3A" />
            <circle cx="385" cy="270" r="3" fill="#FFD700" />

            {/* Star on top */}
            <polygon points="400,200 395,210 385,210 393,216 390,226 400,220 410,226 407,216 415,210 405,210" fill="#FFD700" />
          </g>

          {/* Snow on ground */}
          <ellipse cx="400" cy="310" rx="400" ry="15" fill="white" opacity="0.8" />

          {/* Christmas market stalls */}
          <g id="stalls">
            {/* Left stall */}
            <rect x="100" y="240" width="80" height="60" fill="#8B4513" />
            <polygon points="140,230 100,240 180,240" fill="#C41E3A" />
            <rect x="110" y="255" width="25" height="30" fill="#FFD700" opacity="0.7" />

            {/* Right stall */}
            <rect x="620" y="240" width="80" height="60" fill="#8B4513" />
            <polygon points="660,230 620,240 700,240" fill="#C41E3A" />
            <rect x="665" y="255" width="25" height="30" fill="#FFD700" opacity="0.7" />
          </g>

          {/* Street lamps */}
          <g id="lamps">
            {/* Left lamp */}
            <rect x="195" y="220" width="5" height="80" fill="#333" />
            <circle cx="197.5" cy="215" r="8" fill="#FFD700" opacity="0.9">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Right lamp */}
            <rect x="600" y="220" width="5" height="80" fill="#333" />
            <circle cx="602.5" cy="215" r="8" fill="#FFD700" opacity="0.9">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin="1s" />
            </circle>
          </g>
        </svg>
      </div>
    </div>
  );
}
