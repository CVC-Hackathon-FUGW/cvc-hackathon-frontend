import { Carousel } from "@mantine/carousel";
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';

export default function CarouselSlide() {
    const autoplay = useRef(Autoplay({ delay: 4000 }));
    return (
        <div>
            <Carousel
                maw={1350}
                mx="auto"
                withIndicators
                height={530}
                dragFree
                slideGap="md"
                align="start"
                plugins={[autoplay.current]}
                onMouseEnter={autoplay.current.stop}
                onMouseLeave={autoplay.current.reset}
            >
                <Carousel.Slide className='rounded-3xl'><img width={1350} height={530} className='rounded-3xl' src="https://maytinhvui.com/wp-content/uploads/2020/11/hinh-nen-may-tinh-4k-game-min.jpg" alt="" /></Carousel.Slide>
                <Carousel.Slide className='rounded-3xl'><img width={1350} height={530} className='rounded-3xl' src="https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/01/Hinh-nen-4K-1.jpg?resize=780%2C439&ssl=1" alt="" /></Carousel.Slide>
                <Carousel.Slide className='rounded-3xl'><img width={1350} height={530} className='rounded-3xl' src="https://demoda.vn/wp-content/uploads/2022/01/hinh-nen-4k-laptop-va-pc-800x500.jpg" alt="" /></Carousel.Slide>
            </Carousel>
        </div>
    )
}