import React from 'react';
import '../Style/App.scss';

type PopupProps = {
  // onSubmit: () => void;
  children: React.ReactNode;
}

/**
 * A generic popup model component that wraps any content with a popup overlay,
 * and provides a way to close and submit the popup.
 *

 */
// const PopupModel: React.FC<PopupProps> = ({ onClose, onSubmit, children, formData }) => {
const PopupModel: React.FC<PopupProps> = ({ children }) => {
  console.log('PopupModel re-rendered');
  console.log('Received formData:');

  return (
    <div className="popup-overlay">
      {/* The outer div is the popup overlay, which is a full screen div that blocks any other interaction */}
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {/* The inner div is the popup content, which contains the actual content of the popup */}
        {React.Children.map(children, (child, index) => (
          <div key={index}>{child}</div>
        ))}
        {/* The buttons are used to close and submit the popup */}
        {/* <div className="formContent row row-md">
          <button className='formButtonSubmit' type="submit" onClick={onSubmit}>Close and Submit</button>
        </div> */}
      </div>
    </div>
  );
};

export default PopupModel;