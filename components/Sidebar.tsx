import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface Filters {
  disciplines: string[];
  levels: string[];
  availability: string[];
}

interface SidebarProps {
  filters: Filters;
  onFilterChange: (filterType: keyof Filters, value: string, checked: boolean) => void;
  onClearFilters?: () => void;
}

export function Sidebar({ filters, onFilterChange, onClearFilters }: SidebarProps) {
  const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0);

  return (
    <aside className="w-64 border-r bg-gray-50 p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Filters</h3>
          {hasActiveFilters && onClearFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="h-8 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>
        
        {hasActiveFilters && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium mb-2">Active Filters:</p>
            <div className="space-y-1">
              {filters.disciplines.length > 0 && (
                <p className="text-xs text-blue-700">Disciplines: {filters.disciplines.join(', ')}</p>
              )}
              {filters.levels.length > 0 && (
                <p className="text-xs text-blue-700">Levels: {filters.levels.join(', ')}</p>
              )}
              {filters.availability.length > 0 && (
                <p className="text-xs text-blue-700">Availability: {filters.availability.join(', ')}</p>
              )}

            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Design Discipline</Label>
            <div className="space-y-2">
              {['Service Design', 'UX Generalist', 'Product Design', 'Front-end Design', 'Developer Experience', 'Content Strategy'].map((discipline) => (
                <div key={discipline} className="flex items-center space-x-2">
                  <Checkbox 
                    id={discipline} 
                    checked={filters.disciplines.includes(discipline)}
                    onCheckedChange={(checked) => onFilterChange('disciplines', discipline, !!checked)}
                  />
                  <Label htmlFor={discipline} className="text-sm">{discipline}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Design Level</Label>
            <div className="space-y-2">
              {['D3', 'D4', 'D5', 'D6'].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox 
                    id={level} 
                    checked={filters.levels.includes(level)}
                    onCheckedChange={(checked) => onFilterChange('levels', level, !!checked)}
                  />
                  <Label htmlFor={level} className="text-sm">{level}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Availability</Label>
            <div className="space-y-2">
              {['Bench', '50% Staffed', '100% Staffed', 'New Hire'].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox 
                    id={status} 
                    checked={filters.availability.includes(status)}
                    onCheckedChange={(checked) => onFilterChange('availability', status, !!checked)}
                  />
                  <Label htmlFor={status} className="text-sm">{status}</Label>
                </div>
              ))}
            </div>
          </div>
          

        </div>
      </Card>
    </aside>
  );
}