import { toast } from "react-toastify";
import BaseUrl from "../Common/BaseUrl";

const logout = (navigate) => {
  const URL = BaseUrl();
  const user_token = localStorage.getItem("user_token");
  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      try {
        const tokenListResponse = await fetch(`${URL}token/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_token}`, 
          },
        });

        if (tokenListResponse.ok) {
          const token = await tokenListResponse.json();
          const tokenList = token.token
          const TokenArray = [];
          
          tokenList.forEach(element => {
              TokenArray.push(element.access_token)            
          });

          const isUserTokenValid = TokenArray.includes(user_token);

          if (isUserTokenValid) {
            const response = await fetch(`${URL}logout/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user_token}`,
              },
              body: JSON.stringify({
                access_token: user_token,
              }),
            });

            if (response.ok) {
              localStorage.removeItem("user_token");
              localStorage.removeItem("token_expires_at");
              navigate("/");
              toast.success("Logout Successful", {
                position: "top-right",
                theme: "colored",
              });
            } else {
              const data = await response.json();
              toast.error(data.message, {
                position: "top-right",
                theme: "colored",
              });
            }
          } else {
            localStorage.removeItem("user_token");
            localStorage.removeItem("token_expires_at");
            toast.warning("Invalid User Token. Local data cleared.", {
              position: "top-right",
              theme: "colored",
            });
            navigate("/");
          }
        } else {
          const data = await tokenListResponse.json();
          toast.error(data.message, {
            position: "top-right",
            theme: "colored",
          });
        }
      } catch (error) {
        console.error("Error during logout:", error);
        toast.error("An error occurred during logout", {
          position: "top-right",
          theme: "colored",
        });
      }
    }
  };

  return handleLogout;
};

export default logout;
