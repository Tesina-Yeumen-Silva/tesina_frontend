import { Spinner } from "@heroui/react";

const LoadIcon = () => {
  return (
    <div className="fiexd inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Spinner color="accent" />
    </div>
  );
};

export default LoadIcon;
