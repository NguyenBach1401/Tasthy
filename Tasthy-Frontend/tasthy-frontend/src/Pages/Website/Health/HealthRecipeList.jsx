import React from 'react';
import HealthSection from './HealthSection';
import HealthMenu from './HealthMenu';

const HealthRecipeList = ({ data }) => {
    return (
        <>
            <HealthMenu />

            <div>
                {Object.entries(data).map(([key, value]) => (
                    <HealthSection key={key} title={key} recipes={value} />
                ))}
            </div>
        </>
    );
};

export default HealthRecipeList;
