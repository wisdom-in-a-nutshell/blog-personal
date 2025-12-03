/**
 * Brand stores data for AI-generated chibi-style miniature concept stores.
 * Images generated using Gemini image generation.
 * All images hosted on AIPodcasting CDN.
 *
 * Prompt credit: @dotey - https://x.com/dotey/status/1995190286775881780
 */

export type Brand = {
  name: string;
  slug: string;
  imageUrl: string;
};

const CDN_BASE = "https://storage.aipodcast.ing/permanent/brand_stores";

function brand(name: string, slug: string): Brand {
  return { name, slug, imageUrl: `${CDN_BASE}/${slug}.png` };
}

/**
 * All 50 food chain brands with AI-generated miniature store illustrations
 * Ordered by popularity/fame (most famous first)
 */
export const BRAND_STORES: Brand[] = [
  brand("Starbucks", "starbucks"),
  brand("McDonald's", "mcdonalds"),
  brand("KFC", "kfc"),
  brand("Dunkin'", "dunkin"),
  brand("Krispy Kreme", "krispy_kreme"),
  brand("Taco Bell", "taco_bell"),
  brand("Subway", "subway"),
  brand("Pizza Hut", "pizza_hut"),
  brand("Domino's", "dominos"),
  brand("Chick-fil-A", "chick_fil_a"),
  brand("Wendy's", "wendys"),
  brand("Burger King", "burger_king"),
  brand("Popeyes", "popeyes"),
  brand("Panda Express", "panda_express"),
  brand("Chipotle", "chipotle"),
  brand("Five Guys", "five_guys"),
  brand("In-N-Out", "in_n_out"),
  brand("Shake Shack", "shake_shack"),
  brand("Dairy Queen", "dairy_queen"),
  brand("Baskin-Robbins", "baskin_robbins"),
  brand("Cold Stone", "cold_stone"),
  brand("Ben & Jerry's", "ben_and_jerrys"),
  brand("Häagen-Dazs", "häagen_dazs"),
  brand("Tim Hortons", "tim_hortons"),
  brand("Costa Coffee", "costa_coffee"),
  brand("Peet's Coffee", "peets_coffee"),
  brand("Blue Bottle Coffee", "blue_bottle_coffee"),
  brand("Panera Bread", "panera_bread"),
  brand("Au Bon Pain", "au_bon_pain"),
  brand("Jamba Juice", "jamba_juice"),
  brand("Smoothie King", "smoothie_king"),
  brand("Wingstop", "wingstop"),
  brand("Buffalo Wild Wings", "buffalo_wild_wings"),
  brand("Nando's", "nandos"),
  brand("Raising Cane's", "raising_canes"),
  brand("Sonic", "sonic"),
  brand("Arby's", "arbys"),
  brand("Jack in the Box", "jack_in_the_box"),
  brand("Carl's Jr.", "carls_jr"),
  brand("Hardee's", "hardees"),
  brand("Whataburger", "whataburger"),
  brand("Culver's", "culvers"),
  brand("Potbelly", "potbelly"),
  brand("Jimmy John's", "jimmy_johns"),
  brand("Jersey Mike's", "jersey_mikes"),
  brand("Firehouse Subs", "firehouse_subs"),
  brand("Qdoba", "qdoba"),
  brand("Moe's Southwest Grill", "moes_southwest_grill"),
  brand("Del Taco", "del_taco"),
  brand("El Pollo Loco", "el_pollo_loco"),
];

export const BRAND_COUNT = BRAND_STORES.length;
