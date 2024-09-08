import { Navigation, Pagination, Mousewheel,EffectCoverflow, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import SkeletonSingleBigCard from '../loaders/SkeletonSingleBigCard';


const MainSlider = ({ slides, isLoading=false }) => {
    return (
        <>
            {isLoading ? <SkeletonSingleBigCard/> : <Swiper
                className='main-slider'
                modules={[Navigation, Pagination, Mousewheel, EffectCoverflow, Autoplay]}
                spaceBetween={50}
                slidesPerView={1}
                loop={true}
                navigation
                pagination={{ clickable: true }}
                speed={1500}
                mousewheel={{ releaseOnEdges: true }}
                effect={'coverflow'}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                  }}
                autoplay={{ enabled: true, delay: 5000}}
                /* onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')} */
            >
                {slides && slides.map((slide, index) => {
                    return (<SwiperSlide key={index}>{slide}</SwiperSlide>)
                })}
            </Swiper> }
        </>
    )
}

export default MainSlider