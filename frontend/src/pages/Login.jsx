import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import styled from "styled-components";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { motion } from "framer-motion";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px 0 20px 0;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-family: "Poppins", sans-serif;
  color: #333;
  margin-bottom: 2rem;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-bottom: 2px solid #ddd;
  background: transparent;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #764ba2;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;

const ToggleText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #4a5568;
`;

const ToggleLink = styled.span`
  color: #3498db;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(username, email, password);
      }
      navigate("/");
    } catch (error) {
      console.error(isLogin ? "Login failed:" : "Registration failed:", error);
    }
  };

  return (
    <Container>
      <Card
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>{isLogin ? "Welcome Back" : "Create Account"}</Title>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              whileFocus={{ scale: 1.05 }}
              required
            />
          )}
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            whileFocus={{ scale: 1.05 }}
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            whileFocus={{ scale: 1.05 }}
            required
          />
          <Button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin ? <FaSignInAlt /> : <FaUserPlus />}
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </form>
        <ToggleText>
          {isLogin ? "New to our platform? " : "Already have an account? "}
          <ToggleLink onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Log In"}
          </ToggleLink>
        </ToggleText>
      </Card>
    </Container>
  );
}

export default Auth;
