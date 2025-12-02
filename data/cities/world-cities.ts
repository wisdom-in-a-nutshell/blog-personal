/**
 * World cities data for AI-generated isometric city illustrations.
 * Images generated using GPT-4o image generation with weather-aware prompts.
 * All images hosted on AIPodcasting CDN.
 */

export type City = {
  name: string;
  country: string;
  slug: string;
  imageUrl: string;
};

const CDN_BASE = "https://storage.aipodcast.ing/permanent/cities";

/**
 * Generate city entry with CDN URL from slug
 */
function city(name: string, country: string, slug: string): City {
  return {
    name,
    country,
    slug,
    imageUrl: `${CDN_BASE}/${slug}.png`,
  };
}

/**
 * All world cities with AI-generated isometric illustrations
 * Note: Some cities excluded due to missing images
 */
export const WORLD_CITIES: City[] = [
  city("New York City", "USA", "new_york_city"),
  city("London", "UK", "london"),
  city("Tokyo", "Japan", "tokyo"),
  city("Paris", "France", "paris"),
  city("Dubai", "UAE", "dubai"),
  city("Singapore", "Singapore", "singapore"),
  city("Hong Kong", "China", "hong_kong"),
  city("Sydney", "Australia", "sydney"),
  city("Los Angeles", "USA", "los_angeles"),
  city("Berlin", "Germany", "berlin"),
  city("Toronto", "Canada", "toronto"),
  city("Seoul", "South Korea", "seoul"),
  city("Mumbai", "India", "mumbai"),
  city("Shanghai", "China", "shanghai"),
  city("Bangkok", "Thailand", "bangkok"),
  city("Amsterdam", "Netherlands", "amsterdam"),
  city("Rome", "Italy", "rome"),
  city("Barcelona", "Spain", "barcelona"),
  city("Istanbul", "Turkey", "istanbul"),
  city("Mexico City", "Mexico", "mexico_city"),
  city("Moscow", "Russia", "moscow"),
  city("Cairo", "Egypt", "cairo"),
  city("Buenos Aires", "Argentina", "buenos_aires"),
  city("Vienna", "Austria", "vienna"),
  city("Prague", "Czech Republic", "prague"),
  city("Athens", "Greece", "athens"),
  city("Lisbon", "Portugal", "lisbon"),
  city("Dublin", "Ireland", "dublin"),
  city("Copenhagen", "Denmark", "copenhagen"),
  city("Stockholm", "Sweden", "stockholm"),
  city("Warsaw", "Poland", "warsaw"),
  city("Brussels", "Belgium", "brussels"),
  city("Zurich", "Switzerland", "zurich"),
  city("Milan", "Italy", "milan"),
  city("Madrid", "Spain", "madrid"),
  city("Taipei", "Taiwan", "taipei"),
  city("Kuala Lumpur", "Malaysia", "kuala_lumpur"),
  city("Jakarta", "Indonesia", "jakarta"),
  city("Manila", "Philippines", "manila"),
  city("Ho Chi Minh City", "Vietnam", "ho_chi_minh_city"),
  city("Delhi", "India", "delhi"),
  city("Bangalore", "India", "bangalore"),
  city("Johannesburg", "South Africa", "johannesburg"),
  city("Tel Aviv", "Israel", "tel_aviv"),
  city("San Francisco", "USA", "san_francisco"),
  city("Chicago", "USA", "chicago"),
] as const;

export const CITY_COUNT = WORLD_CITIES.length;
