"use client";

import React, { useState, useEffect } from "react";
import Grid from "@mui/material/GridLegacy";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
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

// Terminal names mapping
const TERMINALS: Record<string, string> = {
  terminal_A: "Terminal A",
  terminal_B: "Terminal B",
  terminal_C: "Terminal C",
  terminal_D: "Terminal D",
};

// Color mapping for each terminal's graph
const COLORS: Record<string, { border: string; background: string }> = {
  terminal_A: {
    border: "rgba(0, 109, 218, 1)",
    background: "rgba(0, 109, 218, 0.5)",
  },
  terminal_B: {
    border: "rgba(0, 130, 161, 1)",
    background: "rgba(0, 130, 161, 0.5)",
  },
  terminal_C: {
    border: "rgba(153, 201, 245, 1)",
    background: "rgba(153, 201, 245, 0.5)",
  },
  terminal_D: {
    border: "rgba(63, 81, 181, 1)",
    background: "rgba(63, 81, 181, 0.5)",
  },
};

// Define a custom interface for data points used in the chart
interface DataPoint {
  x: string;
  y: number;
  count: number;
}

// Event interface updated to include processingTimeMs
interface EventData {
  _id: string;
  terminal_id: string;
  timestamp: string;
  count: number;
  processingTimeMs?: number;
}

interface CouchDBRow {
  id: string;
  doc: {
    _id: string;
    _rev: string;
    terminal_id: string;
    head_count: number;
    timestamp: string;
    processing_time_ms?: number;
  };
}

export default function LiveWaitTimesComponent() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback multiplier if processing time is not available (in minutes per person)
  const waitMultiplier = 1.7;
  // Scaling factor to adjust the processingTimeMs if needed
  const processingTimeScalingFactor = 2; 

  const fetchData = () => {
    const dbUrl = "/api/couchdb";
    fetch(dbUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const rows = data.rows as CouchDBRow[];
        const eventsData: EventData[] = rows
          .filter((row) => row.doc && row.doc.head_count !== undefined)
          .map((row) => ({
            _id: row.id,
            terminal_id: row.doc.terminal_id,
            timestamp: row.doc.timestamp,
            count: row.doc.head_count,
            processingTimeMs: row.doc.processing_time_ms,
          }));
        setEvents(eventsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching CouchDB data:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
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

  const cutoffTime = new Date(Date.now() - 1 * 3600 * 1000);

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        py: 4,
      }}
    >
      {/* Header with Back button on the left and centered title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Button variant="contained" color="primary" href="/">
          Back to Home
        </Button>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ flexGrow: 1, textAlign: "center" }}
        >
          Live Wait Times
        </Typography>
        {/* Empty Box to balance the layout */}
        <Box sx={{ width: 120 }} />
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ width: "100%", maxWidth: 1500 }}>
          <Grid container spacing={2}>
            {Object.entries(grouped).map(([terminal, terminalEvents]) => {
              // Filter events to only include ones newer than cutoffTime
              const filteredEvents = terminalEvents.filter(
                (e) => new Date(e.timestamp) >= cutoffTime
              );

              // Build the data points using the filtered events
              const dataPoints = filteredEvents.map((e) => {
                const estimatedTime = e.processingTimeMs
                  ? parseFloat(
                      (
                        (e.count *
                          e.processingTimeMs *
                          processingTimeScalingFactor) /
                        60000
                      ).toFixed(1)
                    )
                  : parseFloat((e.count * waitMultiplier).toFixed(1));
                return {
                  x: new Date(e.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                  y: estimatedTime,
                  count: e.count,
                };
              });

              // Determine the current wait time from the latest data point, if available
              const currentWaitTime =
                dataPoints.length > 0
                  ? dataPoints[dataPoints.length - 1].y
                  : "N/A";

              const colors = COLORS[terminal] || {
                border: "rgba(63, 81, 181, 1)",
                background: "rgba(63, 81, 181, 0.5)",
              };

              const chartData = {
                datasets: [
                  {
                    label: "Estimated Wait Time (min)",
                    data: dataPoints,
                    fill: false,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    tension: 0.3,
                  },
                ],
              };

              const chartOptions: ChartOptions<"line"> = {
                responsive: true,
                scales: {
                  x: {
                    type: "category" as const,
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context: TooltipItem<"line">): string {
                        const dataPoint = context.raw as DataPoint;
                        return `Wait Time: ${dataPoint.y} min (People in line: ${dataPoint.count})`;
                      },
                    },
                  },
                },
              };

              return (
                <Grid item xs={12} sm={6} key={terminal}>
                  <Box
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 1,
                      p: 2,
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {TERMINALS[terminal] || terminal}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        Estimated wait time: {currentWaitTime} min
                      </Typography>
                    </Box>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
