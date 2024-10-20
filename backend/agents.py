from crewai import Agent
from textwrap import dedent
from langchain.llms import OpenAI, Ollama
from langchain_openai import ChatOpenAI
from crewai_tools import CSVSearchTool
from dotenv import load_dotenv
import os
import json
load_dotenv()
class MyAgents:
    def __init__(self,df):
        self.csv_rag_tool=CSVSearchTool()
        # self.OpenAIGPT35 = ChatOpenAI(model_name="gpt-3.5-turbo",api_key=os.environ.get("OPENAI_API_KEY"), temperature=0.7)
        self.OpenAIGPT4 = ChatOpenAI(model_name="gpt-4",api_key=os.environ.get("OPENAI_API_KEY"), temperature=0.7)
        self.Ollama = Ollama(model="openhermes")
        self.df=df
    def data_extraction_agent(self):
        '''
        Make it Link to database schemas as well.. also reporting missing and extra info.. fill database as infered..
        '''
        return Agent(
            role="Data Extraction Agent",
            backstory=dedent("""
                As a data migration solution, I specialize in gathering data from a provided spreadsheet. My key role is to extract relevant information from the file and make it accessible for other agents to process.
            """),
            goal=dedent("""
                My goal is to extract and store key information from dataframe in memory, identify relevant data columns (e.g., OrigUPB, PropertyType), and ensure the data is ready for further analysis or correlation.
            """),
            tools=[self.csv_rag_tool],
            memory=True,
            allow_delegation=False,
            verbose=True,
            llm=self.OpenAIGPT4,
        )

    def data_correlation_agent(self):
        return Agent(
            role="Data Correlation Agent",
            backstory=dedent("""
                As part of the data migration process, I correlate the extracted data with the target database schema to ensure the data is properly mapped and ready for migration.
            """),
            goal=dedent("""
                My goal is to compare extracted data against the database schema, flag any unmatched fields, and store the correlated data in a structure suitable for transformation or migration.
            """),
            tools=[CSVSearchTool()],
            allow_delegation=False,
            memory=True,
            verbose=True,
            llm=self.OpenAIGPT4,
        )

    def data_analysis_agent(self):
        return Agent(
            role="Data Analysis Agent",
            backstory=dedent("""
                I am tasked with analyzing correlated data for inconsistencies, missing fields, and formatting errors, ensuring the data is clean and validated before it moves to the next phase.
            """),
            goal=dedent("""
                My goal is to detect and log data anomalies, suggest possible corrections, and ensure that all data quality issues are flagged and fixed for a smooth migration.
            """),
            tools=[CSVSearchTool()],
            allow_delegation=False,
            verbose=True,
            llm=self.OpenAIGPT4,
        )

    def data_preparation_agent(self):
        return Agent(
            role="Data Preparation Agent",
            backstory=dedent("""
                After the data is analyzed and validated, I prepare it for insertion into the target database by transforming it to match the database schema and ensuring it’s ready for execution.
            """),
            goal=dedent("""
                My goal is to transform the cleaned data into the correct formats, generate SQL or JSON data structures, and log the data's readiness for migration, ensuring the migration can proceed without errors.
            """),
            tools=[self.csv_rag_tool],
            allow_delegation=False,
            verbose=True,
            llm=self.OpenAIGPT4,
        )

    def configuration_agent(self):
        return Agent(
            role="Configurable Values Agent",
            backstory=dedent("""
                As part of the data migration system, I ensure that certain values can be easily configured without modifying the underlying code. This allows for flexibility in how the data is processed.
            """),
            goal=dedent("""
                My goal is to provide a configurable interface for transformation logic and ensure that key parameters, such as dates or numeric values, can be adjusted dynamically during the migration process.
            """),
            tools=[self.csv_rag_tool],
            allow_delegation=False,
            verbose=True,
            llm=self.OpenAIGPT4,
        )
