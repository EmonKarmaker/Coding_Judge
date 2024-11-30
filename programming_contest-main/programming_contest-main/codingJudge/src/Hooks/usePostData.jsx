import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";


const usePostData = (url, info) => {
  const axiosSecure = useAxiosSecure();
  const [data, setData] = useState([]);
  useEffect(() => {
    axiosSecure.post(url, info).then((res) => {
      setData(res.data);
    });
  }, [url, axiosSecure, info]);
  return data;
};
export default usePostData;