import { Box, Tabs, Tab } from '@mui/material';
import { useState, useEffect } from 'react';
import HeatMapCalendar from './HeatMapCalendar';
import { getFoodJourney, getWorkoutJourney } from '../../../Services/AppServices/JourneyService';

const JourneyTab = () => {
    const [tab, setTab] = useState(0);
    const [foodJourney, setFoodJourney] = useState([]);
    const [workoutJourney, setWorkoutJourney] = useState([]);

    const getRecentMonths = () => {
        const today = new Date();
        const result = [];
        for (let i = 2; i >= 0; i--) {
            const d = new Date(today);
            d.setMonth(d.getMonth() - i);
            result.push({ month: d.getMonth() + 1, year: d.getFullYear() });
        }
        return result;
    };

    useEffect(() => {
        const id = localStorage.getItem('userId');
        if (!id) return;

        const fetchData = async () => {
            try {
                const months = getRecentMonths();

                const foodPromises = months.map(({ month, year }) =>
                    getFoodJourney(id, month, year)
                );
                const workoutPromises = months.map(({ month, year }) =>
                    getWorkoutJourney(id, month, year)
                );

                const foodResults = await Promise.all(foodPromises);
                const workoutResults = await Promise.all(workoutPromises);

                const food = foodResults.flat();
                const workout = workoutResults.flat();

                setFoodJourney(food);
                setWorkoutJourney(workout);
            } catch (error) {
                console.error('Lỗi khi gọi dữ liệu:', error);
            }
        };

        fetchData();
    }, []);

    const handleTabChange = (_, newValue) => setTab(newValue);

    return (
        <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4 }}>
            <Tabs value={tab} onChange={handleTabChange} centered>
                <Tab label="Lộ trình Ăn uống" />
                <Tab label="Lộ trình Tập luyện" />
            </Tabs>

            <Box mt={4}>
                {tab === 0 && <HeatMapCalendar data={foodJourney} />}
                {tab === 1 && <HeatMapCalendar data={workoutJourney} />}
            </Box>
        </Box>
    );
};

export default JourneyTab;
