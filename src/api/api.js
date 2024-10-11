import axios from 'axios';

const BASE_URL = 'https://reqres.in/api/users';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Could not fetch users. Please try again later.');
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Could not fetch user. Please check the user ID and try again.');
  }
};

export const addUser = async (user) => {
  try {
    const response = await axios.post(BASE_URL, user);
    return response.data;
  } catch (error) {
    console.error('Error adding user:', error);
    throw new Error('Could not add user. Please try again later.');
  }
};

export const updateUser = async (id, user) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, user);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Could not update user. Please try again later.');
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Could not delete user. Please try again later.');
  }
};
