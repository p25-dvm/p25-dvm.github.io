# Error Codes

All errors returned by MY_PROJECT follow a consistent structure:

```json
{
  "code": "ERR_TIMEOUT",
  "message": "task exceeded timeout of 30s",
  "task": "greet",
  "status": "error"
}
```

---

## Code Reference

| Code | HTTP | Description |
|------|------|-------------|
| `ERR_TIMEOUT` | 408 | Task exceeded the configured timeout |
| `ERR_NOT_FOUND` | 404 | Task name does not exist |
| `ERR_AUTH` | 401 | Missing or invalid API key |
| `ERR_INVALID_ARGS` | 422 | Task received unexpected or invalid arguments |
| `ERR_RUNTIME` | 500 | Unhandled exception raised inside the task |
| `ERR_RETRY_EXHAUSTED` | 503 | Task failed after all configured retries |

---

## Handling Errors

```python
from my_project import Client, errors

client = Client(api_key="your-api-key")

try:
    result = client.run("my-task")
except errors.TimeoutError:
    print("task timed out — increase timeout in project.yml")
except errors.AuthError:
    print("check your MY_PROJECT_API_KEY environment variable")
except errors.RuntimeError as e:
    print(f"task crashed: {e.message}")
```

---

!!! warning "Retry behavior"
    `ERR_TIMEOUT` and `ERR_RUNTIME` are retryable. `ERR_AUTH`, `ERR_NOT_FOUND`, and `ERR_INVALID_ARGS` are **not** retried regardless of the `retries` setting.
