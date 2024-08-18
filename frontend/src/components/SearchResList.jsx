import React from 'react'
import { useNavigate } from 'react-router-dom'
import CalculateAge from '../utils/CalculateAge'

const SearchResList = ({isMobile, user, handleCloseModal, toggleSearch, sort }) => {
  const navigate = useNavigate()

  const onSubmit = (id) => {
    handleCloseModal()
   if(isMobile){
    toggleSearch()
   } 
    console.log(id);
    navigate(`/profile/${id}`)
  }

  return (
    <div onClick={() => onSubmit(user._id)} className="my-2 cursor-pointer hover:bg-gray-200 flex items-center w-full bg-white border border-gray-100 rounded-lg ">
      <a className='cursor-pointer'>
        <img className="rounded-full m-1" width={45} src={user?.avatar} alt={user?.name} />
      </a>
      <div className='pl-2'>
        <h2 style={{ fontSize: '16px' }} className='font-bold'>{user?.name}</h2>
        {(sort === 'income' || sort === 'income,desc') ?
          <h2 style={{ fontSize: '13px' }} className='text-gray-600'>{user?.income} Salary</h2>
          :
          (sort === 'height' || sort === 'height,desc') ?
            <h2 style={{ fontSize: '13px' }} className='text-gray-600'>{user?.height} CM</h2>
            :
            (sort === 'weight' || sort === 'weight,desc') ?
              <h2 style={{ fontSize: '13px' }} className='text-gray-600'>{user?.weight} KG</h2>
              :
              <h2 style={{ fontSize: '13px' }} className='text-gray-600'>{CalculateAge(user?.DOB)} Yrs Old</h2>
        }
      </div>
    </div>
  )
}

export default SearchResList