import { useEffect, useState } from "react";
import axios from "axios";
import { Types } from "mongoose";


interface RecordModes_interface{
  _id: Types.ObjectId;
  RecordMode: "Normal" | "Details" | "Fixed" | "Free";
}

const useRecordModeList = () => {
  const baseUrl = process.env.REACT_APP_API_URL || `http://localhost:3001`;

  const [recordModes, setRecordMode] = useState<RecordModes_interface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/getLocationInfo/recordmode`);
        setRecordMode(response.data);
        // console.log(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);
  return { recordModes, loading, error };
};


export const RecordModeOptions = () => {
  const { recordModes, loading, error } = useRecordModeList();

  if (loading) return <option value="">Loading Record Modes...</option>;
  if (error) return <option value="">Error loading Record Modes</option>;
  if (recordModes.length === 0) return <option value="">No Record Modes found</option>;

  return (
    <>
      {recordModes.map((RecordMode) => {
        // console.log(RecordMode.RecordMode); // Add this line
        // console.log(typeof RecordMode.RecordMode);
        return (
          <option key={RecordMode._id.toString()} value={RecordMode.RecordMode}>
            {RecordMode.RecordMode}
          </option>
        );
      })}
       
    </>
  );
};

export default RecordModeOptions;