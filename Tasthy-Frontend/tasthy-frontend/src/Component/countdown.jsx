
import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const CountdownToMidnight = ({ targetTime }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = targetTime - now;

            if (diff <= 0) {
                setTimeLeft("Đã đến 0h");
                clearInterval(interval);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    return (
        <Typography variant="body2" color="text.secondary" mt={1}>
            Vui lòng quay lại sau 0h. Còn lại: {timeLeft}
        </Typography>
    );
};

export default CountdownToMidnight;
