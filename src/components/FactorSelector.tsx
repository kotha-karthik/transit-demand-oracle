
import React from 'react';
import { externalFactors } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FactorSelectorProps {
  onFactorChange: (factorId: string, value: string) => void;
}

const FactorSelector: React.FC<FactorSelectorProps> = ({ onFactorChange }) => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">External Factors</h2>
      
      <div className="grid gap-4">
        {externalFactors.map(factor => (
          <div key={factor.id} className="space-y-1">
            <label className="text-sm font-medium">{factor.name}</label>
            <Select 
              defaultValue={factor.current} 
              onValueChange={(value) => onFactorChange(factor.id, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${factor.name}`} />
              </SelectTrigger>
              <SelectContent>
                {factor.options.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-between">
        <Button variant="outline" size="sm">Reset Factors</Button>
        <Button size="sm">Update Forecast</Button>
      </div>
    </div>
  );
};

export default FactorSelector;
