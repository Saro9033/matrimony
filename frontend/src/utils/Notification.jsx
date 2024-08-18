import React from 'react';

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification">
      <p>{message}</p>
      <button onClick={onClose} className="notification-close">×</button>
      <style jsx>{`
        .notification {
          position: fixed;
          top: 10px;
          right: 10px;
          background-color: #4caf50;
          color: white;
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          z-index: 1000;
        }
        .notification-close {
          background: transparent;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Notification;
