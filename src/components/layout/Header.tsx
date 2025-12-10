import { Snowflake, Star } from 'lucide-react';

export function Header() {
  return (
    <header className="relative py-8 px-4 text-center overflow-hidden">
      {/* Animated snowflakes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Snowflake
          className="absolute top-4 left-[10%] text-christmas-gold/30 animate-pulse"
          size={24}
        />
        <Snowflake
          className="absolute top-8 right-[15%] text-christmas-gold/20 animate-pulse"
          size={32}
          style={{ animationDelay: '1s' }}
        />
        <Star
          className="absolute top-6 left-[85%] text-christmas-red/20 animate-pulse"
          size={20}
          style={{ animationDelay: '0.5s' }}
        />
        <Star
          className="absolute top-12 left-[5%] text-christmas-green/20 animate-pulse"
          size={16}
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Snowflake className="text-christmas-red" size={32} />
          <h1 className="text-4xl md:text-5xl font-bold text-christmas-red">
            Weihnachts-Routen-Planer
          </h1>
          <Snowflake className="text-christmas-green" size={32} />
        </div>
        <p className="text-lg md:text-xl text-gray-600 mt-2">
          Perfekte Weihnachtsrouten für Familien in München
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500">
          <span>🎄</span>
          <span>Powered by Claude AI</span>
          <span>✨</span>
        </div>
      </div>
    </header>
  );
}
