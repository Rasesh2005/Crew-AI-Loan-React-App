import React, { useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react'; // Ensure to import necessary components
import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';
import DataExtractionNode from './nodes/DataExtractionNode';
import DataCorrelationNode from './nodes/DataCorrelationNode';
import DataAnalysisNode from './nodes/DataAnalysisNode';
import DataPreparationNode from './nodes/DataPreparationNode';
import DatabaseUpdateNode from './nodes/DatabaseUpdateNode';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique node IDs
import './WorkflowBuilder.css'; // Import the CSS for better theming

const nodeTypes = {
    dataExtraction: DataExtractionNode,
    dataCorrelation: DataCorrelationNode,
    dataAnalysis: DataAnalysisNode,
    dataPreparation: DataPreparationNode,
    databaseUpdate: DatabaseUpdateNode,
};

const WorkflowBuilder = ({ onNext }) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedElements, setSelectedElements] = useState([]); // Track selected elements
    const [isDragging, setIsDragging] = useState(false); // Handle dragging state
    const navigate = useNavigate();

    const onNodesChange = useCallback(
        (changes) => {
            const newNodes = applyNodeChanges(changes, nodes);
            setNodes(newNodes);
        },
        [nodes],
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
    );

    const onSelect = (event, element) => {
        event.stopPropagation(); // Prevent default event
        const isSelected = selectedElements.some(el => el.id === element.id);

        // Toggle selection
        if (isSelected) {
            setSelectedElements((prev) => prev.filter(el => el.id !== element.id));
        } else {
            setSelectedElements((prev) => [...prev, element]);
        }

        // Update styles based on selection
        const updatedNodes = nodes.map(node => {
            if (node.id === element.id) {
                return {
                    ...node,
                    selected: !isSelected, // Toggle selected state
                };
            }
            return node;
        });
        setNodes(updatedNodes);
    };

    const onDrop = useCallback((event) => {
        event.preventDefault();
        const reactFlowBounds = event.target.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        const position = {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        };

        const newNode = {
            id: uuidv4(),
            type,
            position,
            data: { label: `${type} Node` },
            selected: false, // Initialize selected state
        };

        setNodes((nds) => nds.concat(newNode));
        setIsDragging(false); // Reset dragging state after drop
    }, []);

    const onSaveWorkflow = async () => {
        console.log("Workflow saved:", { nodes, edges });
        sessionStorage.setItem('workflow', JSON.stringify({ nodes, edges }));
        try {
            const response = await fetch('http://127.0.0.1:8000/workflow/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nodes, edges }), // Send nodes and edges as payload
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Parse the JSON response
            const schemaRequired = nodes.some(node => node.type === 'dataPreparation' || node.type === 'dataCorrelation');
            navigate('/upload', { state: { schemaRequired } });
            onNext();
        } catch (error) {
            console.error('Error saving workflow:', error);
        }
    };

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ 
            ...params, 
            markerEnd: { type: 'arrowclosed' },
            style: { stroke: '#333', strokeWidth: 2 } // Set arrow color and thickness
        }, eds)),
        []
    );

    return (
        <div className="workflow-builder-wrapper">
            <div className="workflow-builder-content">
                <Sidebar />
                <div
                    className={`workflow-dropzone ${isDragging ? 'dragging' : ''}`} 
                    onDragOver={(event) => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = 'move';
                        setIsDragging(true); // Set dragging state to true
                    }}
                    onDragLeave={() => setIsDragging(false)} // Reset dragging state on leave
                    onDrop={onDrop}
                >
                    <ReactFlow
                        nodes={nodes.map(node => ({
                            ...node,
                            className: node.selected ? 'selected-node' : 'node' // Apply 'selected-node' class if selected
                        }))}
                        edges={edges.map(edge => ({
                            ...edge,
                            markerEnd: { type: 'arrowclosed', color: '#333' },
                            style: { stroke: '#333', strokeWidth: 2 } // Ensure all edges have the desired style
                        }))}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect} // Handle edge creation
                        nodeTypes={nodeTypes}
                        onNodeClick={onSelect} // Handle node selection
                        style={{ width: '100%', height: '100%' }}
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
            </div>

            <div className="save-button-container">
                <button className="save-button" onClick={onSaveWorkflow}>
                    Save Workflow
                </button>
            </div>
        </div>
    );
};

export default WorkflowBuilder;
