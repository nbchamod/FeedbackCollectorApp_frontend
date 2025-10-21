"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";

export default function Home() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE ="http://localhost:5000";

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/feedback`);
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return alert("Please fill in all fields.");

    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.error || "Failed to submit feedback");
      }

      setName("");
      setMessage("");
      fetchFeedbacks();
    } catch (err) {
      console.error("Error submitting feedback:", err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 8 }}>
      <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Feedback Collector
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <TextField
            label="Your Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Your Feedback"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 1 }}
          >
            Submit
          </Button>
        </Box>
      </Card>

      <Typography
        variant="h5"
        sx={{ mt: 6, mb: 2, textAlign: "center", fontWeight: "bold" }}
      >
        All Feedback
      </Typography>

      {loading ? (
        <Box textAlign="center" sx={{ mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {feedbacks.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No feedback yet.
            </Typography>
          ) : (
            feedbacks.map((f) => (
              <Card
                key={f._id}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                  transition: "0.2s",
                  "&:hover": { boxShadow: 5 },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {f.name}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {f.message}
                  </Typography>
                  <Divider sx={{ mt: 1, mb: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(f.createdAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </List>
      )}
    </Container>
  );
}
