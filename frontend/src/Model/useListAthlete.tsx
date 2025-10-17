import { useEffect, useState } from "react";
import axios from "axios";

// Define the Athlete interface for better TypeScript typing
interface Athlete {
  athleteName: string;
  athleteId: string;
  // Add other fields if plan to use them later
}

// Component to fetch and display list of athletes
const useAthleteList = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.REACT_APP_API_URL || `http://localhost:3001`;
  
  useEffect(() => {
    const fetchAthletes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/getAthletesInfo/athletes`);
        setAthletes(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);
  return { athletes, loading, error };
};

// Component to render athlete options for select
export const AthleteOptions = () => {
  const { athletes, loading, error } = useAthleteList();

  if (loading) return <option value="">Loading athletes...</option>;
  if (error) return <option value="">Error loading athletes</option>;
  if (athletes.length === 0) return <option value="">No athletes found</option>;
  
  return (
    <>
      {athletes.map((athlete) => (
        <option key={athlete.athleteId} value={athlete.athleteName}>
          {athlete.athleteId} {athlete.athleteName}
        </option>
      ))}
    </>
  );
};

export default AthleteOptions;