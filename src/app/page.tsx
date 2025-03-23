// import Image from "next/image";
import { Container, Typography, Button, Stack } from "@mui/material";

export const metadata = {
  title: "QueueView",
  description: "Live TSA-line wait tracker.",
};

export default function Home() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        py: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      {/* <Box sx={{ mb: 4 }}>
        Use your own logo here
        <Image
          src="/queueview.svg"
          alt="QueueView Logo"
          width={180}
          height={38}
          priority
        />
      </Box> */}

      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to QueueView
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Monitor live TSA-line wait times in real-time.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        sx={{ mb: 6 }}
      >
        <Button variant="contained" color="primary" size="large" href="#live">
          View Live Wait Times
        </Button>
        <Button variant="outlined" color="primary" size="large" href="#learn">
          Learn More
        </Button>
      </Stack>
    </Container>
  );
}
