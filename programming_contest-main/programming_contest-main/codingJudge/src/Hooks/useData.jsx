import { useContext } from "react";
import { DataContext } from "../Provider/DataProvider";

const useData = () => {
  const data = useContext(DataContext);
  return data;
};

export default useData;
