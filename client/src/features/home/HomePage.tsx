import { Box } from "@mui/material";
import Slider from "react-slick";

export default function HomePage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };
  return (
    <>
      <Slider {...settings}>
        <div>
          <img src="/images/hero1.jpg" alt="Slide 1" style={{ display: 'block', width: '100%', maxHeight: '500px' }} />
        </div>
        <div>
          <img src="/images/hero2.jpg" alt="Slide 2" style={{ display: 'block', width: '100%', maxHeight: '500px' }} />
        </div>
        <div>
          <img src="/images/hero3.jpg" alt="Slide 3" style={{ display: 'block', width: '100%', maxHeight: '500px' }} />
        </div>
      </Slider>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <h2>Welcome to Our Store!</h2>
        <p>Discover our wide range of products and enjoy shopping with us.</p>
      </Box>
    </>
  );
}
