import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
} from "@mui/material";
import GaugeChart from "react-gauge-chart";
import "./App.css"; // Import CSS file

const App = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [history, setHistory] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [bmiCategory, setBmiCategory] = useState("");
  const [gaugePercent, setGaugePercent] = useState(0); // Ensure arrow starts at 0

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("bmiHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const calculateBMI = () => {
    if (!height || !weight) return;
    const bmiValue = (weight / ((height / 100) ** 2)).toFixed(1);
    setBmi(bmiValue);

    let category = "";
    if (bmiValue < 18.5) category = "Underweight";
    else if (bmiValue < 24.9) category = "Normal";
    else if (bmiValue < 29.9) category = "Overweight";
    else category = "Obese";

    setBmiCategory(category);

    // Ensure gauge updates only on button click
    const newGaugePercent = Math.min(Math.max((bmiValue - 16) / (40 - 16), 0), 1);
    setGaugePercent(newGaugePercent);

    const newHistory = [{ id: Date.now(), bmi: bmiValue, category }, ...history];
    setHistory(newHistory);
    localStorage.setItem("bmiHistory", JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("bmiHistory");
  };

  return (
    <div className="main-container">
      <div className="content-wrapper">
        {/* BMI Calculator Section */}
        <Container maxWidth="sm" className="calculator-container">
          <Typography variant="h4" className="title">BMI Calculator</Typography>
          <Card className="card">
            <CardContent>
              <TextField
                fullWidth
                label="Height (cm)"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="input"
              />
              <TextField
                fullWidth
                label="Weight (kg)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="input"
              /><br></br><br></br>
              <Button variant="contained" onClick={calculateBMI} className="button-primary">
                Calculate BMI
              </Button>
            </CardContent>
          </Card>

          <div className="button-container">
            <Button variant="contained" onClick={() => setOpenPopup(true)} className="button-secondary">
              Show BMI History
            </Button>
            <Button variant="contained" onClick={clearHistory} className="button-danger">
              Clear BMI History
            </Button>
          </div>
        </Container>

        {/* Chart Section - Positioned to the right */}
        {bmi && (
          <div className="chart-container">
            <GaugeChart
              id="bmi-gauge"
              nrOfLevels={30}
              arcsLength={[0.15, 0.25, 0.25, 0.35]}
              colors={["#e74c3c", "#f39c12", "#f1c40f", "#2ecc71"]}
              arcWidth={0.2}
              percent={gaugePercent}
              needleColor="#34495e"
              needleBaseColor="#2c3e50"
              textColor="#ffffff"
              formatTextValue={() => `Your BMI: ${bmi}`}
            />
          </div>
        )}
      </div>

      {/* Popup Dialog for BMI History */}
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)} className="dialog">
        <DialogTitle className="dialog-title">BMI History</DialogTitle>
        <DialogContent className="dialog-content">
          <List>
            {history.length > 0 ? (
              history.map((entry) => (
                <ListItem key={entry.id} className="history-item">
                  {entry.bmi} - <span className={`bmi-category ${entry.category.toLowerCase()}`}>{entry.category}</span>
                </ListItem>
              ))
            ) : (
              <Typography>No history available</Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPopup(false)} className="button-primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default App;
