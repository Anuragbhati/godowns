import api from "./api";

export const getItemById = async (id) => {
  try {
    const response = await api.get(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching item:", error);
    throw error;
  }
};

export const createItem = async (item) => {
  try {
    const response = await api.post("/items", item);
    return response.data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

export const getItems = async () => {
  try {
    const response = await api.get("/items");
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    await api.delete(`/items/${id}`);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};
