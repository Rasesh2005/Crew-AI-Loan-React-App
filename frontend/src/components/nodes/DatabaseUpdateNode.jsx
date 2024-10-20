// components/nodes/DatabaseUpdateNode.jsx
import React from 'react';
import { Handle } from '@xyflow/react';

const DatabaseUpdateNode = ({ data }) => {
  return (
    <div className="node">
      <h4>Database Update</h4>
      <p>Executes SQL commands to update the database</p>
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </div>
  );
};

export default DatabaseUpdateNode;
