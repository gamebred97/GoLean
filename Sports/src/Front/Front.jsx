import Navigation from "../Nav/Navigation";
import { getWallpaper } from "../server/server";
import { useEffect, useState } from "react";
import Slideshow from "./SlideShow";

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
      {/* Add more content below slideshow */}
      <Box p={10} bg="gray.50">
        <h2>Other content below slideshow</h2>
      </Box>
    </>
  );
}

export default Front;