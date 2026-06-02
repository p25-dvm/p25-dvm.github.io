# Configuration

All configuration lives in `project.yml` at the root of your project.

---

## Full Example

```yaml
name: my-automation
version: 1.0.0
env: production

tasks:
  timeout: 30
  retries: 3
  output_dir: outputs/

logging:
  level: INFO
  file: logs/run.log

auth:
  api_key_env: MY_PROJECT_API_KEY
```

---

## Reference

### Top-level

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `name` | `str` | required | Project name |
| `version` | `str` | `"0.1.0"` | Semver project version |
| `env` | `str` | `"development"` | Active environment |

### `tasks`

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `timeout` | `int` | `30` | Global task timeout (seconds) |
| `retries` | `int` | `0` | Retry count on failure |
| `output_dir` | `str` | `"outputs/"` | Where results are written |

### `logging`

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `level` | `str` | `"INFO"` | Log level (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |
| `file` | `str` | `null` | Log file path (optional) |

### `auth`

| Key | Type | Description |
|-----|------|-------------|
| `api_key_env` | `str` | Name of the environment variable holding your API key |

---

!!! note
    Environment variables always override `project.yml` values. Prefix with `MY_PROJECT_` — e.g. `MY_PROJECT_ENV=production`.
