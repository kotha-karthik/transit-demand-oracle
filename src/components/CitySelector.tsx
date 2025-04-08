
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface City {
  id: string;
  name: string;
  country: string;
}

interface CitySelectorProps {
  cities: City[];
  selectedCity: string;
  onCityChange: (cityId: string) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ cities, selectedCity, onCityChange }) => {
  const [open, setOpen] = React.useState(false);

  const selectedCityData = cities.find(city => city.id === selectedCity);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          {selectedCity ? `${selectedCityData?.name}, ${selectedCityData?.country}` : "Select city..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandEmpty>No city found.</CommandEmpty>
          <CommandGroup>
            {cities.map((city) => (
              <CommandItem
                key={city.id}
                value={city.id}
                onSelect={(currentValue) => {
                  onCityChange(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCity === city.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {city.name}, {city.country}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CitySelector;
