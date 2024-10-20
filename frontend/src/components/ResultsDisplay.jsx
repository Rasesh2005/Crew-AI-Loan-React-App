import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Box, CircularProgress, Typography } from "@mui/material";
import Markdown from "react-markdown";
import axios from "axios";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useNavigate } from "react-router-dom"; // For navigation
import { useTheme } from "@mui/material/styles"; // To access the chosen theme

// Main Component
const LLMOutputPage = ({onPrev}) => {
  const [output, setOutput] = useState("");          // Stores LLM response
  const [loading, setLoading] = useState(true);     // Loading state
  const outputRef = useRef(output);
  const navigate = useNavigate();  // Navigation to go back
  const theme = useTheme();  // Access the current theme

  useEffect(() => {
    outputRef.current = output;
  }, [output]);

  // Handle form submission (trigger LLM request)
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Make an API request to your LLM backend
      const response = await axios.post("http://localhost:8000/llm");

      // Assuming the backend returns the output as response.data.output
      console.log(response);

      if (response.data.output !== output){
        setOutput(response.data.output.replaceAll(`\\n`, `\n`));
        console.log(outputRef.current);
      }
      if (response.data.output.length > 0) setLoading(false);
      else {
        setOutput("Loading");
      }
    } catch (error) {
      setOutput("Error: Unable to process the request");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleSubmit();
      if (outputRef.current.endsWith("**PROCESS COMPLETED**")) {
        clearInterval(intervalId); // Stop the interval
      }
    }, 2000); // 1000 milliseconds = 1 second

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 800,
        margin: "0 auto",
        backgroundColor: theme.palette.background.paper, // Theme-based background
        borderRadius: "12px",
        boxShadow: theme.shadows[3],
      }}
    >
      {/* Back to Files Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => {onPrev();navigate("/upload");}}  // Assuming "/fileupload" is your route
        sx={{ position: "absolute", top: 20, left: 20 }}
      >
        Back to Files
      </Button>

      {/* Title */}
      <Typography
        display="flex"
        justifyContent="center"
        variant="h3"
        gutterBottom
        color={theme.palette.text.primary} // Theme-based text color
      >
        Output
      </Typography>

      {/* Loading Spinner */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress color="secondary" />
        </Box>
      )}

      {/* Output Section */}
      {!loading && output && (
          <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {`${output}`}
          </Markdown>
      )}
    </Box>
  );
};

export default LLMOutputPage;
