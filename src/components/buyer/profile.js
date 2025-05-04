import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../../Assets/imgs/bg.png";
import { Typography, Box, Container, Button } from "@mui/material";

const BuyerRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [buyerDetails, setBuyerDetails] = useState(null);

  const navigate = useNavigate();

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

        const details = await contractInstance.methods
          .getBuyerDetails(accounts[1])
          .call();

        setBuyerDetails({
          name: details[0],
          city: details[1],
          email: details[2],
          age: details[3].toString(),
          HKID: details[4],
        });
      } catch (error) {
        alert("Failed to load web3, accounts, or contract.");
        console.error(error);
      }
    };

    initWeb3();
  }, []);

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
      }}
    >
      {/* Background Image */}
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

      {/* Glassy Container */}
      <Box
        sx={{
          zIndex: 1,
          position: "absolute",
          top: "26%",
          left: "29%",
          width: "38%",
          height: "52%",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Buyer Profile
        </Typography>
        <Typography variant="body1" gutterBottom>
              <strong>Wallet Address:</strong> {accounts[1]}
            </Typography>

        {buyerDetails ? (
          <Box textAlign="left" mt={3}>
            <Typography variant="body1" gutterBottom>
              <strong>Name:</strong> {buyerDetails.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Age:</strong> {buyerDetails.age}
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>City:</strong> {buyerDetails.city}
            </Typography>
        
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {buyerDetails.email}
            </Typography>
        
            <Typography variant="body1" gutterBottom>
              <strong>HKID:</strong> {buyerDetails.HKID}
            </Typography>
          </Box>
        ) : (
          <Typography>Loading buyer details...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default BuyerRegistration;
