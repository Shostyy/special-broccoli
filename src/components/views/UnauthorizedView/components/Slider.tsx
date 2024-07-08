import React, { useState, useEffect } from 'react';
import { sliderImages } from '../../../../data/constants/sliderImages';
import styles from '../styles/Slider.module.css';
import logoImg from '../../../../assets/images/logo-shadow.png';
import { useTranslation } from 'react-i18next';
import { SLIDER_CHANGE_FREQUENCY_MS } from '../../../../data/constants/constants';

export const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(() => Math.floor(Math.random() * sliderImages.length));
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
        }, SLIDER_CHANGE_FREQUENCY_MS);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.sliderContainer}>
            {sliderImages.map((slide, index) => (
                <div
                    key={index}
                    className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                    style={{ backgroundImage: `url(${slide[0]})` }}
                >
                    <div className={styles.slideContent} style={{ color: slide[1] }}>
                        <div className={styles.logo}>
                            <img src={logoImg} alt="TSA Logo" />
                        </div>
                        <p className={styles.description}>{t('SloganPart1')} {t('SloganPart2')}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Slider;