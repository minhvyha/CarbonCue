import React from 'react';

/**
 * LoadingOverlay Component
 *
 * Displays a full-screen dark grey overlay with a centered loading spinner.
 *
 * Props:
 * - isLoading (boolean): Toggle display of the overlay.
 * - overlayOpacity (number, optional): Opacity of the overlay (0-100). Default: 75.
 * - spinnerSize (number, optional): Size of the spinner in pixels. Default: 128.
 * - borderWidth (number, optional): Thickness of the spinner border in pixels. Default: 8.
 */
interface LoadingOverlayProps {
  isLoading: boolean;
  overlayOpacity?: number;
  spinnerSize?: number;
  borderWidth?: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  overlayOpacity = 75,
  spinnerSize = 64,
  borderWidth = 8,
}) => {
  if (!isLoading) return null;

  // Calculate overlay background as RGBA
  const overlayBg = `rgba(31, 41, 55, ${overlayOpacity / 100})`; // Tailwind gray-800 is #1f2937

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: overlayBg }}
      aria-busy="true"
      role="status"
      aria-label="Loading"
    >
      <div
        className="rounded-full border-gray-500 border-t-carbon-purple animate-spin"
        style={{
          width: spinnerSize,
          height: spinnerSize,
          borderWidth: borderWidth,
        }}
      />
    </div>
  );
};

export default LoadingOverlay;
