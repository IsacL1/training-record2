import { useEffect, useState } from "react";
import axios from "axios";
import { Types } from "mongoose";

interface Location_interface{
  _id: Types.ObjectId,
  locationId: number,
  location: string,
  locationType: string;
  floorType: string;
}

const useLocationList = () => {
  const baseUrl = process.env.REACT_APP_API_URL || `http://localhost:3001`;

  const [location, setLocation] = useState<Location_interface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/getLocationInfo/location`);
        setLocation(response.data);
        // console.log(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);
  return { location, loading, error };
};

const useTypeFloorList = () => {
  const baseUrl = process.env.REACT_APP_API_URL || `http://localhost:3001`;

  const [floorType, setFloorType] = useState<Location_interface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/getLocationInfo/location`);
        setFloorType(response.data);
        // console.log(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);
  return { floorType, loading, error };
};

const LocationOptions = () => {
  const { location, loading, error } = useLocationList();

  if (loading) return <option value="">Loading location...</option>;
  if (error) return <option value="">Error loading location</option>;
  if (location.length === 0) return <option value="">No location found</option>;


  return (
    <>
      {location.map((location) => {
        // console.log(RecordMode.RecordMode); // Add this line
        // console.log(typeof RecordMode.RecordMode);
        return (
          <option key={location._id.toString()} value={location.location}>
            {location.location}
          </option>
        );
      })}
       
    </>
    );
}

const TypeFloorOptions = () => {
  const { floorType, loading, error } = useTypeFloorList();

  if (loading) return <option value="">Loading location...</option>;
  if (error) return <option value="">Error loading location</option>;
  if (floorType.length === 0) return <option value="">No location found</option>;


  return (
    <>
      {floorType.map((floorType) => {
        // console.log(RecordMode.RecordMode); // Add this line
        // console.log(typeof RecordMode.RecordMode);
        return (
          <option key={floorType._id.toString()} value={floorType.floorType}>
            {floorType.floorType}
          </option>
        );
      })}
       
    </>
    );
}
// export default LocationOptions;
export { LocationOptions, TypeFloorOptions };
