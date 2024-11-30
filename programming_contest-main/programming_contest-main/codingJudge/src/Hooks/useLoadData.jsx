// import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useLoadData = (url, credentials) => {
  const axiosSecure = useAxiosSecure();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['loadData', url, credentials],
    queryFn: async () => {
      const response = await axiosSecure.get(url, { withCredentials: credentials });
      return response.data;
    },
  });

  return { data, isLoading, refetch };
  // const [data, setData] = useState([]);
  // useEffect(() => {
  //   axiosSecure.get(url, { withCredentials: credentials }).then((res) => {
  //     setData(res.data);
  //   });
  // }, [url, credentials, axiosSecure]);
  // return data;
};

export default useLoadData;
