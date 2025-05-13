import { Download, Trash2 } from 'lucide-react';

interface ImageProps {
  filename: string;
  url: string;
}

export const Image = ({ filename, url }: ImageProps) => {
  return (
    <div
      key={filename}
      className="group relative cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      <img
        src={url}
        alt={filename}
        className="aspect-square size-full rounded border border-gray-400 object-cover shadow"
      />
      <div className="absolute top-2 right-2 flex gap-1 text-white">
        <button className="image-tool-button bg-gray-800">
          <Download className="m-3 size-5" />
        </button>
        <button className="image-tool-button bg-red-600">
          <Trash2 className="m-3 size-5" />
        </button>
      </div>
      <span className="absolute right-0 bottom-0 left-0 bg-gray-800 p-2 text-sm font-bold text-white opacity-0 group-hover:opacity-80">
        {filename}
      </span>
    </div>
  );
};
