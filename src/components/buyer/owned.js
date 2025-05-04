import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom styled table cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#000",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "#333",
  },
}));

// Custom styled table row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  "&:last-child td, &:last-child th": {
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
  const [sellersCount, setSellersCount] = useState(0);

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

        const sellersCount = await contractInstance.methods
          .getSellersCount()
          .call();
        setSellersCount(sellersCount);

        const landsCount = await contractInstance.methods.getLandsCount().call();
        const _lands = [];

        for (let i = 1; i <= parseInt(landsCount); i++) {
          let land = await contractInstance.methods.getLandDetails(i).call();
          let isApprovedByInspector = await contractInstance.methods.isLandApproved(i).call();

          if (isApprovedByInspector) {
            let requested = await contractInstance.methods.isRequested(i).call();
            let approved = await contractInstance.methods.isApproved(i).call();
            let saleApproved = await contractInstance.methods.isSaleApproved(i).call();
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
              requested,
              approved,
              saleApproved,
              landApproved: isApprovedByInspector,
              owner,
            });
          }
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

  return (
    <Box
      sx={{
        backgroundImage: `url('/bg1.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          padding: "3rem 2rem",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: "#000",
            textShadow: "1px 1px 2px rgba(255,255,255,0.7)",
          }}
        >
          Owned Lands
        </Typography>

        <TableContainer component={Paper} sx={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {ownedLands.map((land, index) => (
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
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default BuyerRegistration;
