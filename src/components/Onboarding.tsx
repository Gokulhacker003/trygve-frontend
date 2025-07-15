import { useState,useEffect} from 'react';
import './Onboarding.css'

const slides =[
    {
        title:'',
        subtitle: '',
        image: 'images/healthcare-intro-1.jpg',
        logo: 'TRYGVE',
        tagline: 'Trusted Guardian of Life',
    },
    {
        title: 'Your Health, Our Priority',
        subtitle: 'Trusted doctors and care at your doorstep.',
        image: 'images/healthcare-intro-2.jpg',
    },
    {
        title: 'Seamless Care, Delivered',
        subtitle: 'Consult, treat, and heal—hassle-free.',
        image: 'images/healthcare-intro-3.jpg',
    },
    {
        title: 'Affordable Healthcare for Everyone',
        subtitle: 'Quality care for every budget.',
        image: 'images/healthcare-intro-4.jpg',
  },
];

function Onboarding(){
    const [current,setCurrent]=useState(0);

    const nextSlide = () => {
        setCurrent((prev)=> Math.min(prev+1,slides.length-1));
    };
    
    const skip = () => {
        setCurrent(slides.length-1);
        
    };
    const getstarter =() =>{

    }
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => {
                if (prev < slides.length - 1) {
                    return prev + 1;
                } else {
                    return prev; // Stay on last slide
                }
            });
        }, 5000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div className='onboarding-container'>
            <div
            className="slide"
            style={{ backgroundImage:`URL(${slides[current].image})`}}
            >
                <div className='slide-content'>
                    <div className='slide-top'>
                        {slides[current].logo &&(
                            <>
                            <h1 className='logo'>{slides[current].logo}</h1>
                            <p className='tagline'>{slides[current].tagline}</p>
                            </>
                        )}
                    </div>
                    <div className='slide-buttom'>
                        <h2 className='title'>{slides[current].title}</h2>
                        <p className='subtitle'>{slides[current].subtitle}</p>

                        <div className='dots'>
                            {slides.map((_,i)=>(
                                <span 
                                key={i}
                                className={`dot ${i===current? 'active':''}`}
                                ></span>
                            ))}
                        </div>
                    <div className='buttons'>{current < slides.length-1?(
                        <>
                        <button className='btn-link' onClick={skip}>Skip</button>
                        <button className='btn-link' onClick={nextSlide}>Next</button>
                    </>
                ):(
                    <button className='btn-get-started'onClick={getstarter}>Get Started</button>
                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Onboarding
