import "./assets/output.css";
import Card from "./ProductCard";
import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "./userContext";
import Navbar from "./navbar";
import { useFilter } from "./useFilter";

interface Product {
  product_Name: string;
  product_Price: number;
  product_Images: string[];
  price: string;
  _id: string;
  product_Category: string;
  Affiliate_link: string;
}

const MyCart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { TokenInfo, fetchCurrentUser, fetchTokenInfo } =
    useContext(UserContext);
  const [search, setSearch] = useState("");
  const { filter, setFilter } = useFilter();
  const BaseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${BaseUrl}/api/mycart/${TokenInfo.userId}`,
          {
            withCredentials: true,
          }
        );

        if (res.status === 200 && res.data.products) {
          if (res.data.products.length > 0) {
            setProducts(res.data.products);
            // setLoading(false);
          }
        } else {
          console.error(
            "An error occurred while fetching posts or no posts returned"
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [products, BaseUrl, TokenInfo]);

  useEffect(() => {
    fetchCurrentUser();
    fetchTokenInfo();
  }, [fetchCurrentUser, fetchTokenInfo]);

  const handleCategoryClick = (category: string) => {
    setFilter((prev) => ({ ...prev, category }));
  };

  const resetFilter = async () => {
    setFilter({ category: "" });
  };

  const categories = [
    "equipement",
    "clothing",
    "supplement",
    "accessories",
    " others",
  ];
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = filter.category
        ? product.product_Category === filter.category
        : true;
      const matchesSearch = search
        ? product.product_Name.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, search, filter.category]);

  return (
    <div className=" ">
      <div className="z-20">
        <Navbar />
      </div>
      <div className="  mt-24   m-auto">
        <div className="flex p-4 ">
          <div className="group z-10  border relative">
            <button className="bg-black border w-full font-semibold py-2 px-4  inline-flex items-center">
              <span>Select Category</span>
              <svg
                className="ml-2 w-4 h-4 bg-black"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="absolute hidden w-full text-white pt-1 group-hover:block">
              <div className="bg-black rounded shadow-lg">
                <button
                  className=" bg-black w-full hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                  onClick={resetFilter}
                >
                  All
                </button>
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="w-full bg-black  hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="  md:flex border w-1/2  relative">
            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              id="search"
              type="text"
              name="search"
              className="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-300 w-full h-10 focus:outline-none focus:border-indigo-400"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="main-content flex flex-col flex-grow p-4">
          <div className="flex flex-col flex-grow   rounded mt-4">
            {/* <!-- PRODUCTS CARDS --> */}
            <section
              id="Projects"
              className="w-full m-auto grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4  md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-6 mt-16 mb-5"
            >
              {filteredProducts
                .filter((val) => {
                  if (search == "") {
                    return val;
                  } else if (
                    val.product_Name
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  ) {
                    return val;
                  }
                })
                .map((product) => (
                  <div key={product._id} className="post-container mb-8">
                    <Card
                      Name={product.product_Name}
                      imageUrl={[
                        `${BaseUrl}/uploads/${product.product_Images[0]}`,
                      ]}
                      price={product.product_Price}
                      productId={product._id}
                      category={product.product_Category}
                      isIncart={true}
                      link={product.Affiliate_link}
                    />
                  </div>
                ))}
              {/* <!--   Ends  --> */}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
