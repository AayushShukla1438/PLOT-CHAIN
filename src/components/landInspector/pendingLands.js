import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Box, Container, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Web3 from 'web3';

// Custom styled MUI TableCell and TableRow
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const PendingLands = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [pendingLands, setPendingLands] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = new Web3('http://127.0.0.1:7545'); // Connecting to Ganache
        const accounts = await web3Instance.eth.getAccounts(); // Get all accounts from Ganache
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = LandContract.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          LandContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setWeb3(web3Instance);
        setAccounts(accounts);
        setContract(contractInstance);

        const landsCount = await contractInstance.methods.getLandsCount().call();
        let _pendingLands = [];
        for (let i = 1; i <= landsCount; i++) {
          let landApproved = await contractInstance.methods.isLandApproved(i).call();
          if (!landApproved) {
            let land = await contractInstance.methods.getLandDetails(i).call();
            let requested = await contractInstance.methods.isRequested(i).call();
            let approved = await contractInstance.methods.isApproved(i).call();
            let saleApproved = await contractInstance.methods.isSaleApproved(i).call();
            let owner = await contractInstance.methods.getLandOwner(i).call();
            let sellerDetails = await contractInstance.methods.getSellerDetails(owner).call();

            _pendingLands.push({
              id: land[0],
              landAddress: land[1],
              area: land[2],
              city: land[3],
              district: land[4],
              country: land[5],
              landPrice: land[6],
              propertyPID: land[7],
              requested,
              approved,
              saleApproved,
              landApproved,
              owner,
              sellerName: sellerDetails[0],
              sellerAge: sellerDetails[1],
              sellerHKID: sellerDetails[2],
            });
          }
        }

        setPendingLands(_pendingLands);
      } catch (error) {
        alert("Failed to load web3, accounts, or contract. Check console for details.");
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  const approveLand = async (landId) => {
    try {
      // Initialize Web3 with Ganache URL
      const web3 = new Web3('http://127.0.0.1:7545'); 
      const accounts = await web3.eth.getAccounts();
      const senderAccount = accounts[0]; // Get the account at index 7 from Ganache

      // Send the approval transaction
      await contract.methods.approveLand(landId).send({ from: senderAccount });

      // Refresh the list of pending lands after approval
      const landsCount = await contract.methods.getLandsCount().call();
      let _pendingLands = [];
      for (let i = 1; i <= landsCount; i++) {
        let landApproved = await contract.methods.isLandApproved(i).call();
        if (!landApproved) {
          let land = await contract.methods.getLandDetails(i).call();
          let requested = await contract.methods.isRequested(i).call();
          let approved = await contract.methods.isApproved(i).call();
          let saleApproved = await contract.methods.isSaleApproved(i).call();
          let owner = await contract.methods.getLandOwner(i).call();
          let sellerDetails = await contract.methods.getSellerDetails(owner).call();

          _pendingLands.push({
            id: land[0],
            landAddress: land[1],
            area: land[2],
            city: land[3],
            district: land[4],
            country: land[5],
            landPrice: land[6],
            propertyPID: land[7],
            requested,
            approved,
            saleApproved,
            landApproved,
            owner,
            sellerName: sellerDetails[0],
            sellerAge: sellerDetails[1],
            sellerHKID: sellerDetails[2],
          });
        }
      }

      setPendingLands(_pendingLands);
      alert("Land approved successfully: " + landId);
      navigate("/land-inspector-dashboard");
    } catch (error) {
      console.error("Error approving land:", error);
      alert("An error occurred while approving the land. Check the console for more details.");
    }
  };

  return (
    <Container
      maxWidth={false}
      style={{
        backgroundImage: `url("/bg1.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        paddingTop: "5%",
      }}
    >
      <Box
        sx={{
          width: "90%",
          backdropFilter: "blur(15px)",
          background: "rgba(255, 255, 255, 0.15)",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <Typography variant="h3" align="center" gutterBottom sx={{ color: "#000", mb: 4 }}>
          Pending Lands
        </Typography>
        <TableContainer component={Paper} sx={{ background: "rgba(255, 255, 255, 0.25)" }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>District</StyledTableCell>
                <StyledTableCell>Country</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Property ID</StyledTableCell>
                <StyledTableCell>Seller Name</StyledTableCell>
                <StyledTableCell>Seller HKID</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingLands.map((land, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{land.id}</StyledTableCell>
                  <StyledTableCell><Typography noWrap>{land.landAddress}</Typography></StyledTableCell>
                  <StyledTableCell>{land.district}</StyledTableCell>
                  <StyledTableCell>{land.country}</StyledTableCell>
                  <StyledTableCell>{land.landPrice}</StyledTableCell>
                  <StyledTableCell>{land.propertyPID}</StyledTableCell>
                  <StyledTableCell>{land.sellerName}</StyledTableCell>
                  <StyledTableCell>{land.sellerHKID}</StyledTableCell>
                  <StyledTableCell>
                    <Button variant="contained" onClick={() => approveLand(land.id)}>
                      Approve
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

export default PendingLands;
