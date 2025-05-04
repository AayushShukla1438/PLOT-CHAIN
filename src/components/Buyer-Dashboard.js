import React, { useState, useEffect } from "react";
import LandContract from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import { useNavigate } from "react-router-dom";
import { Button, Box, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import backgroundImage from "../Assets/imgs/bg.png";

const BuyerRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [lands, setLands] = useState([]);
  const [sellersCount, setSellersCount] = useState(0);
  const [ownedLands, setOwnedLands] = useState([]);
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

        const sellersCount = await contractInstance.methods.getSellersCount().call();
        setSellersCount(sellersCount);

        const landsCount = await contractInstance.methods.getLandsCount().call();
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

        setLands(_lands);
        const owned = _lands.filter((land) => land.owner === accounts[1]);
        setOwnedLands(owned);
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
        backgroundColor: "#D7F5FF", // Background color
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background image */}
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

      {/* Glassy container */}
      <Box
        sx={{
          zIndex: 1,
          position: "absolute",
          top: "24%", // Adjust this for vertical positioning
          left: "28%", // Adjust for horizontal positioning
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
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
          Buyer Dashboard
        </Typography>

        {/* Modern, cute buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
            width: "100%",
          }}
        >
          {[{ title: "Profile", link: "/buyer-profile" },
            { title: "Owned Lands", link: "/buyer-owned-lands" },
            { title: "Available Lands", link: "/buyer-available-lands" },
            { title: "View Land Requests", link: "/buyer-land-requests" }].map((button, index) => (
              <Button
              key={index}
              variant="contained"
              color="primary"
              component={Link}
              to={button.link}
              sx={{
                width: "80%",  // Reduced width
                fontSize: "1.1rem",
                padding: "10px",
                borderRadius: "50px",  // Rounded corners for a cuter look
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                backgroundColor: "#4A90E2", // Cute blue color (updated)
                "&:hover": {
                  backgroundColor: "#357ABD", // Darker blue on hover (updated)
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              {button.title}
            </Button>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default BuyerRegistration;
