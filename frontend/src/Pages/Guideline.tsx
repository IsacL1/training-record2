import axios from 'axios';
import React, { useState } from 'react';

const host = 'localhost:3001';

const Guideline = () => {
    return (
        <div className='main'>
            <h1 className='title'>Guideline</h1>
            <div className='container'>
                <div className='content'>
                    <h2>1. Introduction</h2>
                    <p>Inline freestyle is a sport that involves performing tricks using inline skates. The sport is divided into several disciplines, including speed slalom, classic slalom, and slide. This guideline provides information on how to analyze speed slalom records.</p>
                    <p>Before use, please read the following:</p>
                    <del><p>1. The user must have an account to access the records.</p></del>
                    <p>2. The user must be registered as an athlete.</p>
                    <h2>2. Speed Slalom</h2>
                    <h3>2.1. Record</h3>
                    <p>Speed slalom records are stored in the database in the following format:</p>
                    <details>
                        <summary>Record format</summary>
                        <pre>
                            {`{
                                "athleteName": "John Doe",
                                "SSRecords": [
                                    {
                                        date: "2021-06-02",
                                        time: 4,5,
                                        missedCone: 0,
                                        kickedCone: 1,
                                        DQ: false,
                                        endLine: false,
                                        SSResult: 457,
                                        notes: "",
                                        recordType: 'Normal'
                                    },
                                    {
                                        date: "2021-06-02",
                                        side: "L",
                                        step: 8,
                                        time12m: 2.5,
                                        time20cones: 2.0,
                                        time: 4,5,
                                        missedCone: 0,
                                        kickedCone: 1,
                                        DQ: false,
                                        endLine: false,
                                        SSResult: 457,
                                        notes: "",
                                        recordType: 'Details'
                                    }
                                ]
                            }`}
                        </pre>
                    </details>
                    <h3>2.2. AnalyzeSSR</h3>
                    <p>The AnalyzeSSR page allows users to view and analyze speed slalom records. Users can request normal or detailed records and sort the records by date, time, missed cone, kicked cone, DQ, end line, SS result, and notes.</p>
                    <h2>3. Slide</h2>
                    <h2>4. Classic</h2>
                    <h2>5. Registration</h2>
                    <p>The registration page allows users to register.</p>
                </div>
            </div>
        </div>
    );
}

export default Guideline;