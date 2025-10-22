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
  Box,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default function Home() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const API_BASE = "http://localhost:5000";

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

    if (!name.trim() || !message.trim()) {
      setError("Please fill in both Name and Feedback fields.");
      return;
    }

    setOpenConfirm(true);
  };

  const confirmSubmit = async () => {
    setOpenConfirm(false);
    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to submit feedback");
        return;
      }

      setName("");
      setMessage("");
      setSuccess(true);
      fetchFeedbacks();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Something went wrong. Please try again later.");
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
            error={!name.trim() && !!error}
          />
          <TextField
            label="Your Feedback"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={!message.trim() && !!error}
            helperText={!message.trim() && !!error ? "Required field" : ""}
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
                  backgroundColor: "#e3f2fd", // 🌊 light blue background
                  "&:hover": {
                    boxShadow: 5,
                    backgroundColor: "#bbdefb", // slightly darker blue on hover
                  },
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

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError("")}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Feedback submitted successfully!
        </Alert>
      </Snackbar>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit your feedback?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={confirmSubmit} variant="contained" color="primary">
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
