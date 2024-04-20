import { Link } from "react-router-dom";
import "./assets/css/cardWork.css";

interface CardProps {
  nameOfprogram: string;
  description: string;
  thumbnail: string;

  workoutId: string;
}

const WorkoutCard: React.FC<CardProps> = ({
  nameOfprogram,
  description,
  thumbnail,

  workoutId,
}) => {
  return (
    // <div className="card bg-base-100 p-2 shadow-xl">
    //   <Link to={`/workoutPlan/${workoutId}`}>
    //     <figure>
    //       <img
    //         src={thumbnail}
    //         alt="workout Plan Thumbnail"
    //         className=" rounded-xl h-96 w-full object-cover"
    //       />
    //     </figure>
    //     <div className="card-body">
    //       <h2 className="text-3xl font-bold">{nameOfprogram}</h2>
    //       <p className=" whitespace-pre-wrap">{description}</p>
    //       <div className="flex justify-end">
    //         <div className=" bg-red-400 w-30  inline-block px-3 font-semibold py-1 rounded-2xl">
    //           High {intensity}
    //         </div>
    //       </div>
    //       <div className="card-actions justify-end">
    //         {/* Link or button to view more details */}
    //       </div>
    //     </div>
    //   </Link>
    // </div>
    <div className="workout_wrapper ">
      <div className="workout_card rounded-xl">
        <img className="workout_img rounded-xl" src={thumbnail} alt="" />
        <div className="workout_title">{nameOfprogram}</div>

        <div className="workout_detail  rounded-b-xl">
          <p className="whitespace-pre-wrap mb-6">{description}</p>
          <Link to={`/workoutPlan/${workoutId}`} className="workout_btn mt-6">
            Start
          </Link>
          {/* <div className="flex  justify-center mt-16">
            <div className=" bg-red-400 w-30  inline-block px-3 font-semibold py-1 rounded-2xl">
              High {intensity}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
