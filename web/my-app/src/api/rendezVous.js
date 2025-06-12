import axios from "./axios";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export async function getUserRendezVous(userId) {
  const response = await axios.get(`/rendezVous/${userId}`, {
    headers: authHeader(),
  });
  return response;
}

export async function cancelRDV({ rdvId, reason }) {
  const response = await axios.delete(`/rendezVous/deleteRDV/${rdvId}`, {
    headers: authHeader(),
    data: { reason },
  });
  return response.data;
}

export async function bookRDV({ patientId, doctorId, date }) {
  const accessToken = localStorage.getItem('accessToken');

  const bookResponse = await axios.post(
    '/rendezVous/bookRDV',
    { date, patientId, doctorId },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return bookResponse.data._id;
}
