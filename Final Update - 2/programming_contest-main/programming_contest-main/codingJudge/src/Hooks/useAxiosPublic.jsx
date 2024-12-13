import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://coding-judge-server.vercel.app",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
