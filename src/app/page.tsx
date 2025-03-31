import Link from "next/link";
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
        <Link href="/live" passHref>
          <Button variant="contained" color="primary" size="large">
            View Live Wait Times
          </Button>
        </Link>
        {/* <Button variant="outlined" color="primary" size="large" href="#learn">
          Learn More
        </Button> */}
      </Stack>
    </Container>
  );
}
