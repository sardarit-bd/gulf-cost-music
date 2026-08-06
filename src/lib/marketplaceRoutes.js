const MARKETPLACE_ROUTES = {
  artist: "/dashboard/artist/marketplace",
  venue: "/dashboard/venue/marketplace",
  photographer: "/dashboard/photographer/market",
  studio: "/dashboard/studio/market",
  journalist: "/dashboard/journalist/market",
  fan: "/dashboard/fan/market",
};

export function getMarketplacePath(userType) {
  return MARKETPLACE_ROUTES[userType] || "/dashboard/artist/marketplace";
}
