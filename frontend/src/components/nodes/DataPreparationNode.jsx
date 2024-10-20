// components/nodes/DataPreparationNode.jsx
import React from 'react';
import { Handle } from '@xyflow/react';

const DataPreparationNode = ({ data }) => {
  return (
    <div className="node">
      <h4>Data Preparation</h4>
      <p>Prepares validated data for database migration</p>
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </div>
  );
};

export default DataPreparationNode;
