import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Equal } from 'lucide-react'

export interface TripStopProps{
    id:number,
    title: string
    cityId: number
    observation: string
}

export const TripStop = ({id,title}: TripStopProps) => {
    const {attributes, listeners, setNodeRef, transform,transition} = useSortable({id});

    const style  = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style = {style} className='border-gray-5 dark:bg-gray-2 dark:border-gray-2 rounded-md w-full flex items-center px-2 py-1 justify-between gap-5 touch-none font-inter text-sm bg-gray-6'>
            {title}
            <span className='text-gray-9'> <Equal /> </span>
        </div>
    )
}
