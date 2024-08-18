import React, { useEffect, useState } from 'react';
import imageSrc from '../../assets/reg1.jpg';
import { useRegister } from '../../context/RegisterContext';
import Stepper from './stepper';
import { countries } from 'countries-list';
import { states, cities } from '../../utils/Data';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, clearUpdated, editUser, isUpdated, loginAuthError, loginAuthStatus, loginAuthUser, loginIsAuthenticated, registerUser } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import CalculateAge from '../../utils/CalculateAge';
import {gothraOptions, chevvaiDoshamOptions, starOptions,
   raasiOptions,maritalStatusOptions,indianLanguages, subCasteOptions, familyStatusOptions, familyTypeOptions,
   physicalStatusOptions, educationOptions} from '../../utils/Options'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const Error = useSelector(loginAuthError)
  const Status = useSelector(loginAuthStatus)
  const User = useSelector(loginAuthUser)
  const IsUpdated = useSelector(isUpdated)

  const { formData, updateFormData ,resetFormData} = useRegister();
  const [currentStep, setCurrentStep] = useState(1);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const countryOptions = Object.keys(countries).map(code => ({
    value: code,
    label: countries[code].name
  }));


  useEffect(() => {
    if (formData.country) {
      const selectedCountryStates = states[formData.country] || [];
      const stateOptions = selectedCountryStates.map(state => ({ value: state, label: state }));
      setStateOptions(stateOptions);
    } else {
      setStateOptions([]);
    }

    if (formData.state) {
      const selectedCity = cities[formData.state] || [];
      console.log("selectedCity", selectedCity, formData.state)
      const stateOptions = selectedCity.map(city => ({ value: city, label: city }));
      setCityOptions(stateOptions);
    } else {
      setCityOptions([]);
    }

    if(IsUpdated){
      navigate('/')
      dispatch(clearUpdated())   
     }
  }, [formData.country,IsUpdated, formData.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  const [errors, setErrors] = useState({
    apiErrors: '',
    DOB: '',
    subCaste: '',
    motherTongue: '',
    maritalStatus: '',
    height: '',
    weight: '',
    star: '',
    raasi: '',
    gothra: '',
    chevvaiDosham: '',
    phoneNumber: '',
    city: '',
    country: '',
    state: '',
    education: '',
    occupation: '',
    income: '',
    physicalStatus: '',
    familyStatus: '',
    familyType: '',
  });

  function isUnder21(dob) {
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDifference = today.getMonth() - dobDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age < 21;
  }

  const validateForm = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.DOB) newErrors.DOB = 'DOB is required';
      if (isUnder21(formData.DOB)) {
        newErrors.DOB = 'Above 21 Years Old only Allowed';
      }

      if (!formData.subCaste) newErrors.subCaste = 'SubCaste is required';
      if (!formData.motherTongue) newErrors.motherTongue = 'Mother Tongue is required';
      if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital Status is required';
      if (!formData.height) newErrors.height = 'Height is required';
      if (!formData.weight) newErrors.weight = 'Weight is required';
    }

    if (currentStep === 2) {
      if (!formData.star) newErrors.star = 'Star is required';
      if (!formData.raasi) newErrors.raasi = 'Raasi is required';
      if (!formData.gothra) newErrors.gothra = 'Gothra is required';
      if (!formData.chevvaiDosham) newErrors.chevvaiDosham = 'Chevvai Dosham is required';
    }

    if (currentStep === 3) {
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone Number is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.country) newErrors.country = 'Country is required';
      if (!formData.state) newErrors.state = 'State is required';
    }


    if (currentStep === 4) {
      if (!formData.education) newErrors.education = 'Education is required';
      if (!formData.occupation) newErrors.occupation = 'Occupation is required';
      if (!formData.income) newErrors.income = 'Income is required';
      if (!formData.physicalStatus) newErrors.physicalStatus = 'Physical Status is required';
      if (!formData.familyStatus) newErrors.familyStatus = 'Family Status is required';
      if (!formData.familyType) newErrors.familyType = 'Family Type is required';
    }

    // Add validation for other steps here...

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
      
        let FormDatas = new FormData();
        FormDatas.append('subCaste', formData.subCaste);
        FormDatas.append('motherTongue', formData.motherTongue);
        FormDatas.append('maritalStatus', formData.maritalStatus);
        FormDatas.append('height', formData.height);
        FormDatas.append('weight', formData.weight);
        FormDatas.append('star', formData.star);
        FormDatas.append('raasi', formData.raasi);
        FormDatas.append('gothra', formData.gothra);
        FormDatas.append('chevvaiDosham', formData.chevvaiDosham);
        FormDatas.append('phoneNumber', formData.phoneNumber);
        FormDatas.append('city', formData.city);
        FormDatas.append('country', formData.country);
        FormDatas.append('state', formData.state);
        FormDatas.append('education', formData.education);
        FormDatas.append('occupation', formData.occupation);
        FormDatas.append('income', formData.income);
        FormDatas.append('physicalStatus', formData.physicalStatus);
        FormDatas.append('familyStatus', formData.familyStatus);
        FormDatas.append('familyType', formData.familyType);
        FormDatas.append('about', formData.about);

        dispatch(editUser(FormDatas))
        resetFormData()
      }
    }
  };


  const handleDropChange = (selectedOption, actionMeta) => {
    console.log(selectedOption)
    const { name } = actionMeta;
    updateFormData(name, selectedOption)
  };


  let title;

  switch (currentStep) {
    case 1: title = "Please provide us with your Basic Details"
      break;
    case 2: title = "Please provide us with your Religious details"
      break;
    case 3: title = "Please provide us with your Contact details"
      break;
    case 4: title = "Please provide us with your Other details"
      break;
    default: title = "NOT FOUND"
      break;
  }
  const resetError = (field) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: ''
    }));
  };

  useEffect(() => {
    if (Error) {
      setErrors(prevErrors => ({
        ...prevErrors,
        apiErrors: Error || ''
      }));
      dispatch(clearError())
    }
  

  }, [Error, dispatch]);

  useEffect(() => {
    // Generate the about section when formData is updated
    const generateAbout = () => {
      return `Hi, I'm ${User?.name} from ${formData.city}, ${formData.state}, ${formData.country}. I am ${CalculateAge(formData.DOB)} years old, born on ${formData.DOB}. I have a ${formData.education} degree and work as a ${formData.occupation}. I am currently ${formData.maritalStatus} and my family status is ${formData.familyStatus}. I belong to the ${formData.subCaste} sub-caste and speak ${formData.motherTongue}. My height is ${formData.height} and my physical status is ${formData.physicalStatus}. My annual income is ${formData.income}. I live in a ${formData.familyType} family.`;
    };



    // Update the about field
    updateFormData('about', generateAbout());

  }, [formData.name, formData.city, formData.state, formData.country, formData.DOB, formData.education, formData.occupation, formData.maritalStatus, formData.familyStatus, formData.subCaste, formData.motherTongue, formData.height, formData.physicalStatus, formData.income, formData.familyType]);

  console.log(formData)
  return (
    <div className="my-20 container mx-auto px-4 py-2">
      <Stepper currentStep={currentStep} />

{/* //grid grid-cols-1 lg:grid-cols-5 */}
      <div className="flex align-center justify-center gap-4">
        {/* <div className="hidden lg:block lg:flex lg:items-center h-full lg:col-span-2">
          <img src={imageSrc} alt="Description" className="w-full object-cover" />
        </div> */}

        <div className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className=" font-bold mb-4">{title}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {currentStep === 1 && (<>
                  {/* DOB*/}
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date Of Birth</label>
                    <input
                      onFocus={() => resetError('DOB')}
                      name='DOB'
                      value={formData.DOB}
                      onChange={handleChange}
                      type="date"
                      className=" focus:outline-none focus:ring-0 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                      placeholder="Enter your name"
                    />
                    {errors.DOB && <p className="text-red-500 text-sm mt-1">{errors.DOB}</p>}
                  </div>

                  {/* subcaste  */}
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select your subcaste
                    </label>


                    <Select
                      onFocus={() => resetError('subCaste')}
                      options={subCasteOptions}
                      value={subCasteOptions.find(option => option.value === formData.subCaste) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'subCaste' })}
                      placeholder="Select SubCaste" />
                    {errors.subCaste && <p className="text-red-500 text-sm mt-1">{errors.subCaste}</p>}
                  </div>

                  {/* Marital status */}
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select your Marital Status
                    </label>

                    <Select
                      onFocus={() => resetError('maritalStatus')}
                      options={maritalStatusOptions}
                      value={maritalStatusOptions.find(option => option.value === formData.maritalStatus) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'maritalStatus' })}
                      placeholder="Select Marital Status" />
                    {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
                  </div>

                  {/* Language */}
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select your Mother Tongue
                    </label>
                    <Select
                      onFocus={() => resetError('motherTongue')}
                      options={indianLanguages}
                      value={indianLanguages.find(option => option.value === formData.motherTongue) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'motherTongue' })}
                      placeholder="Select Marital Status" />
                    {errors.motherTongue && <p className="text-red-500 text-sm mt-1">{errors.motherTongue}</p>}
                  </div>

                  {/* height */}
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Your Height in Cm
                    </label>
                    <input
                      onFocus={() => resetError('height')}
                      name='height'
                      value={formData.height}
                      onChange={handleChange}
                      type="number"
                      className=" focus:outline-none focus:ring-0 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                      placeholder="Enter your height"
                    />
                    {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                  </div>

                  {/* weight */}
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Your Weight in Kg
                    </label>
                    <input
                      onFocus={() => resetError('weight')}
                      name='weight'
                      value={formData.weight}
                      onChange={handleChange}
                      type="number"
                      className=" focus:outline-none focus:ring-0 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                      placeholder="Enter your Weight"
                    />
                    {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                  </div>
                </>)}

                {currentStep === 2 && (<>
                  {/* Raasi*/}
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">Raasi</label>
                    <Select
                      onFocus={() => resetError('raasi')}
                      options={raasiOptions}
                      value={raasiOptions.find(option => option.value === formData.raasi) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'raasi' })}
                      placeholder="Select Raasi" />
                    {errors.raasi && <p className="text-red-500 text-sm mt-1">{errors.raasi}</p>}
                  </div>

                  {/* star  */}
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select your star
                    </label>
                    <Select
                      onFocus={() => resetError('star')}
                      options={starOptions}
                      value={starOptions.find(option => option.value === formData.star) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'star' })}
                      placeholder="Select Star" />
                    {errors.star && <p className="text-red-500 text-sm mt-1">{errors.star}</p>}
                  </div>

                  {/* chevvaiDosham */}
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select your Chevvai Dosham
                    </label>
                    <Select
                      onFocus={() => resetError('chevvaiDosham')}
                      options={chevvaiDoshamOptions}
                      value={chevvaiDoshamOptions.find(option => option.value === formData.chevvaiDosham) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'chevvaiDosham' })}
                      placeholder="Select Chevvai Dosham" />
                    {errors.chevvaiDosham && <p className="text-red-500 text-sm mt-1">{errors.chevvaiDosham}</p>}
                  </div>

                  {/* Gothra */}
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select your Gothra
                    </label>
                    <Select
                      onFocus={() => resetError('gothra')}
                      options={gothraOptions}
                      value={gothraOptions.find(option => option.value === formData.gothra) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.value, { name: 'gothra' })}
                      placeholder="Select Gothra" />
                    {errors.gothra && <p className="text-red-500 text-sm mt-1">{errors.gothra}</p>}
                  </div>
                </>)}


                {currentStep === 3 && (<>
                  {/* phoneNumber*/}
                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">Whatsapp Number</label>
                    <input
                      onFocus={() => resetError('phoneNumber')}
                      name='phoneNumber'
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      type="text"
                      className=" focus:outline-none focus:ring-0 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                      placeholder="Whatsapp No."
                    />
                    {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                  </div>

                  {/* Country*/}
                  <div className="relative mb-4">
                    <label className="block lg:pb-2 text-sm font-medium text-gray-700">Select Country</label>
                    <Select
                      onFocus={() => resetError('country')}
                      options={countryOptions}
                      value={countryOptions.find(option => option.label === formData.country) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'country' })}
                      placeholder="Select Country" />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>


                  {/* State*/}
                  <div className="relative mb-4">
                    <label className="block lg:pb-2 text-sm font-medium text-gray-700">Select State</label>
                    <Select
                      onFocus={() => resetError('state')}
                      options={stateOptions}
                      value={stateOptions.find(option => option.label === formData.state) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'state' })}
                      placeholder="Select state" />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  {/* City*/}
                  <div className="relative mb-4">
                    <label className="block lg:pb-2 text-sm font-medium text-gray-700">Select city</label>
                    <Select
                      onFocus={() => resetError('city')}
                      options={cityOptions}
                      value={cityOptions.find(option => option.label === formData.city) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'city' })}
                      placeholder="Select city" />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                </>)}

                {currentStep === 4 && (<>

                  <div className="relative mb-4">
                    <label className="block lg:pb-2 text-sm font-medium text-gray-700">Select Education</label>
                    <Select
                      onFocus={() => resetError('education')}
                      options={educationOptions}
                      value={educationOptions.find(option => option.label === formData.education) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'education' })}
                      placeholder="Select Education" />
                    {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
                  </div>


                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Enter Your Occupation
                    </label>
                    <input
                      onFocus={() => resetError('occupation')}
                      name='occupation'
                      value={formData.occupation}
                      onChange={handleChange}
                      type="text"
                      className=" focus:outline-none focus:ring-0 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                      placeholder="Enter your Weight"
                    />
                    {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
                  </div>

                  <div className="relative mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Enter Your Income per month
                    </label>
                    <input
                      onFocus={() => resetError('income')}
                      name='income'
                      value={formData.income}
                      onChange={handleChange}
                      type="number"
                      min="0"
                      step="0.01"
                      className=" focus:outline-none focus:ring-0 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                      placeholder="Enter your Income"
                    />
                    {errors.income && <p className="text-red-500 text-sm mt-1">{errors.income}</p>}
                  </div>


                  <div className="relative mb-4">
                    <label className="block lg:pb-2 text-sm font-medium text-gray-700">Select Physical Status</label>
                    <Select
                      onFocus={() => resetError('physicalStatus')}
                      options={physicalStatusOptions}
                      value={physicalStatusOptions.find(option => option.label === formData.physicalStatus) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'physicalStatus' })}
                      placeholder="Select Physical Status" />
                    {errors.physicalStatus && <p className="text-red-500 text-sm mt-1">{errors.physicalStatus}</p>}
                  </div>


                  <div className="relative mb-4">
                    <label className="block lg:pb-2 text-sm font-medium text-gray-700">Select Family Status</label>
                    <Select
                      onFocus={() => resetError('familyStatus')}
                      options={familyStatusOptions}
                      value={familyStatusOptions.find(option => option.label === formData.familyStatus) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'familyStatus' })}
                      placeholder="Select Family Status" />
                    {errors.familyStatus && <p className="text-red-500 text-sm mt-1">{errors.familyStatus}</p>}
                  </div>


                  <div className="relative mb-4">
                    <label className="block lg:pb-2 text-sm font-medium text-gray-700">Select Family Type</label>
                    <Select
                      onFocus={() => resetError('familyType')}
                      options={familyTypeOptions}
                      value={familyTypeOptions.find(option => option.label === formData.familyType) || null}
                      onChange={(selectedOption) => handleDropChange(selectedOption.label, { name: 'familyType' })}
                      placeholder="Select Family Type" />
                    {errors.familyType && <p className="text-red-500 text-sm mt-1">{errors.familyType}</p>}
                  </div>
                  <div className="relative mb-4">
                    <label className="block lg:pb-2 text-sm font-medium text-gray-700">About</label>
                    <textarea
                      value={formData.about}
                      name='about'
                      onChange={handleChange}
                      rows={10}
                      cols={50}
                      className="w-full p-2 border border-gray-300 rounded-md resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </>)}
              </div>
              {errors.apiErrors && <p className="text-red-500 text-sm mt-1">{errors.apiErrors}</p>}

              <div className="flex justify-between w-full">
                <button
                  type="button"
                  disabled={currentStep === 1 ? true : false}
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currentStep !== 1 ? 'Back' : 'Back'}
                </button>
                <button
                  disabled={Status === "loading" && currentStep === 4}
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {currentStep === 4 ? 'Submit' : 'Next'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>


    </div>
  );
};

export default RegisterPage;

