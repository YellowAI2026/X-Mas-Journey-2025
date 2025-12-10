export interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  description: string;
  humidity: number;
  windSpeed: number;
}

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const MUNICH_LAT = 48.1351;
const MUNICH_LON = 11.5820;

export class WeatherService {
  async getWeather(date: Date): Promise<WeatherData> {
    // If API key is available, try to fetch real data
    if (WEATHER_API_KEY) {
      try {
        return await this.fetchRealWeather(date);
      } catch (error) {
        console.warn('Weather API failed, using mock data:', error);
      }
    }

    // Return mock weather data
    return this.getMockWeather(date);
  }

  private async fetchRealWeather(_date: Date): Promise<WeatherData> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${MUNICH_LAT}&lon=${MUNICH_LON}&units=metric&appid=${WEATHER_API_KEY}&lang=de`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API request failed');

    const data = await response.json();

    return {
      temp: Math.round(data.main.temp),
      condition: this.mapWeatherCondition(data.weather[0].main),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
    };
  }

  private mapWeatherCondition(
    condition: string
  ): WeatherData['condition'] {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sun'))
      return 'sunny';
    if (conditionLower.includes('rain')) return 'rainy';
    if (conditionLower.includes('snow')) return 'snowy';
    if (conditionLower.includes('wind')) return 'windy';
    return 'cloudy';
  }

  private getMockWeather(date: Date): WeatherData {
    // Simulate realistic Munich winter weather
    const month = date.getMonth();
    const isDecember = month === 11;

    if (isDecember) {
      // More realistic Christmas weather for Munich
      const scenarios: WeatherData[] = [
        {
          temp: 2,
          condition: 'snowy',
          description: 'Leichter Schneefall',
          humidity: 85,
          windSpeed: 12,
        },
        {
          temp: 5,
          condition: 'cloudy',
          description: 'Bewölkt mit gelegentlichen Aufhellungen',
          humidity: 75,
          windSpeed: 8,
        },
        {
          temp: 0,
          condition: 'sunny',
          description: 'Sonnig und kalt',
          humidity: 60,
          windSpeed: 5,
        },
        {
          temp: 3,
          condition: 'rainy',
          description: 'Leichter Nieselregen',
          humidity: 90,
          windSpeed: 15,
        },
      ];

      // Pick based on day of month for consistency
      const index = date.getDate() % scenarios.length;
      return scenarios[index];
    }

    // Default winter weather
    return {
      temp: 4,
      condition: 'cloudy',
      description: 'Typisches Winterwetter',
      humidity: 70,
      windSpeed: 10,
    };
  }

  getClothingRecommendation(weather: WeatherData, hasInfants: boolean): string[] {
    const recommendations: string[] = [];

    // Temperature-based recommendations
    if (weather.temp < 0) {
      recommendations.push('Wintermantel oder dicke Daunenjacke');
      recommendations.push('Thermounterwäsche');
      recommendations.push('Dicke Handschuhe und Mütze');
      recommendations.push('Winterstiefel mit gutem Profil');
      recommendations.push('Schal oder Halstuch');
    } else if (weather.temp < 5) {
      recommendations.push('Warme Winterjacke');
      recommendations.push('Handschuhe und Mütze');
      recommendations.push('Warme Stiefel');
      recommendations.push('Schal');
    } else {
      recommendations.push('Warme Jacke oder Mantel');
      recommendations.push('Optional: Leichte Handschuhe und Mütze');
    }

    // Weather condition specific
    if (weather.condition === 'rainy') {
      recommendations.push('Regenjacke oder Regenschirm');
      recommendations.push('Wasserfeste Schuhe');
    } else if (weather.condition === 'snowy') {
      recommendations.push('Wasserfeste Winterschuhe');
      recommendations.push('Optional: Schneehose für Kinder');
    }

    // Wind specific
    if (weather.windSpeed > 20) {
      recommendations.push('Winddichte Jacke');
    }

    // Special recommendations for families with infants
    if (hasInfants) {
      recommendations.push('Warme Decke für Kinderwagen/Buggy');
      recommendations.push('Fußsack für Kinderwagen');
      recommendations.push('Extra Ersatzkleidung');
    }

    return recommendations;
  }
}

export const weatherService = new WeatherService();
