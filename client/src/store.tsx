import "./assets/output.css";
import Card from "./ProductCard";
import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "./userContext";

import { useFilter } from "./useFilter";
import Navbar from "./navbar";
import { Link } from "react-router-dom";

interface Product {
  product_Name: string;
  product_Price: number;
  product_Images: string[];
  price: string;
  _id: string;
  product_Category: string;
  incart: string[];
  Affiliate_link: string;
}

const Store = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { TokenInfo, fetchTokenInfo, fetchCurrentUser } =
    useContext(UserContext);
  const { filter } = useFilter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/products", {
          withCredentials: true,
        });

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
        console.error("Error fetching posts:", error);
      }
    };

    fetchProducts();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = filter.category
        ? product.product_Category === filter.category
        : true;
      //   const matchesSearch = search
      //     ? product.product_Name.toLowerCase().includes(search.toLowerCase())
      //     : true;
      return matchesCategory;
    });
  }, [products, filter.category]);

  //   const resetFilter = async () => {
  //     setFilter({ category: '' });
  //   };

  useEffect(() => {
    fetchCurrentUser();
    fetchTokenInfo();
  }, [fetchCurrentUser, fetchTokenInfo]);

  return (
    <div className=" justify-between">
      <Navbar />
      <div className="  ">
        <section
          className="section mt-10 hero"
          style={{ backgroundImage: "url('Storeback.jpg')" }}
        >
          <div className=" container">
            <h2 className="section__title-border   leading-tight  text-6xl">
              New BOdy Of course{" "}
              <br />
              <strong className="section__title ml-40">
                {" "}
                NEW Equipement {" "}
              </strong>
            </h2>

            <div className="flex justify-end">
              <p className="relative top-36  hero-text">
                YouFit PROVIDE MORR BY FINDING FOR YOU BEST PRODUCT YOU COULD
                NEED FOR YOUR TRANSFORMATION BODY
              </p>
            </div>

            <div className=" mt-16  ">
              <Link
                to="/workoutPlans"
                className="bg-lime-400  h-20 py-12 w-20 px-3   hover:bg-black hover:text-white  border text-lg   text-black rounded-full "
              >
                SHOP NOW
              </Link>
            </div>
            <div className="relative left-1/2 top-28 w-1/2">
              <img src="mouse.png" alt="" className="w-14 h-16" />
            </div>
          </div>
        </section>

        <div className="main-content flex flex-col flex-grow p-4">
          <div className="flex flex-col flex-grow   rounded mt-4">
            {/* <!-- PRODUCTS CARDS --> */}
            <section
              id="Projects"
              className="w-full m-auto grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4  md:grid-cols-2 justify-items-center justify-center gap-y-20 lg:gap-x-10  gap-x-6 mt-16 mb-5"
            >
              {filteredProducts.map((product) => (
                <div key={product._id} className="post-container mb-8 w-full">
                  <Card
                    Name={product.product_Name}
                    imageUrl={[
                      `http://localhost:3000/uploads/${product.product_Images[0]}`,
                    ]}
                    price={product.product_Price}
                    productId={product._id}
                    category={product.product_Category}
                    isIncart={product.incart.includes(TokenInfo.userId)}
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

export default Store;
