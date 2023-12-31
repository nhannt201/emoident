import EmotionAnalyzer from "./component/EmotionAnalyzer";
import { Route, Routes } from "react-router-dom";
import React from "react";

function App() {
  return (
      <Routes>
          <Route path="/" element={<EmotionAnalyzer/>} />
      </Routes>

  );
}

export default App;
