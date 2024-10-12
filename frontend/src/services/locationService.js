import api from "./api";

export const getLocations = async () => {
  try {
    const response = await api.get("/locations");
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

export const createLocation = async (location) => {
  try {
    const response = await api.post("/locations", location);
    return response.data;
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
};

export const deleteLocation = async (id) => {
  try {
    await api.delete(`/locations/${id}`);
  } catch (error) {
    console.error("Error deleting location:", error);
    throw error;
  }
};
