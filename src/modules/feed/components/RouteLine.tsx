import { Circle, Square } from "lucide-react";

export default function RouteLine() {
  return (
    <div className="flex items-center flex-1 mx-2">
      <Circle size={9} className="text-gray-6"  stroke="currentColor" strokeWidth={4}/>
      <div className="flex-1 border-t my-3 border-gray-11"></div>
      <Square size={9} className="text-gray-6" fill="currentColor" stroke="currentColor"/>
    </div>
  );
}
