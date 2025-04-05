import React from "react";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <input
      type="text"
      placeholder="Search for a movie..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="mt-4 p-3 border-2 border-gray-300 rounded-lg w-full sm:w-2/3 md:w-1/2 lg:w-1/3 text-lg"
    />
  );
}
