export const ROLE_MENUS = {
  artist: [
    { label: "Dashboard", href: "/dashboard/artist" },
    { label: "Manage Profile", href: "/dashboard/artist/manageProfile" },
    { label: "Marketplace", href: "/dashboard/artist/marketplace" },
    // { label: "Billing", href: "/dashboard/artist/billing" },
    { label: "Orders", href: "/dashboard/artist/orders" },
  ],
  photographer: [
    { label: "Overview", href: "/dashboard/photographer" },
    { label: "Manage Profile", href: "/dashboard/photographer/manageprofile" },
    { label: "Service", href: "/dashboard/photographer/service" },
    { label: "Photos", href: "/dashboard/photographer/photos" },
    { label: "Videos", href: "/dashboard/photographer/videos" },
    { label: "Market", href: "/dashboard/photographer/market" },
    // { label: "Billing", href: "/dashboard/photographer/billing" },
  ],
  venue: [
    { label: "Overview", href: "/dashboard/venue" },
    { label: "Edit Profile", href: "/dashboard/venue/edit" },
    { label: "Add Show", href: "/dashboard/venue/addshow" },
    { label: "Market", href: "/dashboard/venue/marketplace" },
    { label: "Orders", href: "/dashboard/venue/orders" },
    // { label: "Billing", href: "/dashboard/venue/billing" },
  ],
  journalist: [
    { label: "Overview", href: "/journalist/dashboard" },
    { label: "My Posts", href: "/dashboard/journalist/profile" },
    { label: "Create Post", href: "/dashboard/journalist/create-news" },
    { label: "Edit Post", href: "/dashboard/journalist/edit-news" },
    { label: "Billing", href: "/dashboard/journalist/billing" },
  ],

  studio: [
    { label: "Overview", href: "/dashboard/studio" },
    { label: "Edit Profile", href: "/dashboard/studio/profile" },
    { label: "Media", href: "/dashboard/studio/media" },
    { label: "Services", href: "/dashboard/studio/profile/services" },
    // { label: "Billing", href: "/dashboard/studio/billing" },
  ],
};
