import React, { useState, useEffect } from "react";
import LandContract from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../Assets/imgs/bg.png";
import { Box, Typography, Container, Button } from "@mui/material";
import { Link } from "react-router-dom";

const SellerDashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [landRequests, setLandRequests] = useState([]);

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

        const details = await contractInstance.methods
          .getSellerDetails(accounts[2])
          .call();
        setSellerDetails({
          name: details[0],
          age: details[1].toString(),
          HKID: details[2],
        });

        const landsCount = await contractInstance.methods
          .getLandsCount()
          .call();
        const _lands = [];
        for (let i = 1; i <= parseInt(landsCount); i++) {
          let land = await contractInstance.methods.getLandDetails(i).call();
          let requested = await contractInstance.methods.isRequested(i).call();
          let owner = await contractInstance.methods.getLandOwner(i).call();
          let approved = await contractInstance.methods.isApproved(i).call();

          _lands.push({
            id: land[0],
            landAddress: land[1],
            area: land[2],
            city: land[3],
            district: land[4],
            country: land[5],
            landPrice: land[6],
            propertyPID: land[7],
            owner: owner,
            requested: requested,
            approved: approved,
          });
        }

        const ownedLands = _lands.filter((land) => land.owner === accounts[2]);
        setLandRequests(ownedLands);
      } catch (error) {
        alert(
          "Failed to load web3, accounts, or contract. Check console for details."
        );
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
          Seller Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ fontStyle: "italic", mb: 3 }}>
          Wallet address: {accounts[2]}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", flexDirection: "column" }}>
          <Button
            component={Link}
            to="/seller-profile"
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
            View Profile
          </Button>

          <Button
            component={Link}
            to="/seller-owned-lands"
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
            View Lands
          </Button>

          <Button
            component={Link}
            to="/seller-land-add"
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
            Add Land
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SellerDashboard;
