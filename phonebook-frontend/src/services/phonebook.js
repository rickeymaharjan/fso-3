import axios from "axios";

const baseUrl = "api/persons";

const addPerson = (person) => {
  const request = axios.post(baseUrl, person);
  return request.then((response) => response.data);
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response);
};

const updateNumber = (id, newObj) => {
  const request = axios.put(`${baseUrl}/${id}`, newObj);
  return request.then((response) => response.data);
};

export default { addPerson, getAll, deletePerson, updateNumber };
