import React, { useEffect, useState } from 'react';
import { getHealthRecipe } from '../../../Services/AppServices/RecipeService';
import HealthRecipeList from './HealthRecipeList';

const HealthPage = () => {
    const [HealthData, setHealthData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await getHealthRecipe();
            setHealthData(data);
        };

        fetchData();
    }, []);

    return <HealthRecipeList data={HealthData} />;
};

export default HealthPage;
