import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingProps {
  name?: string; // Optional prop for custom loading text
}

const Loading: React.FC<LoadingProps> = ({ name = "Data" }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[70vh]">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading {name}...</p>
      
      {/* Skeleton Placeholder */}
      <div className="w-full max-w-sm space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};

export default Loading;
