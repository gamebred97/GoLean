import Navigation from "../Nav/Navigation";
import { getWallpaper } from "../server/server";
import { useEffect, useState } from "react";
import Slideshow from "./SlideShow";
import { Box } from "@chakra-ui/react";


function Front() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getWallpaper();
      setImages(data.photos);
    };
    loadData();
  }, []);

  return (
    <>
      <Navigation />
      {images.length > 0 && <Slideshow images={images} />}
      <Box
        p={10}
        bg="gray.900"
        fontFamily="'Bebas Neue', sans-serif"
        color="white"
        fontSize="24px"
      >
        <p>
          29 He gives strength to the weary and increases the power of the weak.
        </p>
        <p>
          30 Even youths grow tired and weary, and young men stumble and fall.
        </p>
        <p>
          31 but those who hope in the LORD will renew their strength. They will
          soar on wings like eagles; they will run and not grow weary, they will
          walk and not be faint.
        </p>
      </Box>
    </>
  );
}

export default Front;
