// import React from "react";
// import { Link } from "react-router-dom";
// import BackgroundImage from "../Assets/imgs/bg.png";
// import { Box, Typography, Container, Button } from "@mui/material";
// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";

// const LandingPage = () => {
//   return (
//     <Container
//       maxWidth={false}
//       disableGutters
//       style={{
//         backgroundColor: "#D7F5FF", // 💡 Base color of the full screen
//         width: "100vw",
//         height: "100vh",
//         position: "relative",
//         overflow: "hidden",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       {/* Background image layer */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           backgroundImage: `url(${BackgroundImage})`,
//           backgroundSize: "cover",
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "center",
//           zIndex: 0,
//         }}
//       />

//       {/* Glassy container on top */}
//       <Box
//         sx={{
//           zIndex: 1,
//           position: "absolute",
//           top: "24%",            // Move vertically (adjust this to reposition)
//           left: "28%",           // Move horizontally (adjust this to reposition)
//           width: "39%",          // ✅ Resize this to make the glass container bigger/smaller
//           height: "54%",         // ✅ Resize this to adjust height
//           backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent white
//           borderRadius: "16px",
//           boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
//           backdropFilter: "blur(12px)",
//           WebkitBackdropFilter: "blur(12px)",
//           border: "1px solid rgba(255, 255, 255, 0.18)",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "2rem",
//           textAlign: "center",
          
//         }}
//       >
//         <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
//           PlotChain
//         </Typography>

//         <Typography
//           variant="subtitle1"
//           sx={{ fontStyle: "italic", mb: 4, color: "#555" }}
//         >
//           Securing Your Ground, Block by Block - Immutable Land Registration at Your Fingertips!
//         </Typography>

//         <Typography variant="h6" sx={{ mb: 3 }}>
//           Please select your role:
//         </Typography>

//         <Box display="flex" gap={3}>
//           <Button
//             variant="contained"
//             color="primary"
//             component={Link}
//             to="/buyer"
//           >
//             Buyer
//           </Button>
//           <Button
//             variant="contained"
//             color="primary"
//             component={Link}
//             to="/seller"
//           >
//             Seller
//           </Button>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default LandingPage;



import React from "react";
import { Link } from "react-router-dom";
import BackgroundImage from "../Assets/imgs/bg.png";
import { Box, Typography, Container, Button } from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const LandingPage = () => {
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background image layer */}
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

      {/* Glassy container on top */}
      <Box
        sx={{
          zIndex: 1,
          position: "absolute",
          top: "24%",
          left: "28%",
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
          PlotChain
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ fontStyle: "italic", mb: 4, color: "#555" }}
        >
          Securing Your Ground, Block by Block - Immutable Land Registration at Your Fingertips!
        </Typography>

        <Typography variant="h6" sx={{ mb: 3 }}>
          Please select your role:
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={3}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/buyer"
            >
              Buyer
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/seller"
            >
              Seller
            </Button>
          </Box>

          {/* Pathway Fraud Detection Button */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => window.open("/pathway.html", "_blank")}
          >
            Fraud Detection (Pathway)
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LandingPage;
