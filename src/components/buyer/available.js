import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import {
  Button,
  Box,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Custom styled table cell components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Custom styled table row components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Utility function to create a structured object for table rows
function createData(
  id,
  address,
  area,
  city,
  district,
  country,
  price,
  propertyID
) {
  return { id, address, area, city, district, country, price, propertyID };
}

const BuyerRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [lands, setLands] = useState([]);

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

        const landsCount = await contractInstance.methods
          .getLandsCount()
          .call();
        const _lands = [];
        for (let i = 1; i <= parseInt(landsCount); i++) {
          let land = await contractInstance.methods.getLandDetails(i).call();
          let isApprovedByInspector = await contractInstance.methods
            .isLandApproved(i)
            .call();

          if (isApprovedByInspector) {
            let requested = await contractInstance.methods
              .isRequested(i)
              .call();
            let approved = await contractInstance.methods.isApproved(i).call();
            let saleApproved = await contractInstance.methods
              .isSaleApproved(i)
              .call();
            let owner = await contractInstance.methods.getLandOwner(i).call();

            _lands.push({
              id: land[0],
              landAddress: land[1],
              area: land[2],
              city: land[3],
              district: land[4],
              country: land[5],
              landPrice: land[6],
              propertyPID: land[7],
              requested: requested,
              saleApproved: saleApproved,
              approved: approved,
              landApproved: isApprovedByInspector,
              owner: owner,
            });
          }
        }
        setLands(_lands);
      } catch (error) {
        alert("Failed to load web3, accounts, or contract. Check console for details.");
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  const handleRequestLand = async (sellerId, landId) => {
    try {
      await contract.methods
        .requestLand(sellerId, landId)
        .send({ from: accounts[1], gas: "6721975" });
      console.log(`Request sent for land ID: ${landId}`);

      const landsCount = await contract.methods.getLandsCount().call();
      const _lands = [];
      for (let i = 1; i <= parseInt(landsCount); i++) {
        let land = await contract.methods.getLandDetails(i).call();
        let isPaid = await contract.methods.isPaid(i).call();

        if (!isPaid) {
          let requested = await contract.methods.isRequested(i).call();
          let approved = await contract.methods.isApproved(i).call();
          let saleApproved = await contract.methods.isSaleApproved(i).call();
          let owner = await contract.methods.getLandOwner(i).call();
          let isApprovedByInspector = await contract.methods
            .isLandApproved(i)
            .call();

          _lands.push({
            id: land[0],
            landAddress: land[1],
            area: land[2],
            city: land[3],
            district: land[4],
            country: land[5],
            landPrice: land[6],
            propertyPID: land[7],
            requested: requested,
            saleApproved: saleApproved,
            approved: approved,
            landApproved: isApprovedByInspector,
            owner: owner,
          });
        }
      }
      setLands(_lands);
      alert("Request sent successfully: " + landId);
      navigate("/buyer-dashboard");
    } catch (error) {
      console.error("Error requesting to buy land:", error);
    }
  };

  return (
    <Container
      maxWidth={false}
      style={{
        backgroundImage: "url('/bg1.png')", 
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "2rem",
        }}
      >
        <Box style={{ width: "50%", margin: "auto" }}>
          <Typography
            variant="h3"
            component="h2"
            style={{ color: "#000", marginBottom: "3%" }}
          >
            Available Lands
          </Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>Area</StyledTableCell>
                <StyledTableCell>City</StyledTableCell>
                <StyledTableCell>District</StyledTableCell>
                <StyledTableCell>Country</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Property ID</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lands.map((land, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{land.id}</StyledTableCell>
                  <StyledTableCell>{land.landAddress}</StyledTableCell>
                  <StyledTableCell>{land.area}</StyledTableCell>
                  <StyledTableCell>{land.city}</StyledTableCell>
                  <StyledTableCell>{land.district}</StyledTableCell>
                  <StyledTableCell>{land.country}</StyledTableCell>
                  <StyledTableCell>{land.landPrice}</StyledTableCell>
                  <StyledTableCell>{land.propertyPID}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      onClick={() => handleRequestLand(land.owner, land.id)}
                      disabled={land.requested}
                    >
                      {land.requested ? "Requested" : "Request to Buy"}
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default BuyerRegistration;
