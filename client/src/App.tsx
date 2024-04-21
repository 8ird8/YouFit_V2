import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./home";
import AddMealPlan from "./Addmeal";
import PlanDetails from "./planDetails";
import Login from "./login";
import Register from "./register";
import FetchFiltredMealPlans from "./filtredMeals";
import { UserProvider } from "./userContext";
import { useAuth } from "./useAuth";
import { AuthContext, AuthProvider } from "./authContext";
import VerfyEmail from "./verifyEmail";
import UpdateMealPlan from "./updatePlan";
import AddWorkoutPlan from "./addWorkout";
import FetchWorkoutPlans from "./WorkoutPlan";
import WorkoutPlanDetails from "./workoutDetails";
import UpdateWorkoutPlan from "./updateWorkoutPlan";
import Landing from "./landing";
import { useContext, useEffect, useState } from "react";
import { NotificationProvider } from "./notifContext";
import FetchFiltredWorkout from "./filtredWorkoutPl";
import AddListing from "./addProduct";
import Store from "./store";
import MyCart from "./ProductCart";
import UpdateProduct from "./updateProduct";
import AdminDash from "./AdminDash";
import { FilterProvider } from "./filterContext";
import Profile from "./profile";
import Setting from "./setting";
import Product from "./productDetails";
import AdminMeals from "./adminMeals";
import AdminWorkout from "./AdminWorkout";
import AdminStore from "./AdminStore";
import EmailSentNotification from "./SentEmail";
// import { CartProvider } from "./cartContext";

interface TokenProps {
  children: React.ReactNode;
}

function CheckToken({ children }: TokenProps) {
  const { authStatus, verifySession } = useAuth();
  const isAuthenticated = authStatus && authStatus.isAuthenticated;

  useEffect(() => {
    if (!authStatus.checked) {
      verifySession();
    }
  }, [authStatus.checked, verifySession]);

  if (!authStatus.checked) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function CheckAdmin({ children }: TokenProps) {
  const { authAdmin, verifyAdmin } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      if (!authAdmin.checked) {
        verifyAdmin().finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      <Navigate to="/Login" />;
    }
  }, [authAdmin.checked, token, verifyAdmin]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!authAdmin.isAdmin) {
    return <Navigate to="/Login" replace />;
  }

  return <>{children}</>;
}

const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <UserProvider>
          <FilterProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </FilterProvider>
        </UserProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Landing />} />

      <Route
        path="/profile"
        element={
          <CheckToken>
            <Profile />
          </CheckToken>
        }
      />
      <Route
        path="/setting"
        element={
          <CheckToken>
            <Setting />
          </CheckToken>
        }
      />
      <Route path="/users/:userId/verify/:token" element={<VerfyEmail />} />
      <Route path="/MealsPlans" element={<Home />} />

      <Route
        path="/Generate/MealsPlans"
        element={
          <CheckToken>
            <FetchFiltredMealPlans />
          </CheckToken>
        }
      />
      <Route
        path="/MealsPlans/update/:planId"
        element={
          <CheckAdmin>
            <UpdateMealPlan />
          </CheckAdmin>
        }
      />
      <Route
        path="/add/Mealsplan"
        element={
          <CheckAdmin>
            <AddMealPlan />
          </CheckAdmin>
        }
      />
      <Route path="/plan/:planId" element={<PlanDetails />} />

      {/* Workout routes */}

      <Route
        path="/add/workoutPlan"
        element={
          <CheckAdmin>
            <AddWorkoutPlan />
          </CheckAdmin>
        }
      />
      <Route path="/workoutPlans" element={<FetchWorkoutPlans />} />
      <Route path="/sent" element={<EmailSentNotification />} />
      <Route
        path="/FworkoutPlans"
        element={
          <CheckToken>
            <FetchFiltredWorkout />
          </CheckToken>
        }
      />
      <Route path="/workoutPlan/:workoutId" element={<WorkoutPlanDetails />} />
      <Route
        path="/workoutPlan/update/:workoutId"
        element={
          <CheckAdmin>
            <UpdateWorkoutPlan />
          </CheckAdmin>
        }
      />

      {/* store routes */}

      <Route
        path="/add/Product"
        element={
          <CheckAdmin>
            <AddListing />
          </CheckAdmin>
        }
      />
      <Route path="/Store" element={<Store />} />
      <Route path="/product/:productId" element={<Product />} />

      <Route path="/mycart" element={<MyCart />} />
      <Route path="/update/:productId/" element={<UpdateProduct />} />

      {/* admin */}
      <Route
        path="/Dashboard"
        element={
          <CheckAdmin>
            <AdminDash />
          </CheckAdmin>
        }
      />
      <Route
        path="/Admin/MealsPlan"
        element={
          <CheckAdmin>
            <AdminMeals />
          </CheckAdmin>
        }
      />
      <Route
        path="/Admin/WorkoutPlan"
        element={
          <CheckAdmin>
            <AdminWorkout />
          </CheckAdmin>
        }
      />
      <Route
        path="/Admin/Store"
        element={
          <CheckAdmin>
            <AdminStore />
          </CheckAdmin>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
