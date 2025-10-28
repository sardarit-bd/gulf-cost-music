'use client'
import { useState } from 'react'

export default function VenueDashboard() {
  const [venue, setVenue] = useState({
    name: '',
    city: '',
    address: '',
    capacity: '',
    biography: '',
    openHours: '',
    photos: []
  })

  const cities = ['New Orleans', 'Biloxi', 'Mobile', 'Pensacola']

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Handle venue profile update logic here
    console.log('Updating venue profile:', venue)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Venue Dashboard</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Venue Name</label>
            <input
              type="text"
              value={venue.name}
              onChange={(e) => setVenue({...venue, name: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <select
              value={venue.city}
              onChange={(e) => setVenue({...venue, city: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={venue.address}
              onChange={(e) => setVenue({...venue, address: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Seating Capacity</label>
            <input
              type="number"
              value={venue.capacity}
              onChange={(e) => setVenue({...venue, capacity: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Biography</label>
          <textarea
            value={venue.biography}
            onChange={(e) => setVenue({...venue, biography: e.target.value})}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Open Hours & Days</label>
          <textarea
            value={venue.openHours}
            onChange={(e) => setVenue({...venue, openHours: e.target.value})}
            rows={3}
            placeholder="e.g., Monday-Friday: 5PM-12AM, Saturday-Sunday: 12PM-2AM"
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
          Update Venue Profile
        </button>
      </form>
    </div>
  )
}