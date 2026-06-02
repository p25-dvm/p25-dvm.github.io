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

1. Ensure your system is fully up to date.

    ```bash
    sudo apt update && sudo apt upgrade
    ```

2. The following steps need to be performed to ensure that the MMDVM_HS_HAT_DUPLEX board is properly exposed via the GPIO headers. These steps should be configured **before** attaching the modem to the GPIO headers.

    - **Skip this step if you are using an MMDVM_HS_USB adapter or non-Pi based compute.**

    ```bash
    ssh user@raspberrypi
    sudo systemctl disable bluetooth.service serial-getty@ttyAMA0.service
    sudo systemctl mask serial-getty@ttyAMA0.service
    grep '^dtoverlay=disable-bt' /boot/firmware/config.txt || echo 'dtoverlay=disable-bt' | sudo tee -a /boot/firmware/config.txt
    sudo sed -i 's/^console=serial0,115200 *//' /boot/firmware/cmdline.txt
    sudo reboot
    ```

    - **Note:** These steps were taken from the [dvmhost GitHub repository](https://github.com/DVMProject/dvmhost) under the **Raspberry Pi Preparation Notes** section and updated to accommodate the Raspbian 12 file structure.
      - `/boot/config.txt` → `/boot/firmware/config.txt`
      - `/boot/cmdline.txt` → `/boot/firmware/cmdline.txt`

### Raspberry Pi (USB) / Debian 12

1. Ensure your system is fully up to date.

    ```bash
    sudo apt update && sudo apt upgrade
    ```

2. Review and notate what devices your host can see, specifically USB devices **before** plugging in the MMDVM_HS_USB adapter. The command below will show the devices attached to the USB bus by vendor.

    - **Note:** There may be some variance based on which chipset you have. In the example below there are 2 MMDVM_HS_HAT_DUPLEX modems attached, and they both show a different device ID.

    ```bash
    lsusb
    ```

    Example output:

    ```
    Bus 004 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
    Bus 003 Device 005: ID 9986:7523  USB Serial <-- MMDVM_HS_HAT_DUPLEX
    Bus 003 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
    Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
    Bus 001 Device 006: ID 1a86:7523 QinHeng Electronics CH340 serial converter <-- MMDVM_HS_HAT_DUPLEX
    Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
    ```

3. Next you will need to locate the physical device identifier of the adapter. A single adapter will likely reside at `/dev/ttyUSB0`.

    ```bash
    ls /dev | grep USB
    ```

## Flashing the DVM Firmware

Now that your compute is properly set up and your modem has been successfully detected, you will need to flash it with the firmware from the DVMProject. There are a couple of different ways to do this; this guide will cover using the flashing utility `HSFlashEZ` and using the MMDVM_HS_USB adapter. Both methods will boot your modem into bootloader mode so new firmware can be written via `stm32flash`.

### HSFlashEZ (GPIO Method)

1. Connect your modem to the Raspberry Pi's GPIO headers.

2. Clone the `hsflash` GitHub repository and compile the code.

    ```bash
    git clone https://github.com/ThisGuyNeedsABeer/hsflash.git
    cd hsflash/
    gcc hsflash.c -o hsflash
    chmod +x hsflash
    ```

3. Download the `dvm-firmware-hs-hat-dual.bin` firmware to the `hsflash` directory.

    ```bash
    wget https://github.com/DVMProject/dvmfirmware-hs/releases/download/2025-11-06/dvm-firmware-hs-hat-dual.bin
    ```

4. Flash the newly downloaded firmware. If `stm32flash` is missing, `hsflash` will attempt to install it.

    ```bash
    ./hsflash
    ```

    Example output:

    ```
    ██╗  ██╗███████╗   ███████╗██╗      █████╗ ███████╗██╗  ██╗
    ██║  ██║██╔════╝   ██╔════╝██║     ██╔══██╗██╔════╝██║  ██║
    ███████║███████╗   █████╗  ██║     ███████║███████╗███████║
    ██╔══██║╚════██║   ██╔══╝  ██║     ██╔══██║╚════██║██╔══██║
    ██║  ██║███████║██╗██║     ███████╗██║  ██║███████║██║  ██║
    ╚═╝  ╚═╝╚══════╝╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
                      * HOTSPOT FLASH EZ *

    [WARN] stm32flash is not installed.
    Install stm32flash now? [Y/n]: y

    ... apt output omitted...

    Enter BOOT0 GPIO pin [default 20]: 20
    Enter NRST GPIO pin [default 21]: 21
    Enter firmware filename (e.g. dvm-firmware-hs-hat-dual.bin): dvm-firmware-hs-hat-dual.bin
    Enter serial port [default /dev/ttyAMA0]: /dev/ttyAMA0

    ===== Configuration Summary =====
    BOOT0 GPIO      : 20
    NRST GPIO       : 21
    BIN_FILE        : dvm-firmware-hs-hat-dual.bin
    SERIAL_PORT     : /dev/ttyAMA0
    stm32flash      : found
    =================================

    Proceed with flashing? [Y/n]: y
    [INFO] Proceeding with firmware flash setup...
    [INFO] Setting BOOT0 high (GPIO20)...
    [ raspi-gpio is deprecated - try `pinctrl` instead ]
    [INFO] Asserting reset (GPIO21 low)...
    [INFO] Releasing reset (GPIO21 high)...
    [INFO] Flashing firmware...
    stm32flash 0.7

    http://stm32flash.sourceforge.net/

    Using Parser : Raw BINARY
    Size         : 57248
    Interface serial_posix: 57600 8E1
    Version      : 0x22
    Option 1     : 0x00
    Option 2     : 0x00
    Device ID    : 0x0410 (STM32F10xxx Medium-density)
    - RAM        : Up to 20KiB  (512b reserved by bootloader)
    - Flash      : Up to 128KiB (size first sector: 4x1024)
    - Option RAM : 16b
    - System RAM : 2KiB
    Write to memory
    Erasing memory
    Wrote and verified address 0x0800dfa0 (100.00%) Done.

    Resetting device...
    Reset done.

    [INFO] Setting BOOT0 low (GPIO20)...
    [INFO] Resetting MCU to boot from flash...
    [SUCCESS] Flashing complete and STM32 restarted successfully.
    ```
