from datetime import datetime
from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from writeio import save_markdown
from crewai_tools import FileReadTool


@CrewBase
class MyCrew():
    """MatchToProposal crew"""
    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

	
    def manager(self) -> Agent:
        return Agent(
            config=self.agents_config['main_manager'],
            verbose=True,
            allow_delegation=True,
            cache=True
        )

    @agent
    def manager_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['manager'],
            tools=[FileReadTool('backend/temp/workflow.json')],
            verbose=True,
            allow_delegation=False,
            cache=True,
            max_iter=1
        )
    @agent
    def data_migration_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['data_migrator'],
            tools=[FileReadTool()],
            verbose=True,
            allow_delegation=False,
            cache=True,
            max_iter=1
            
        )
    @agent
    def data_correlation_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['data_correlator'],
            tools=[FileReadTool()],
            verbose=True,
            allow_delegation=False,
            cache=True,
            max_iter=1
        )
    @agent
    def data_analyser_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['data_analyser'],
            tools=[FileReadTool()],
            verbose=True,
            allow_delegation=False,
            cache=True,
            max_iter=1
        )
    @agent
    def data_preparation_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['data_migrator'],
            tools=[FileReadTool()],
            verbose=True,
            allow_delegation=False,
            cache=True,
            max_iter=1
        )

    @task
    def management_task(self) -> Task:
        return Task(
            config=self.tasks_config['management_task'],
            agent=self.manager_agent(),
        )

    @task
    def data_migration_task(self) -> Task:
        return Task(
            config=self.tasks_config['data_migration_task'],
            agent=self.data_migration_agent()
        )
    @task
    def data_correlation_task(self) -> Task:
        return Task(
            config=self.tasks_config['data_correlation_task'],
            agent=self.data_correlation_agent()
        )
    @task
    def data_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config['data_analysis_task'],
            agent=self.data_analyser_agent()
        )
    @task
    def data_preparation_task(self) -> Task:
        return Task(
            config=self.tasks_config['data_preparation_task'],
            agent=self.data_preparation_agent()
        )

    @crew
    def crew(self) -> Crew:
        """Creates the MatchToProposal crew"""
        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
			task_callback=save_markdown,
            verbose=True,
            process=Process.hierarchical,
            manager_agent=self.manager(),
            memory=True,
            planning=True
        )
