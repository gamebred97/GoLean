import { Box, Image, Flex, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {ChevronLeftIcon, ChevronRightIcon} from "@chakra-ui/react"

function Slideshow({ images }) {
  const [index, setIndex] = useState(0);

  // Auto slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  // Handlers for manual navigation
  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <Box position="relative" width="100%" height="400px" overflow="hidden" bg="gray.100" borderRadius="md">
      <Flex
        height="100%"
        width={`${images.length * 100}%`}
        transform={`translateX(-${index * (100 / images.length)}%)`}
        transition="transform 0.7s ease-in-out"
      >
        {images.map((img, i) => (
          <Box key={i} flex="0 0 auto" width={`${100 / images.length}%`} height="400px" position="relative">
            <Image
              src={img.src.landscape}
              alt={img.alt || `slide-${i}`}
              objectFit="cover"
              width="100%"
              height="100%"
              userSelect="none"
              draggable={false}
              borderRadius="md"
            />
          </Box>
        ))}
      </Flex>

      {/* Navigation buttons */}
      <IconButton
        aria-label="Previous Slide"
        icon={<ChevronLeftIcon />}
        position="absolute"
        top="50%"
        left="10px"
        transform="translateY(-50%)"
        zIndex={2}
        onClick={prevSlide}
        colorScheme="teal"
        opacity={0.7}
        _hover={{ opacity: 1 }}
        size="sm"
      />
      <IconButton
        aria-label="Next Slide"
        icon={<ChevronRightIcon />}
        position="absolute"
        top="50%"
        right="10px"
        transform="translateY(-50%)"
        zIndex={2}
        onClick={nextSlide}
        colorScheme="teal"
        opacity={0.7}
        _hover={{ opacity: 1 }}
        size="sm"
      />
    </Box>
  );
}

export default Slideshow;