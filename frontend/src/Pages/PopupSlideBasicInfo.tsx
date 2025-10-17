import React, { useEffect, useState } from 'react';
import PopupModel from '../Component/PopupModel';
import RecordModeOptions from '../Model/useListRecordMode';
import { LocationOptions, TypeFloorOptions } from '../Model/useListLocation';
import '../Style/Popup.scss';
import '../Style/App.scss';
type Props = {
  // onClose: () => void;
  
  onSubmit: (data: FormData) => void;
  // updateFormData: (data: FormData) => void;

}

interface FormData {
  selectedLocation: string;
  selectedTypeFloor: string;
  selectedRecordMode: string;
}

/**
 * A popup component that asks for background information about the record.
 * @param {Props} props - The props for the component.
 * @param {() => void} props.onSubmit - The function to call when the user submits the form.
 */



const PopupSlideBasicInfo: React.FC<Props> = ({ onSubmit }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    // The location of the record.
    selectedLocation: '',
    // The type of floor of the record.
    selectedTypeFloor: '',
    // The record mode of the record.
    selectedRecordMode: '',
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // const baseUrl = process.env.REACT_APP_API_URL || `http://localhost:3001`;
  useEffect(() => {
    // TODO: Add an effect to handle setting the initial state of the form
  }, [isPopupOpen]);

  /**
   * Handles changes to the form input.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event - The event object.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    //     const { name, value } = event.target;
    // setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  /**
   * Handles the submission of the form.
   */
  const handleSubmit = () => {
    // updateFormData(formData); // Update formData before submitting
    onSubmit(formData);
  };

  return (
    <div>
      {/* <PopupModel onSubmit={handleSubmit}> */}
      <PopupModel>
        <h2>Enter Background Information</h2>

        {/*  Testing output */}
        {/* <p>Received formData():</p>
        <pre>
          {JSON.stringify(formData, null, 2)}
        </pre> */}

        <form className='form'>
          <div className="formContent row md">
            <label className="formLabel col-sm-12 col-form-label">
              Location:
              <select className="inputBox" name="selectedLocation" value={formData.selectedLocation} onChange={handleChange} >
                <option value="">Location</option>
                <LocationOptions />
              </select>
            </label>
          </div>

          <div className="formContent row md">
            <label className="formLabel col-sm-12 col-form-label">
              Type of floor:
              <select className="inputBox" name="selectedTypeFloor" value={formData.selectedTypeFloor} onChange={handleChange} >
                <option value="">Type of Floor</option>
                <TypeFloorOptions />
              </select>
            </label>
          </div>

          <div className="formContent row md">
            <label className="formLabel col-sm-12 col-form-label">
              Record Mode:
              <select className="inputBox" name="selectedRecordMode" value={formData.selectedRecordMode} onChange={handleChange} >
                <option value="">Record Mode</option>
                <RecordModeOptions />
              </select>
            </label>
          </div>

          <div className="formContent row row-md">
            <button className='formButtonSubmit' type="submit" onClick={handleSubmit}>Close and Submit</button>
          </div>
        </form>
      </PopupModel>
    </div>
  );
};

export default PopupSlideBasicInfo;