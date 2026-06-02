# Introduction

MY_PROJECT is a terminal-first automation toolkit designed for developers and operators who want predictable, scriptable infrastructure tooling.

---

## Why MY_PROJECT?

Most automation tools are built around GUIs, cloud consoles, or heavyweight agents. MY_PROJECT is different:

- **No agents** — runs on demand, not as a persistent daemon
- **No proprietary DSL** — configuration is YAML; logic is Python
- **No lock-in** — outputs standard formats (JSON, CSV, plain text)

---

## Core Concepts

### Tasks

A **task** is the smallest unit of work. Tasks are defined in plain Python and composed into pipelines.

```python
from my_project import task

@task
def hello(name: str) -> str:
    return f"hello, {name}"
```

### Pipelines

A **pipeline** chains tasks together. Each task's output feeds into the next.

```python
from my_project import pipeline

flow = pipeline([
    fetch_data,
    transform,
    export,
])
```

### Configuration

All project-level settings live in `project.yml`:

```yaml
name: my-automation
version: 1.0.0
env: production

tasks:
  timeout: 30
  retries: 3
```

---

## Project Layout

```
my-project/
├── project.yml        # project config
├── tasks/
│   ├── __init__.py
│   └── main.py        # your task definitions
├── outputs/           # default output directory
└── logs/              # run logs
```

---

!!! tip "Next step"
    Head to [Installation](installation.md) to get up and running.
