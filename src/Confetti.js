import React, { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

const Confetti = ({ Btn, setBtn }) => {
    const [windowDimension, setDimension] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [fadeOut, setFadeOut] = useState(false);
    const detectSize = () => {
        setDimension({
            width: window.innerWidth,
            height: window.innerHeight
        });
    };

    useEffect(() => {
        window.addEventListener('resize', detectSize);
        return () => {
            window.removeEventListener('resize', detectSize);
        };
    }, [windowDimension, setBtn]);

    useEffect(() => {
        if (!Btn) {
            setFadeOut(true);  // เริ่มการจางหายเมื่อ Btn เป็น false
            setTimeout(() => setFadeOut(false), 1000);  // ลบ Confetti ออกจาก DOM หลังจากจางหาย (1000 มิลลิวินาที)
        }
    }, [Btn]);

    return (
        <>  
            {Btn || fadeOut ? 
            (  // แสดง Confetti เมื่อ Btn เป็น true หรือในช่วงจางหาย
                <ReactConfetti
                    style={{ opacity: Btn ? 1 : 0, transition: 'opacity 1s ease-out' }}
                    width={windowDimension.width}
                    height={windowDimension.height}
                />
            ) : null}
        </>
    );
};

export default Confetti;
