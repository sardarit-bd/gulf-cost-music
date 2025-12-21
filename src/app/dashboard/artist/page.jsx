"use client";


import ArtistDashboard from '@/components/modules/dashboard/artists/ArtistDashboard';
import { useAuth } from '@/context/AuthContext';

const ArtistPage = () => {
  const { user } = useAuth();

  return (
    <ArtistDashboard key={user?._id} />
  );
}

export default ArtistPage;