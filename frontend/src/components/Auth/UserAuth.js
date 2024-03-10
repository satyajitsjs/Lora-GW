import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useUserAuth  = () => {
  const navigate = useNavigate();
  const user_data = localStorage.getItem("user_token");

  useEffect(() => {
    if (!user_data) {
      navigate("/");
    }
  }, [navigate, user_data]);

  return user_data;
};

export default useUserAuth ;
