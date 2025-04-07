"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Stack,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const TERMINALS: Record<string, string> = {
  terminal_A: "Terminal A",
  terminal_B: "Terminal B",
  terminal_C: "Terminal C",
  terminal_D: "Terminal D",
};

// Event interface
interface EventData {
  _id: string;
  terminal_id: string;
  timestamp: string;
  count: number;
}

interface CouchDBRow {
  id: string;
  doc: {
    _id: string;
    _rev: string;
    terminal_id: string;
    pic_id: string;
    num_ppl: number;
    timestamp_received: string;
    timestamp_processed: string;
    processing_time_ms: number;
  };
}

export default function LiveWaitTimesComponent() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Use the API route provided by Next.js which is served over HTTPS.
    const dbUrl = "/api/couchdb";
    fetch(dbUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Process the CouchDB data (assuming similar structure)
        const rows = data.rows as CouchDBRow[]; // Ideally, define a proper interface
        const eventsData: EventData[] = rows
          .filter((row) => row.doc && row.doc.num_ppl !== undefined)
          .map((row) => ({
            _id: row.id,
            terminal_id: row.doc.terminal_id,
            timestamp: row.doc.timestamp_received,
            count: row.doc.num_ppl,
          }));
        setEvents(eventsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching CouchDB data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Group events by terminal
  const grouped = events.reduce(
    (acc: { [key: string]: EventData[] }, event) => {
      if (!acc[event.terminal_id]) acc[event.terminal_id] = [];
      acc[event.terminal_id].push(event);
      return acc;
    },
    {}
  );

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
      <Typography variant="h3" gutterBottom>
        Live Wait Times
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ width: "100%", maxWidth: 800 }}>
          {Object.entries(grouped).map(([terminal, terminalEvents]) => {
            const chartData = {
              labels: terminalEvents.map((e) =>
                new Date(e.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              ),
              datasets: [
                {
                  label: "Number of People",
                  data: terminalEvents.map((e) => e.count),
                  fill: false,
                  borderColor: "rgba(63, 81, 181, 1)",
                  backgroundColor: "rgba(63, 81, 181, 0.5)",
                  tension: 0.3,
                },
              ],
            };

            return (
              <Accordion key={terminal}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {TERMINALS[terminal]}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Line data={chartData} options={{ responsive: true }} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={6}>
        <Button variant="contained" href="/" color="primary">
          Back to Home
        </Button>
      </Stack>
    </Container>
  );
}
