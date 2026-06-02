# Installation

## Requirements

- Python **3.9** or newer
- pip 21+

---

## Install via pip

```bash
pip install my-project
```

Verify the install:

```bash
my-project --version
```

---

## Install in a virtual environment (recommended)

```bash
python -m venv .venv
source .venv/bin/activate      # Linux / macOS
.venv\Scripts\activate         # Windows

pip install my-project
```

---

## Install from source

```bash
git clone https://github.com/<your-github-username>/<your-repo-name>.git
cd <your-repo-name>
pip install -e .
```

---

## Docker

A minimal Docker image is available:

```bash
docker pull ghcr.io/<your-github-username>/my-project:latest
docker run --rm my-project --version
```

---

!!! warning "Windows note"
    Some shell features require [Windows Terminal](https://aka.ms/terminal) or WSL2 for best results.

!!! tip "Next step"
    Continue to [Quick Start](quickstart.md) to run your first task.
