export interface AthleteInfoForm {
    athleteId: string;
    athleteName: string;
    bod: Date;
    phone: string;
    password: string;
    addr: string;
    HKID4digit: string;
}

export interface CurrentAbilityValue {
    date: Date;
    weight: number;
    height: number;
    timedRun9min: number;
    verticalJump: number;
    longJump: number;
    sqaut: number;
}

export interface AthletesCurrentAbilityValue {
    athleteName: string;
    CurrentAbilityValue: CurrentAbilityValue[];
}

export interface SlideBasic extends RecordMode {
    athleteName: string;
    trickName: string;
    trickLevel: string;
    trickFamily: string;
    trickSubFamily?: string;
    distance?: number;
    notes?: string;
    // recordMode: "Normal" | "Details" | "Fixed" | "Free";
}

export interface RecordMode {
    recordMode: "Normal" | "Details" | "Fixed" | "Free";
}
export interface Location {
    locationId: number;
    location: string;
    locationType: string;
    floorType: string;
    locationNotes: string;
}

export interface SlideDetails extends ComboSlideRecord, RecordMode {
    steps?: number;
    floorType: string;
    speed: number;
    entry: string;
    endLine: boolean;
    notes: '',
    // recordType: "Normal" | "Details";
}

export interface ComboSlideRecord extends SlideBasic {
    comboTricks: SlideBasic[];
}

export interface SlideTrick {
    trickId: string;
    trickName: string;
    level: string;
    subLevel: string;
    family: string;
    description?: string;
}

export interface ClassicSlalom {
    date: string;
    trickName: string;
    level: string;
    family: string;
    cones: number;
    notes?: string;
}

export interface OffSkateExercise {
    date: string;
    exerciseName: string;
    set: number;
    reps: number;
    weight: number;
    totalSet: number;
    totalReps: number;
    totalWeight: number;
    notes?: string;
}

export interface Goals {
    athleteName: string;
    speedSlalom: SpeedSlalomBasic[];
    slide: SlideTrick[];
    classicSlalom: ClassicSlalom[];
    offSkateExercise: OffSkateExercise[];
}

// use success in SSRecord
export interface SpeedSlalomBasic {
    athleteName: string;
    date: Date;
    time?: number;
    missedCone: number;
    kickedCone: number;
    DQ: boolean;
    endLine: boolean;
    SSResult: number;
    notes?: string;
    recordMode: "Normal" | "Details";
}


export interface SSRDetails extends SpeedSlalomBasic {
    side: "L" | "R";
    step?: number;
    time12m?: number;
    xCones?: number;
    timeXcones?: number;
    recordMode: "Normal" | "Details";
}

export interface Athletes {
    athleteName: string;
    athletesCurrentAbilityValue: CurrentAbilityValue[];
    SSRrecords: any[];
    CSrecords: any[];
    slideRecords: any[];
    offSkateExercise: any[];
    goals: Goals[];
}