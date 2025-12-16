
import { TripStop } from "@/models/tripStop";
import { formatDateTime, formatTime } from "@/shared/utils/dateTime";
import { capitalizeWords } from "@/shared/utils/string";
import { Circle, Square } from "lucide-react";

interface TripRoutePreviewProps {
  tripStops: TripStop[];
  withTimes?: boolean;
}

export function TripRoutePreview({ tripStops , withTimes}: TripRoutePreviewProps) {
  return (
    <div className="w-full py-4">
      <div className="flex flex-col items-center space-y-0">
        {tripStops.map((stop, index) => {
          const isFirst = stop.start;
          const isLast = stop.destination;
          const isNotLast = index < tripStops.length - 1;

          return (
            <div key={index} className="flex w-full">
              {/* Columna de puntos y línea */}
              <div className="flex flex-col items-center relative">
                {/* Punto del stop */}
                <div className="flex-shrink-0 z-10">

                {isFirst && <Circle size={12} fill="white" stroke="white" />}
                {!isFirst && !isLast && <Circle size={12} className=" text-gray-2 dark:text-gray-6" />}
                {isLast && <Square size={12} fill="white" stroke="white" />}
                </div>

                {/* Línea que conecta con el siguiente */}
                {isNotLast && (
                  <div className="w-0.5 bg-gray-300 absolute top-5 bottom-2 left-1/2 -translate-x-1/2"></div>
                )}
                </div>

              {/* Contenido del stop */}
              <div className="ml-4 flex-1 max-w-[250px] md:max-w-[300px] xl:max-w-[350px] pb-2">
                
                <h3 className={`font-medium leading-5 text-gray-900 dark:text-white ${!isFirst && !isLast ? 'text-md' : 'text-lg'}`}>
                  {capitalizeWords(stop.cityName)} 
                  {withTimes && stop.estimatedArrivalDateTime
                    ? isFirst || isLast
                      ? <span className="text-[16px]"> - {formatDateTime(stop.estimatedArrivalDateTime)}</span>
                      : <span className="text-[16px]"> - {formatTime(stop.estimatedArrivalDateTime)}</span>
                    : ""}
                </h3>
                {stop.observation && (
                  <p className="text-sm font-light text-gray-2 dark:text-gray-6 mt-1 break-words max-w-full">
                    {capitalizeWords(stop.observation)}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
