import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, memo, useCallback, useMemo } from "react";

interface Filters {
  disciplines: string[];
  levels: string[];
  availability: string[];
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filterType: keyof Filters, value: string, checked: boolean) => void;
  onClearFilters: () => void;
}

export const FilterBar = memo(function FilterBar({ filters, onFilterChange, onClearFilters }: FilterBarProps) {
  const [showFilterDropdowns, setShowFilterDropdowns] = useState(false);

  const disciplines = ['Service Design', 'UX Generalist', 'Product Design', 'Front-end Design', 'Developer Experience', 'Content Strategy', 'Product Management', 'Engineering', 'Program Management'];
  const levels = ['D3', 'D4', 'D5', 'D6', 'E3', 'E4', 'E5', 'E6', 'P4', 'P5', 'P6', 'PM4', 'PM5', 'PM6'];
  const availability = ['Bench', '50% Staffed', '100% Staffed'];

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(filterArray => filterArray.length > 0);
  }, [filters]);

  const handleFilterToggle = useCallback((type: keyof Filters, value: string) => {
    const isCurrentlySelected = filters[type].includes(value);
    onFilterChange(type, value, !isCurrentlySelected);
  }, [filters, onFilterChange]);

  const removeFilter = useCallback((type: keyof Filters, value: string) => {
    onFilterChange(type, value, false);
  }, [onFilterChange]);

  return (
    <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilterDropdowns(!showFilterDropdowns)}
            className="text-xs h-7"
          >
            Add Filter
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs h-7 text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {filters.disciplines.map((discipline) => (
          <Badge
            key={`discipline-${discipline}`}
            variant="secondary"
            className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer rounded-full px-3 py-1"
          >
            {discipline}
            <button
              onClick={() => removeFilter('disciplines', discipline)}
              className="ml-2 hover:text-blue-900"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {filters.levels.map((level) => (
          <Badge
            key={`level-${level}`}
            variant="secondary"
            className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer rounded-full px-3 py-1"
          >
            {level}
            <button
              onClick={() => removeFilter('levels', level)}
              className="ml-2 hover:text-green-900"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {filters.availability.map((status) => (
          <Badge
            key={`availability-${status}`}
            variant="secondary"
            className="bg-teal-100 text-teal-800 hover:bg-teal-200 cursor-pointer rounded-full px-3 py-1"
          >
            {status}
            <button
              onClick={() => removeFilter('availability', status)}
              className="ml-2 hover:text-teal-900"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Filter Dropdowns */}
      {showFilterDropdowns && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg border">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Discipline</label>
            <div className="space-y-2">
              {disciplines.map((discipline) => (
                <label key={discipline} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.disciplines.includes(discipline)}
                    onChange={() => handleFilterToggle('disciplines', discipline)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{discipline}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Level</label>
            <div className="space-y-2">
              {levels.map((level) => (
                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.levels.includes(level)}
                    onChange={() => handleFilterToggle('levels', level)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{level}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Availability</label>
            <div className="space-y-2">
              {availability.map((status) => (
                <label key={status} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.availability.includes(status)}
                    onChange={() => handleFilterToggle('availability', status)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});