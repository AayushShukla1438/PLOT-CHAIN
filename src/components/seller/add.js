import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Container,
  TextField,
  Grid,
} from "@mui/material";
import backgroundImage from "../../Assets/imgs/bg.png";

const SellerDashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [buyersCount, setBuyersCount] = useState(0);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [landAddress, setLandAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [country, setCountry] = useState("");
  const [landPrice, setLandPrice] = useState("");
  const [propertyPID, setPropertyPID] = useState("");
  const [landRequests, setLandRequests] = useState([]);

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
          .getSellerDetails(accounts[2])
          .call();
        setSellerDetails({
          name: details[0],
          age: details[1].toString(),
          HKID: details[2],
        });

        const buyerscount = await contractInstance.methods
          .getBuyersCount()
          .call();
        setBuyersCount(buyerscount);

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
            owner,
            requested,
            approved,
          });
        }

        const ownedLands = _lands.filter((land) => land.owner === accounts[2]);
        setLandRequests(ownedLands);
      } catch (error) {
        alert("Failed to load web3, accounts, or contract.");
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  const handleAddLand = async (e) => {
    e.preventDefault();
    try {
      await contract.methods
        .addLand(landAddress, area, city, district, country, landPrice, propertyPID)
        .send({ from: accounts[2], gas: "6721975" });

      alert("Land added successfully: " + propertyPID);
      navigate("/seller-dashboard");
    } catch (error) {
      console.error("Error adding land:", error);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Add Land
        </Typography>

        <form onSubmit={handleAddLand}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Land Address"
                variant="outlined"
                fullWidth
                value={landAddress}
                onChange={(e) => setLandAddress(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Area (sq. ft)"
                variant="outlined"
                fullWidth
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="City"
                variant="outlined"
                fullWidth
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="District"
                variant="outlined"
                fullWidth
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Country"
                variant="outlined"
                fullWidth
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Price (ETH)"
                variant="outlined"
                type="number"
                fullWidth
                value={landPrice}
                onChange={(e) => setLandPrice(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Property ID"
                variant="outlined"
                fullWidth
                value={propertyPID}
                onChange={(e) => setPropertyPID(e.target.value)}
                required
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ marginTop: 3 }}
          >
            Add Land
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SellerDashboard;
