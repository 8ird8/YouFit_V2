import axios from "axios";
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { UserContext } from "./userContext";

interface CartContextType {
  itemCount: number;
  setItemCount: (count: number) => void;
}

const defaultCartContext: CartContextType = {
  itemCount: 0,
  setItemCount: () => {},
};

export const CartContext = createContext<CartContextType>(defaultCartContext);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [itemCount, setItemCount] = useState<number>(0);
  const { currentUserInfo, fetchCurrentUser, fetchTokenInfo } =
    useContext(UserContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/mycart/${currentUserInfo.userId}`,
          {
            withCredentials: true,
          }
        );

        if (res.status === 200 && res.data.products) {
          if (res.data.products.length > 0) {
            setItemCount(res.data.products.length);
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
  }, [itemCount, currentUserInfo]);

  useEffect(() => {
    fetchCurrentUser();
    fetchTokenInfo();
  }, [fetchCurrentUser, fetchTokenInfo]);
  return (
    <CartContext.Provider value={{ itemCount, setItemCount }}>
      {children}
    </CartContext.Provider>
  );
};
