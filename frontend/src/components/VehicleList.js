import { useEffect, useState } from 'react';
import axios from 'axios';

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/vehicles') // Ganti dengan URL backend Anda
      .then(response => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching vehicles');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Daftar Kendaraan</h2>
      <ul>
        {vehicles.map(vehicle => (
          <li key={vehicle.id}>
            <strong>{vehicle.model}</strong> - Tahun: {vehicle.year}, Harga: Rp {vehicle.price.toLocaleString()}, Lokasi: {vehicle.location}
            <p>{vehicle.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VehicleList;