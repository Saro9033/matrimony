// RegisterContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const RegisterContext = createContext();

// Define the provider component
export const RegisterProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    profileFor: '',
    name: '',
    email: '',
    role: 'user',
    phoneNumber: '',
    gender: '',
    DOB: '',
    subCaste: '',
    motherTongue: '',
    maritalStatus: '',
    country: '',
    avatar:'',
    city: '',
    state: '',
    height: '',
    weight:'',
    education: '',
    occupation: '',
    income: '',
    physicalStatus: '',
    familyStatus: '',
    familyType: '',
    about: '',
    star:'',
    raasi:'',
    gothra:'',
    chevvaiDosham:''
  });

  const updateFormData = (field, value) => {
    setFormData(prevState => ({ ...prevState, [field]: value }));
  };

  const resetFormData = () => {
    setFormData({
      profileFor: 'myself',
      name: '',
      avatar:'',
      email: '',
      role: 'user',
      phoneNumber: '',
      gender: '',
      DOB: '',
      subCaste: '',
      motherTongue: '',
      maritalStatus: '',
      country: '',
      city: '',
      state: '',
      height: '',
      education: '',
      occupation: '',
      income: '',
      physicalStatus: '',
      familyStatus: '',
      familyType: '',
      about: '',
      star:'',
      gothra:'',
      chevvaiDosham:''
    });
  };

  return (
    <RegisterContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </RegisterContext.Provider>
  );
};

// Custom hook to use the RegisterContext
export const useRegister = () => {
  return useContext(RegisterContext);
};
