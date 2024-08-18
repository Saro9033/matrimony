import React from 'react'


const CalculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    const month = new Date().getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && new Date().getDate() < birthDate.getDate())) {
        return age - 1;
    }
    return age;
};


export default CalculateAge