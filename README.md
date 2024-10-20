# Workflow handler with CrewAI and ReactFlow
This application is an app made using Crew AI that takes input a datasheet and a Database schema. It employs agents as provided in the ReactFlow interface to process the data and provide appropriate output. The application is designed to handle complex workflows and provide efficient solutions.

## How to Run

### Frontend
The `frontend` folder contains a React application. To run the application, navigate to the `frontend` directory and run the following commands:

```bash
cd frontend
npm install
npm start
cd ..

```

The application will start on `http://localhost:3000`.

### Backend
The `backend` folder contains a Python application. To run the application, navigate to the `backend` directory and run the following command(Make Sure to get an OPENAI API key beforehand):

```bash
touch .env
echo "OPENAI_API_KEY=\"YOUR_API_KEY_HERE\"" >> .env
echo "OPENAI_MODEL_NAME=gpt-4-turbo" >> .env
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
python3 main.py
```

The application will start on `http://localhost:8000`.

## How to Contribute
1. Fork the repository
2. Create a new branch (`git checkout -b feature`)
3. Make the appropriate changes in the files
4. Add changes to reflect the changes made
5. Commit your changes (`git commit -am 'Add new feature'`)
6. Push to the branch (`git push origin feature`)
7. Create a Pull Request

Please make sure to update tests as appropriate.
