
import { NavLink } from 'react-router-dom'
const Navbar = () => {
  return (
    <div>
      <div className="Navbar">
        <input type="checkbox" id="navcheck" role="button" title="navMenu" />
        <label htmlFor="navcheck" aria-hidden="true" title="navMenu">
          <span className="burger">
            <span className="bar">
              <span className="visuallyhidden">Menu</span>
            </span>
          </span>
        </label>
        {/* <nav id="menu"> */}
        <nav className='navMenu'>
          <NavLink to="/Pages/SpeedSlalomRecord" id="speedslalom">Speed Slalom</NavLink>
          <ul>
            <NavLink to="/Pages/SSResultRecored" id="ssresultrecord">Get SS Result</NavLink>
          </ul>
          <NavLink to="/Pages/SlideRecord" id="slide">Slide</NavLink>
          <ul>
            <NavLink to="/Pages/SlideRecored" id="sliderecord">Get Slide Result</NavLink>
          </ul>
          <NavLink to="/Pages/ClassicSlalomRecord" id="slide">Classic</NavLink>
          <NavLink to="/Pages/AthleteReg" id="slide">Registration</NavLink>
          <NavLink to="/Pages/Guideline" id="guideline">Guideline</NavLink>
          <NavLink to="/Pages/Login" id="login">Login</NavLink>
        </nav>
      </div>
    </div>

  );
};

export default Navbar;