import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "./userContext";
import Navbar from "./navbar";
import { useAuth } from "./useAuth";

interface ProductType {
  product_Name: string;
  product_Price: string;
  product_Description: string;
  product_Images: string[];
  product_City: string;

  incart: string;
  // include other product properties as needed
}

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductType | undefined>(undefined);
  const [mainImage, setMainImage] = useState<string>("");
  const { TokenInfo, fetchTokenInfo, fetchCurrentUser } =
    useContext(UserContext);
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const navigate = useNavigate();
  const { authAdmin } = useAuth();
  const isAdmin = authAdmin && authAdmin.isAdmin;

  useEffect(() => {
    fetchCurrentUser();
    fetchTokenInfo();
  }, [fetchTokenInfo, fetchCurrentUser]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/product/${productId}`,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.product) {
          setProduct(response.data.product);
          if (
            response.data.product.product_Images &&
            response.data.product.product_Images.length > 0
          ) {
            setMainImage(response.data.product.product_Images[0]);
            console.log("Token" + TokenInfo.userId);
          }
        } else {
          console.error("Error fetching product");
        }
      } catch (error) {
        console.error("Error during product fetch:", error);
      }
    };

    fetchProduct();
  }, [productId, TokenInfo]);

  const [Incart, setIncart] = useState(false);

  useEffect(() => {
    // Ensure product data is available and TokenInfo is not undefined
    if (product && TokenInfo.userId) {
      const isIncart = product.incart.includes(TokenInfo.userId);
      setIncart(isIncart);
    }
  }, [product, TokenInfo.userId]);

  const toggleLike = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/product/${productId}/cart`,
        {},
        { withCredentials: true }
      );

      if (res.status === 200) {
        if (!Incart) {
          setIncart(true);
        } else {
          setIncart(false);
        }
        console.log(Incart);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/delete/${productId}`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        console.log("delleted successfully");
        navigate("/store")
      } else {
        console.error("You are not allowed");
      }
    } catch (error) {
      console.log(" u D'ONT HAVE THE ACCES :", error);
      // Handle error or show a notification to the user
    }
  };

  return (
    <div>
      <div className="mb-24">
        <Navbar />
      </div>
      <div className="flex justify-between lg:px-40 md:px-32">
        <button onClick={() => navigate(-1)} className=" ">
          <img
            className="w-10 h-10 bg-lime-400 rounded-full p-2"
            src={`${AssetsUrl}/arrowleft.png`}
            alt="arrow-left"
          />
        </button>
        {isAdmin && (
          <div className="my-auto flex gap-2 ">
            <button
              className=" w-8 h-8  text-black rounded-md "
              onClick={() => navigate(`/update/${productId}`)}
            >
              <img src={`${AssetsUrl}/edit.png`} alt="" />
            </button>
            <button
              className=" w-8 h-8  text-black rounded-md "
              onClick={handleDelete}
            >
              <img src={`${AssetsUrl}/trash.png`} alt="reash" />
            </button>
          </div>
        )}
      </div>
      <section className="py-20  font-poppins">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="lg:flex md:flex  mb-24 -mx-4">
            <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
              <div className="sticky top-0 overflow-hidden ">
                <div className="relative mb-6 lg:mb-10 lg:h-96">
                  <img
                    className="object-contain w-full lg:h-full"
                    src={`http://localhost:3000/uploads/${mainImage}`}
                    alt="Product"
                  />
                </div>
                <div className="flex -mx-2 md:flex">
                  {product?.product_Images.map((image, index) => (
                    <div
                      className="w-1/2  object-contain p-2 sm:w-1/4"
                      key={index}
                    >
                      <button
                        className="block border border-gray-200 hover:border-indigo-400"
                        onClick={() => setMainImage(image)}
                      >
                        <img
                          className="object-contain w-full h-28"
                          src={`http://localhost:3000/uploads/${image}`}
                          alt="Product thumbnail"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full shadow ml-4 relative py-4 h-full px-4 md:w-1/2">
              <div className="lg:pl-16">
                <div className="mb-6 ">
                  <h2 className="max-w-xl mt-6 mb-6 text-4xl font-bold capitalize leading-loose tracking-wide text-white md:text-4xl">
                    {product?.product_Name}
                  </h2>

                  <p className="inline-block text-2xl font-semibold ">
                    <span>{product?.product_Price} $</span>
                  </p>
                </div>
                <div className="mb-6">
                  <h2 className="mb-2 text-md text-2xl capitalize font-bold text-white">
                    Details :
                  </h2>
                  <div className="bg-gray-100 rounded-xl">
                    <div className="p-3 lg:p-5 ">
                      <div className="p-2 rounded-xl lg:p-6 bg-gray-50">
                        <div className="flex flex-wrap  gap-x-10 gap-y-4">
                          <div>
                            <p className="whitespace-pre-wrap">
                              {product?.product_Description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6 "></div>
                <div className="flex justify-between flex-wrap items-center mb-6">
                  <div className="mb-4 lg:mb-0">
                    <button className="flex items-center justify-center  h-10 p-2 mr-4 text-gray-700 border border-gray-300 lg:w-11 hover:text-gray-50 hover:bg-red-600 hover:border-red-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className=" bi bi-heart"
                        viewBox="0 0 16 16"
                      >
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="flex  w-36">
                    {!Incart && (
                      <button
                        onClick={toggleLike}
                        className="w-full px-4 py-3 text-center text-gray-100 bg-indigo-600 border border-transparent hover:border-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 rounded-xl"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
