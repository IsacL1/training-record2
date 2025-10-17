
import React, { useEffect, useState } from 'react';
import { SlideBasic, SlideDetails, RecordMode } from '../Model/Interface';
import AthleteOptions from '../Model/useListAthlete';

import PopupSlideBasicInfo from './PopupSlideBasicInfo';

const SlideRecord = () => {
  // const [athletes, setAthletes] = useState<string[]>([]);
  const [displayMode, setDisplayMode] = useState<'Fixed' | 'Free'>('Fixed');
  // const [, setShowList] = useState<boolean>(false);
  const [selectedAthlete, setSelectedAthlete] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [selectedSubFamily, setSelectedSubFamily] = useState('');
  const [selectedTrickName, setSelectedTrickName] = useState('');
  const [selectedTrickFamilies, setSelectedTrickFamilies] = useState([]);
  const [selectedFloorType, setSelectedFloorType] = useState('');
  const [selectedEntry, setSelectedEntry] = useState('');
  const [tricks, setTricks] = useState<{ trickName: string; trickFamily: string; trickId: string }[]>([]);
  const levels = ['A', 'B', 'C', 'D', 'E'];
  const baseUrl = process.env.REACT_APP_API_URL || `http://localhost:3001`;

  // Slalom Record Basic
  // Add a state to store the form data
  const [RecordMode, setRecordMode] = useState<RecordMode>({
    recordMode: "Fixed",
  });

  const [SlideBasic, setSlideBasicForm] = useState<SlideBasic>({
    athleteName: '',
    trickName: '',
    trickLevel: '',
    trickFamily: '',
    trickSubFamily: '',
    distance: undefined,
    notes: '',
    ...RecordMode
  });

  const [SlideDetails, setSlideDetailsForm] = useState<SlideDetails>({
    ...SlideBasic,
    steps: undefined,
    floorType: '',
    speed: 0,
    entry: '',
    comboTricks: [],
    endLine: false,
    notes: '',
    ...RecordMode
  });

  const handleNormalSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prepare data to send to the server
    const recordData = {
      athleteName: selectedAthlete,
      trickLevel: selectedLevel,
      trickFamily: selectedFamily || undefined, // Optional field
      trickSubFamily: selectedSubFamily || undefined, // Optional field
      trickName: selectedTrickName,
      timestamp: new Date().toISOString(), // Optional: Add timestamp
      // recordType: RecordMode,
      distance: SlideBasic.distance,
      notes: SlideBasic.notes || "",
    };

    console.log('Record data:', recordData); // Log the data to be sent

    try {
      const response = await fetch(`${baseUrl}/api/addSlideRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordData),
      });

      console.log('Response:', recordData); // Log the response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Record added:', result);

      // Reset form (optional)
      setSlideBasicForm({ ...SlideBasic, distance: undefined, notes: '' }); // Reset basic form
      setSelectedLevel('');
      setSelectedFamily('');
      setSelectedSubFamily('');
      setSelectedTrickName('');
      setSelectedAthlete('');
      setTricks([]); // Clear tricks dropdown
      setSelectedTrickFamilies([]); // Clear families dropdown

      alert('Record submitted successfully!');
    } catch (error) {
      console.error('Error submitting record:', error);
      alert('Failed to submit record. Please try again.');
    }
  }

  const handleDetailsSubmit = async (event: React.FormEvent<HTMLFormElement>) => { // This function will be called when the form is submitted (e.g., when the user clicks the "Submit" button) => {
    event.preventDefault();

    // Prepare data to send to the server
    const recordData = {
      // require field
      athleteName: selectedAthlete,
      trickLevel: selectedLevel,
      trickFamily: selectedFamily,
      trickName: selectedTrickName,
      recordType: RecordMode,
      timestamp: new Date().toISOString(), // Optional: Add timestamp

      // Optional type field
      floorType: selectedFloorType,
      steps: SlideDetails.steps,
      notes: SlideDetails.notes,
      endLine: SlideDetails.endLine,
      distance: SlideDetails.distance,

    };

    console.log('Record data:', recordData); // Log the data to be sent

    try {
      const response = await fetch(`${baseUrl}/api/addSlideRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Record added:', result);

      // Reset form (optional)
      setSelectedLevel('');
      setSelectedFamily('');
      setSelectedSubFamily('');
      setSelectedTrickName('');
      setSelectedAthlete('');
      setTricks([]); // Clear tricks dropdown
      setSelectedTrickFamilies([]); // Clear families dropdown
      setSelectedFloorType('');
      setSlideDetailsForm({
        ...SlideDetails,
      }); // Reset details form

      alert('Record submitted successfully!');
    } catch (error) {
      console.error('Error submitting record:', error);
      alert('Failed to submit record. Please try again.');
    }
  }

  // Fetch trick families when level changes
  useEffect(() => {
    if (selectedLevel) {
      fetchTrickFamilies();
      fetchTricks();
    }
  }, [selectedLevel]);

  // Fetch tricks when family changes
  useEffect(() => {
    if (selectedLevel) {
      fetchTricks();
    }
  }, [selectedFamily]);

  const fetchTrickFamilies = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/trick-families?selectedLevel=${selectedLevel}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // console.log('Fetched trick Families:', data); // Log the data
      console.log('Families for level', selectedLevel, ':', data);
      setSelectedTrickFamilies(data);
    } catch (error) {
      console.error('Error fetching trick families:', error);
    }
  };

  const fetchTricks = async () => {

    try {
      const query = new URLSearchParams();
      if (selectedLevel) query.append('level', selectedLevel);
      if (selectedFamily) query.append('family', selectedFamily);
      if (selectedSubFamily) query.append('subFamily', selectedSubFamily);

      const response = await fetch(`${baseUrl}/api/getTricks?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Tricks:', data); // Log the data
      setTricks(data);

      // If trickName exists but family changed, reset trickName
      if (selectedTrickName && selectedFamily) {
        const currentTrick = data.find((t: { trickName: string; }) => t.trickName === selectedTrickName);
        if (!currentTrick) setSelectedTrickName('');
      }
    } catch (error) {
      console.error('Error fetching tricks:', error);
    }
  };

  const handleDisplayModeChange = (mode: 'Fixed' | 'Free') => {
    setDisplayMode(mode);
  };

  const handleNormalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSlideBasicForm((prev: any) => ({ ...prev, [name]: name === 'distance' ? (value === '' ? null : Number(value)) : value, }));
  }

  const handleDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (event.target.name === 'date') {
    //   setSlideDetailsForm({ ...SlideDetails, date: new Date(event.target.value) });
    // } else
    if (event.target.name === 'endline') {
      setSlideDetailsForm({ ...SlideDetails, endLine: event.target.checked });
    }

    setSelectedFloorType(event.target.value);
    // console.log(SlideDetails);
  }

  const handleAthleteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAthlete(event.target.value);
    setSlideBasicForm({ ...SlideBasic, athleteName: event.target.value });
    setSlideDetailsForm({ ...SlideDetails, athleteName: event.target.value });
    // setShowList(false);
  };

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(event.target.value);
    setSelectedFamily('');
    setSelectedTrickName('');
  };

  const handleFamilyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newFamily = event.target.value;
    if (!isNaN(Number(newFamily))) { // Ensure it’s a valid number
      setSelectedFamily(newFamily);
      setSelectedTrickName('');
    }
  };

  const handleTrickChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTrickName = event.target.value;
    setSelectedTrickName(newTrickName);

    // If family isn't selected, set it based on trickName
    if (!selectedFamily && newTrickName) {
      const trick = tricks.find(t => t.trickName === newTrickName);
      if (trick) setSelectedFamily(trick.trickFamily);
    }
  };

  // Popup windows session
  // Popup form state and handlers
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>();
  const [dataInfo, setDataInfo] = useState<string>('');

  const handlePopupformSubmit = async (data: any) => {
    console.log("Popup form data received: ", data);
    // Do something with the submitted data
    setFormData(data);
    setIsPopupOpen(false);

    // Fetch record mode from backend and set displayMode accordingly
    try {
      // Assume popup form has a field "selectedRecordMode" with value "Fixed" or "Free"
      const selectedRecordMode = data.selectedRecordMode;
      // Check if backend supports the selected mode, else fallback to first available
      if (selectedRecordMode === 'Fixed') {
        handleDisplayModeChange('Fixed');
        setRecordMode({ recordMode: 'Fixed' });
        setDataInfo(`${data.selectedTypeFloor}, ${data.selectedRecordMode}`);
      } else if (selectedRecordMode === 'Free') {
        handleDisplayModeChange('Free');
        setRecordMode({ recordMode: 'Free' });
        setDataInfo(`${data.selectedTypeFloor}, ${data.selectedRecordMode}`);
      }

    } catch (error) {
      console.error('Error fetching record mode:', error);
    }
  }


  const handlePopupOpen = () => {
    console.log('handleOpen called');
    setIsPopupOpen(true);
  };
  // const fetchAndSetDisplayMode = async () => {
  //   try {
  //     const res = await fetch(`${baseUrl}/api/getDetailsInfo/recordmode`);
  //     const data = await res.json();
  //     if (data && data.length > 0 && (data[0].recordMode === 'Fixed' || data[0].recordMode === 'Free')) {
  //       setDisplayMode(data[0].recordMode);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching record mode:', error);
  //   }
  // };
  return (
    <div className='main'>
      <div className='row row-md'>
        <div className='col col-md-2'>
          {/* <button onClick={() => handleDisplayModeChange('Fixed')}>Fixed</button>
          <button onClick={() => handleDisplayModeChange('Free')}>Free Record</button> */}

          {/* <button onClick={fetchAndSetDisplayMode}>Fetch Display Mode</button> */}

          {/* Other content on the main page */}
          <div className='p-10 flex jusify-center w-full'>
            <button onClick={handlePopupOpen}>Background Info</button>
            {isPopupOpen && ( // isPopupOpen is true, show the popup
              <PopupSlideBasicInfo onSubmit={handlePopupformSubmit} />
            )}
          </div>
        </div>
        <div className='col col-md-10'>
          {/* <p>Received Basic info:</p>
          <pre>
            {JSON.stringify(formData, null,)}
          </pre> */}

          <p className='info'>{dataInfo}</p>
        </div>
      </div>
      <h1 className='title'>Slide Battle</h1>
      <div className='container'>

        {displayMode === 'Fixed' && (
          <form className='form' onSubmit={handleNormalSubmit}>
            <div>
              <label className="formLabel col-sm-5 col-form-label">Fixed Record (Pratice mode)</label>
            </div>
            <div className="formContent row row-md">
              <label className="formLabel col-sm-5 col-form-label">Name: </label>
              <select name="athleteName" className="inputBox" value={selectedAthlete} onChange={(e) => setSelectedAthlete(e.target.value)} required>
                <option value="">Select an athlete</option>
                <AthleteOptions />
              </select>
            </div>

            <div className="formContent row md">
              <label className="formLabel col-sm-5 col-form-label">Level: </label>
              <select name="trickLevel" className="inputBox" value={selectedLevel} onChange={handleLevelChange} required>
                <option value="">Select trick level</option>
                {levels.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="formContent row md">
              <label className="formLabel col-sm-5 col-form-label">Family: </label>
              {/* optional to choose, if choosen, it will be a select option form */}
              <select name="trickFamily" className="inputBox" value={selectedFamily} onChange={handleFamilyChange}>
                <option value="">Select trick family (optional)</option>
                {selectedTrickFamilies.map(fam => (
                  <option key={fam} value={fam}>{fam}</option>
                ))}
              </select>
            </div>

            <div className="formContent row md">
              <label className="formLabel col-sm-5 col-form-label">Trick Name: </label>
              <select name="trickName" className="inputBox" value={selectedTrickName} onChange={handleTrickChange} required>
                <option value="">Select a trick</option>
                {tricks.map(trick => (
                  <option key={trick.trickId} value={trick.trickName}>
                    {trick.trickName} - {trick.trickId}
                  </option>
                ))}
              </select>
            </div>

            <div className="formContent row md">
              <label className="formLabel col-sm-5 col-form-label">Distance: </label>
              <input type="number" name="distance" className="inputBox" value={SlideBasic.distance ?? ''} min="0"
                placeholder="Distance" onChange={handleNormalChange} required />
            </div>

            <div className="formContent row md">
              <label className="formLabel col-sm-5 col-form-label">Notes: </label>
              <input type="text" name="notes" className="inputBox" value={SlideBasic.notes || ''}
                placeholder='Notes / Comments' onChange={handleNormalChange} />
            </div>
            <div className="formContent row row-md">
              <button type="submit">Submit</button>
            </div>
          </form>
        )}

        {displayMode === 'Free' && (
          <form className='form' onSubmit={handleDetailsSubmit}>
            <div>
              <label className="formLabel col-sm-5 col-form-label">Free Record (Mock of Competition mode)</label>
            </div>
            {/* <div className="formContent row row-sm-2">
              <label className="formLabel col-sm-5 col-form-label">Type of floor: </label>
              <div className="col">

                <div className="row">
                  <div className="formRadio col-md">
                    <input type="radio" name="floorType" id='hardFloor' className="col"
                      value="hardFloor" checked={selectedFloorType === 'hardFloor'} onChange={handleDetailsChange} />
                    <label htmlFor="hardFloor" className="formLabel col col-form-label">Hard floor</label>
                  </div>
                  <div className="formRadio col-md">
                    <input type="radio" name="floorType" id='plastic' className="col"
                      value="plastic" checked={selectedFloorType === 'plastic'} onChange={handleDetailsChange} />
                    <label htmlFor="plastic" className="formLabel col col-form-label">Plastic</label>
                  </div>
                </div>
                <div className="row">
                  <div className="formRadio col-md">
                    <input type="radio" name="floorType" id='wax' className="col"
                      value="wax" checked={selectedFloorType === 'wax'} onChange={handleDetailsChange} />
                    <label htmlFor="wax" className="formLabel col col-form-label">Wax</label>
                  </div>
                  <div className="formRadio col-md">
                    <input type="radio" name="floorType" id='pad' className="col"
                      value="pad" checked={selectedFloorType === 'pad'} onChange={handleDetailsChange} />
                    <label htmlFor="pad" className="formLabel col col-form-label">Pad</label>
                  </div>
                </div>

              </div>
            </div> */}

            <div className="formContent row row-md">
              <label className="formLabel col-sm-5 col-form-label">Name: </label>
              <select name="athleteName" className="inputBox" value={selectedAthlete} onChange={handleAthleteChange} required>
                <option value="">Select an athlete</option>
                <AthleteOptions />
              </select>
            </div>

            <div className="formContent row md">
              <label className="formLabel col-sm-5 col-form-label">Steps (in25m): </label>
              <input type="number" step="1" name="steps" className="inputBox" value={SlideDetails.steps ?? ''} min="0"
                placeholder="Steps" onChange={handleDetailsChange} />
            </div>

            <div className="formContent row md">
              <label className="formLabel col-sm-5 col-form-label">Level: </label>
              <select name="trickLevel" className="inputBox" value={selectedLevel} onChange={handleLevelChange} required>
                <option value="">Select trick level</option>
                {levels.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div className="formContent row md">
              <label className="formLabel col-sm-5 col-form-label">Family: </label>
              {/* optional to choose, if choosen, it will be a select option form */}
              <select name="trickFamily" className="inputBox" value={selectedFamily} onChange={handleFamilyChange}>
                <option value="">Select trick family (optional)</option>
                {selectedTrickFamilies.map(fam => (
                  <option key={fam} value={fam}>{fam}</option>
                ))}
              </select>
            </div>

            <div className="formContent row md">
              <label className="formLabel col-sm-5 col-form-label">Trick Name: </label>
              <select name="trickName" className="inputBox" value={selectedTrickName} onChange={handleTrickChange} required>
                <option value="">Select a trick</option>
                {tricks.map(trick => (
                  <option key={trick.trickId} value={trick.trickName}>
                    {trick.trickName} - {trick.trickId}
                  </option>
                ))}
              </select>
            </div>

            <div className="formContent row md">
              <label className="formLabel col-sm-5 col-form-label">Distance: </label>
              <input type="number" name="distance" className="inputBox" value={SlideDetails.distance ?? ''} min="0"
                placeholder="Distance" onChange={handleDetailsChange} />
            </div>

            <div className="formContent row md">
              <label className="formLabel col-sm-5 col-form-label">Speed: </label>
              <input type="number" step="0.001" name="speed" className="inputBox" value={SlideDetails.speed ?? ''} min="0"
                placeholder="Speed in 0.001" onChange={handleDetailsChange} required />
            </div>

            <div className="formContent row row-sm">
              <label className="formLabel col-sm-5 col-form-label">Entry method: </label>

              <div className="formRadio col-sm-2">
                <input type="radio" name="entry" id='forward' className="col-sm-5"
                  value="fwd" checked={selectedEntry === 'fwd'} onChange={handleDetailsChange} />
                <label htmlFor="forward" className="formLabel col-sm col-form-label">Forward</label>
              </div>
              <div className="formRadio col-sm-2">
                <input type="radio" name="entry" id='backward' className="col-sm-5"
                  value="bwd" checked={selectedEntry === 'bwd'} onChange={handleDetailsChange} />
                <label id='backward' htmlFor="backward" className="formLabel col-sm col-form-label">Backward</label>
              </div>
            </div>

            <div className="formContent row row-md">
              <label className="formLabel col-sm-5 col-form-label">End line: </label>

              <div className="formRadio col-sm col-form-label">
                <input type="checkbox" name="endline" className="col-sm-5" checked={SlideDetails.endLine}
                  placeholder="End Line?" onChange={handleDetailsChange} />
              </div>
              <label className="formLabel col-sm-2 col-form-label">
                <label className='foramLabel-DQ col-sm-2'>
                  {SlideDetails.endLine ? 'DQ' : ''}</label>
              </label>
            </div>

            <div className="formContent row row-md">
              <label className="formLabel col-sm-5 col-form-label">Notes: </label>
              <input type="text" name="notes" className="inputBox" value={SlideDetails.notes}
                placeholder='Notes / Comments' onChange={handleDetailsChange} />
            </div>

            <div className="formContent row row-md">
              <button type="submit">Submit</button>
            </div>
          </form>
        )}
      </div >
    </div>
  );
};

export default SlideRecord;