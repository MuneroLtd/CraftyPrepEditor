# YAML Quick Reference for Auto-Flow

## Common Operations

### Query Tasks

```bash
# Get all tasks
yq '.tasks[]' .autoflow/TASK.yml

# Get next PENDING task
yq '.tasks[] | select(.status == "PENDING") | .id' .autoflow/TASK.yml | head -1

# Get task by ID
yq '.tasks[] | select(.id == "task-022")' .autoflow/TASK.yml

# Get tasks by status
yq '.tasks[] | select(.status == "REVIEWFIX")' .autoflow/TASK.yml

# Get task title and status
yq '.tasks[] | "\(.id): \(.title) [\(.status)]"' .autoflow/TASK.yml
```

### Update Tasks

```bash
# Update task status
yq -i '(.tasks[] | select(.id == "task-022") | .status) = "PLANNED"' .autoflow/TASK.yml

# Mark acceptance criterion as complete
yq -i '(.tasks[] | select(.id == "task-022") | .acceptance_criteria[0].completed) = true' .autoflow/TASK.yml

# Update sprint progress
yq -i '.sprint.progress.completed = 2' .autoflow/TASK.yml
```

### Query Sprints

```bash
# Get all sprints
yq '.sprints[]' .autoflow/SPRINTS.yml

# Get current sprint
yq '.project.current_sprint' .autoflow/SPRINTS.yml

# Get sprint by ID
yq '.sprints[] | select(.id == 3)' .autoflow/SPRINTS.yml

# Get ACTIVE sprint
yq '.sprints[] | select(.status == "ACTIVE")' .autoflow/SPRINTS.yml

# List all tasks in Sprint 1
yq '.sprints[0].tasks[]' .autoflow/SPRINTS.yml
```

### Query Completed Tasks

```bash
# Get all completed tasks
yq '.tasks[]' .autoflow/COMPLETED_TASKS.yml

# Get task by ID
yq '.tasks[] | select(.id == "task-001")' .autoflow/COMPLETED_TASKS.yml

# Get tasks by sprint
yq '.tasks[] | select(.sprint == "Sprint 1 - Foundation & Core Processing")' .autoflow/COMPLETED_TASKS.yml

# Get commit hashes
yq '.tasks[] | "\(.id): \(.commit)"' .autoflow/COMPLETED_TASKS.yml
```

## File Structure

### SPRINTS.yml

```yaml
project:
  name: "Project Name"
  total_sprints: 7
  current_sprint: 3
  last_updated: "2025-10-06"

sprints:
  - id: 1
    goal: "Sprint Goal"
    status: COMPLETE
    duration: "Week 1-2"
    progress:
      completed: 10
      total: 10
    deliverables:
      - "Deliverable 1"
      - "Deliverable 2"
    tasks:
      - id: task-001
        status: COMMITTED
        title: "Task Title"
    completed: "2025-10-04"
```

### TASK.yml

```yaml
sprint:
  id: 3
  goal: "Sprint Goal"
  duration: "Week 5-6"
  status: ACTIVE
  progress:
    completed: 1
    total: 3
  last_updated: "2025-10-06T18:18:00Z"

tasks:
  - id: task-021
    title: "Task Title"
    priority: MEDIUM
    status: REVIEWFIX
    estimated: "5 hours"
    description: "Task description"
    acceptance_criteria:
      - criterion: "Criterion text"
        completed: false
    blockers: null
    documentation:
      - title: "Doc Title"
        path: "path/to/doc.md"
```

### COMPLETED_TASKS.yml

```yaml
project:
  name: "Project Name"
  last_updated: "2025-10-06T18:18:00Z"

tasks:
  - id: task-001
    title: "Task Title"
    status: COMMITTED
    completed: "2025-10-04"
    estimated: "4 hours"
    actual: "~4 hours"
    sprint: "Sprint 1 - Foundation & Core Processing"
    description: "Task description"
    deliverables:
      - "Deliverable 1"
      - "Deliverable 2"
    commit: "0318d5a"
    quality_metrics:
      tests_passing: "5/5 (100%)"
      code_coverage: "≥80%"
```

## yq Tips

### Basic Syntax

- `.` - Root
- `.field` - Access field
- `.array[]` - Iterate array
- `select(.field == "value")` - Filter
- `|` - Pipe
- `-i` - In-place edit

### Output Formats

```bash
# YAML output (default)
yq '.tasks[]' file.yml

# JSON output
yq -o=json '.tasks[]' file.yml

# Pretty JSON
yq -o=json -I=2 '.tasks[]' file.yml

# Compact
yq -o=json -c '.tasks[]' file.yml
```

### Multiple Files

```bash
# Merge files
yq eval-all 'select(fileIndex == 0) * select(fileIndex == 1)' file1.yml file2.yml

# Compare
yq eval-all 'select(fileIndex == 0) == select(fileIndex == 1)' file1.yml file2.yml
```

## Status Constants

### Task Status
- `PENDING` - Awaiting planning
- `PLANNED` - Ready for implementation
- `REVIEW` - Ready for code review
- `REVIEWFIX` - Issues found, needs fixes
- `TEST` - Ready for testing
- `VERIFY` - Ready for E2E verification
- `COMPLETE` - All checks passed
- `COMMITTED` - Archived and committed

### Sprint Status
- `PENDING` - Not started
- `ACTIVE` - In progress
- `COMPLETE` - Finished

## Resources

- **yq Documentation**: https://mikefarah.gitbook.io/yq/
- **YAML Specification**: https://yaml.org/spec/1.2.2/
- **Auto-Flow Standards**: `.autoflow/STANDARDS.md` (in global config)
