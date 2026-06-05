# Conventional Hotspot Setup

This guide will walk you through setting up and configuring a conventional P25 hotspot for use as a standalone network on either ham bands or your own FCC Part 90 license (encryption legal). This guide will not cover connecting into existing hobbyist systems such as NexCom, CTRS, etc.

**This guide assumes the following:**

- You are either a licensed ham radio operator or possess an FCC Part 90 business license.
- You possess a basic knowledge of Debian based Linux distributions (Raspbian / Debian 12 Bookworm).
- You have a basic knowledge of networking.
- You possess the necessary hardware to program your radios.

### Hardware Requirements

- **Compute:** A dedicated machine that will serve as a "network core" running `dvmfne`. A VPS is highly recommended for always on availability. Hetzner, DigitalOcean, Amazon EC2 (Free Tier), are just some examples of budget friendly providers. You can, of course, use a dedicated Linux device or virtual machine on your own network to offset this cost.
- **Compute:** A Raspberry Pi or similar compute device with power and storage that will serve as the physical hotspot running `dvmhost`. For supported devices see [hardware](https://p25-dvm.github.io/hardware/hardware/).
- **Modem Hardware:** An MMDVM_HS_HAT_DUPLEX board. For supported devices see [hardware](https://p25-dvm.github.io/hardware/hardware/).
    - **Optional:** If you do not wish to use the GPIO headers on a Raspberry Pi or you are using a non-Raspberry Pi compute device, you will need an MMDVM_HS_USB adapter.

### Software Requirements

- **Operating System:** Raspbian Pi OS (Legacy, 64-bit) / Debian 12 Bookworm (x86_64)
    - **Note:** Raspbian 13 (Modern) / Debian 13 (Trixie) are unsupported at this time.
- Internet Connection
- SSH access to all compute

## Initial Compute Configuration

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

### MMDVM_HS_USB (USB Method)

COMING SOON

## dvmfne Configuration

The next sections will cover the configuration of `dvmfne` and `dvmhost`. These are the two software components that are required for a functional P25 hotspot.

### What is dvmfne?

**Q:** What is `dvmfne`?

**A:** A network "core", that provides a central server for `dvmhost` instances to connect to and be networked with, allowing relay of traffic and other data between `dvmhost` instances and other `dvmfne` instances.

- Source: [DVMProject GitHub](https://github.com/DVMProject/dvmhost)

### dvmfne Prerequisites

1. A compute resource to run `dvmfne`. A VPS from one of the providers in the hardware requirements section is highly advised as it will always be available. This guide will feature a VPS running Debian 12 Bookworm.
2. An open port on the compute resource for the downstream hotspots to connect to. 62031 is the default port.
3. The `dvmfne` binary from the latest `dvmhost` release for your CPU architecture.
    - The latest binaries can be found in the releases section of the [DVMProject GitHub](https://github.com/DVMProject/dvmhost).

### Connect To Your Compute and Download `dvmfne`

1. Download the latest release from the [DVMProject GitHub](https://github.com/DVMProject/dvmhost).

    ```bash
    ssh user@remotevps

    sudo mkdir /opt/dvm
    cd /opt/
    sudo wget [latest-dvmhost-release-for-your-cpu-architecture.tar.gz]
    ```

2. Extract and remove the downloaded archive.

    ```bash
    sudo tar zxvf [latest-dvmhost-release.tar.gz]

    # Remove archive (optional)
    sudo rm [latest-dvmhost-release.tar.gz]
    ```

3. Organize the `/opt/dvm` working directory. You are free to set your directories as you see fit, just be sure to update the downstream configuration files as they will reference the paths set forth by this guide.

    ```bash
    cd /opt/dvm/
    sudo mkdir /opt/dvm/examples/
    sudo mv /opt/dvm/*.example.* /opt/dvm/examples/
    sudo mkdir -p /opt/dvm/log/fne/
    sudo mkdir /opt/dvm/log/fne-activity
    sudo mkdir /opt/dvm/rules/
    ```

### Configure `dvmfne`

1. Make a copy of the example `fne-config.yml` file for editing.

    ```bash
    sudo cp /opt/dvm/examples/fne-config.example.yml /opt/dvm/fne-config.yml
    sudo nano /opt/dvm/fne-config.yml
    ```

2. Define the base settings for P25 functionality within `fne-config.yml`. At minimum locate and configure these core settings marked in green on the comparison listed below within `fne-config.yml`. All other settings can be set to your preference. If you do not wish to make the changes by hand, you may simply download the completed example that aligns with this guide instead.

    ```bash
    sudo nano /opt/dvm/fne-config.yml
    ```
    
    - Base Example: [fne-config.yml](https://github.com/DVMProject/dvmhost/blob/master/configs/fne-config.example.yml)
    - Completed Example: [fne-config.yml](https://github.com/p25-dvm/p25-dvm.github.io/blob/main/docs/example-configs/conventional-hotspot/fne-config.yml)
    - Comparison: [fne-config.yml](https://www.diffchecker.com/NXQRz3Rs/)

3. Make a copy of the base rules, acls, and peer list for editing.

    ```bash
    sudo cp /opt/dvm/examples/rid_acl.example.dat /opt/dvm/rules/rid_acl.dat
    sudo cp /opt/dvm/examples/talkgroup_rules.example.yml /opt/dvm/rules/talkgroup_rules.yml
    sudo cp /opt/dvm/examples/peer_list.example.dat /opt/dvm/rules/peer_list.dat
    ```

4. Define the peers that will be allowed to connect to your FNE within `peer_list.dat`. This file controls which hotspots (peers) are able to connect to this FNE. If you do not wish to make the changes by hand, you may simply download the completed example that aligns with this guide instead.

    ```bash
    sudo nano /opt/dvm/rules/peer_list.dat
    ```

    - Base Example: [peer_list.dat](https://github.com/DVMProject/dvmhost/blob/master/configs/peer_list.example.dat)
    - Completed Example: [peer_list.dat](https://github.com/p25-dvm/p25-dvm.github.io/blob/main/docs/example-configs/conventional-hotspot/peer_list.dat)
    - Comparison: [peer-list.dat](https://www.diffchecker.com/zvQ5HP50/)

5. Define the talkgroups that you want to have have accessible to your peers within `talkgroup_rules.yml`. If you do not wish to make the changes by hand, you may simply download the completed example that aligns with this guide instead.

    ```bash
    sudo nano /opt/dvm/rules/talkgroup_rules.yml
    ```
    
    - Base Example: [talkgroup_rules.yml](https://github.com/DVMProject/dvmhost/blob/master/configs/talkgroup_rules.example.yml)
    - Completed Example: [talkgroup_rules.yml](https://github.com/p25-dvm/p25-dvm.github.io/blob/main/docs/example-configs/conventional-hotspot/talkgroup_rules.yml)
    - Comparison: [talkgroup_rules.yml](https://www.diffchecker.com/3lxEHeJL/)

    **Optional:** Populate `rid_acl.dat` if you wish to restrict access to your FNE by radio ID. This can always be configured later. If you do not wish to make the changes by hand, you may simply download the completed example that aligns with this guide instead.

    ```bash
    sudo nano /opt/dvm/rules/rid_acl.dat
    ```

    - Base Example: [rid_acl.dat](https://github.com/DVMProject/dvmhost/blob/master/configs/rid_acl.example.dat)
    - Completed Example: [rid_acl.dat](https://github.com/p25-dvm/p25-dvm.github.io/blob/main/docs/example-configs/conventional-hotspot/rid_acl.dat)
    - Comparison: [rid_acl.dat](https://www.diffchecker.com/K9TjGTJs/)


6. Start the `dvmfne` daemon.

    ```bash
    sudo /opt/dvm/start-dvm-fne.sh fne-config.yml
    ```

## dvmhost Configuration

### What is dvmhost?

**Q:** What is `dvmhost`?

**A:** Host software that connects to the modem (both air interface for repeater and hotspot or P25 DFSI for commercial P25 hardware) and is the primary data processing application for digital modes.

- Source: [DVMProject GitHub](https://github.com/DVMProject/dvmhost)

### dvmhost Prerequisites

1. A compute resource to run `dvmhost`. This guide will assume your hotspot is running on a Raspberry Pi as that is a common configuration for portability. You can, of course, also use a dedicated Debian 12 Bookworm device.
2. No `iptables` or other firewall rules currently exist on the compute device.
3. The `dvmhost` binary from the latest `dvmhost` release for your CPU architecture.
    - The latest binaries can be found in the releases section of the [DVMProject GitHub](https://github.com/DVMProject/dvmhost).

### Connect To Your Compute and Download `dvmhost`

1. Download the latest release from the [DVMProject GitHub](https://github.com/DVMProject/dvmhost).

    ```bash
    ssh user@raspberrypi

    sudo mkdir /opt/dvm
    cd /opt/
    sudo wget [latest-dvmhost-release-for-your-cpu-architecture.tar.gz]
    ```

2. Extract and remove the downloaded archive.

    ```bash
    sudo tar zxvf [latest-dvmhost-release.tar.gz]

    # Remove archive (optional)
    sudo rm [latest-dvmhost-release.tar.gz]
    ```

3. Organize the `/opt/dvm` working directory. You are free to set your directories as you see fit, just be sure to update the downstream configuration files as they will reference the paths set forth by this guide.

    ```bash
    cd /opt/dvm/
    sudo mkdir /opt/dvm/examples/
    sudo mv /opt/dvm/*.example.* /opt/dvm/examples/
    sudo mkdir /opt/dvm/log/host/
    sudo mkdir /opt/dvm/rules/
    ```

### Configure `dvmhost`

1. Copy the example `ident_table.dat` file and configure it for your frequency range. This guide is going to focus on the UHF R2 range as this will cover FCC Part 90 itinerant frequencies where encryption is legal.  If you do not wish to make the changes by hand, you may simply download the completed example that aligns with this guide instead.

    ```bash
    sudo cp /opt/dvm/examples/iden_table.example.dat /opt/dvm/rules/iden_table.dat
    sudo nano /opt/dvm/rules/iden_table.dat
    ```

    - Base Example: [iden_table.dat](https://github.com/DVMProject/dvmhost/blob/master/configs/iden_table.example.dat)
    - Completed Example: [iden_table.dat](https://github.com/p25-dvm/p25-dvm.github.io/blob/main/docs/example-configs/conventional-hotspot/iden_table.dat)
    - Comparison: [iden_table.dat](https://www.diffchecker.com/9Tz7RNEd/)

2. Calculate the frequency pair that will be used for your primary voice channel.

    - Navigate to: [iden-calc-web](https://dvmproject.io/iden-calc-web/). This is a web-based version of the referenced `iden-channel-calc.py` script from `iden_table.dat`.
    - Enter the appropriate values into each of the following fields:
        - **Downlink Frequency (MHz):** The frequency on which the hotspot will receive transmissions.
            - This guide uses: **464.000 MHz**
        - **Base Frequency (MHz):** A starting or reference frequency for a specific block or range of channels within the P25 system's frequency plan. Used in a formula, along with the **Channel ID** and **Spacing**, to calculate the specific frequency for a given channel.
            - This guide uses: **450.000 MHz**
        - **Spacing (kHz):** The separation between the center frequencies of adjacent channels, often called the channel step or channel raster. Typically measured in kilohertz (kHz) (e.g., 12.5 kHz, **6.25 kHz for P25**). This value is crucial for calculating the exact frequency of a channel based on its ID and the base frequency.
            - This guide uses: **6.25 kHz**
        - **Offset (MHz):** The standard frequency difference between the uplink and downlink frequencies for a repeater channel pair in a specific band (e.g., +5 MHz or -5 MHz). Ensures that radios transmit on one frequency and receive on another, allowing for simultaneous transmission and reception through a repeater.
            - This guide uses: **5.000 MHz**
        - **Channel (dec):** A numerical identifier for a specific radio channel within the P25 system. This **decimal value** is used in a formula with the **Base Frequency** and **Spacing** to determine the precise operational frequency (often the **downlink**) for that channel.
            - This guide uses: **2240 (dec)** / **0x8c0 (hex)** 
        - **Uplink Frequency (MHz):** Calculated automatically.
            - This guide uses: **469.000 MHz**

3. Make a copy of the example `config.yml` file for editing.

    ```bash
    sudo cp /opt/dvm/examples/config.example.yml /opt/dvm/config.yml
    sudo nano /opt/dvm/config.yml
    ```

4. Define the base settings for P25 functionality within `config.yml`. Locate and configure these core settings within `config.yml`. All other settings can be set to your preference.

    ```yaml
    log.displayLevel: 1
    log.filepath: /opt/dvm/log/host/
    log.fileRoot: host
    network.address: [ADDRESS-OF-FNE]
    network.id: [6-DIGIT-ID-OF-HOTSPOT]
    network.password: [PASSWORD-FROM-FNE-CONFIG.YML-ON-FNE]
    system.identity: MYHOTSPOT
    protocols.dmr.enable: false
    protocols.nxdn.enable: false
    protocols.p25.enable: true
    system.modem.protocol.type: uart
    system.modem.protocol.mode: air
    system.modem.protocol.uart.port: /dev/ttyAMA0 # /dev/ttyUSB0 if you are using the MMDVM_HS_USB hat
    system.modem.protocol.uart.speed: 115200
    system.config.channelId: [CHANNEL-ENTRY-FROM-IDEN_TABLE.DAT] # 2 if you are using the UHF R2 band mentioned earlier
    system.config.channelNo: [VALUE-CALCULATED-FROM-IDEN-CALC-WEB]
    system.config.voiceChNo.channelId: 2
    system.config.voiceChNo.channelNo: [HEX-VALUE-CALCULATED-FROM-IDEN-CALC-WEB]
    system.config.iden_table.file: /opt/dvm/rules/iden_table.dat
    ```

5. Connect to the modem to verify your settings.

    ```bash
    sudo /opt/dvm/dvmhost -c /opt/dvm/config.yml --setup
    ```

    - Press **F8** — the modem should initialize and connect successfully. If it does not, check your connections. This is also where alignment would take place if necessary. Alignment is generally needed if the hotspot does not activate when receiving a transmission from a subscriber radio. For assistance tuning your modem please refer to the calibration section.
    - Press **F2** — this will save your current settings and "flatten" your `config.yml` file, removing any comments.
    - Press **F3** — this will return you to the console.

    - **Note:** Due to the length of a finalized `config.yml`, it will not be included inline. Click here to view it on GitHub.

6. Start the `dvmhost` process as a daemon and verify your process is running.

    ```bash
    sudo /opt/dvm/start-dvm.sh /opt/dvm/config.yml
    ps aux | grep dvmhost
    ```

    - **Note:** If you do not see a `dvmhost` process running, review `/opt/dvm/log/host-CURRENT-DATE.log` for details.

7. Create a `dvmhost` system service.

    ```bash
    sudo nano /etc/systemd/system/dvmhost.service
    ```

    Example `dvmhost.service`:

    ```
    [Unit]
    Description=dvmhost
    After=network.target

    [Service]
    ExecStart=/opt/dvm/bin/dvmhost -c /opt/dvm/config.yml -f
    User=root
    Type=forking
    Restart=on-abnormal
    TimeoutSec=infinity

    [Install]
    WantedBy=multi-user.target
    ```

8. Enable the `dvmhost` service to start at system boot.

    ```bash
    sudo systemctl daemon-reload
    sudo systemctl enable dvmhost.service
    sudo systemctl start dvmhost.service
    ```
