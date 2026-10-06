import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

import SliderOne from '../../assets/images/banner1.png'
import SliderTwo from '../../assets/images/banner2.png'

const Hero = () => {
    return (

        <section className='section-1'>
            <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                }}

            >
                <SwiperSlide>
                    <div className="content" style={{ backgroundImage: `url(${SliderOne})` }}>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="content" style={{ backgroundImage: `url(${SliderTwo})` }}>
                    </div>
                </SwiperSlide>
            </Swiper>
        </section>
    )
}

export default Hero