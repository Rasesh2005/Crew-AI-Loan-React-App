#!/usr/bin/env python
import sys
from backend.crew2 import MatchToProposalCrew


def run():
    # Replace with your inputs, it will automatically interpolate any tasks and agents information
    inputs = {
        'path_to_jobs_csv': './data/jobs.csv',
        'path_to_cv': './data/cv.md',
        'file_output': 'output.md'
    }
    MatchToProposalCrew().crew().kickoff(inputs=inputs)
run()

