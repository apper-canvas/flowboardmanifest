import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuClick, onSearch, selectedProject }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:pl-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <ApperIcon name="Menu" className="w-6 h-6" />
            </button>
          </div>

          {/* Project title and breadcrumb */}
          <div className="flex items-center space-x-4 flex-1 lg:flex-initial">
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold font-display text-gray-900">
                {selectedProject ? selectedProject.title : "Projects"}
              </h1>
              {selectedProject && (
                <p className="text-sm text-gray-500 mt-1">
                  {selectedProject.description}
                </p>
              )}
            </div>
          </div>

          {/* Search and actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block w-80">
              <SearchBar
                placeholder="Search tasks and projects..."
                onSearch={handleSearch}
                value={searchQuery}
/>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="pb-4 sm:hidden">
          <SearchBar
            placeholder="Search tasks and projects..."
            onSearch={handleSearch}
            value={searchQuery}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;