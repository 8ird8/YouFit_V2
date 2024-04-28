

const Footer = () => {
  return (
    <div>
      <footer className="footer section" id="footer">
        <div className="container">
          <div className="footer__container">
            <div className="footer__content">
              <a href="#" className="footer__logo">
                YOUFit.
              </a>
              <p className="footer__description">
                Subscribe for company <br />
                updates below.
              </p>
              <form action="" className="footer__form" id="footer-form">
                <input
                  type="email"
                  name="user_email"
                  placeholder="Your Email"
                  className="footer__input"
                  id="footer-input"
                />
                <button type="submit" className="btn footer__btn">
                  Subscribe
                </button>

                <p className="footer__message" id="footer-message"></p>
              </form>
            </div>

            <div className="footer__content">
              <h3 className="footer__title">information</h3>
              <ul className="footer__list">
                <li>
                  <a
                    target="_blank"
                    href="tel:+212654378356"
                    className="footer__link"
                  >
                    (+212)654378356
                  </a>
                </li>
                <li>
                <a
                    target="_blank"
                    href="Email:YoufitGym@gmail.com"
                    className="footer__link"
                  >
                    YoufitGym@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__content">
              <h3 className="footer__title">Service</h3>
              <ul className="footer__list">
                <li>
                  <a href="#" className="footer__link">
                    Meals Program
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Workout Program
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    BMI Calculat
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__content">
              <h3 className="footer__title">Company</h3>
              <ul className="footer__list">
                <li>
                  <a href="#" className="footer__link">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Our Program
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                   Nutritions
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    bmi
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer__group">
            <div className="footer__social">
              <a
                target="_blank"
                href="https://twitter.com/"
                className="footer__social-link"
              >
                <i className="bi bi-twitter"></i>
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/"
                className="footer__social-link"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                target="_blank"
                href="https://www.youtube.com/"
                className="footer__social-link"
              >
                <i className="bi bi-youtube"></i>
              </a>
              <a
                target="_blank"
                href="https://web.whatsapp.com/"
                className="footer__social-link"
              >
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
