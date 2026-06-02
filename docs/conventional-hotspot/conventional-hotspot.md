## Conventional Hotspot Setup

### Hardware Requirements

- **Compute:** A Raspberry Pi or similar compute device with power and storage. For supported devices see [hardware](https://p25-dvm.github.io/hardware/hardware/).
- **Modem Hardware:** An MMDVM_HS_HAT_DUPLEX board. For supported devices see [hardware](https://p25-dvm.github.io/hardware/hardware/).
  - **Optional:** If you do not wish to use the GPIO headers on a Raspberry Pi or you are using a non-Raspberry Pi compute device, you will need an MMDVM_HS_USB adapter.

### Software Requirements

- **Operating System:** Raspbian Pi OS (Legacy, 64-bit) / Debian 12 Bookworm (x86_64)
  - **Note:** Raspbian 13 (Modern) / Debian 13 (Trixie) are unsupported at this time.
- Internet Connection
- SSH access to your compute

## Initial Configuration

### Raspberry Pi (GPIO)

1. Ensure your system is fully update to date.

    ```bash
    # sudo apt update && sudo apt upgrade
    ```

2. The following steps need to be performed to ensure that the MMDVM_HS_HAT_DUPLEX board is properly exposed via the GPIO headers. These steps should be configured **before** attaching the modem to the GPIO headers.
   - **Skip this step if you are using an MMDVM_HS_USB adapter or non-Pi based compute.**

    ```bash
    # ssh user@raspberrypi
    # sudo systemctl disable bluetooth.service serial-getty@ttyAMA0.service
    # sudo systemctl mask serial-getty@ttyAMA0.service
    # grep '^dtoverlay=disable-bt' /boot/firmware/config.txt || echo 'dtoverlay=disable-bt' | sudo tee -a /boot/firmware/config.txt
    # sudo sed -i 's/^console=serial0,115200 *//' /boot/firmware/cmdline.txt
    # sudo reboot
    ```

    - **Note:** These steps were taken from the [dvmhost GitHub repository](https://github.com/DVMProject/dvmhost) under the **Raspberry Pi Preparation Notes** section and updated to accommodate the Raspbian 12 file structure.

- `/boot/config.txt` -> `/boot/firmware/config.txt`
- `/boot/cmdline.txt` -> `/boot/firmware/cmdline.txt`

### Raspberry Pi (USB) / Debian 12

1. Ensure your system is fully update to date.

    ```bash
    # sudo apt update && sudo apt upgrade
    ```

2. Review and notate what devices your host can see, specifically USB devices **before** plugging in the MMDVM_HS_USB adapter. The command below will show the devices attached to the USB bus by vendor.
   - **Note:** There may be some variance based on which chipset you have. In the example below There are 2 MMDVM_HS_HAT_DUPLEX modems attached, and they both show a different device ID.

    ```
    # lsusb

    Example Output: 
    Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
    Bus 003 Device 005: ID 9986:7523  USB Serial <-- MMDVM_HS_HAT_DUPLEX
    Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
    Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
    Bus 001 Device 006: ID 1a86:7523 QinHeng Electronics CH340 serial converter <-- MMDVM_HS_HAT_DUPLEX
    Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
    ```

    ```
    # ls /dev | grep USB
    ```

3. This will show the physical location of the adapter. A single adapter will likely reside at `/dev/ttyUSB0.`

