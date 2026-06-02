# API Reference

## `@task`

Decorator that registers a function as a runnable task.

```python
from my_project import task

@task
def my_task(arg: str) -> str:
    return arg.upper()
```

**Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `str` | function name | Override the task name |
| `timeout` | `int` | `30` | Seconds before the task is killed |
| `retries` | `int` | `0` | Number of retry attempts on failure |

---

## `pipeline(tasks)`

Chain multiple tasks into a sequential pipeline.

```python
from my_project import pipeline

flow = pipeline([task_a, task_b, task_c])
flow.run()
```

---

## `Client`

Programmatic interface for running tasks and reading outputs.

```python
from my_project import Client

client = Client(api_key="your-api-key")
result = client.run("greet", name="hacker")
print(result.output)
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `run(task, **kwargs)` | `Result` | Run a task by name |
| `list_tasks()` | `list[str]` | List registered tasks |
| `get_output(task)` | `dict` | Fetch the last output for a task |

---

## `Result`

Returned by `Client.run()`.

| Attribute | Type | Description |
|-----------|------|-------------|
| `output` | `Any` | Task return value |
| `status` | `str` | `"ok"` or `"error"` |
| `duration_ms` | `int` | Execution time in milliseconds |
| `error` | `str \| None` | Error message if status is `"error"` |
