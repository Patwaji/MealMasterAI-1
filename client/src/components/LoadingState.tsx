const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
      <h2 className="text-xl font-medium text-gray-800 mb-2">Generating Your Meal Plan</h2>
      <p className="text-neutral-dark text-center">Our AI is creating personalized meals based on your preferences...</p>
    </div>
  );
};

export default LoadingState;
