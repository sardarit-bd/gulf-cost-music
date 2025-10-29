'use client'
import { useState } from 'react'

export default function JournalistDashboard() {
  const [news, setNews] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    credit: '',
    photos: []
  })

  const cities = ['New Orleans', 'Biloxi', 'Mobile', 'Pensacola']

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Handle news submission logic here
    console.log('Submitting news:', news)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Journalist Dashboard</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={news.title}
              onChange={(e) => setNews({...news, title: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select
              value={news.location}
              onChange={(e) => setNews({...news, location: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Location</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={news.date}
              onChange={(e) => setNews({...news, date: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Credit</label>
            <input
              type="text"
              value={news.credit}
              onChange={(e) => setNews({...news, credit: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={news.description}
            onChange={(e) => setNews({...news, description: e.target.value})}
            rows={6}
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
          Submit News
        </button>
      </form>
    </div>
  )
}