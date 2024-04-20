

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
                    href="tel:+989353770255"
                    className="footer__link"
                  >
                    (+98)9353770255
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.google.com/maps/place/Piroozi+Metro+Station/@35.6906275,51.4678442,18z/data=!4m5!3m4!1s0x3f8e027b555fc43b:0x1682d8b3b203a6db!8m2!3d35.6910109!4d51.4679227"
                    className="footer__link"
                  >
                    MFR9+C5,Piroozi St,
                    <br />
                    Farah Abad,
                    <br />
                    Tehran, Iran
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer__content">
              <h3 className="footer__title">Pricing</h3>
              <ul className="footer__list">
                <li>
                  <a href="#" className="footer__link">
                    Basic
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Premium
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Diamond
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
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Customers
                  </a>
                </li>
                <li>
                  <a href="#" className="footer__link">
                    Partners
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
