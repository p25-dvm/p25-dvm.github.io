# Quick Start

Get something running in under 5 minutes.

---

## 1. Initialize a project

```bash
my-project init my-first-project
cd my-first-project
```

This creates the default project layout:

```
my-first-project/
├── project.yml
├── tasks/
│   └── main.py
└── outputs/
```

---

## 2. Write your first task

Edit `tasks/main.py`:

```python
from my_project import task

@task
def greet(name: str = "world") -> str:
    """Print a greeting."""
    return f"hello, {name}"
```

---

## 3. Run it

```bash
my-project run greet
# hello, world

my-project run greet --name hacker
# hello, hacker
```

---

## 4. View outputs

Results are saved to `outputs/` by default:

```bash
cat outputs/greet.json
```

```json
{
  "task": "greet",
  "result": "hello, hacker",
  "duration_ms": 2,
  "status": "ok"
}
```

---

!!! success "You're up and running"
    From here, explore [the API reference](../reference/api.md) or check out [configuration options](../reference/configuration.md).
