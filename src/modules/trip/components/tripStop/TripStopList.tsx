import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TripStop, TripStopProps } from './TripStop';
import { Trash2 } from 'lucide-react';

interface ColumnProps{
    tripStops: TripStopProps[];
    onDelete: (id: number) => void;
}

export const TripStopList = ({ tripStops, onDelete} :ColumnProps) => {
  return (
    <div className='rounded-lg flex flex-col gap-3.5 w-full p-2'>
        <SortableContext 
          items={tripStops} 
          strategy={verticalListSortingStrategy}
        >
          {tripStops.map((tripStop,index) => 
            <div key={tripStop.id} className='flex items-center gap-3'>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-300">
                {index + 1}.
              </span>
              <TripStop id={tripStop.id} title={tripStop.title} cityId={tripStop.cityId} observation={tripStop.observation} />
              <button
                type="button"
                onClick={() => onDelete(tripStop.cityId)}
                className="cursor-pointer rounded-full bg-gray-6 dark:bg-gray-2 p-2 ml-2 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <Trash2 size={18} className="text-gray-2 dark:text-gray-1" />
              </button> 
            </div>
          )}

        </SortableContext>
    </div>
  )
}
