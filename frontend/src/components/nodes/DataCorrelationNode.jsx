// components/nodes/DataCorrelationNode.jsx
import React from 'react';
import { Handle } from '@xyflow/react';

const DataCorrelationNode = ({ data }) => {
  return (
    <div className="node">
      <h4>Data Correlation</h4>
      <p>Matches extracted fields to DB schema</p>
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </div>
  );
};

export default DataCorrelationNode;
