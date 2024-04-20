import "./assets/output.css";
import Card from "./ProductCard";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "./userContext";
import Navbar from "./navbar";

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
  const {  TokenInfo, fetchCurrentUser, fetchTokenInfo } =
    useContext(UserContext);
    const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/mycart/${TokenInfo.userId}`,
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
  }, [products, TokenInfo]);

  useEffect(() => {
    fetchCurrentUser();
    fetchTokenInfo();
  }, [fetchCurrentUser, fetchTokenInfo]);

  return (
    <div className=" ">
      <Navbar/>
      <div className=" m-auto">
        
        <div className="main-content flex flex-col flex-grow p-4">
          <div className="flex flex-col flex-grow   rounded mt-4">
            {/* <!-- PRODUCTS CARDS --> */}
            <section
              id="Projects"
              className="w-full m-auto grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4  md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-6 mt-16 mb-5"
            >
              {products
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
                        `http://localhost:3000/uploads/${product.product_Images[0]}`,
                      ]}
                      price={product.product_Price}
                      productId={product._id}
                      category={product.product_Category}
                      isIncart={true}
                      link= {product.Affiliate_link}
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
