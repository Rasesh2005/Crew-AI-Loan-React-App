import React from 'react';
import './Sidebar.css'; // Add the CSS for the sidebar

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Agent Library</div>
      <div className="description">Drag these agents onto the canvas.</div>
      
      <div 
        className="dndnode" 
        onDragStart={(event) => onDragStart(event, 'dataExtraction')} 
        draggable
      >
        Data Extraction Agent
      </div>

      <div 
        className="dndnode" 
        onDragStart={(event) => onDragStart(event, 'dataCorrelation')} 
        draggable
      >
        Data Correlation Agent
      </div>

      <div 
        className="dndnode" 
        onDragStart={(event) => onDragStart(event, 'dataAnalysis')} 
        draggable
      >
        Data Analysis Agent
      </div>

      <div 
        className="dndnode" 
        onDragStart={(event) => onDragStart(event, 'dataPreparation')} 
        draggable
      >
        Data Preparation Agent
      </div>

      <div 
        className="dndnode" 
        onDragStart={(event) => onDragStart(event, 'databaseUpdate')} 
        draggable
      >
        Database Update Agent
      </div>
    </aside>
  );
};

export default Sidebar;
