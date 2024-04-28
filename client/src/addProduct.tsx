import { useRef, useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Sidebar } from "./sidebar";
// import { useNotification } from './useNotification';

const AddListing = () => {
  const [product_Name, setProduct_N] = useState("");
  const [product_Description, setProduct_D] = useState("");
  const [product_Category, setproduct_C] = useState("");
  const [product_Price, setproduct_P] = useState("");
  const [product_Gender, setproduct_Gender] = useState("");
  const [Affiliate_link, setAffiliate_Link] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  //   const { setNotification } = useNotification();
  const navigate = useNavigate();
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const BasesUrl = import.meta.env.VITE_BASE_URL;


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("product_Name", product_Name);
    formData.append("product_Description", product_Description);
    formData.append("product_Category", product_Category);
    formData.append("product_Price", product_Price);
    formData.append("product_Gender", product_Gender);
    formData.append("Affiliate_link", Affiliate_link);

    if (fileInputRef.current?.files) {
      for (let i = 0; i < fileInputRef.current.files.length; i++) {
        formData.append("product_Images", fileInputRef.current.files[i]);
      }
    }

    try {
      const res = await axios.post(`${BasesUrl}/api/List`, formData, {
        withCredentials: true,
        // headers: {
        //   "Content-Type": "multipart/form-data ",

        // },
      });

      if (res.status === 200) {
        setProduct_N("");
        setProduct_D("");

        navigate("/Store");
        // setNotification("Post added successfully");
      } else {
        console.log(res);
      }
    } catch (error) {
      console.error("Error during adding post :", error);
    }
  };

  return (
    <div className=" flex  justify-between ">
      <Sidebar />

      <div className="  mx-auto px-4 ml-64 w-full py-8">
        <div className=" text-center font-bold text-4xl text-white mb-6 ">
          Add Product Here
        </div>
        <form onSubmit={handleSubmit}>
          <div className=" rounded mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg  mb-10">
            <div className="mt-4 mb-4">
              <label className="text-white font-bold">Product name :</label>
              <div className="border p-2 mt-2">
                <input
                  className="p2 w-full bg-black"
                  placeholder=""
                  type="text"
                  onChange={(e) => setProduct_N(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 mb-4">
              <label className="text-white  font-bold">Gender :</label>

              <select
                className="  bg-black w-full border  p-2 mb-4 mt-2 text-gray-300 "
                value={product_Gender}
                onChange={(e) => setproduct_Gender(e.target.value)}
                required
              >
                <option value="">For </option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Both">Both</option>
              </select>
            </div>

            <div className="mt-4 mb-4">
              <label className="text-white  font-bold">Category :</label>

              <select
                className="  bg-black w-full border  p-2 mb-4 mt-2 text-gray-300 "
                value={product_Category}
                onChange={(e) => setproduct_C(e.target.value)}
                required
              >
                <option value="equipement">equipement</option>
                <option value="clothing">Clothing</option>
                <option value="supplement">supplement</option>
                <option value="accessories">accessories</option>

                <option value="others">others</option>
              </select>
            </div>
            <div className="mt-4 mb-4">
              <label className="text-white  font-bold">Description :</label>

              <textarea
                className="w-full rounded bg-black text-white sec p-3 h-60 border mt-2 outline-none"
                placeholder="Describe everything about  product here"
                onChange={(e) => setProduct_D(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mt-4 mb-4">
              <label className="text-white  font-bold">Price :</label>

              <div className="border mt-2">
                <input
                  className="p-2 boder w-full bg-black"
                  placeholder="Mad"
                  type="text"
                  onChange={(e) => setproduct_P(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 mb-4">
              <label className="text-white  font-bold">Affiliate Link :</label>

              <div className="border mt-2">
                <input
                  className="p-2   w-full bg-black"
                  placeholder="Https://example.com"
                  type="text"
                  onChange={(e) => setAffiliate_Link(e.target.value)}
                />
              </div>
            </div>

            <label className="flex items-center mb-4  cursor-pointer">
              <span className="mr-2 ml-2 mt-2 text-gray-300 font-semibold ">
                Upload Product images
              </span>
              <img
                src={`${AssetsUrl}/upload.png`}
                alt="image"
                className="w-8 h-8"
              />
              <input
                type="file"
                className="hidden"
                accept="image/jpeg, image/png, image/gif"
                id="image"
                name="imageUrl"
                ref={fileInputRef}
              />
            </label>

            <div className="flex items-center justify-between">
              <button
                className=" btn w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                List
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
