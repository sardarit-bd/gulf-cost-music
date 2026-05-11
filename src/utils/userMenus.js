import {
  LayoutDashboard,
  User,
  Store,
  CreditCard,
  ShoppingBag,
  PlusCircle,
  Image,
  Video,
  Settings,
  Newspaper,
  Camera,
  Music,
} from "lucide-react";

export const ROLE_MENUS = {
  artist: [
    { label: "Dashboard", href: "/dashboard/artist", icon: LayoutDashboard },
    { label: "Manage Profile", href: "/dashboard/artist/manageProfile", icon: User },
    { label: "Market", href: "/dashboard/artist/marketplace", icon: Store },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Orders", href: "/dashboard/artist/orders", icon: ShoppingBag },
  ],

  photographer: [
    { label: "Overview", href: "/dashboard/photographer", icon: LayoutDashboard },
    { label: "Manage Profile", href: "/dashboard/photographer/manageprofile", icon: User },
    { label: "Service", href: "/dashboard/photographer/service", icon: Settings },
    { label: "Photos", href: "/dashboard/photographer/photos", icon: Image },
    { label: "Videos", href: "/dashboard/photographer/videos", icon: Video },
    { label: "Market", href: "/dashboard/photographer/market", icon: Store },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Orders", href: "/dashboard/photographer/orders", icon: ShoppingBag },
  ],

  venue: [
    { label: "Overview", href: "/dashboard/venue", icon: LayoutDashboard },
    { label: "Add Show", href: "/dashboard/venue/addshow", icon: PlusCircle },
    { label: "Market", href: "/dashboard/venue/marketplace", icon: Store },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Orders", href: "/dashboard/venue/orders", icon: ShoppingBag },
  ],

  journalist: [
    { label: "Overview", href: "/dashboard/journalist", icon: LayoutDashboard },
    { label: "My Profile", href: "/dashboard/journalist/profile", icon: User },
    { label: "Create Post", href: "/dashboard/journalist/create-news", icon: Newspaper },
    { label: "Market", href: "/dashboard/journalist/market", icon: Store },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Orders", href: "/dashboard/journalist/orders", icon: ShoppingBag },
  ],

  studio: [
    { label: "Overview", href: "/dashboard/studio", icon: LayoutDashboard },
    { label: "Edit Profile", href: "/dashboard/studio/profile", icon: User },
    { label: "Media", href: "/dashboard/studio/media", icon: Image },
    { label: "Services", href: "/dashboard/studio/profile/services", icon: Settings },
    { label: "Market", href: "/dashboard/studio/market", icon: Store },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Orders", href: "/dashboard/studio/orders", icon: ShoppingBag },
  ],

  fan: [
    { label: "Overview", href: "/dashboard/fan", icon: LayoutDashboard },
    { label: "Market", href: "/dashboard/fan/market", icon: Store },
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Orders", href: "/dashboard/fan/orders", icon: ShoppingBag },
  ],
};