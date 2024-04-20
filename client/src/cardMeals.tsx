import { Link } from "react-router-dom";

interface CardProps {
  Plan_Name: string;
  descriptionP: string;
  thumbnail: string;
  totalCalories: number;

  planId: string;
}

const Card: React.FC<CardProps> = ({
  Plan_Name,
  descriptionP,
  thumbnail,
  totalCalories,
  planId,
}) => {
  return (
    <div className="card  max-h-card  border border-gray-600 bg-base-100 shadow-xl">
      <Link to={`/plan/${planId}`}>
        <figure>
          <img src={thumbnail} alt="Meal Plan Thumbnail" />
        </figure>
      </Link>
      <div className="card-body flex flex-col justify-between p-3 ">
        <div>
          <h2 className="card-title mt-4 mb-4">{Plan_Name}</h2>
          <p className="whitespace-pre-wrap">{descriptionP}</p>
        </div>
        <div className=" mt-4">
          {" "}
          {/* This div ensures "Total Calories" is at the bottom */}
          <div className=" flex flex-col bottom-0 justify-end ">
            <div>Total Calories: {totalCalories}</div>
            {/* Link or button to view more details */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
