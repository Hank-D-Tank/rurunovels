import { Navigation, Pagination, Mousewheel, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import SkeletonStoryCard from '../loaders/SkeletonStoryCard';


const Slider = ({ slides, slidesPerView = 6, isLoading = false }) => {
  return (
    <>
      {isLoading ? <SkeletonStoryCard quantity={slidesPerView} />
        : <Swiper
          className='slider'
          modules={[Navigation, Mousewheel, Autoplay]}
          spaceBetween={20}
          slidesPerView={slidesPerView}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            400: {
              slidesPerView: 2,
            },
            639: {
              slidesPerView: 3,
            },
            865: {
              slidesPerView: 3,
            },
            1000: {
              slidesPerView: 4
            },
            1500: {
              slidesPerView: slidesPerView
            },
            1700: {
              slidesPerView: slidesPerView
            }
          }}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          speed={1500}
          /* mousewheel={{ releaseOnEdges: false }} */
          scrollbar={{ draggable: true }}
          effect={'coverflow'}
          autoplay={{ enabled: true, delay: 5000 }}/* 
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')} */
        >
          {slides && slides.map((slide, index) => {
            return (<SwiperSlide key={index}>{slide}</SwiperSlide>)
          })}
        </Swiper>}
    </>
  )
}

export default Slider