# Hardware

Links to purchase hardware will be shared when applicable. In order to keep things simple, Amazon will be listed as the primary vendor. As always, community recommendations are welcomed.

### Hotspot Hardware (Conventional & Trunking)

- **Compute** - Raspberry Pi's are often seen as the main compute power of the hotspot. The links below feature full-fledged starter kits. This means everything you need is included: case, power supply, microSDHC card & adapter, and heatsinks. You can of course purchase a board without the starter kit components, although buying everything at once as a bundle can be cheaper.
    - Raspberry Pi Model 3 B+: [Amazon](https://a.co/d/09u7ZB7S)
    - Raspberry Pi Model 4: [Amazon](https://a.co/d/0djiAMjJ)
    - Raspberry Pi Model 5: [Amazon](https://a.co/d/04O5aYmq)
- **Memory Cards** - A good quality MicroSDHC card will be needed to store the operating system as well as configuration files. Storage should ideally be >= 32GB. This will provide ample room for the operating system as well as configuration & log files.
    - Popular microSDHC brands are:
        - Samsung: [32GB](https://a.co/d/0ejg3ztf) / [64GB](https://a.co/d/002dVgwn) / [128GB](https://a.co/d/0gp6PaNF)
        - Lexar: [32GB](https://a.co/d/04CwdLP4) / [64GB](https://a.co/d/0f0qyXsS) / [128GB](https://a.co/d/0aV7Nxax)
        - SanDisk: [32GB](https://a.co/d/01z2DaKL) / [64GB](https://a.co/d/07ynOncE) / [128GB](https://a.co/d/05Mg7Mul)
- **Hotspot Specific Cases** - These are cases designed to allow ventilation as well as allow for the attached antennas to be properly exposed without any obstructions. These cases are recommended when running a MMDVM Duplex Board as a hat instead of attached via external USB adapter.
    - [C4Labs Pi 3 & 4 Compatible Case](https://a.co/d/07NgwKjx)

### MMDVM/DVM Hardware

- **Note:** The DVMProject firmware that you will need to flash onto the MMDVM board **requires duplex operation**. The DVMProject **does not support simplex operation**.

- **MMDVM Duplex Boards:** This is the brain of the operation. These hats connect directly to your computer (often a Raspberry Pi), directly via the GPIO pins or via external USB adapter. Be aware that some soldering may be required even if the photos show the headers to be pre-installed.
    - [MMDVM_HS_HAT_DUPLEX w/ OLED](https://a.co/d/0dl8QZX9)
    - [MMDVM_HS_HAT_DUPLEX w/o OLED](https://a.co/d/067B7zb6)
    - [DVM-HS-USB](https://store.w3axl.com/products/dvm-hs-usb-hotspot-usb-c-serial-adapter-for-mmdvm-hotspot-hats): This is a product made by W3AXL, a direct contributor to the DVMProject. It is recommended to purchase at least one of these as it can make flashing the DVM firmware substantially easier by means of the A/B switch to toggle bootloader mode.
    - [MMDVM_HS_USB Hat](https://a.co/d/0b0nopmF): This is an alternative to the USB adapter made by W3AXL, however these generally cost more and purchases do not support an independent developer.

### Traditional RF Site Hardware

This section will feature components used for larger sites that are operating over traditional RF.

- Raspberry Pi or similar compute: See the list above of approved Raspberry Pi models.
- [DVM-V1 Duplex Modem](https://store.w3axl.com/products/dvm-v1-duplex-modem): This is a product made by W3AXL, a direct contributor to the DVMProject. The result of nearly a year of continuous iteration, the DVM-V1 is perfect for implementing a multi-mode digital repeater using any base station radios you want. With digitally-controlled softpots for TX & RX modulation levels, an RJ45 for radio interfacing, and a USB-C connection to your host PC of choice, the DVM-V1 takes the original MMDVM modem concept and makes it even better.
- [PCB End Plates For DVM-V1](https://store.w3axl.com/products/pcb-end-plates-for-dvm-v1): This is a product made by W3AXL, a direct contributor to the DVMProject. Silkscreened and shielded end plates for the DVM-V1 modem boards.
- Hammond Manufacturing Enclosures
    - [1455C801 (Silver)](https://www.digikey.com/en/products/detail/hammond-manufacturing/1455C801/460159)
    - [1455C801BK (Black)](https://www.digikey.com/en/products/detail/hammond-manufacturing/1455C801BK/460160?s=N4IgTCBcDaIIwBYCsSDCAOADHAQgaRAF0BfIA)
    - [1455C801RD (Red)](https://www.digikey.com/en/products/detail/hammond-manufacturing/1455C801RD/5277161)
    - [1455C802 (Silver)](https://www.digikey.com/en/products/detail/hammond-manufacturing/1455c802/460161)
    - [1455C802BK (Black)](https://www.digikey.com/en/products/detail/hammond-manufacturing/1455c802bk/460162)
- Motorola Radios (Confirmed Working)
    - CDM1250 Radio (x2) (AAM25SHD9AA2AN) - UHF (450-527 MHz) - Ideally you want to find these with power cables for under $150.00 each. At minimum two will be needed for a conventional configuration. In a trunking configuration, each voice channel will require an additional radio.
    - CDM1250 Programming Cable
        - [BlueMax49ers Serial Cable](https://bluemax49ers.com/product-explorer/motorola-cdm1250-serial-programming-cable-db-9-rkn4081/)
        - [BlueMax49ers USB Cable](https://bluemax49ers.com/product-explorer/motorola-cdm1250-ftdi-programming-cable-rkn4081/)
    - [Motorola CDM1250 Repeater Cables](https://www.ebay.com/itm/350427352788): You will need two of these.
    - [RJ45 To Terminal Block Adapter](https://a.co/d/0fgjAIge): This will be used to interface both radios into the DVM-V1 Duplex Modem.
    - [UHF Duplexer](https://www.buytwowayradios.com/xlt-dp-450x5n-50.html): This will be used to allow your RF site to Tx/Rx via a single antenna. Purchasing one from BuyTwoWayRadios.com (unaffiliated) will have tuning available for an additional $59.99.
