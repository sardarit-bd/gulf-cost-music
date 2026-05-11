"use client";

import StatCard from "@/components/modules/dashboard/artists/StatCard";
import { Crown, Pause, Play, TrendingUp, User, Users } from "lucide-react";

const ArtistStats = ({ stats, planStats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
      <StatCard
        icon={User}
        label="Total Artists"
        value={stats.total}
        color="purple"
      />
      <StatCard
        icon={Play}
        label="Active Artists"
        value={stats.active}
        color="green"
      />
      <StatCard
        icon={Pause}
        label="Inactive Artists"
        value={stats.inactive}
        color="orange"
      />
      <StatCard
        icon={Crown}
        label="Pro Plan"
        value={planStats.pro}
        color="yellow"
        plan="pro"
      />
      <StatCard
        icon={Users}
        label="Free Plan"
        value={planStats.free}
        color="blue"
        plan="free"
      />
      <StatCard
        icon={TrendingUp}
        label="This Month"
        value={stats.thisMonth}
        color="indigo"
      />
    </div>
  );
};

export default ArtistStats;
