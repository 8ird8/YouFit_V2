import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface ProductType {
  product_Name: string;
  product_Price: string;
  product_Description: string;
  product_Images: string[];
  product_City: string;
  creator: {
    avatar: string;
    username: string;
  };
  // include other product properties as needed
}

const UpdateProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductType | undefined>(undefined);
  const [product_Name, setProductName] = useState("");
  const [product_Price, setProductPrice] = useState("");
  const [product_Description, setProductDescription] = useState("");
  const [product_Category, setProductCategory] = useState("");
  const [product_Gender, setproduct_Gender] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mainImage, setMainImage] = useState<string>("");
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  const BaseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/api/product/${productId}`,
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
          }
        } else {
          console.error("Error fetching product");
        }
      } catch (error) {
        console.error("Error during product fetch:", error);
      }
    };

    fetchProduct();
  }, [product, productId]);

  const handleImageDelete = async (imageName: string) => {
    try {
      await axios.delete(
        `${BaseUrl}/api/product/${productId}/image/${imageName}`,
        {
          withCredentials: true,
        }
      );
      // Update local state to remove the image
      setProduct((currentProduct) => {
        if (!currentProduct) return undefined; // Early return if currentProduct is undefined

        const updatedImages = currentProduct.product_Images.filter(
          (img) => img !== imageName
        );

        return { ...currentProduct, product_Images: updatedImages };
      });
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${BaseUrl}/api/delete/${productId}`, {
        withCredentials: true,
      });
      if (res.status === 403) {
        console.error("You are not allowed");
      } else {
        console.log("delleted successfully");
        navigate("/home");
      }
    } catch (error) {
      console.log(" u D'ONT HAVE THE ACCES :", error);
      // Handle error or show a notification to the user
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("product_Name", product_Name);
    formData.append("product_Description", product_Description);
    formData.append("product_Price", product_Price);

    formData.append("product_Category", product_Category);
    formData.append("product_Gender", product_Gender);
    if (fileInputRef.current?.files) {
      for (let i = 0; i < fileInputRef.current.files.length; i++) {
        formData.append("product_Images", fileInputRef.current.files[i]);
      }
    }

    try {
      const res = await axios.put(
        `${BaseUrl}/api/updateProduct/${productId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        navigate("/store");
      } else {
        console.error("Error updating post:", res);
      }
    } catch (error) {
      console.error("Error during post update:", error);
    }
  };

  return (
    <div>
      <section className="py-10  ">
        <div className="max-w-6xl px-4 mx-auto">
          <div className="flex   mb-24 -mx-4">
            <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
              <div className="sticky top-0 overflow-hidden ">
                <div className="relative mb-6 lg:mb-10 lg:h-96">
                  <img
                    className="object-contain w-full lg:h-full"
                    src={`${BaseUrl}/uploads/${mainImage}`}
                    alt="Product"
                  />
                </div>
                <div className="flex-wrap -mx-2 md:flex">
                  {product?.product_Images.map((image, index) => (
                    <div className="w-1/2 p-2 sm:w-1/4" key={index}>
                      <div className="relative">
                        <button
                          onClick={() => setMainImage(image)}
                          className="block border border-gray-200 hover:border-indigo-400"
                        >
                          <img
                            className="object-contain w-full lg:h-28"
                            src={`${BaseUrl}/uploads/${image}`}
                            alt="Product thumbnail"
                          />
                        </button>
                        <button
                          onClick={() => handleImageDelete(image)}
                          className="absolute top-1 right-0 bg-gray-500 rounded-full w-6 h-6 text-white p-1"
                        >
                          <img src={`${AssetsUrl}/cross.png`} alt="cross" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="lg:w-1/2  p-2 w-1/4">
                    <div className="relative flex items-center justify-center h-full">
                      <label
                        htmlFor="image"
                        className="flex items-center justify-center border border-gray-200 hover:border-indigo-400 w-full h-full cursor-pointer"
                      >
                        <input
                          type="file"
                          className="hidden"
                          id="image"
                          name="imageUrl"
                          ref={fileInputRef}
                          multiple
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v12m6-6H6"
                          />
                        </svg>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" py-6 shadow  relative h-screen px-4 w-form m-auto lg:w-1/2">
              <div className="lg:pl-20">
                <div className="mb-6  ">
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label className="max-w-xl mt-8 mb-6 text-2xl font-bold text-white md:text-2xl">
                        {" "}
                        Product Name :{" "}
                      </label>
                      <div className="border">
                        <input
                          type="text"
                          name="product_Name"
                          className="h-10 w-full rounded-xl  bg-black  p-2 "
                          value={product_Name}
                          onChange={(e) => setProductName(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleDelete}
                      className="absolute top-1 right-0"
                    >
                      <img
                        src={`${AssetsUrl}/trash.png`}
                        alt="d"
                        className="w-6 h-6"
                      />
                    </button>
                    <div>
                      <label className="inline-block mt-6 mb-2 text-2xl font-bold text-white">
                        Gender :
                      </label>
                      <select
                        className="title rounded w-full bg-black border   p-2 mb-4 outline-none"
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

                    <div>
                      <label className="inline-block mt-6 mb-2 text-2xl font-bold text-white">
                        Category :
                      </label>
                      <select
                        className="title rounded w-full bg-black border border-gray-300 p-2 mb-4 outline-none"
                        value={product_Category}
                        onChange={(e) => setProductCategory(e.target.value)}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="equipement">equipement</option>
                        <option value="clothing">Clothing</option>
                        <option value="supplement">supplement</option>
                        <option value="accessories">accessories</option>

                        <option value="others">others</option>
                      </select>
                    </div>
                    <label className="inline-block mt-4 text-2xl font-bold text-white">
                      Price :
                    </label>
                    <div className="border mb-6">
                      <input
                        type="text"
                        className=" w-full  rounded-xl  border bg-black border-black  p-2"
                        value={product_Price}
                        onChange={(e) => setProductPrice(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className=" text-md text-2xl capitalize mt-4 font-bold text-white">
                        Details :
                      </label>
                      <textarea
                        name="product_Description"
                        className="w-full border mt-2  bg-black p-2 h-36 "
                        value={product_Description}
                        onChange={(e) => setProductDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="flex gap-6">
                      <button
                        type="submit"
                        className="w mt-6 px-4 py-3 text-center text-gray-100 bg-indigo-600 border border-transparent hover:border-indigo-500 hover:text-indigo-700 hover:bg-indigo-100 rounded-xl"
                      >
                        Save Changes
                      </button>
                      <Link
                        to={`/product/${productId}`}
                        type="button"
                        className="w mt-6 px-4 py-3 text-center text-indigo-700 bg-indigo-100 border border-transparent hover:border-indigo-500 hover:text-indigo-100 hover:bg-indigo-700 rounded-xl"
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdateProduct;
