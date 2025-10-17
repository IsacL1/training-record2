export default buildAthleteId = async () => {
    const count = await athletesInfoModel.countDocuments();
    const athleteId = `S${(count + 1).toString().padStart(3, '0')}`;
    return athleteId;
};

try {
    const athletesInfo = req.body;
    const athleteId = await buildAthleteId();
    const newAthletesInfo = new athletesInfoModel({ ...athletesInfo, athleteId });
    await newAthletesInfo.save().then(() => {
        res.send('Athlete created, record added successfully!');
    });
} catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('Internal Server Error');
}