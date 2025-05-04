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

const Seller = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [HKID, setHKID] = useState("");
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
      } catch (error) {
        alert("Failed to load web3, accounts, or contract.");
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await contract.methods
        .registerSeller(name, age, HKID)
        .send({ from: accounts[2], gas: "6721975" });

      console.log("Seller registered successfully");
      navigate("/seller-dashboard");
      const sellerCount = await contract.methods.getSellersCount().call();
      console.log("Seller count:", sellerCount);
    } catch (error) {
      console.error("Error registering seller:", error);
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
      {/* Background image layer */}
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

      {/* Glass UI container */}
      <Box
        sx={{
          zIndex: 1,
          position: "absolute",
          top: "24%",
          left: "28%",
          width: "39%",
          height: "54%",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
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
          Seller Registration
        </Typography>
        <Typography variant="subtitle1" sx={{ fontStyle: "italic", mb: 3 }}>
          Wallet address being used: {accounts[2]}
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
          <Box mb={3}>
            <label>HKID:</label>
            <input
              type="text"
              value={HKID}
              onChange={(e) => setHKID(e.target.value)}
              required
              style={{ marginLeft: "30px" }}
            />
          </Box>
          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Seller;
