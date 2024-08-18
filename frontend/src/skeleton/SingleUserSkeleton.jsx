import React from 'react';

const SingleUserSkeleton = () => {
  return (
    <>  <div className="flex items-start justify-center  py-5 ">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl p-4 border border-gray-200 rounded shadow animate-pulse dark:border-gray-700">
        {/* Left Side: Image */}
        <div className="flex-shrink-0 w-full lg:w-1/4 mb-4 lg:mb-0">
          <div className="flex items-center justify-center h-48 bg-gray-300 rounded dark:bg-gray-700">
            <svg className="w-24 h-24 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
            </svg>
          </div>
        </div>
        
        {/* Right Side: Text and Buttons */}
        <div className="w-full lg:w-3/4 lg:pl-4">
          <div className="space-y-4">
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-3/4"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-5/6"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-1/2"></div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-3/4"></div>
          </div>
          <div className="mt-4 flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
            <div className="h-10 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-1/3"></div>
          </div>
        </div>
        
      </div>

    </div>
      <div className=" px-5   w-full lg:w-3/4 lg:pl-4">
    <div className="space-y-4 px-5 py-5 ">
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-3/4"></div>
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-5/6"></div>
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-1/2"></div>
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-3/4"></div>
    </div>
    <div className="space-y-4 px-5 py-5 ">
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-3/4"></div>
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-5/6"></div>
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-1/2"></div>
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full lg:w-3/4"></div>
    </div>
  </div>
  </>
  );
}

export default SingleUserSkeleton;
