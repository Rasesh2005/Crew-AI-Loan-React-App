# # main.py
import io
import os
import time
from typing import Optional
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd  
import uvicorn
import json
import threading
from crew import MyCrew
app = FastAPI()
schema=False
inProgress=False

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. Change this to specific origins in production.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)
def run():
    global schema
    # Replace with your inputs, it will automatically interpolate any tasks and agents information
    inputs = {
        'json_path':"backend/temp/workflow.json",
        'data_file_path':"backend/temp/Data.csv",
        'schema_file_path': "backend/temp/Schema.csv"
    }
    MyCrew().crew().kickoff(inputs=inputs)
    with open('backend/output/output.md','a') as f:
        f.write("\n>>>>>>> **PROCESS COMPLETED**")
# Background Task Function
async def process_file(file: UploadFile,schema=False):
    try:
        # Read file contents
        contents = await file.read()  # Read the file content
        
        # Determine the file type and process accordingly
        if file.filename.endswith('.csv'):
            # If it's a CSV file, read it using `StringIO` for text-based files
            data = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        elif file.filename.endswith('.xlsx'):
            # If it's an XLSX file, read it using `BytesIO` for binary-based files
            data = pd.read_excel(io.BytesIO(contents))
        else:
            raise ValueError("Unsupported file type. Please upload a CSV or XLSX file.")
        
        # Save the DataFrame to CSV format
        temp_dir = os.path.join('backend', 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save the DataFrame to CSV format
        csv_filename = f"{"Schema" if schema else "Data"}.csv"
        file_path = os.path.join(temp_dir, csv_filename)
        data.to_csv(file_path, index=False)  # Save as CSV without the index
        print(f"Processed and saved data from {file.filename} to {csv_filename}")
    except Exception as e:
        print(f"Error processing file {file.filename}: {str(e)}")
@app.get('/output')

@app.post("/upload/")
async def upload_file(data: UploadFile = File(...), schema_file: Optional[UploadFile] = File(None)):
    global schema
    try:
        await process_file(data)
        if(schema_file): 
            await process_file(schema_file,schema=True)
            schema=True
            return {"status": "processed", "data": data.filename,"schema_file":schema_file.filename}
        else:
            schema=False
            with open("backend/temp/Schema.csv",'w') as _: pass
            return  {"status": "processed", "data": data.filename}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))
# Example Workflow Start Endpoint
@app.post("/workflow/")
async def start_workflow(workflow_data: dict):
    global inProgress
    inProgress=False
    # Example logic to handle workflow start
    print(f"Starting workflow: {workflow_data}")
    with open('backend/temp/workflow.json','w') as f:
        f.write(json.dumps(workflow_data,indent=2))
    return JSONResponse(content={"status": "success", "message": "Workflow stored successfully"})
    
@app.get("/")
async def root():
    return {"message": "Welcome to the Data Migration Workflow API"}
def run_in_thread():
    thread = threading.Thread(target=run)
    thread.start()
@app.post("/llm")
async def llm():
    global inProgress
    if not inProgress:
        print("started LLM")
        inProgress=True
        f=open('backend/output/output.md','w')
        f.close()
        run_in_thread()
    try:
        with open('backend/output/output.md') as f:
            text=f.read()
            return {"output": text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
# Run the application using Uvicorn if this script is executed directly
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
