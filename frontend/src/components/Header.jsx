import { useState } from "react";
import CartIcon from '../assets/images/icons/cart-icon.png';
import SearchIcon from '../assets/images/icons/search-icon.png';
import LogoWhite from '../assets/images/Eclogo.png';
import MobileLogoWhite from '../assets/images/M_logo.png';
import { NavLink, useNavigate, useSearchParams } from "react-router";
import "./header.css";

export function Header({ cart }) {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("search");

  const [search, setSearch] = useState(searchText || "");
  const [showMenu, setShowMenu] = useState(false); // ✅ NEW

  const updateSearchInput = (event) => {
    setSearch(event.target.value);
  };

  const searchProduct = () => {
    navigate(`/?search=${search}`);
  };

  let totalQuantity = 0;
  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });

  return (
    <div className="header">

      {/* LEFT */}
      <div className="left-section">
        <NavLink to="/" className="header-link">
          <img className="logo" src={LogoWhite} />
          <img className="mobile-logo" src={MobileLogoWhite} />
        </NavLink>
      </div>

      {/* SEARCH */}
      <div className="middle-section">
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
          value={search}
          onChange={updateSearchInput}
        />

        <button className="search-button" onClick={searchProduct}>
          <img className="search-icon" src={SearchIcon} />
        </button>
      </div>

      {/* RIGHT */}
      <div className="right-section">

        {/* ✅ MOBILE MENU BUTTON */}
        <button
          className="mobile-menu-btn"
          onClick={() => setShowMenu(!showMenu)}
        >
          ☰
        </button>

        {/* ✅ NORMAL LINKS (DESKTOP) */}
        <div className="desktop-links">
          <NavLink className="orders-link header-link" to="/orders">
            <span className="orders-text">Orders</span>
          </NavLink>

          <NavLink className="cart-link header-link" to="/checkout">
            <img className="cart-icon" src={CartIcon} />
            <div className="cart-quantity">{totalQuantity}</div>
            <div className="cart-text">Cart</div>
          </NavLink>

          <NavLink className="orders-link header-link" to="/logout">
            <span className="orders-text">Logout</span>
          </NavLink>
        </div>

        {/* ✅ DROPDOWN (MOBILE) */}
        <div className={`dropdown-menu ${showMenu ? "show" : ""}`}>

          <NavLink to="/orders" onClick={() => setShowMenu(false)}>
            Orders
          </NavLink>

          <NavLink to="/checkout" onClick={() => setShowMenu(false)}>
            Cart ({totalQuantity})
          </NavLink>

          <NavLink to="/logout" onClick={() => setShowMenu(false)}>
            Logout
          </NavLink>

        </div>

      </div>
    </div>
  );
}