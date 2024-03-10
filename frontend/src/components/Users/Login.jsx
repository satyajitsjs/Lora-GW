import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BaseUrl from "../Common/BaseUrl";
import Loading from "../Common/Loading";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user_data = localStorage.getItem("user_token");
  const URL = BaseUrl() + "login/";

  useEffect(() => {
    if (user_data) {
      navigate("/dashboard");
    }
  }, [navigate, user_data]);

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  const login = async () => {
    setLoading(true);
    setError(null);

    const FormData = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post(URL, FormData);
      const data = response.data;
      if (data.Success === true) {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 2000,
        });
        const token = data.token;
        localStorage.setItem("user_token", token.access_token);
        localStorage.setItem(
          "token_expires_at",
          token.access_token_expires_at
        );
        const removeExpiredToken = () => {
          const accessTokenExpiresAt = localStorage.getItem(
            "token_expires_at"
          );

          if (
            accessTokenExpiresAt &&
            new Date().getTime() >= parseInt(accessTokenExpiresAt, 10) * 1000
          ) {
            localStorage.removeItem("user_token");
            localStorage.removeItem("token_expires_at");
          }
        };
        setTimeout(removeExpiredToken, 1000);
        navigate("/dashboard");
      } else {
        toast.error(data.message, {
          position: "top-right",
        });
        setError(data.message);
        navigate("/");
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
      toast.error(error.message, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-cover bg-no-repeat">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border-2 p-10 rounded-lg bg-white">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Username<span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                onChange={handleUsername}
                value={username}
                required
                className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Password<span className="text-red-400">*</span>
                </label>
                <div className="text-sm">
                  <Link className="font-semibold text-gray-800 hover:gray-200">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <input
                type="password"
                name="password"
                onChange={handlePassword}
                value={password}
                onKeyPress={handleKeyPress}
                required
                className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400"
              />
            </div>

            <div>
              <button
                onClick={login}
                type="submit"
                className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-900 hover:text-white focus-visible:outline"
              >
                {loading ? (
                  <Loading size="20px"/>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
