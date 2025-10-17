import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { SSRDetails } from '../Model/Interface';

import { CiFilter } from "react-icons/ci";

import moment from 'moment';
import "../Style/AnalyzeSSR.scss";

const host = 'localhost:3001';

interface AthletesSSRecords extends SSRDetails {
    _id: string,
}
const SSResultRecored = () => {
    const [AthletesSSRecordsData, setAthletesSSRecordsData] = useState<AthletesSSRecords[]>([]);
    const [displayMode, setDisplayMode] = useState<'Normal' | 'Details'>('Normal');

    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    const fetchSSRecords = useCallback(async (recordType: 'Normal' | 'Details') => {

        axios.get(`http://${host}/api/getSSRecords?recordType=${recordType}`)
            .then(response => {
                setAthletesSSRecordsData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const handleDisplayModeChange = (mode: 'Normal' | 'Details') => {
        setDisplayMode(mode);
        fetchSSRecords(mode);
    };

    const thElements = document.querySelectorAll('th[data-sort]');

    thElements.forEach((th) => {
        th.addEventListener('click', () => {
            const sortKey = th.getAttribute('data-sort') || '';
            handleSort(sortKey as keyof AthletesSSRecords);
        });
    });

    const handleSort = (key: keyof AthletesSSRecords) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }

        const sortedData = [...AthletesSSRecordsData].sort((a, b) => {
            if (sortOrder === 'asc') {
                return ((a[key] ?? '') > (b[key] ?? '') ? 1 : -1);
            } else {
                return ((a[key] ?? '') < (b[key] ?? '') ? 1 : -1);
            }
        });

        setAthletesSSRecordsData(sortedData);
    };

    return (
        <div className='main'>
            <button onClick={() => handleDisplayModeChange('Normal')}>Normal</button>
            <button onClick={() => handleDisplayModeChange('Details')}>Details</button>
            <h1 className='title'>Speed Slalom Result</h1>
            <div className='container'>
                <table className="table" >
                    {displayMode === 'Normal' && (
                        <>
                            <thead className='table-head'>
                                <tr className='table-tr'>
                                    {/* Date sorting cannot work now */}
                                    <th className='table-th'>
                                        <label>Date<button onClick={() => handleSort('time')} className="sort-button"><CiFilter /></button></label>
                                    </th>
                                    <th className='table-th'>
                                        <label>Athlete<button onClick={() => handleSort('athleteName')} className="sort-button"><CiFilter /></button></label>
                                    </th><th className='table-th'>
                                        <label>Time12m<button onClick={() => handleSort('time12m')} className="sort-button"><CiFilter /></button></label>
                                    </th>
                                    <th className='table-th'>
                                        <label>Time<button onClick={() => handleSort('time')} className="sort-button"><CiFilter /></button></label>
                                    </th>
                                    <th className='table-th'>
                                        <label>Missed Cone<button onClick={() => handleSort('missedCone')} className="sort-button"><CiFilter /></button></label>
                                    </th>
                                    <th className='table-th'>
                                        <label>Kicked Cone<button onClick={() => handleSort('kickedCone')} className="sort-button"><CiFilter /></button></label>
                                    </th>
                                    <th className='table-th'>
                                        <label>DQ<button onClick={() => handleSort('DQ')} className="sort-button"><CiFilter /></button></label>
                                    </th>
                                    <th className='table-th'>
                                        <label>End Line<button onClick={() => handleSort('endLine')} className="sort-button"><CiFilter /></button></label>
                                    </th>
                                    <th className='table-th'>
                                        <label>SSResult<button onClick={() => handleSort('SSResult')} className="sort-button"><CiFilter /></button></label>
                                    </th>
                                    <th className='table-th'>
                                        <label>Notes<button onClick={() => handleSort('notes')} className="sort-button"><CiFilter /></button></label>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='table-body'>
                                {Object.values(AthletesSSRecordsData).map(record => (
                                    <tr key={record._id.toString()}>
                                        <td className='SSR-td'>{moment(record.date).format('YYYY-MM-DD')}</td>
                                        <td className='SSR-td'>{record.athleteName}</td>
                                        <td className='SSR-td'>{record.time || 'null'}</td>
                                        <td className='SSR-td'>{record.missedCone}</td>
                                        <td className='SSR-td'>{record.kickedCone}</td>
                                        <td className='SSR-td'>{record.DQ.toString()}</td>
                                        <td className='SSR-td'>{record.endLine.toString()}</td>
                                        <td className='SSR-td'>{record.SSResult}</td>
                                        <td className='SSR-td'>{record.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}

                    {displayMode === 'Details' && (
                        <><thead className='table-head'>
                            <tr className='table-tr'>
                                {/* Date sorting cannot work now */}
                                <th className='table-th'>
                                    <label>Date<button onClick={() => handleSort('time')} className="sort-button"><CiFilter /></button></label>
                                </th>
                                <th className='table-th'>
                                    <label>Athlete<button onClick={() => handleSort('athleteName')} className="sort-button"><CiFilter /></button></label>
                                </th>
                                <th className='table-th'>
                                    <label>Time<button onClick={() => handleSort('time')} className="sort-button"><CiFilter /></button></label>
                                </th>
                                <th className='table-th'>
                                    <label>Missed Cone<button onClick={() => handleSort('missedCone')} className="sort-button"><CiFilter /></button></label>
                                </th>
                                <th className='table-th'>
                                    <label>Kicked Cone<button onClick={() => handleSort('kickedCone')} className="sort-button"><CiFilter /></button></label>
                                </th>
                                <th className='table-th'>
                                    <label>DQ<button onClick={() => handleSort('DQ')} className="sort-button"><CiFilter /></button></label>
                                </th>
                                <th className='table-th'>
                                    <label>End Line<button onClick={() => handleSort('endLine')} className="sort-button"><CiFilter /></button></label>
                                </th>
                                <th className='table-th'>
                                    <label>SSResult<button onClick={() => handleSort('SSResult')} className="sort-button"><CiFilter /></button></label>
                                </th>
                                <th className='table-th'>
                                    <label>Notes<button onClick={() => handleSort('notes')} className="sort-button"><CiFilter /></button></label>
                                </th>
                            </tr>
                        </thead>
                            <tbody className='table-body'>
                                {Object.values(AthletesSSRecordsData).map(record => (
                                    <tr key={record._id.toString()}>
                                        <td className='SSR-td'>{moment(record.date).format('YYYY-MM-DD')}</td>
                                        <td className='SSR-td'>{record.athleteName}</td>
                                        <td className='SSR-td'>{record.time}</td>
                                        <td className='SSR-td'>{record.missedCone}</td>
                                        <td className='SSR-td'>{record.kickedCone}</td>
                                        <td className='SSR-td'>{record.DQ.toString()}</td>
                                        <td className='SSR-td'>{record.endLine.toString()}</td>
                                        <td className='SSR-td'>{record.SSResult}</td>
                                        <td className='SSR-td'>{record.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    )}
                </table>
            </div></div >
    );
}
export default SSResultRecored;