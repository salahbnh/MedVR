import axios from "./axios";

function authHeader() {
  const token = localStorage.getItem("accessToken");
  return { Authorization: `Bearer ${token}` };
}

export const getMedicalFolder = async (patientId, requesterId) => {
  const response = await axios.post(
    '/medical-folder/getMedFolder',
    { patientId, requesterId },
    { headers: authHeader() }
  );
  return response;
};

export const createMedicalFolder = async (patientId) => {
  const response = await axios.post(
    '/medical-folder/createMedFolder',
    { patientId },
    { headers: authHeader() }
  );
  return response.data;
};

export const modifyMedicalFolder = async (patientId, requesterId, medications, allergies, testResults) => {
  const response = await axios.put(
    '/medical-folder/modifMedFolder',
    { patientId, requesterId, medications, allergies, testResults },
    { headers: authHeader() }
  );
  return response.data;
};

export const giveMedicalFolderAccess = async (patientId, doctorId) => {
  const response = await axios.post(
    '/medical-folder/giveAccess',
    { patientId, doctorId },
    { headers: authHeader() }
  );
  return response.data;
};

export const removeMedicalFolderAccess = async (patientId, doctorId) => {
  const response = await axios.post(
    '/medical-folder/removeAccess',
    { patientId, doctorId },
    { headers: authHeader() }
  );
  return response.data;
};
