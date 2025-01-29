import Navbar from "./navbarUser";
import axios from "axios";
import { useEffect } from "react";
const LayoutUser = ({ Children }) => {

  return (
    <>
      <Navbar />
      <main>{Children}</main>
    </>
  );
};
export default LayoutUser;
