'use client'
import { useState } from 'react'

export default function ArtistDashboard() {
  const [profile, setProfile] = useState({
    name: '',
    city: '',
    genre: '',
    biography: '',
    photos: [],
    mp3File: null
  })

  const genres = ['Rap', 'Country', 'Pop', 'Rock', 'Jazz', 'Reggae', 'EDM', 'Classical', 'Other']

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Handle profile update logic here
    console.log('Updating artist profile:', profile)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Artist Dashboard</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => setProfile({...profile, city: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Genre</label>
            <select
              value={profile.genre}
              onChange={(e) => setProfile({...profile, genre: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Genre</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">MP3 File</label>
            <input
              type="file"
              accept=".mp3"
              onChange={(e) => setProfile({...profile, mp3File: e.target.files[0]})}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Biography</label>
          <textarea
            value={profile.biography}
            onChange={(e) => setProfile({...profile, biography: e.target.value})}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Photos (Up to 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="mt-1 block w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  )
}