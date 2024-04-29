import { Link } from "react-router-dom";
import "./assets/css/styles.css";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "./footer";

const Landing = () => {
  const [isloading, setIsLoading] = useState(true);
  const homeImgRef = useRef(null);
  const ImgRef = useRef(null);
  const programRef = useRef(null);
  const btnRef = useRef(null);
  const ChooseRef = useRef(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Loading timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Home image animation
  useEffect(() => {
    if (!isloading) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.from(programRef.current, {
        duration: 2,
        opacity: 0,
        x: 100,
        autoAlpha: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: programRef.current,
          start: "top 75%",
          toggleActions: "restart none restart none",
        },
      });

      gsap.fromTo(
        homeImgRef.current,
        { x: 500, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: homeImgRef.current,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "restart none restart none",
            // restart: Restarts the animation each time the trigger enters the viewport.
            // none: Does nothing when the trigger leaves the viewport.
          },
        }
      );

      gsap.fromTo(
        ChooseRef.current,
        { y: 200, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: homeImgRef.current,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play none restart none",
            // restart: Restarts the animation each time the trigger enters the viewport.
            // none: Does nothing when the trigger leaves the viewport.
          },
        }
      );

      gsap.fromTo(
        ImgRef.current,
        { y: 0, opacity: 0 },
        {
          y: -100,
          opacity: 1,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ImgRef.current,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "play none restart none",
          },
        }
      );
      gsap.fromTo(
        btnRef.current,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: btnRef.current,
            start: "top bottom",
            end: "bottom top",
            toggleActions: "restart none restart none",
          },
        }
      );
    }
  }, [isloading]);

  if (isloading) {
    return (
      <div className="preloader" id="preloader">
        <img src="preloader.gif" />
      </div>
    );
  }

  const calculateBMI = (e:any ) => {
    e.preventDefault(); // Prevent the form from submitting traditionally

    if (!weight || !height) {
      setMessage("Please enter some values");
      return;
    }

    const heightInMeters = Number(height) / 100;
    const bmi = Number(weight ) / (heightInMeters * heightInMeters);
    const formattedBMI = bmi.toFixed(1);

    if (Number(weight) < 0) {
      setMessage("Negative values not allowed");
    } else if (heightInMeters <= 0) {
      setMessage("Please enter a valid height");
    } else if (bmi <= 18.4) {
      setMessage(`Your BMI is ${formattedBMI} which means you are Underweight`);
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      setMessage(`Your BMI is ${formattedBMI} which means You are Normal`);
    } else if (bmi >= 25 && bmi <= 29.9) {
      setMessage(`Your BMI is ${formattedBMI} which means You are Overweight`);
    } else if (bmi >= 30) {
      setMessage(`Your BMI is ${formattedBMI} which means You are Obese`);
    }
  };
  return (
    <>
      <div className="landing">
        <header className="px-8 rounded-full mx-auto mb-4 fixed lg:left-40 md:left-32 top-2 z-20 text-white   w-3/4">
          <div className="mx-auto ">
            <nav className="flex justify-between ">
              <a href="#" className="nav__logo my-auto">
                YOUFit.
              </a>

              <div
                className="nav__menu my-auto rounded-full bg-gris2 border border-gris4 px-6 w-1/2 py-2"
                id="nav-menu"
              >
                <ul className="flex justify-between  w-full ">
                  <li>
                    <a href="#home" className=" text-white active-link">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#program" className="text-white">
                      Program
                    </a>
                  </li>
                  <li>
                    <a href="#meals" className="text-white">
                      Nutrious
                    </a>
                  </li>
                  <li>
                    <a href="#bmi" className="text-white">
                      BMI Calc
                    </a>
                  </li>
                </ul>

                <i className="bi bi-x nav__close" id="nav-close"></i>
              </div>
              {!token && (
                <div>
                  <ul className="mt-2">
                    <li>
                      <Link
                        to="/login"
                        className="bg-lime-400 px-8  py-2 border  text-black rounded-full "
                        id="log-btn"
                      >
                        Sign Up
                      </Link>
                    </li>
                  </ul>
                </div>
                
              )}

              {token && <div className=" w-20"></div>}
            </nav>
          </div>
        </header>

        <main id="main">
          <section className="home" id="home">
            <div className="container">
              <div className="home__container">
                <div ref={programRef} className="  home__data">
                  <h2 className="home__subtitle">MAKE YOUR</h2>
                  <h1 className="home__title">BODY SHAPE</h1>
                  <p className="home__description">
                    Join 1000’S Of People Who Have Lost Weight, Reversed Disease
                    And Feel Their Best Today.
                  </p>
                  {!token && (
                    <Link
                      to="/register"
                      ref={btnRef}
                      className="bg-lime-400 font-bold   rounded-full  w-60 h-60  mt-8  flex py-24  justify-center    hover:bg-black hover:text-lime-400  border  text-2xl   text-black  "
                    >
                      JOINs <span className="text-white"> ssNOW</span>
                    </Link>
                  )}
                </div>

                <div className="home__images">
                  <img
                    src="home.png"
                    alt="home image"
                    className="home__img  z-index z-10 "
                    ref={ImgRef}
                  />

                  <div className="home__triangle home__triangle-1"></div>
                  <div className="home__triangle home__triangle-2"></div>
                  <div className="home__triangle home__triangle-3"></div>
                </div>
              </div>
            </div>
          </section>

          <section className="section program" id="program">
            <div className="container">
              <div className="section-data">
                <h3 className="section-subtitle">Our Programs</h3>
                <h2 className="section-title">
                  <span>build your</span> best body
                </h2>
              </div>

              <div className="program__container mb-14">
                <article className="program__card">
                  <div className="program__img">
                    <img src="program1.png" alt="Program img" />
                  </div>

                  <h3 className="program__title">Flex Muscle</h3>
                  <p className="program__description">
                    Creating tension that's temporarily making the muscle fibers
                    smaller or contracted.
                  </p>

                  <Link
                    to={`${token ? "/FworkoutPlans" : "/workoutPlans"}`}
                    className="program__btn"
                  >
                    <img src="run.png" alt="program button" />
                  </Link>
                </article>

                <article className="program__card">
                  <div className="program__img">
                    <img src="program2.png" alt="Program img" />
                  </div>

                  <h3 className="program__title">Cardio Exercise</h3>
                  <p className="program__description">
                    Exercise your heart rate up and keeps it up for a prolonged
                    period of time.
                  </p>

                  <Link
                    to={`${token ? "/FworkoutPlans" : "/workoutPlans"}`}
                    className="program__btn"
                  >
                    <img src="run.png" alt="program button" />
                  </Link>
                </article>

                <article className="program__card">
                  <div className="program__img">
                    <img src="muscles2.png" alt="Program img" />
                  </div>

                  <h3 className="program__title">Gain Muscle</h3>
                  <p className="program__description">
                    Gaining muscle involves a combination of strength training
                    exercises, proper nutrition, and adequate rest.
                  </p>

                 <Link
                    to={`${token ? "/FworkoutPlans" : "/workoutPlans"}`}
                    className="program__btn"
                  >
                    <img src="run.png" alt="program button" />
                  </Link>
                </article>

                <article className="program__card">
                  <div className="program__img">
                    <img src="program4.png" alt="Program img" />
                  </div>

                  <h3 className="program__title">Weight Lifting</h3>
                  <p className="program__description">
                    Attempts a maximum weight single lift of a barbell loaded
                    with weight plates.
                  </p>

                  <Link
                    to={`${token ? "/FworkoutPlans" : "/workoutPlans"}`}
                    className="program__btn"
                  >
                    <img src="run.png" alt="program button" />
                  </Link>
                </article>
              </div>
              <div className="section-data relative -top-16  ">
                <Link
                  to={`${token ? "/FworkoutPlans" : "/workoutPlans"}`}
                  className="hover:bg-lime-400  h-20 py-12 w-20 px-1   bg-black text-white  border text-lg   hover:-black rounded-full "
                >
                  Explore More
                  {/* <img src="run.png" alt="program button" className="w-7 " /> */}
                </Link>
              </div>
            </div>
          </section>

          <section className="  section choose ">
            <div className="container">
              <div className="choose__container">
                <div className="choose__images">
                  <img
                    className="choose__img"
                    src="choose.png"
                    alt="choose-us img"
                    ref={homeImgRef}
                  />

                  <div className="choose__triangle choose__triangle-1"></div>
                  <div className="choose__triangle choose__triangle-2"></div>
                  <div className="choose__triangle choose__triangle-3"></div>
                </div>

                <div ref={ChooseRef} className="choose__data">
                  <div className="section-data">
                    <h3 className="section-subtitle">Best Reason</h3>
                    <h2 className="section-title">
                      <span>why</span> choose us ?
                    </h2>
                  </div>

                  <p className="choose__description">
                    Achieve wellness with YOUFit: tailored workouts, nutritious
                    meal plans, and a diverse marketplace for holistic health
                    essentials.
                  </p>

                  <div className="choose__group">
                    <div className="choose__group-data">
                      <h3 className="choose__group-title">100+</h3>
                      <p className="choose__group-description">
                        Personalized Plans Await
                      </p>
                    </div>
                    <div className="choose__group-data">
                      <h3 className="choose__group-title">50+</h3>
                      <p className="choose__group-description">
                        Customized Meals
                      </p>
                    </div>
                    <div className="choose__group-data">
                      <h3 className="choose__group-title">15+</h3>
                      <p className="choose__group-description">
                        Targeted Workouts
                      </p>
                    </div>
                    <div className="choose__group-data">
                      <h3 className="choose__group-title">100+</h3>
                      <p className="choose__group-description">
                        Customized Meals, Tailored Workouts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-20" id="meals">
            <div className="container">
              <div className="section-data">
                <h3 className="section-subtitle">Nutritions</h3>
                <h2 className="section-title">
                  <span>Delicious,Healthy Nutritious Food</span> <br /> FOR
                  HEALTHY LIFE
                </h2>
              </div>

              <div className="">
                <div className="">
                  <div className=" team__container">
                    <div className="my-auto">
                      <h2 className="team__title">Green Glory Salad</h2>
                      <p className="team__subtitle">300-400 Kcal</p>
                      <div className="flex flex-col justify-between">
                        <p className="mb-20 ">
                          Freshly tossed with crisp greens, vibrant vegetables,
                          and a tangy vinaigrette, our healthy salad bursts with
                          flavor and nutrients, making it a deliciously
                          satisfying choice for nourishment and wellness .
                        </p>
                        <Link
                          className="text-white hover:bg-lime-400  w-fit rounded-full py-2 px-3  "
                          to="/MealsPlans"
                        >
                          MORE
                        </Link>
                      </div>
                    </div>

                    <div className="team__img">
                      <img src="meal1.jpg" alt="team img" />
                    </div>
                  </div>

                  <>
                    <div className=" team__container">
                      <div className="team__img lg:mr-40 ">
                        <img src="meal2.jpg" alt="team img" className="" />
                      </div>
                      <div className="team__data">
                        <h2 className="team__title">ROGER SCOTT</h2>
                        <p className="team__subtitle">500-700 Kcal</p>
                        <div className="flex flex-col justify-between">
                          <p className="mb-20 ">
                            Indulge in a delightful medley of garden-fresh
                            goodness, where every bite of our healthy salad is a
                            symphony of colors, textures, and wholesome
                            ingredients, elevating your taste buds while fueling
                            your body with vitality..
                          </p>
                          <Link
                            className="text-white hover:bg-lime-400  w-fit rounded-full py-2 px-3  "
                            to="/MealsPlans"
                          >
                            MORE
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>

                  <div className=" team__container">
                    <div className="team__data">
                      <h2 className="team__title">Fresh, ripe, soft fruit </h2>
                      <p className="team__subtitle">84-95 Kcal</p>
                      <div className="flex flex-col justify-between">
                        <p className="mb-20 ">
                          Savor the succulent sweetness of our mixed fruit
                          medley, brimming with a harmonious blend of nature's
                          finest flavors and bursting with nourishing goodnes.
                        </p>
                        <Link
                          className="text-white hover:bg-lime-400  w-fit rounded-full py-2 px-3  "
                          to="/MealsPlans"
                        >
                          MORE
                        </Link>
                      </div>
                    </div>

                    <div className="team__img">
                      <img src="meal3.jpg" alt="team img" />
                    </div>
                  </div>
                </div>
              </div>
              {!token && (
                <>
                  <div className="section-data mt-6">
                    <h2 className="section-title">
                      <span>Join Us For Hepling you Achiving </span> <br /> YOur
                      Goal
                    </h2>
                  </div>
                  <div className=" flex justify-center items-center ">
                    <Link
                      to="/register"
                      ref={btnRef}
                      className="bg-lime-400 font-bold   rounded-full  w-60 h-60  mt-8  flex py-24  justify-center    hover:bg-black hover:text-lime-400  border  text-2xl   text-black  "
                    >
                      JOINs <span className="text-white"> ssNOW</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </section>
          <section className="section pricing mt-20" id="bmi">
            <div className="container">
              <div className="section-data">
                <h3 className="section-subtitle">BMI</h3>
                <h2 className="section-title">
                  <span>What Is the</span> BMI?
                </h2>
              </div>

              <div className="w-4/5 m-auto  leading-7">
                <p>
                  <b className="text-white">BMI</b> or Body Mass Index, is a
                  simple numerical calculation that uses a person's height and
                  weight to determine their body mass category. <br /> It's
                  calculated by dividing a person's weight in kilograms by the
                  square of their height in meters (kg/m²). <br /> The resulting
                  value places the individual in one of several categories:
                  underweight, normal weight, overweight, or obese, helping to
                  assess their general health risk related to body mass.
                  However, it's important to note that BMI does not directly
                  measure body fat and can sometimes inaccurately categorize
                  individuals with high muscle mass as overweight or obese.
                </p>
              </div>
            </div>
          </section>

          <section className="section bmi -mt-20" id="bmi">
            <div className="container">
              <div className="bmi__container">
                <div className="bmi__data">
                  <h2 className="section-title">
                    <span>Calculate</span> your BMI
                  </h2>
                  <p className="bmi__description">
                    The body mass index (BMI) calculator calculates body mass
                    index from your weight and height.
                  </p>

                  <form
                    className="bmi__form"
                    id="bmi-form"
                    onSubmit={calculateBMI}
                  >
                    <div className="bmi__input">
                      <input
                        type="number"
                        placeholder="Height in cm"
                        id="bmi-cm"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                      <label>cm</label>
                    </div>

                    <div className="bmi__input">
                      <input
                        type="number"
                        placeholder="Weight in kg"
                        id="bmi-kg"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                      <label>kg</label>
                    </div>

                    <button type="submit" className="btn bmi__btn">
                      Calculate Now
                    </button>

                    <p className="bmi__message" id="bmi-message">
                      {message}
                    </p>
                  </form>
                </div>

                <img src="bmi.png" alt="bmi img" className="bmi__img" />
              </div>
            </div>
          </section>

          <section className="brands section">
            <div className="container">
              <div className="section-data">
                <h3 className="section-subtitle">Our Store</h3>
                <h2 className="section-title">
                  <span>About Youfit </span> Store?
                </h2>
                <div className="w-4/5 m-auto  leading-7">
                  <p>
                    <b className="text-white">Nutrition</b> ,Vitamin, food supplements and Whey Protein
                    Youfit. Shop, Website selling the Best Brands: Sports nutrition,
                    food supplements and whey protein. proteins, protein gym, dietetics,
                    bodybuilding, fitness, endurance, CrossFit..
                    international gym supplement brand.
                  </p>
                </div>
              </div>
            </div>
            <section id="best-selling">
              <div className="all-cards">
                <div className="cards">
                  <img className="selling-img"
                    src="Whey.jpg"
                    alt="Whey"
                  />
                  <div className="selling-box">
                    <div className="add-to-cart">
                    <Link  to="/store" className="btn btn--small">SHOP PAGE</Link>
                    </div>
                  </div>
                </div>
                <div className="cards">
                  <img className="selling-img w-full"
                    src="CLOUTHS.png"
                    alt="leg-press"
                    width="250"
                    height="auto"
                  />
                  <div className="selling-box">
                    <div className="add-to-cart">
                    <Link  to="/store" className="btn btn--small">SHOP PAGE</Link>
                    </div>
                  </div>
                </div>
                <div className="cards">
                  <img className="selling-img w-full h-full"
                    src="oil.jpg"
                    alt="dumbbells"
                    width="250"
                    height="400"
                  />
                  <div className="selling-box">
                    <div className="add-to-cart">
                      <Link  to="/store" className="btn btn--small">SHOP PAGE</Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </main>

        <Footer />

        
      </div>
    </>
  );
};

export default Landing;
