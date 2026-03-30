import axios from "axios";

const planningApi = axios.create({
  baseURL: "http://localhost:5099",
});

export default planningApi;