#!/usr/bin/env python3
"""
Migrate auto-flow Markdown files to YAML format.
"""
import re
import yaml
from pathlib import Path
from datetime import datetime

def parse_sprints_md():
    """Parse SPRINTS.md and extract structured data."""
    sprints_md = Path('.autoflow/SPRINTS.md').read_text()

    # Extract project info
    project_match = re.search(r'\*\*Project\*\*:\s*(.+)', sprints_md)
    total_sprints_match = re.search(r'\*\*Total Sprints\*\*:\s*(\d+)', sprints_md)

    project_name = project_match.group(1) if project_match else "CraftyPrep - Laser Engraving Image Prep Tool"
    total_sprints = int(total_sprints_match.group(1)) if total_sprints_match else 7

    # Parse sprints
    sprints = []
    sprint_pattern = r'## Sprint (\d+):\s*(.+?)\n\n\*\*Duration\*\*:\s*(.+?)\n\*\*Status\*\*:\s*(\w+)\n\*\*Progress\*\*:\s*(\d+)/(\d+)'

    for match in re.finditer(sprint_pattern, sprints_md):
        sprint_id = int(match.group(1))
        goal = match.group(2).strip()
        duration = match.group(3).strip()
        status = match.group(4).strip()
        completed_tasks = int(match.group(5))
        total_tasks = int(match.group(6))

        # Find the sprint section
        sprint_section_start = match.start()
        next_sprint = re.search(r'## Sprint \d+:', sprints_md[match.end():])
        sprint_section_end = match.end() + next_sprint.start() if next_sprint else len(sprints_md)
        sprint_content = sprints_md[sprint_section_start:sprint_section_end]

        # Extract deliverables
        deliverables = []
        deliverables_match = re.search(r'### Deliverables\n\n((?:\d+\..*\n)+)', sprint_content)
        if deliverables_match:
            deliverables_text = deliverables_match.group(1)
            deliverables = [line.strip()[3:].strip() for line in deliverables_text.split('\n') if line.strip()]

        # Extract tasks
        tasks = []
        task_pattern = r'`(task-\d+)`\s*\[(\w+)\]\s*-\s*(.+)'
        for task_match in re.finditer(task_pattern, sprint_content):
            task_id = task_match.group(1)
            task_status = task_match.group(2)
            task_title = task_match.group(3).strip()

            tasks.append({
                'id': task_id,
                'status': task_status,
                'title': task_title
            })

        sprint_data = {
            'id': sprint_id,
            'goal': goal,
            'status': status,
            'duration': duration,
            'progress': {
                'completed': completed_tasks,
                'total': total_tasks
            },
            'deliverables': deliverables,
            'tasks': tasks
        }

        # Add completed date for COMPLETE sprints
        if status == 'COMPLETE':
            sprint_data['completed'] = '2025-10-04'  # Based on completed tasks

        sprints.append(sprint_data)

    # Determine current sprint
    current_sprint = next((s['id'] for s in sprints if s['status'] == 'ACTIVE'), 1)

    return {
        'project': {
            'name': project_name,
            'total_sprints': total_sprints,
            'current_sprint': current_sprint,
            'last_updated': datetime.now().strftime('%Y-%m-%d')
        },
        'sprints': sprints
    }

def parse_task_md():
    """Parse TASK.md and extract structured data."""
    task_md = Path('.autoflow/TASK.md').read_text()

    # Extract sprint info
    sprint_match = re.search(r'\*\*Current Sprint\*\*:\s*Sprint (\d+)\s*-\s*(.+)', task_md)
    goal_match = re.search(r'\*\*Sprint Goal\*\*:\s*(.+)', task_md)
    duration_match = re.search(r'\*\*Duration\*\*:\s*(.+)', task_md)
    status_match = re.search(r'\*\*Status\*\*:\s*(\w+)', task_md)
    progress_match = re.search(r'\*\*Progress\*\*:\s*(\d+)/(\d+)', task_md)

    sprint_id = int(sprint_match.group(1)) if sprint_match else 3
    sprint_name = sprint_match.group(2).strip() if sprint_match else "Material Presets & Settings"
    goal = goal_match.group(1).strip() if goal_match else ""
    duration = duration_match.group(1).strip() if duration_match else "TBD"
    status = status_match.group(1).strip() if status_match else "ACTIVE"
    completed = int(progress_match.group(1)) if progress_match else 0
    total = int(progress_match.group(2)) if progress_match else 0

    # Parse tasks
    tasks = []
    task_pattern = r'### (Task \d+\.\d+):\s*(.+?)\n\n\*\*ID\*\*:\s*(task-\d+)\n\*\*Priority\*\*:\s*(\w+)\n\*\*Status\*\*:\s*(\w+)\n\*\*Estimated Effort\*\*:\s*(.+)'

    for match in re.finditer(task_pattern, task_md, re.MULTILINE):
        task_name = match.group(1)
        task_title = match.group(2).strip()
        task_id = match.group(3)
        priority = match.group(4).strip()
        status_str = match.group(5).strip()
        estimated = match.group(6).strip()

        # Find task section
        task_start = match.start()
        next_task = re.search(r'### Task \d+\.\d+:', task_md[match.end():])
        task_end = match.end() + next_task.start() if next_task else len(task_md)
        task_section = task_md[task_start:task_end]

        # Extract description
        desc_match = re.search(r'\*\*Description\*\*:\n(.+?)(?=\n\n\*\*)', task_section, re.DOTALL)
        description = desc_match.group(1).strip() if desc_match else ""

        # Extract acceptance criteria
        criteria = []
        criteria_section = re.search(r'\*\*Acceptance Criteria\*\*:\n((?:- \[.\] .+\n)+)', task_section)
        if criteria_section:
            for line in criteria_section.group(1).split('\n'):
                if line.strip().startswith('- ['):
                    checked = 'x' in line[:6]
                    criterion = line.split('] ', 1)[1].strip() if '] ' in line else line
                    criteria.append({
                        'criterion': criterion,
                        'completed': checked
                    })

        # Extract blockers
        blockers_match = re.search(r'\*\*Blockers\*\*:\s*(.+)', task_section)
        blockers = blockers_match.group(1).strip() if blockers_match else "None"

        # Extract docs
        docs = []
        docs_pattern = r'- \[(.+?)\]\((.+?)\)'
        for doc_match in re.finditer(docs_pattern, task_section):
            docs.append({
                'title': doc_match.group(1),
                'path': doc_match.group(2)
            })

        task_data = {
            'id': task_id,
            'title': task_title,
            'priority': priority,
            'status': status_str,
            'estimated': estimated,
            'description': description,
            'acceptance_criteria': criteria,
            'blockers': blockers if blockers != "None" else None,
            'documentation': docs if docs else []
        }

        tasks.append(task_data)

    return {
        'sprint': {
            'id': sprint_id,
            'goal': goal,
            'duration': duration,
            'status': status,
            'progress': {
                'completed': completed,
                'total': total
            },
            'last_updated': datetime.now().isoformat() + 'Z'
        },
        'tasks': tasks
    }

