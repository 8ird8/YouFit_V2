import axios from "axios";
import { useState } from "react";
import { useAuth } from "./useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "./useNotification";

interface CardProps {
  Name: string;
  productId: string;
  imageUrl: string[];
  price: number;
  category: string;
  isIncart: boolean;
  link: string;
}

const Card: React.FC<CardProps> = ({
  Name,
  imageUrl,
  price,
  productId,
  category,
  isIncart,
  link,
}) => {
  const [Incart, setIncart] = useState(isIncart);
  const { authAdmin } = useAuth();
  const isAdmin = authAdmin && authAdmin.isAdmin;
  const { setNotification } = useNotification();
  const AssetsUrl = import.meta.env.VITE_ASSETS_URL;
  
  // const { authStatus } = useAuth();
  // const isAuthenticated = authStatus && authStatus.isAuthenticated;
  const navigate = useNavigate();

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
      } else {
        console.error("You are not allowed");
      }
    } catch (error) {
      console.log(" u D'ONT HAVE THE ACCES :", error);
      // Handle error or show a notification to the user
    }
  };

  // const handleIncartClick = async () => {
  //   if (isAuthenticated) {
  //     try {
  //       const res = await axios.post(
  //         `http://localhost:3000/api/product/${productId}/cart`,

  //         { withCredentials: true }
  //       );

  //       if (res.status === 200) {
  //         if (!Incart) {
  //           setIncart(true);
  //         } else {
  //           setIncart(false);
  //           // window.location.reload();
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error toggling like:", error);
  //     }
  //   } else {
  //     console.log("User is not authenticated, redirecting to login.");
  //     navigate("/login"); // Redirect user to login page
  //   }
  // };

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
          // window.location.reload();
        }
        console.log(Incart);
      } else if (res.status === 201) {
        setNotification(res.data.message, "info");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="product-list">
        <div className="product-card">
          <figure className="card-banner">
            <img
              src={imageUrl[0]}
              loading="lazy"
              alt="Running Sneaker Shoes"
              className=" w-full h-full image-contain object-contain"
            />

            <div className="card-badge">New</div>
            

            <ul className="card-action-list">
              <li className="card-action-item">
                <button
                  className="card-action-btn"
                  aria-labelledby="card-label-1"
                  onClick={toggleLike}
                >
                  {!Incart ? (
                    <img src={`${AssetsUrl}/cart-add.png`} alt="" className="w-8 h-8" />
                  ) : (
                    <img src={`${AssetsUrl}/cart-check.png`} alt="" className="w-8 h-8" />
                  )}
                </button>

                <div className="card-action-tooltip" id="card-label-1">
                  Add to Cart
                </div>
              </li>
              <li className="card-action-item">
                <button
                  className="card-action-btn"
                  aria-labelledby="card-label-1"
                >
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    <img src={`${AssetsUrl}/buy.png`} alt="buy" className="w-8 h-8" />
                  </a>
                </button>

                <div className="card-action-tooltip" id="card-label-1">
                  Buy NOW
                </div>
              </li>
              <li className="card-action-item">
                <button
                  className="card-action-btn"
                  aria-labelledby="card-label-1"
                >
                  <Link to={`/product/${productId}`} rel="noopener noreferrer">
                    <img src={`${AssetsUrl}/vision.png`} alt="buy" className="w-8 h-8" />
                  </Link>
                </button>

                <div className="card-action-tooltip" id="card-label-1">
                  View
                </div>
              </li>
              {isAdmin && (
                <li className="card-action-item">
                  <button
                    className="card-action-btn"
                    aria-labelledby="card-label-1"
                    onClick={handleDelete}
                  >
                    <img src={`${AssetsUrl}/trash.png`} alt="" className="w-8 h-8" />
                  </button>

                  <div className="card-action-tooltip" id="card-label-1">
                    delete
                  </div>
                </li>
              )}
            </ul>
          </figure>

          <div className="card-content">
            <div className="card-cat">
              <a href="#" className=" capitalize card-cat-link">
                {category}
              </a>{" "}
            </div>

            <h3 className="h3 card-title">
              <a href="#">{Name}</a>
            </h3>

            <data className="text-white" value="180.85">
              {price}
              <span className=" text-gray-400 ">MAD</span>
            </data>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
