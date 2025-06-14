import { Box, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function Slideshow({ images }) {
  const [index, setIndex] = useState(0);
  const delay = 6000;

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, delay);

    return () => clearInterval(interval);
  }, [images]);

  return (
<Box
  w="100%"
  h={{ base: "55vh", md: "69vh" }}
  overflow="hidden"
  position="relative"
>
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