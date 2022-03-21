# tianpower-bms-monitor

Monitor Tian Power Battery Management System used by REVOV

## Why

To get accurate state-of-charge and battery health data not provided by an inverter.

#### Why node

I like node and I have other node based packages I wanted to integrate it with.

## Interface Design

The general thinking is captured in the [design documentation](./documentation/design.md)

## Protocol

Very patchy implementation based on poorly reverse-engineered wire captures using the Windows based "Uper-computer software V1.1.634-8.exe" utility.

## Installation

Locally as dependency

```sh
npm i -S tianpower-bms-monitor
```

Globally for CLI interface

```sh
npm i -g tianpower-bms-monitor
```

## Usage

### Important note on serial interface

Remeber to add user to dialout group if not already added to allow accessing serial port

```sh
sudo useradd <current_user> dialout
```

### CLI

#### bms-status

Polls the BMS for current status and prints the formatted response.

##### parameters

- -r, --raw: show the raw, unformatted response string, default=false
- -p, --port: Serial port for tty interface, e.g. /dev/ttyUSB0
- -t, --timeout: query timeout in MS, default=10000

##### Example - formatted

```sh
$ bms-status
Querying BMS Status
{
  "voltage": 234.2,
  "current": 50,
  "soc": 230.2,
  "soh": 50,
  "power": 437,
  "cellCount": 16,

}

```

##### Example - raw using ttyUSB0

```sh
$ axpert-status -r -p /dev/ttyUSB0
Querying BMS Status
7c01017601100cf60cf70cf50cf98cf30cf48cf60cf90cf50cf58cf50cfa8cf00cf18cf60cf802017a0303012547c04014e20050300510053205406050000000200000000000007010026080114bc090127100a0100000b01000015880c01000014a80d01000f9b690e010023f2190f01000484221001000440e8620d
```
