import { Box, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

/**
 * Slideshow component to display a rotating slideshow of images.
 * Cycles through images every 6 seconds with a fade transition.
 *
 * @param {Object} props - Component props
 * @param {Array<{src: {original: string}, alt: string}>} props.images - Array of image objects with src and alt text
 * @returns {JSX.Element} The slideshow UI component
 */
function Slideshow({ images }) {
  /** 
   * Index of the currently displayed image
   * @type {number}
   */
  const [index, setIndex] = useState(0);

  /** Duration to show each image (milliseconds) */
  const delay = 6000; // 6 seconds

  /**
   * Effect to cycle through images on a timed interval.
   * Clears interval on unmount or when images change.
   */
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, delay);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <Box w="100%" h="800px" overflow="hidden" position="relative">
      <Image
        src={images[index].src.original}
        alt={images[index].alt}
        objectFit="cover"
        w="100%"
        h="100%"
        transition="opacity 0.5s ease-in-out"
      />
    </Box>
  );
}

export default Slideshow;