import React, { useState, useEffect } from "react";
import LandContract from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../Assets/imgs/bg.png";
import { Box, Typography, Container, Button } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const BuyerRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [HKID, setHKID] = useState("");
  const [email, setEmail] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = await getWeb3();
        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = LandContract.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          LandContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setWeb3(web3Instance);
        setAccounts(accounts);
        setContract(contractInstance);
        console.log(accounts);
        console.log(contractInstance);
      } catch (error) {
        alert(
          "Failed to load web3, accounts, or contract. Check console for details."
        );
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await contract.methods
        .registerBuyer(name, age, city, HKID, email)
        .send({ from: accounts[1], gas: "6721975" });

      console.log("Buyer registered successfully");
      navigate("/buyer-dashboard");
      const buyercount = await contract.methods.getBuyersCount().call();
      console.log("Buyer count:", buyercount);
    } catch (error) {
      console.error("Error registering buyer:", error);
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      style={{
        backgroundColor: "#D7F5FF",
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background image over solid color */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* Registration Container */}
      <Box
        sx={{
          zIndex: 1,
          position: "absolute",
          top: "24%",            // Move vertically (adjust this to reposition)
          left: "28%",           // Move horizontally (adjust this to reposition)
          width: "39%",          // ✅ Resize this to make the glass container bigger/smaller
          height: "54%",         // ✅ Resize this to adjust height
          backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent white
          borderRadius: "16px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
          
        }}
      >
        <Typography variant="h5" fontWeight="bold" pb={1}>
          Buyer Registration
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontStyle: "italic", mb: 3 }}
        >
          Wallet address being used: {accounts[1]}
        </Typography>
        <form onSubmit={handleRegister}>
          <Box mb={2}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ marginLeft: "20px" }}
            />
          </Box>
          <Box mb={2}>
            <label>Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              style={{ marginLeft: "33px" }}
            />
          </Box>
          <Box mb={2}>
            <label>City:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              style={{ marginLeft: "30px" }}
            />
          </Box>
          <Box mb={2}>
            <label>HKID:</label>
            <input
              type="text"
              value={HKID}
              onChange={(e) => setHKID(e.target.value)}
              required
              style={{ marginLeft: "23px" }}
            />
          </Box>
          <Box mb={3}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ marginLeft: "20px" }}
            />
          </Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default BuyerRegistration;
