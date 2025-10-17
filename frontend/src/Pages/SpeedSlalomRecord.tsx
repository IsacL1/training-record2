import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { SpeedSlalomBasic, SSRDetails } from '../Model/Interface';
import AthleteOptions from '../Model/useListAthlete';

const host = 'localhost:3001';

const SpeedSlalomRecord = () => {
    // Add a state to store the list of athletes
    const [selectedAthlete, setSelectedAthlete] = useState<string>('');
    const [, setShowList] = useState<boolean>(false);

    const [displayMode, setDisplayMode] = useState<'Normal' | 'Details'>('Normal');

    // Slalom Record Basic
    // Add a state to store the form data
    const [SpeedSlalomBasic, setSpeedSlalomForm] = useState<SpeedSlalomBasic>({
        athleteName: '',
        date: new Date(),
        time: undefined,
        missedCone: 0,
        kickedCone: 0,
        DQ: false,
        endLine: false,
        SSResult: 0,
        notes: '',
        recordMode: "Normal"
    });

    // Slalom Record Details
    // Add a state to store the form data
    const [SSRDetails, setSSRDetails] = useState<SSRDetails>({
        ...SpeedSlalomBasic,
        side: 'L',
        step: 0,
        time12m: undefined,
        xCones: undefined,
        timeXcones: undefined,
        recordMode: "Details"
    });

    const handleDisplayModeChange = (mode: 'Normal' | 'Details') => {
        setDisplayMode(mode);
    };

    // Handle change - SppedSlalom form  
    const handleNormalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = event.target;
        let newValue: string | number | undefined | Date | boolean = value; // Default to string value

        if (name === 'time') {
            newValue = value === '' ? undefined : parseFloat(value); // Handle number or undefined
        } else if (event.target.name === 'date') {
            newValue = new Date(value); // Convert to Date object
        } else if (event.target.name === 'endline') {
            newValue = checked; // Use checked for checkbox
        }

        setSpeedSlalomForm((prev) => {
            const updatedState = { ...prev, [name]: newValue };
            console.log('Updated state:', updatedState); // Log after update
            return updatedState;
        });
    };

    // Handle change - SppedSlalom form  
    const handleDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSSRDetails({ ...SSRDetails, [event.target.name]: event.target.value });
        // console.log("SSRDetails log: ", SSRDetails);

        if (event.target.name === 'date') {
            setSSRDetails({ ...SSRDetails, date: new Date(event.target.value) });
        } else if (event.target.name === 'endline') {
            setSSRDetails({ ...SSRDetails, endLine: event.target.checked });
        } else {
            setSSRDetails({ ...SSRDetails, [event.target.name]: event.target.value });
        }
    };

    const handleAChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? NaN : Number(event.target.value);
        setSSRDetails(prev => ({ ...prev, time12m: newValue }));
        calculateValues(
            event.target.value,
            Number.isNaN(SSRDetails.timeXcones) ? '' : String(SSRDetails.timeXcones),
            Number.isNaN(SSRDetails.time) ? '' : String(SSRDetails.time)
        );
    };

    const handleBChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? NaN : Number(event.target.value);
        setSSRDetails(prev => ({ ...prev, timeXcones: newValue }));
        calculateValues(
            Number.isNaN(SSRDetails.time12m) ? '' : String(SSRDetails.time12m),
            event.target.value,
            Number.isNaN(SSRDetails.time) ? '' : String(SSRDetails.time)
        );
    };

    const handleCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value === '' ? NaN : Number(event.target.value);
        setSSRDetails(prev => ({ ...prev, time: newValue }));
        calculateValues(
            Number.isNaN(SSRDetails.time12m) ? '' : String(SSRDetails.time12m),
            Number.isNaN(SSRDetails.timeXcones) ? '' : String(SSRDetails.timeXcones),
            event.target.value
        );
    };

    // Handle change of selected athlete
    const handleAthleteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAthlete(event.target.value);
        setSpeedSlalomForm({ ...SpeedSlalomBasic, athleteName: event.target.value });
        setSSRDetails({ ...SSRDetails, athleteName: event.target.value });
        setShowList(false);
    };


    // Submit form
    const handleNormalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // console.log(typeof SpeedSlalomBasic.date);
        // console.log(SpeedSlalomBasic.date);

        console.log('handleSubmit called');
        event.preventDefault();

        // Calculate the result and keep 3 decimal places
        // setSpeedSlalomForm({ ...SpeedSlalomBasic, recordMode: "Normal" });

        // Validate the data
        if (!SpeedSlalomBasic.athleteName || !SpeedSlalomBasic.date || !SpeedSlalomBasic.time) {
            toast.error('Please fill in all required fields');
        } else if (SpeedSlalomBasic.missedCone === null || SpeedSlalomBasic.missedCone <= 0) {
            SpeedSlalomBasic.missedCone = 0;
        }
        if (SpeedSlalomBasic.kickedCone === null || SpeedSlalomBasic.kickedCone <= 0) {
            SpeedSlalomBasic.kickedCone = 0;
        }

        if (Number(SpeedSlalomBasic.kickedCone) + Number(SpeedSlalomBasic.missedCone) > 4 || SpeedSlalomBasic.endLine) {
            SpeedSlalomBasic.DQ = true;
        }

        const SSResult = (Number(SpeedSlalomBasic.time) + ((Number(SpeedSlalomBasic.missedCone) + Number(SpeedSlalomBasic.kickedCone)) * 0.2)).toFixed(3);
        SpeedSlalomBasic.SSResult = parseFloat(SSResult);

        setSpeedSlalomForm({ ...SpeedSlalomBasic, SSResult: parseFloat(SSResult) });
        console.log("SSR", SSResult);

        // Warp the data
        const speedSlalomData = {
            athleteName: SpeedSlalomBasic.athleteName,
            date: SpeedSlalomBasic.date,
            time: SpeedSlalomBasic.time,
            missedCone: SpeedSlalomBasic.missedCone,
            kickedCone: SpeedSlalomBasic.kickedCone,
            DQ: SpeedSlalomBasic.DQ,
            endLine: SpeedSlalomBasic.endLine,
            SSResult: SpeedSlalomBasic.SSResult,
            notes: SpeedSlalomBasic.notes,
            recordMode: "Normal"
        };

        console.log(typeof speedSlalomData);
        console.log("SpeedSlalomBasic: ", SpeedSlalomBasic);


        // Send data to server
        axios.post(`http://${host}/api/addSSRecord`, speedSlalomData)
            .then((response) => {
                console.log("Repoense data: ", response.data);
                toast.success('Data submitted successfully!');
                setSpeedSlalomForm({
                    athleteName: SpeedSlalomBasic.athleteName,
                    date: new Date(),
                    time: undefined,
                    missedCone: 0,
                    kickedCone: 0,
                    DQ: false,
                    endLine: false,
                    SSResult: 0,
                    notes: '',
                    recordMode: "Normal"
                });
            })
            .catch((error) => {
                console.error(error);
                toast.error('Error submitting data!');
            });

    };

    // Details Record
    const handleDetailsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        // console.log(typeof SSRAdditional.date);
        // console.log(SSRAdditional.date);

        event.preventDefault();
        console.log('handleDetailsSubmit called');
        // Calculate the result and keep 3 decimal places
        const SSResult = (Number(SSRDetails.time) + ((Number(SSRDetails.missedCone) + Number(SSRDetails.kickedCone)) * 0.2)).toFixed(3);
        SSRDetails.SSResult = parseFloat(SSResult);

        setSSRDetails({ ...SSRDetails, SSResult: parseFloat(SSResult) });
        console.log("SSR", SSResult);

        // Validate the data
        if (!SSRDetails.athleteName || !SSRDetails.date || !SSRDetails.side || !SSRDetails.step || !SSRDetails.time) {
            toast.error('Please fill in all required fields');
        } else if (SSRDetails.step <= 0 || SSRDetails.time <= 0) {
            toast.error('Invalid values');
        }

        if (SSRDetails.missedCone === null || SSRDetails.missedCone <= 0) {
            SSRDetails.missedCone = 0;
        }

        if (SSRDetails.kickedCone === null || SSRDetails.kickedCone <= 0) {
            SSRDetails.kickedCone = 0;
        }

        if (Number(SpeedSlalomBasic.kickedCone) + Number(SpeedSlalomBasic.missedCone) > 4 || SpeedSlalomBasic.endLine) {
            SpeedSlalomBasic.DQ = true;
        }


        // Warp the data
        const speedSlalomData = {
            athleteName: SSRDetails.athleteName,
            date: SSRDetails.date,
            side: SSRDetails.side,
            step: SSRDetails.step,
            time12m: SSRDetails.time12m,
            xCones: SSRDetails.xCones,
            timeXcones: SSRDetails.timeXcones,
            time: SSRDetails.time,
            missedCone: SSRDetails.missedCone,
            kickedCone: SSRDetails.kickedCone,
            DQ: SSRDetails.DQ,
            endLine: SSRDetails.endLine,
            SSResult: SSRDetails.SSResult,
            notes: SSRDetails.notes,
            recordMode: 'Details'
        };

        console.log(typeof speedSlalomData);
        console.log(SSRDetails);

        // Send data to server
        axios.post(`http://${host}/api/addSSRecord`, speedSlalomData)
            .then((response) => {
                console.log(response.data);
                toast.success('Data submitted successfully!');
                setSSRDetails({
                    athleteName: SSRDetails.athleteName,
                    date: new Date(),
                    side: 'L',
                    step: undefined,
                    time12m: undefined,
                    xCones: SSRDetails.xCones,
                    timeXcones: undefined,
                    time: undefined,
                    missedCone: 0,
                    kickedCone: 0,
                    DQ: false,
                    endLine: false,
                    SSResult: 0,
                    notes: '',
                    recordMode: "Details"
                });
            })
            .catch((error) => {
                console.error(error);
                toast.error('Error submitting data!');
            });

    };
    // Function to handle calculations
    const calculateValues = (time12m: string, timeXcones: string, time: string) => {
        const numA = time12m === '' ? NaN : Number(time12m);     // time12m
        const numB = timeXcones === '' ? NaN : Number(timeXcones); // timeXcones
        const numC = time === '' ? NaN : Number(time);           // total time

        if (!isNaN(numA) && !isNaN(numB) && isNaN(numC)) {
            setSSRDetails(prev => ({ ...prev, time: numA + numB }));
        }
        else if (isNaN(numA) && !isNaN(numB) && !isNaN(numC)) {
            setSSRDetails(prev => ({ ...prev, time12m: numC - numB }));
        }
        else if (!isNaN(numA) && isNaN(numB) && !isNaN(numC)) {
            setSSRDetails(prev => ({ ...prev, timeXcones: numC - numA }));
        }
    };

    return (
        <div className='main'>
            <button onClick={() => handleDisplayModeChange('Normal')}>Normal</button>
            <button onClick={() => handleDisplayModeChange('Details')}>Details Record</button>
            <h1 className='title'>Speed Slalom</h1>
            <div className='container'>

                {displayMode === 'Normal' && (
                    <form className='form' onSubmit={handleNormalSubmit}>
                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">Name: </label>
                            <select name="athleteName" className="inputBox" value={selectedAthlete} onChange={handleAthleteChange} required>
                                <option value="">Select an athlete</option>
                                <AthleteOptions />
                            </select>
                        </div>

                        <div className="formContent row md">
                            <label htmlFor="date" id="date" className="formLabel col-sm-5 col-form-label">Date: </label>
                            <input type="date" name="date" className="inputBox"
                                value={moment(SpeedSlalomBasic.date).format('YYYY-MM-DD')}
                                onChange={handleNormalChange} required
                            />
                        </div>

                        <div className="formContent row row-md">
                            <label htmlFor="time" className="formLabel col-sm-5 col-form-label">*Time: </label>
                            <input type="number" step="0.001" name="time" className="inputBox"
                                value={SpeedSlalomBasic.time ?? ''} // Displays empty when undefined 
                                min="0"
                                placeholder="Time" onChange={handleNormalChange} required />
                        </div>

                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">Missed: </label>
                            <input type="number" step="1" name="missedCone" className="inputBox" value={SpeedSlalomBasic.missedCone ?? 0} min="0"
                                placeholder="Missed Cone" onChange={handleNormalChange} />
                        </div>

                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">Kicked: </label>
                            <input type="number" step="1" name="kickedCone" className="inputBox" value={SpeedSlalomBasic.kickedCone ?? 0} min="0"
                                placeholder="Kicked Cone" onChange={handleNormalChange} />
                        </div>

                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">End line: </label>

                            <div className="formRadio col-sm col-form-label">
                                <input type="checkbox" name="endline" className="col-sm-5" checked={SpeedSlalomBasic.endLine}
                                    placeholder="End Line?" onChange={handleNormalChange} />
                            </div>
                            <label className="formLabel col-sm-2 col-form-label">
                                <label className='foramLabel-DQ col-sm-2'>
                                    {Number(SpeedSlalomBasic.kickedCone) + Number(SpeedSlalomBasic.missedCone) > 4 || SpeedSlalomBasic.endLine ? 'DQ' : ''}</label>
                            </label>

                        </div>

                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">Notes: </label>
                            <input type="text" name="notes" className="inputBox" value={SpeedSlalomBasic.notes}
                                placeholder='Notes / Comments' onChange={handleNormalChange} />
                        </div>

                        <div className="formContent row row-md">
                            <button type="submit">Submit</button>
                        </div>
                        <div className="formContent row row-md">
                            <span className="formLabel-Result col-sm-5 col-form-label">{SpeedSlalomBasic.SSResult}</span>
                        </div>
                    </form>
                )}

                {displayMode === 'Details' && (
                    <form className='form' onSubmit={handleDetailsSubmit}>
                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">Name: </label>
                            <select name="athleteName" className="inputBox" value={selectedAthlete} onChange={handleAthleteChange} required>
                                <option value="">Select an athlete</option>
                                <AthleteOptions />
                            </select>
                        </div>

                        <div className="formContent row md">
                            <label className="formLabel col-sm-5 col-form-label">Date: </label>
                            <input type="date" name="date" className="inputBox"
                                value={moment(SSRDetails.date).format('YYYY-MM-DD')}
                                onChange={handleDetailsChange} required
                            />
                        </div>

                        <div className="formContent row row-sm">
                            <label className="formLabel col-sm-5 col-form-label">Feet in box: </label>

                            <div className="formRadio col-sm-2">
                                <input type="radio" name="side" className="col-sm-5"
                                    value="L" checked={SSRDetails.side === 'L'} onChange={handleDetailsChange} />
                                <label htmlFor="left" className="formLabel col-sm col-form-label">L</label>
                            </div>
                            <div className="formRadio col-sm-2">
                                <input type="radio" name="side" className="col-sm-5"
                                    value="R" checked={SSRDetails.side === 'R'} onChange={handleDetailsChange} />
                                <label htmlFor="right" className="formLabel col-sm col-form-label">R</label>
                            </div>
                        </div>

                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">*Steps: </label>
                            <input type="number" name="step" className="inputBox" value={Number(SSRDetails.step) ?? 0} min="0"
                                placeholder="Steps" onChange={handleDetailsChange} required />
                        </div>

                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">*X cones: </label>
                            <input type="number" name="xCones" className="inputBox" value={SSRDetails.xCones ?? ''} min="1"
                                placeholder="xCones" onChange={handleDetailsChange} required />
                        </div>

                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">*Time 12m: </label>
                            <input type="number" step="0.001" name="time12m" className="inputBox" value={Number.isNaN(SSRDetails.time12m) ? '' : SSRDetails.time12m} min="1"
                                placeholder="12m time" onChange={handleAChange} required />
                        </div>

                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">*Time ({SSRDetails.xCones} cones): </label>
                            <input type="number" step="0.001" name="timeXcones" className="inputBox" value={Number.isNaN(SSRDetails.timeXcones) ? '' : SSRDetails.timeXcones} min="1"
                                placeholder={`Time of ${SSRDetails.xCones} cones`} onChange={handleBChange} required />
                        </div>

                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">Time: </label>
                            <input type="number" step="0.001" name="time" className="inputBox" value={Number.isNaN(SSRDetails.time) ? '' : SSRDetails.time} min="1"
                                placeholder="Time result" onChange={handleCChange} required />
                        </div>

                        <div className="detailsInfo row row-md">
                            <div className="formContent row row-md">
                                <label className="formLabel col-sm-5 col-form-label">Missed: </label>
                                <input type="number" name="missedCone" className="inputBox" value={SSRDetails.missedCone ?? 0} min="0"
                                    placeholder="Missed Cone" onChange={handleDetailsChange} />
                            </div>

                            <div className="formContent row row-md">
                                <label className="formLabel col-sm-5 col-form-label">Kicked: </label>
                                <input type="number" name="kickedCone" className="inputBox" value={SSRDetails.kickedCone ?? 0} min="0"
                                    placeholder="Kicked Cone" onChange={handleDetailsChange} />
                            </div>

                            <div className="formContent row row-md">
                                <label className="formLabel col-sm-5 col-form-label">End line: </label>

                                <div className="formRadio col-sm col-form-label">
                                    <input type="checkbox" name="endline" className="col-sm-5" checked={SSRDetails.endLine}
                                        placeholder="End Line?" onChange={handleDetailsChange} />
                                </div>
                                <label className="formLabel col-sm-2 col-form-label">
                                    <label className='foramLabel-DQ col-sm-2'>
                                        {Number(SSRDetails.kickedCone) + Number(SSRDetails.missedCone) > 4 || SSRDetails.endLine ? 'DQ' : ''}</label>
                                </label>
                            </div>
                        </div>

                        <div className="formContent row row-md">
                            <label className="formLabel col-sm-5 col-form-label">Notes: </label>
                            <input type="text" name="notes" className="inputBox" value={SSRDetails.notes}
                                placeholder='Notes / Comments' onChange={handleDetailsChange} />
                        </div>

                        <div className="formContent row row-md">
                            <button type="submit">Submit</button>
                        </div>
                        <div className="formContent row row-md">
                            <span className="formLabel-Result col-sm-5 col-form-label">{SSRDetails.SSResult}</span>
                        </div>
                    </form>
                )}
            </div >
        </div >
    );
}

export default SpeedSlalomRecord;