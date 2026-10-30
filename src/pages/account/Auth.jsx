import BrandLogo from "../../components/common/BrandLogo";
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useShop } from "../../hooks/useShop";
import { Field, Button } from "../../components/common/UI";
import { photos } from "../../data/products";
export default function Auth() {
  const { pathname } = useLocation(),
    navigate = useNavigate(),
    { setProfile, notify } = useShop(),
    [error, setError] = useState("");
  const register = pathname === "/register",
    forgot = pathname === "/forgot-password",
    admin = pathname === "/admin/login";
  return (
    <div className={`auth-page ${admin ? "admin-auth" : ""}`}>
      <div className="auth-photo">
        <img
          src={admin ? "/images/office-banner.png" : photos.journal}
          alt="A notebook ready for a new chapter"
        />
        <div>
          <Link className="logo" to="/">
            <BrandLogo />
          </Link>
          <h2>
            A fresh page.
            <br />
            <em>A new possibility.</em>
          </h2>
        </div>
      </div>
      <div className="auth-form">
        <Link className="eyebrow" to="/">
          â† BACK TO PAPERIST
        </Link>
        <h1>
          {admin
            ? "Paperist Admin"
            : register
              ? "Your next chapter."
              : forgot
                ? "A fresh start."
                : "Welcome back."}
        </h1>
        <p>
          {admin
            ? "Sign in to the local admin demo."
            : register
              ? "Make a little space for the things you love."
              : forgot
                ? "Weâ€™ll show a demo recovery confirmation."
                : "Good to see you. Your ideas are waiting."}
        </p>
        <div className="demo-note">
          Phase 1 demo â€” use fictional information and a demo password.
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            if (
              register &&
              data.get("Password") !== data.get("Confirm password")
            ) {
              setError("Passwords must match.");
              return;
            }
            setError("");
            if (forgot) {
              notify("Demo recovery requested. No email has been sent.");
              return;
            }
            if (register)
              setProfile({
                name: data.get("First name") + " " + data.get("Last name"),
                email: data.get("Email"),
                phone: data.get("Mobile"),
              });
            sessionStorage.setItem(
              admin ? "paperist-admin" : "paperist-session",
              "demo",
            );
            navigate(admin ? "/admin" : "/account");
          }}
        >
          {(register
            ? [
                "First name",
                "Last name",
                "Email",
                "Mobile",
                "Password",
                "Confirm password",
              ]
            : forgot
              ? ["Email"]
              : ["Email", "Password"]
          ).map((label) => (
            <Field
              key={label}
              label={label}
              name={label}
              type={
                label.toLowerCase().includes("password")
                  ? "password"
                  : label === "Email"
                    ? "email"
                    : label === "Mobile"
                      ? "tel"
                      : "text"
              }
              required
              minLength={
                label.toLowerCase().includes("password") ? 8 : undefined
              }
            />
          ))}
          {!register && !forgot && (
            <div className="summary-line">
              <label className="check">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
          )}
          {error && (
            <p role="alert" className="red">
              {error}
            </p>
          )}
          <Button>
            {register
              ? "Create account"
              : forgot
                ? "Request recovery"
                : "Sign in to demo"}{" "}
            â†’
          </Button>
        </form>
        <p>
          {register
            ? "Already part of the story? "
            : forgot
              ? "Remembered your password? "
              : "New here? "}
          <Link
            className="text-link"
            to={register || forgot ? "/login" : "/register"}
          >
            {register || forgot ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}
