import React, { useState, useEffect } from "react";
import LandContract from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from "../Assets/imgs/bg.png";
import { Box, Typography, Container, Button } from "@mui/material";

const LandInspectorDashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

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
        alert("Failed to load web3, accounts, or contract. Check console for details.");
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  return (
    <Container
      maxWidth={false}
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
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          zIndex: 1,
          position: "absolute",
          top: "26%",
          left: "28%",
          width: "39%",
          height: "52%",
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
          Land Inspector Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ fontStyle: "italic", mb: 3 }}>
          Wallet address: {accounts[0]}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Button
            component={Link}
            to="/land-inspector-pending-lands"
            variant="contained"
            color="primary"
            sx={{
              marginBottom: 2,
              padding: "10px 20px",
              backgroundColor: "#0073e6",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#005bb5" },
            }}
          >
            View Pending Lands
          </Button>

          <Button
            component={Link}
            to="/land-inspector-pending-sales"
            variant="contained"
            color="primary"
            sx={{
              marginBottom: 2,
              padding: "10px 20px",
              backgroundColor: "#0073e6",
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#005bb5" },
            }}
          >
            View Pending Sales
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LandInspectorDashboard;
