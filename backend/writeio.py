from datetime import datetime
def save_markdown(task_output):
    # print(task_output)
    # Get today's date in the format YYYY-MM-DD
    today_date = datetime.now().strftime('%d-%m-%y %H:%M:%S')
    print(today_date)
    # Set the filename with today's date
    filename = f"{today_date}.md"
    filename="output.md"
    # Write the task output to the markdown file
    with open ('backend/output/'+filename, 'a') as file: file.write(f'\n{task_output}')
    print(f"Markdown saved as {filename}")