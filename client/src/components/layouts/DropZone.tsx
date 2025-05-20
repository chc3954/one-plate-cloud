import { Plus } from 'lucide-react';

export const DropZone = () => {
  return (
    <div className="drop-zone">
      <div className="flex size-full animate-pulse flex-col items-center justify-center gap-4">
        <Plus className="size-28 overflow-visible rounded-full border-4 border-dashed p-4 text-blue-800/80" />
        <span className="text-center text-3xl font-semibold text-blue-800/80">
          Drop your images here!
        </span>
      </div>
    </div>
  );
};