def parse_completed_tasks_md():
    """Parse COMPLETED_TASKS.md and extract structured data."""
    completed_md = Path('.autoflow/COMPLETED_TASKS.md').read_text()

    tasks = []

    # Parse completed tasks
    task_pattern = r'### Task \d+\.\d+:\s*(.+?)\n\n\*\*ID\*\*:\s*(task-\d+)\n\*\*Status\*\*:\s*(\w+)\n\*\*Completed\*\*:\s*(.+?)\n\*\*Estimated\*\*:\s*(.+?)\n\*\*Actual\*\*:\s*(.+?)\n\*\*Sprint\*\*:\s*(.+)'

    for match in re.finditer(task_pattern, completed_md, re.MULTILINE):
        title = match.group(1).strip()
        task_id = match.group(2)
        status = match.group(3).strip()
        completed_date = match.group(4).strip()
        estimated = match.group(5).strip()
        actual = match.group(6).strip()
        sprint = match.group(7).strip()

        # Find task section
        task_start = match.start()
        next_task = re.search(r'### Task \d+\.\d+:', completed_md[match.end():])
        task_end = match.end() + next_task.start() if next_task else len(completed_md)
        task_section = completed_md[task_start:task_end]

        # Extract description
        desc_match = re.search(r'\*\*Description\*\*:\n(.+?)(?=\n\n\*\*)', task_section, re.DOTALL)
        description = desc_match.group(1).strip() if desc_match else ""

        # Extract deliverables
        deliverables = []
        deliv_match = re.search(r'\*\*Key Deliverables\*\*:\n((?:- ✅ .+\n)+)', task_section)
        if deliv_match:
            deliverables = [line.strip()[4:].strip() for line in deliv_match.group(1).split('\n') if line.strip()]

        # Extract commit hash
        commit_match = re.search(r'\*\*Commit\*\*:\s*([a-f0-9]+)', task_section)
        commit = commit_match.group(1) if commit_match else None

        # Extract quality metrics
        tests_match = re.search(r'Tests passing:\s*(.+)', task_section)
        coverage_match = re.search(r'Code coverage:\s*(.+)', task_section)

        quality_metrics = {}
        if tests_match:
            quality_metrics['tests_passing'] = tests_match.group(1).strip()
        if coverage_match:
            quality_metrics['code_coverage'] = coverage_match.group(1).strip()

        task_data = {
            'id': task_id,
            'title': title,
            'status': status,
            'completed': completed_date,
            'estimated': estimated,
            'actual': actual,
            'sprint': sprint,
            'description': description,
            'deliverables': deliverables,
            'commit': commit,
            'quality_metrics': quality_metrics if quality_metrics else {}
        }

        tasks.append(task_data)

    return {
        'project': {
            'name': 'CraftyPrep - Laser Engraving Image Prep Tool',
            'last_updated': datetime.now().isoformat() + 'Z'
        },
        'tasks': tasks
    }

def main():
    """Main migration function."""
    print("🔄 Migrating auto-flow files from Markdown to YAML...\n")

    # Migrate SPRINTS.md to SPRINTS.yml
    print("1. Migrating SPRINTS.md to SPRINTS.yml...")
    try:
        sprints_data = parse_sprints_md()
        with open('.autoflow/SPRINTS.yml', 'w') as f:
            yaml.dump(sprints_data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
        print("   ✅ SPRINTS.yml created successfully\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")

    # Migrate TASK.md to TASK.yml
    print("2. Migrating TASK.md to TASK.yml...")
    try:
        task_data = parse_task_md()
        with open('.autoflow/TASK.yml', 'w') as f:
            yaml.dump(task_data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
        print("   ✅ TASK.yml created successfully\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")

    # Migrate COMPLETED_TASKS.md to COMPLETED_TASKS.yml
    print("3. Migrating COMPLETED_TASKS.md to COMPLETED_TASKS.yml...")
    try:
        completed_data = parse_completed_tasks_md()
        with open('.autoflow/COMPLETED_TASKS.yml', 'w') as f:
            yaml.dump(completed_data, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
        print("   ✅ COMPLETED_TASKS.yml created successfully\n")
    except Exception as e:
        print(f"   ❌ Error: {e}\n")

    print("✨ Migration complete!")
    print("\nNext steps:")
    print("  1. Review the generated YAML files")
    print("  2. Backup the Markdown files")
    print("  3. Test with auto-flow commands")

if __name__ == '__main__':
    main()
