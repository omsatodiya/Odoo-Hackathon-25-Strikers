'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchFilter({ onSearch, initialQuery = '' }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const popularSkills = [
    'Web Development', 'Graphic Design', 'Photography', 'Writing',
    'Marketing', 'Data Analysis', 'Video Editing', 'Music Production',
    'Language Teaching', 'Cooking', 'Fitness Training', 'Consulting'
  ];

  const addSkillFilter = (skill: string) => {
    if (!activeFilters.includes(skill)) {
      const newFilters = [...activeFilters, skill];
      setActiveFilters(newFilters);
      handleSearch(newFilters.join(' '));
    }
  };

  const removeSkillFilter = (skill: string) => {
    const newFilters = activeFilters.filter(f => f !== skill);
    setActiveFilters(newFilters);
    handleSearch(newFilters.join(' '));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by skills, name, or location..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Popular Skills</h4>
              <div className="grid grid-cols-2 gap-2">
                {popularSkills.map((skill) => (
                  <Button
                    key={skill}
                    variant={activeFilters.includes(skill) ? "default" : "outline"}
                    size="sm"
                    onClick={() => 
                      activeFilters.includes(skill) 
                        ? removeSkillFilter(skill)
                        : addSkillFilter(skill)
                    }
                    className="text-xs h-8"
                  >
                    {skill}
                  </Button>
                ))}
              </div>
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveFilters([]);
                    handleSearch('');
                  }}
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="secondary" className="flex items-center gap-1">
              {filter}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSkillFilter(filter)}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}