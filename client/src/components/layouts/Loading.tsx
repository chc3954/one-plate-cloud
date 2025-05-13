export const Loading = () => {
  return (
    <div className="gallery">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index}>
          <div className="aspect-square size-full animate-pulse rounded bg-gray-200 shadow"></div>
        </div>
      ))}
    </div>
  );
};
