// components/nodes/DataExtractionNode.jsx
import React from 'react';
import { Handle } from '@xyflow/react';

const DataExtractionNode = ({ data }) => {
  return (
    <div className="node">
      <h4>Data Extraction</h4>
      <p>Extracts key columns from datasets</p>
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </div>
  );
};

export default DataExtractionNode;
