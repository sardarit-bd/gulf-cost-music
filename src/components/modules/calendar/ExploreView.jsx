"use client";

import { Calendar, ChevronRight, MapPin, Music, Sparkles } from "lucide-react";

export default function ExploreView({ events, onSelectLocation }) {
    // Group events by state and city (for overview)
    const groupedByLocation = {};

    // Also group upcoming events count
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    events.forEach(event => {
        if (!event.state || !event.city) return;

        const state = event.state;
        const city = event.city;
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        const isUpcoming = eventDate >= today;

        if (!groupedByLocation[state]) {
            groupedByLocation[state] = {
                cities: {},
                totalEvents: 0,
                upcomingEvents: 0
            };
        }

        if (!groupedByLocation[state].cities[city]) {
            groupedByLocation[state].cities[city] = {
                count: 0,
                upcomingCount: 0,
                latestEvents: [],
                events: []
            };
        }

        groupedByLocation[state].cities[city].count++;
        groupedByLocation[state].cities[city].events.push(event);
        groupedByLocation[state].totalEvents++;

        if (isUpcoming) {
            groupedByLocation[state].cities[city].upcomingCount++;
            groupedByLocation[state].upcomingEvents++;
        }

        // Store latest events (up to 3)
        if (groupedByLocation[state].cities[city].latestEvents.length < 3) {
            groupedByLocation[state].cities[city].latestEvents.push(event);
        }
    });

    // Sort states alphabetically
    const sortedStates = Object.keys(groupedByLocation).sort();

    // Calculate totals
    const totalEvents = events.length;
    const totalUpcoming = events.filter(e => new Date(e.date) >= today).length;
    const totalStates = sortedStates.length;
    const totalCities = Object.values(groupedByLocation).reduce((acc, state) => {
        return acc + Object.keys(state.cities).length;
    }, 0);

    return (
        <div className="p-6">
            {/* Welcome Header */}
            <div className="mb-6 text-center">
                <div className="inline-flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full mb-3">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-700">Discover Live Music</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Music className="w-6 h-6 text-yellow-500" />
                    Explore Events by Location
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                    Find events across {totalStates} states and {totalCities} cities
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3 mb-6 max-w-md mx-auto">
                <div className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
                    <p className="text-xs text-gray-500">Total Events</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-green-600">{totalUpcoming}</p>
                    <p className="text-xs text-gray-500">Upcoming</p>
                </div>
                {/* <div className="bg-white rounded-xl border border-gray-200 p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">{totalCities}</p>
                    <p className="text-xs text-gray-500">Cities</p>
                </div> */}
            </div>

            {/* States and Cities Grid */}
            {sortedStates.length > 0 ? (
                <div className="space-y-6">
                    {sortedStates.map((state) => {
                        const stateData = groupedByLocation[state];
                        const cities = Object.keys(stateData.cities).sort((a, b) => {
                            return stateData.cities[b].count - stateData.cities[a].count;
                        });

                        return (
                            <div key={state} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                {/* State Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-3 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white shadow-sm">
                                                <Music className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-gray-900">{state}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {stateData.totalEvents} events • {stateData.upcomingEvents} upcoming
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cities Grid */}
                                <div className="p-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {cities.map((city) => {
                                            const cityData = stateData.cities[city];
                                            const cityDisplayName = city
                                                .split(' ')
                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                .join(' ');

                                            const hasUpcoming = cityData.upcomingCount > 0;
                                            const latestEvent = cityData.latestEvents[0];

                                            return (
                                                <div
                                                    key={`${state}-${city}`}
                                                    onClick={() => onSelectLocation(state, city)}
                                                    className="group cursor-pointer p-3 rounded-xl border border-gray-100 bg-white hover:border-yellow-300 hover:shadow-md transition-all duration-200"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <MapPin className="w-3 h-3 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                                                                <p className="font-medium text-gray-800 text-sm capitalize group-hover:text-yellow-600 transition-colors">
                                                                    {cityDisplayName}
                                                                </p>
                                                            </div>
                                                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                                    <span className="text-xs text-gray-500">{cityData.count} events</span>
                                                                </div>
                                                                {hasUpcoming && (
                                                                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                                                                        {cityData.upcomingCount} upcoming
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {/* Latest event preview */}
                                                            {latestEvent && (
                                                                <div className="mt-2 pt-1 border-t border-gray-100">
                                                                    <p className="text-[10px] text-gray-400 truncate">
                                                                        Next: {latestEvent.title}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-yellow-500 group-hover:translate-x-0.5 transition-all" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Music className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No events found
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Events will appear here when they are added to the calendar
                    </p>
                </div>
            )}

            {/* Footer Note */}
            {sortedStates.length > 0 && (
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">
                        Click on any city to view all events in that location
                    </p>
                </div>
            )}
        </div>
    );
}