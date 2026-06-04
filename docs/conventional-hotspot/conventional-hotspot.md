## Conventional Hotspot Setup

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

### MMDVM_HS_USB (USB Method)

COMING SOON

## DVM Configuration

The next sections will cover the configuration of `dvmfne` and `dvmhost`. These are the two software components that are required for a functional P25 hotspot.

#### What is dvmfne?

**Q:** What is `dvmfne`?

**A:** A network "core", that provides a central server for `dvmhost` instances to connect to and be networked with, allowing relay of traffic and other data between `dvmhost` instances and other `dvmfne` instances.

- Source: [DVMProject GitHub](https://github.com/DVMProject/dvmhost)

#### dvmfne Prerequisites

1. A compute resource to run `dvmfne`. A VPS from one of the providers in the hardware requirements section is highly advised as it will always be available. This guide will feature a VPS running Debian 12 Bookworm.
2. An open port on the compute resource for the downstream hotspots to connect to. 62031 is the default port.
3. The `dvmfne` binary from the latest `dvmhost` release for your CPU architecture.
    - The latest binaries can be found in the releases section of the [DVMProject GitHub](https://github.com/DVMProject/dvmhost).

#### Connect To Your Compute and Download `dvmfne`

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

#### Configure `dvmfne`

1. Make a copy of the example `fne-config.yml` file.

    ```bash
    sudo cp /opt/dvm/examples/fne-config.example.yml /opt/dvm/fne-config.yml
    ```

2. Define the base settings for P25 functionality within `fne-config.yml`. Locate and configure these core settings within `fne-config.yml`. All other settings can be set to your preference.

    ```yaml
    log.filePath: /opt/dvm/log/fne/
    log.activityFilePath: /opt/dvm/log/fne-activity/
    master.peerId: 1234567 # Change this to something unique, this is your FNE Peer ID
    master.password: 00AABBCCDDEEFF112233445566778899 # Change this to something secure
    master.allowDMRTraffic: false
    master.allowP25Traffic: true
    master.allowNXDNTraffic: false
    master.parrotGrantDemand: true
    parrotOnlyToOrginiatingPeer: true # This typo is present in the release config.
    master.talkgroup_rules.file: /opt/dvm/rules/talkgroup_rules.yml
    system.radio_id.file: /opt/dvm/rules/rid_acl.dat
    ```

3. Make a copy of the base rules & peer list.

    ```bash
    sudo cp /opt/dvm/examples/rid_acl.example.dat /opt/dvm/rules/rid_acl.dat
    sudo cp /opt/dvm/examples/talkgroup_rules.example.yml /opt/dvm/rules/talkgroup_rules.yml
    sudo cp /opt/dvm/examples/peer_list.example.dat /opt/dvm/rules/peer_list.dat
    ```

4. Populate `peer_list.dat`. This file controls which hotspots (peers) are able to connect to this FNE.

    Example `peer_list.dat` (minimal configuration):

    ```
    #
    # Digital Voice Modem - Peer ID Access Control List
    #
    # This file sets the valid peer IDs allowed on a FNE. This file should always end with an empty line!
    #
    #   * PEER ID           [REQUIRED]  - Unique ID for a peer.
    #                                       Peer IDs are valid numbers between 1 and 999999999.
    #   * PEER PASSWORD     [REQUIRED]  - Unique password for this peer to use when authenticating.
    #   * PEER REPLICATION  [OPTIONAL]  - Flag indicating whether or not the peer connection is another FNE and will receive
    #                                       full configuration from this FNE. When peer replication is set, and the connection is
    #                                       another FNE, that FNE will receive all the talkgroups, radio ID lists, and
    #                                       peer lists from this FNE, it will also receive all system traffic.
    #   * PEER ALIAS        [OPTIONAL]  - Textual name alias for the peer.
    #   * CAN REQUEST KEYS  [OPTIONAL]  - Flag indicating the peer connection is allowed to request encryption keys.
    #                                       If this flag is disabled (0), and the connected peer requests and encryption key
    #                                       the encryption key request will be dropped and ignored.
    #   * CAN ISSUE INHIBIT [OPTIONAL]  - Flag indicating the peer connection is capable of transmitting inhibit packets.
    #                                       If this flag is disabled (0), and the connected peer issues an inhibit to the network
    #                                       this FNE will drop the packet and ignore it.
    #   * HAS CALL PRIORITY [OPTIONAL]  - Flag indicating the peer connection has call priority.
    #                                       If this flag is disabled (0), and the connected peer tries to transmit over an on going
    #                                       call, normal call collision rules are applied to the traffic being transmitted.
    #                                       If this flag is enabled (1), and the connected peer tries to transmit over an on going
    #                                       call, call collision rules are ignored, and the peer is given priority.
    #   * JITTER ENABLED    [OPTIONAL] - Flag indicating whether the adaptive jitter buffer is enabled.
    #   * JITTER MAX FRAMES [OPTIONAL] - Maximum buffer size in frames (range: 2-8 frames).
    #   * JITTER MAX WAIT   [OPTIONAL] - Maximum wait time in microseconds (range: 10000-200000 us).
    #
    # Entry Format: "Peer ID,Peer Password,Peer Replication (1 = Enabled / 0 = Disabled),Peer Alias (optional),Can Request Keys (1 = Enabled / 0 = Disabled),Can Issue Inhibit (1 = Enabled / 0 = Disabled),Has Call Priority (1 = Enabled / 0 = Disabled),Jitter Enabled (1 = Enabled / 0 = Disabled),Jitter Max Size, Jitter Max Wait<newline>"
    # Examples:
    100000,MYSECUREPASSWORD,
    ```

5. Populate `talkgroup_rules.yml`.
    - Populate this file with the talkgroups that you would like to have present on your system.

    Example `talkgroup_rules.yml` (minimal config):

    ```yaml
    groupVoice:
    - alias: Test Talkgroup 1
      config:
        active: true
        affiliated: false
        parrot: false
      name: Test Talkgroup 1
      source:
        slot: 1
        tgid: 20000 # Change this to your preferred talkgroup ID
    - alias: Test Parrot 1
      config:
        active: true
        affiliated: false
        parrot: true # This enables this talkgroup to echo or "parrot" back the input transmission
      name: Test Parrot 1
      source:
        slot: 1
        tgid: 20001 # Change this to your preferred talkgroup ID
    ```

7. **Optional:** Populate `rid_acl.dat`
    - This step is necessary if you wish to restrict access to your FNE by radio ID. This can always be configured later.

    ```bash
    sudo nano /opt/dvm/rules/rid_acl.dat
    ```

    Example `rid_acl.dat`:

    ```
    #
    # Digital Voice Modem - Radio ID Access Control List
    #
    # This file sets the valid Radio IDs allowed on a repeater. This file should always end with an empty line!
    #
    #   * RID               [REQUIRED] - Unique Radio ID.
    #   * ENABLED           [REQUIRED] - Flag indicating whether or not this radio ID entry is enabled and valid.
    #   * ALIAS             [OPTIONAL] - Textual string representing an alias for this radio ID entry.
    #   * IP ADDRESS        [OPTIONAL] - IP Address assigned to this radio ID.
    #
    # Entry Format: "RID,Enabled (1 = Enabled / 0 = Disabled),Optional Alias,Optional IP Address,<newline>"
    # Example:
    175999,1,User-A,
    ```

9. Start the `dvmfne` daemon.

    ```bash
    sudo /opt/dvm/start-dvm-fne.sh fne-config.yml
    ```
