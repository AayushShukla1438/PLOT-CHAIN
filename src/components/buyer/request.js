import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { Box, Container, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const BuyerRegistration = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [lands, setLands] = useState([]);
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

        const details = await contractInstance.methods.getBuyerDetails(accounts[1]).call();
        setBuyerDetails({
          name: details[0],
          city: details[1],
          email: details[2],
          age: details[3].toString(),
          HKID: details[4],
        });

        const landsCount = await contractInstance.methods.getLandsCount().call();
        const _lands = [];

        for (let i = 1; i <= parseInt(landsCount); i++) {
          let land = await contractInstance.methods.getLandDetails(i).call();
          let requested = await contractInstance.methods.isRequested(i).call();
          let owner = await contractInstance.methods.getLandOwner(i).call();
          let approved = await contractInstance.methods.isApproved(i).call();
          let landApprovalStatus = await contractInstance.methods.isLandApproved(i).call();
          let saleApprovalStatus = await contractInstance.methods.isSaleApproved(i).call();

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
            landApprovalStatus: landApprovalStatus,
            saleApprovalStatus: saleApprovalStatus,
          });
        }

        setLands(_lands);
        const owned = _lands.filter((land) => land.owner === accounts[1]);
        setOwnedLands(owned);
      } catch (error) {
        alert("Failed to load web3, accounts, or contract. Check console for details.");
        console.error(error);
      }
    };

    initWeb3();
  }, []);

  const makePayment = async (landId, price) => {
    try {
      const sellerAddress = await contract.methods.getLandOwner(landId).call();

      await contract.methods
        .payment(sellerAddress, landId)
        .send({ from: accounts[1], value: price, gas: "6721975" });

      alert("Payment successful: " + price);
      navigate("/buyer-dashboard");
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundImage: `url("/bg1.png")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 4,
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", md: "85%", lg: "75%" },
          backdropFilter: "blur(12px)",
          background: "rgba(255, 255, 255, 0.25)",
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          p: 4,
        }}
      >
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          Your Land Requests
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Land ID</StyledTableCell>
                <StyledTableCell>Land Address</StyledTableCell>
                <StyledTableCell>Area</StyledTableCell>
                <StyledTableCell>City</StyledTableCell>
                <StyledTableCell>District</StyledTableCell>
                <StyledTableCell>Country</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Property ID</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lands.filter((land) => land.requested).map((land, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{land.id}</StyledTableCell>
                  <StyledTableCell>
                    <Typography noWrap>{land.landAddress}</Typography>
                  </StyledTableCell>
                  <StyledTableCell>{land.area}</StyledTableCell>
                  <StyledTableCell>{land.city}</StyledTableCell>
                  <StyledTableCell>{land.district}</StyledTableCell>
                  <StyledTableCell>{land.country}</StyledTableCell>
                  <StyledTableCell>{land.landPrice}</StyledTableCell>
                  <StyledTableCell>{land.propertyPID}</StyledTableCell>
                  <StyledTableCell>
                    {land.approved ? "Approved" : "Pending Approval"}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => makePayment(land.id, land.landPrice)}
                      disabled={!land.approved}
                    >
                      {land.approved ? "Pay" : "Awaiting Approval"}
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
