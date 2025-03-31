"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Stack,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Import Chart.js components and react-chartjs-2
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

interface LineData {
  lineName: string;
  waitTime: string;
  confidence: string;
}

interface RowProps {
  line: LineData;
}

function Row({ line }: RowProps) {
  const [open, setOpen] = useState(false);

  // Generate some mock data for the graph
  const baseWait = parseInt(line.waitTime) || 15;
  const data = {
    labels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30"],
    datasets: [
      {
        label: "Wait Time (min)",
        data: [
          baseWait,
          baseWait + Math.floor(Math.random() * 5 - 2),
          baseWait + Math.floor(Math.random() * 5 - 2),
          baseWait + Math.floor(Math.random() * 5 - 2),
          baseWait + Math.floor(Math.random() * 5 - 2),
          baseWait + Math.floor(Math.random() * 5 - 2),
          baseWait + Math.floor(Math.random() * 5 - 2),
        ],
        fill: false,
        backgroundColor: "rgba(63, 81, 181, 0.5)",
        borderColor: "rgba(63, 81, 181, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      // title: {
      //   display: true,
      //   text: "Wait Time Over Time",
      // },
    },
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>{" "}
          {line.lineName}
        </TableCell>
        <TableCell>{line.waitTime}</TableCell>
        <TableCell>{line.confidence}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3} sx={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="subtitle1" gutterBottom>
                Wait Time Graph Over Time
              </Typography>
              {/* Center the chart using flex properties */}
              <Box
                sx={{
                  height: 200,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Line
                  data={data}
                  options={options}
                  style={{ width: "100%", maxWidth: "600px" }}
                />
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function LiveWaitTimesComponent() {
  // Mock data for demonstration
  const mockLines: LineData[] = [
    { lineName: "Terminal A - Main", waitTime: "15 min", confidence: "High" },
    {
      lineName: "Terminal B - South",
      waitTime: "30 min",
      confidence: "Medium",
    },
    { lineName: "Terminal C - East", waitTime: "10 min", confidence: "High" },
    { lineName: "Terminal D - North", waitTime: "45 min", confidence: "Low" },
  ];

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
        Live Wait Times
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Below is an example of how real-time TSA wait data could be displayed in
        the future. Click the arrow to expand each row and view a wait time
        graph.
      </Typography>

      <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", mb: 4 }}>
        <TableContainer component={Paper}>
          <Table aria-label="Mock Wait Times Table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Line Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Wait Time</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Confidence</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockLines.map((line, idx) => (
                <Row key={idx} line={line} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
      >
        <Button variant="contained" color="primary" size="large" href="/">
          Back to Home
        </Button>
      </Stack>
    </Container>
  );
}
