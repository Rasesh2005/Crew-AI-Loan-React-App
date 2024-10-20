// components/nodes/DataAnalysisNode.jsx
import React from 'react';
import { Handle } from '@xyflow/react';

const DataAnalysisNode = ({ data }) => {
  return (
    <div className="node">
      <h4>Data Analysis</h4>
      <p>Analyzes data for inconsistencies and missing values</p>
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </div>
  );
};

export default DataAnalysisNode;
