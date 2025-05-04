import React, { useState, useEffect } from "react";
import LandContract from "../../artifacts/Land.json";
import getWeb3 from "../../getWeb3";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Container,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1a1a1a",
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "rgba(243, 208, 215, 0.4)",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const SellerDashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
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

        const landsCount = await contractInstance.methods.getLandsCount().call();
        const _lands = [];

        for (let i = 1; i <= parseInt(landsCount); i++) {
          const land = await contractInstance.methods.getLandDetails(i).call();
          const isApprovedByInspector = await contractInstance.methods
            .isLandApproved(i)
            .call();

          if (isApprovedByInspector) {
            const requested = await contractInstance.methods.isRequested(i).call();
            const approved = await contractInstance.methods.isApproved(i).call();
            const saleApproved = await contractInstance.methods
              .isSaleApproved(i)
              .call();
            const owner = await contractInstance.methods.getLandOwner(i).call();

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

        const ownedLands = _lands.filter((land) => land.owner === accounts[2]);
        setLandRequests(ownedLands);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    initWeb3();
  }, []);

  const getLandStatus = (land) => {
    if (!land.landApproved) return "Pending Inspection";
    if (land.landApproved && !land.requested) return "Not Requested";
    if (land.landApproved && land.requested && !land.approved)
      return "Pending Approval";
    if (land.landApproved && land.requested && land.approved && !land.saleApproved)
      return "Pending Sale Approval";
    return "Approved";
  };

  const approveLandRequest = async (landId) => {
    try {
      await contract.methods.approveRequest(landId).send({ from: accounts[2] });
      alert("Land request approved successfully: " + landId);
      navigate("/seller-dashboard");
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        backgroundImage: `url('/bg1.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: 4,
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            color: "#000",
            fontWeight: "bold",
            // textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
            mt: 6,
          }}
        >
          View and your listed lands
        </Typography>
      </Box>

      {landRequests.length === 0 ? (
        <Box
          sx={{
            backgroundColor: "rgba(255,255,255,0.85)",
            padding: 5,
            borderRadius: 3,
            textAlign: "center",
            maxWidth: 600,
            margin: "auto",
          }}
        >
          <Typography variant="h5" gutterBottom>
            No land records available
          </Typography>
          <Typography variant="body1">
            You haven't added any lands or none are approved yet.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={5}
          sx={{ borderRadius: 3, mb: 6, backgroundColor: "rgba(255,255,255,0.95)" }}
        >
          <Table sx={{ minWidth: 800 }} aria-label="land table">
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
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {landRequests.map((land, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{land.id}</StyledTableCell>
                  <StyledTableCell>{land.landAddress}</StyledTableCell>
                  <StyledTableCell>{land.area}</StyledTableCell>
                  <StyledTableCell>{land.city}</StyledTableCell>
                  <StyledTableCell>{land.district}</StyledTableCell>
                  <StyledTableCell>{land.country}</StyledTableCell>
                  <StyledTableCell>{land.landPrice}</StyledTableCell>
                  <StyledTableCell>{land.propertyPID}</StyledTableCell>
                  <StyledTableCell>{getLandStatus(land)}</StyledTableCell>
                  <StyledTableCell>
                    {land.requested && !land.approved ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => approveLandRequest(land.id)}
                      >
                        Approve
                      </Button>
                    ) : (
                      <Button variant="outlined" size="small" disabled>
                        No Action
                      </Button>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SellerDashboard;
