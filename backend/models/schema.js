const mongoose = require('mongoose')
const extendSchema = require('mongoose-extend-schema');

const athletesInfoSchema = new mongoose.Schema({
    athleteId: { type: String },
    athleteName: { type: String },
    bod: { type: Date },
    phone: { type: String },
    password: { type: String },
    addr: { type: String },
    HKID4digit: { type: String }
})

// Classic Slalom trick
// According to World Skate rulesbook 2020 ver
const classicSlalomTrickSchema = new mongoose.Schema({
    trickName: { type: String },
    level: { type: String },
    family: { type: String },
    cones: { type: Number },
    notes: { type: String },
})

// Slide tricks
// According to World Skate rulesbook 2020 ver
const slideTricksSchema = new mongoose.Schema({
    sequence: { type: Number },
    trickId: { type: String },
    trickName: { type: String },
    trickLevel: { type: String },
    trickSubLevel: { type: String },
    trickFamily: { type: String },
    description: { type: String }
})

const recordModeSchema = new mongoose.Schema({
    recordMode: { type: String, enum: ["Normal", "Details", "Fixed", "Free"], require: true }
})

// Location info 
const locationInfoSchema = new mongoose.Schema({
    location: { type: String },
    locationType: { type: String, enum: ["Indoor", "Outdoor"] },
    floorType: { type: String, enum: ["Placstic", "Hard floor", "Wax", "Pad"] },
    locationNotes: { type: String },

})

// Speed Slalom records
const speedSlalomRecordsSchema = new mongoose.Schema(extendSchema(locationInfoSchema, {
    athleteName: { type: String },
    date: { type: Date },
    side: { type: String, enum: ["L", "R"] },
    step: { type: Number },
    time12m: { type: Number },
    xCones: { type: Number },
    time: { type: Number },
    missedCone: { type: Number },
    kickedCone: { type: Number },
    DQ: { type: Boolean },
    endLine: { type: Boolean },
    SSResult: { type: Number },
    notes: { type: String },
    // recordType: { type: String, enum: ["Normal", "Details"] },
    // timestamp: { type: String, default: () => new Date().toISOString() },
}))

// For recording athletes' slide tricks
const slideRecordsSchema = new mongoose.Schema(extendSchema(locationInfoSchema, {
    athleteName: { type: String, required: true },
    trickName: { type: String, required: true },
    trickLevel: { type: String, required: true },
    trickFamily: { type: String, required: true },
    trickSubFamily: { type: String },
    distance: { type: Number, default: 0 },
    notes: { type: String },
    timestamp: { type: String, default: () => new Date().toISOString(), require: true },
    // recordMode: { type: String, enum: ["Normal", "Details", "Fixed", "Free"], require: true  },
    // Additional fields as needed
    steps: { type: Number },
    floorType: { type: String },
    speed: { type: Number },
    entry: { type: String },
    holdSuccess: { type: Boolean, default: false },
    // comboType: { type: String },
    comboTricks: { type: [] },
}))

// Off skate exercise
const offSkateExerciseSchema = new mongoose.Schema({
    exerciseName: { type: String },
    set: { type: Number },
    reps: { type: Number },
    weight: { type: Number },
    totalSet: { type: Number },
    totalReps: { type: Number },
    totalWeight: { type: Number },
    notes: { type: String },
})

// To record athletes current ability
const athletesCurrentAbilityValueSchema = new mongoose.Schema({
    athleteName: { type: String },
    CurrentAbilityValue: [{
        date: { type: Date },
        weight: { type: Number },
        height: { type: Number },
        timedRun9min: { type: Number },
        verticalJump: { type: Number },
        longJump: { type: Number },
        sqaut: { type: Number }
    }]
})

// Goals for speed slalom, slide and classic slalom
const goalsSchema = new mongoose.Schema({
    athleteName: { type: String },
    goals: [
        {
            SpeedSlalom: [
                {
                    date: { type: Date },
                    side: { type: String },
                    step: { type: Number },
                    time: { type: Number },
                    missedCone: { type: Number },
                    kickedCone: { type: Number },
                    DQ: { type: Boolean },
                    endLine: { type: Boolean },
                    result: { type: Number },
                    notes: { type: String },
                }
            ],
            Slide: [
                {
                    date: { type: Date },
                    trickName: { type: String },
                    level: { type: String },
                    family: { type: String },
                    length: { type: Number },
                    notes: { type: String },
                }
            ],
            ClassicSlalom: [
                {
                    date: { type: Date },
                    trickName: { type: String },
                    level: { type: String },
                    family: { type: String },
                    cones: { type: Number },
                    notes: { type: String },
                }
            ],
            offSkateExercise: [
                {
                    date: { type: Date },
                    exerciseName: { type: String },
                    set: { type: Number },
                    reps: { type: Number },
                    weight: { type: Number },
                    totalSet: { type: Number },
                    totalReps: { type: Number },
                    totalWeight: { type: Number },
                    notes: { type: String },
                }
            ]
        }
    ]
})


// Record athletes' all training records
const athletesRecordsSchema = new mongoose.Schema({
    athleteName: { type: String },
    date: { type: Date },
    side: { type: String, enum: ["L", "R"] },
    step: { type: Number },
    time12m: { type: Number },
    xCones: { type: Number },
    time: { type: Number },
    missedCone: { type: Number },
    kickedCone: { type: Number },
    DQ: { type: Boolean },
    endLine: { type: Boolean },
    SSResult: { type: Number },
    notes: { type: String },
    // recordType: { type: String, enum: ["Normal", "Details"] }
    /*CSRecords: [{ date: { type: Date } , type: Schema.Types.ObjectId, ref: 'ClassicSlalom' }], // call the classicSlalomSchema
    SlideRecords: [{ date: { type: Date } , type: Schema.Types.ObjectId, ref: 'Slide'}], // call the slideSchema
    /*offSkateExercise: [{ date: { type: Date } , type: Schema.Types.ObjectId, ref:  'offSkateExercise'}], // call the offSkateExerciseSchema
    ...goalsSchema.obj  //  call the goalsSchema
    */
}, { recordModeSchema: true })

// export to mongoDB
const athletesInfoModel = mongoose.model('AthletesInfo', athletesInfoSchema)
const speedSlalomRecordsModel = mongoose.model('SpeedSlalomRecords', speedSlalomRecordsSchema)
const classicSlalomTrickModel = mongoose.model('ClassicSlalom', classicSlalomTrickSchema)
const slideTricksModel = mongoose.model('SlideTricks', slideTricksSchema)
const slideRecordsModel = mongoose.model('SlideRecords', slideRecordsSchema)
const offSkateExerciseModel = mongoose.model('offSkateExercise', offSkateExerciseSchema)
const goalsModel = mongoose.model('Goals', goalsSchema)
const athletesCurrentAbilityValueModel = mongoose.model('AthletesCurrentAbilityValue', athletesCurrentAbilityValueSchema)
const athletesRecordsModel = mongoose.model('Athletes', athletesRecordsSchema)
const locationInfoSchemaModel = mongoose.model('LocationInfo', locationInfoSchema)
const RecordModeModel = mongoose.model('RecordMode', recordModeSchema)

module.exports = {
    athletesInfoModel,
    classicSlalomTrickModel,
    slideTricksModel, slideRecordsModel,
    offSkateExerciseModel, goalsModel,
    athletesCurrentAbilityValueModel, athletesRecordsModel,
    speedSlalomRecordsModel, locationInfoSchemaModel,
    RecordModeModel
}