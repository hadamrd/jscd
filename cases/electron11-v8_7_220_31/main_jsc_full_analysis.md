# main.jsc — Full Codebase Analysis

## Overview

**File**: `main.jsc` (12.7 MB, V8 8.7.220.31 / Electron 11.4.6 code cache)
**Decompiled**: 460,144 lines of JavaScript, 8,591 functions
**Deobfuscated**: 13.8 MB after obfuscator-io-deobfuscator
**Obfuscation**: javascript-obfuscator with splitStrings (9–10 char chunks), hex identifier mangling, string array rotation, proxy functions

## Identity

This is the **main-process bundle** of an Electron 11 desktop application that performs comprehensive hardware fingerprinting and system information collection. The app bundles:

1. **`systeminformation`** (npm) — full system inventory library (CPU, RAM, GPU, disks, network, WiFi, battery, Docker, processes, users)
2. **CryptoJS** — complete symmetric crypto stack (AES, DES, TripleDES, RC4, MD5, SHA-1, SHA-256, SHA-512, RIPEMD-160)
3. **Discord RPC** — rich presence client over local IPC
4. **Google APIs** (Gmail v1) — email sending capability
5. **Electron main process** — BrowserWindow, ipcMain (25 handlers), app lifecycle, crashReporter, powerSaveBlocker

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Top-level entry (lines 1–12280)                                 │
│  ├── 74-entry internal require table (webpack-style modules)     │
│  ├── String array decoder: a0_0x2d98(idx, key) → string          │
│  ├── AES-encrypted string table (hardcoded key/IV)                │
│  └── Module bootstrap + exports                                   │
├─────────────────────────────────────────────────────────────────┤
│  systeminformation library (lines ~12280–400000)                  │
│  ├── CPU: brand, model, cores, speed, flags, virtualization      │
│  ├── Memory: per-DIMM manufacturer, partNum, serialNum           │
│  ├── Disk: serial, UUID, SMART, firmware, geometry               │
│  ├── GPU: vendor, model, VRAM, PCI device/vendor IDs, driver     │
│  ├── Displays: EDID, resolution, serial, productionYear          │
│  ├── Network: interfaces, MAC, connections, peer addresses        │
│  ├── WiFi: SSID, BSSID, signal, security, channel                │
│  ├── Battery: serial, manufacturer, capacity, voltage            │
│  ├── BIOS/DMI: UUID, vendor, version, serial                      │
│  ├── Docker: containers, images, volumes                          │
│  ├── Processes: pid, command, path, user, memory                  │
│  ├── Users: username, tty, IP, session time                      │
│  └── OS: platform, arch, kernel, hostname, uptime                 │
├─────────────────────────────────────────────────────────────────┤
│  CryptoJS (interspersed, ~20% of code)                           │
│  ├── AES-256-CBC (keySize:8, Rcon, SBOX, INV_SBOX)                │
│  ├── DES + TripleDES (PC-1/PC-2 permutation tables)             │
│  ├── RC4 (256-element KSA)                                        │
│  ├── MD5, SHA-1, SHA-256, SHA-512, RIPEMD-160                     │
│  ├── CBC/ECB/CTR/CFB/OFB modes                                    │
│  ├── Pkcs7/Zero/Iso10126/AnsiX923 padding                         │
│  └── EvpKDF (MD5-based OpenSSL key derivation)                    │
├─────────────────────────────────────────────────────────────────┤
│  Electron main process (lines ~390000+)                           │
│  ├── BrowserWindow (742×556, centered)                            │
│  ├── 25 ipcMain.on handlers                                       │
│  ├── app.on lifecycle handlers                                    │
│  ├── powerSaveBlocker (keeps host awake)                          │
│  ├── crashReporter.createReport                                   │
│  ├── screen.getPrimaryDisplay()                                   │
│  ├── child_process.execFile (windowsHide:true, maxBuffer:20MB)   │
│  └── ElectronJSONSettingsStoreMain                                 │
├─────────────────────────────────────────────────────────────────┤
│  Exfiltration layer                                               │
│  ├── Gmail API: users.messages.send (from/to from process.env)   │
│  ├── Discord RPC: presence with largeImageKey/smallImageKey      │
│  └── AES-encrypted string table (command templates/endpoints)     │
└─────────────────────────────────────────────────────────────────┘
```

## Data Model (910 unique property names)

The app collects and structures the following data:

### Hardware Fingerprint
| Category | Properties |
|---|---|
| **CPU** | manufacturer, brand, model, cores, physicalCores, performanceCores, speed, speedMin, speedMax, governor, voltage, voltageConfigured, voltageMin, cache (l1/l2/l3), socket, revisionCode |
| **Memory (per DIMM)** | manufacturer, partNum, serialNum, size, clockSpeed, formFactor, type, voltage, bank, ecc |
| **GPU** | vendor, model, vram, vramDynamic, subDeviceId, vendorId, pciBus, driverVersion, utilizationGpu, temperatureGpu, utilizationMemory, temperatureMemory, powerDraw, powerLimit, fanSpeed |
| **Disks** | device, serialNum, serial, uuid, model, manufacturer, type, fsType, size, bytesPerSector, totalSectors, totalCylinders, totalHeads, totalTracks, tracksPerCylinder, smartStatus, firmwareRevision, interfaceType, removable |
| **Displays** | vendor, model, productionYear, serialNum, displayId, deviceName, resolutionX, resolutionY, currentResX, currentResY, sizeX, sizeY, pixelDepth, positionX, builtin, external, main |
| **Battery** | manufacturer, model, serialNum, hasBattery, acConnected, isCharging, designedCapacity, maxCapacity, currentCapacity, capacityUnit, percent, voltage, cycleCount |
| **BIOS/DMI** | vendor, version, releaseDate, biosApicMode, hardwareUUID, motherboard manufacturer/model/serial |

### Network Fingerprint
| Category | Properties |
|---|---|
| **Interfaces** | iface, ifaceName, mac, ip4, ip4subnet, ip6, ip6subnet, internal, virtual, operstate, type, dhcp, dnsSuffix, mtu, speed, netEnabled |
| **WiFi** | ssid, bssid, channel, frequency, signalLevel, security, wpaFlags, quality, mode |
| **Connections** | protocol, localAddress, localPort, peerAddress, peerPort, state, pid, process |
| **Users** | user, tty, ip, pid, pids, command, started, time |

### Software/OS
| Category | Properties |
|---|---|
| **OS** | platform, arch, distro, release, kernel, hostname, fqdn, uptime, timezone |
| **Docker** | id, name, image, imageID, state, status, ports, command, created, container, driver, graphDriver, repoTags, repoDigests, virtualSize, sharedSize |
| **Processes** | pid, parentPid, pids, name, command, path, user, priority, memVsz, memRss, utime, stime, cutime, cstime, cpuu, nice |
| **VirtualBox** | name, guestOS, hardwareUUID, memory, cpus, firmware, chipset, acpi, hpet, pae, longMode, x2Apic, bootDevice1-4, cpuProfile, cpuExepCap, pageFusion |

## Crypto Stack

Full CryptoJS bundle with:
- **AES-256-CBC** — used for encrypting collected data before exfiltration and for decrypting the string table (command templates, endpoints)
- **Key/IV**: Hardcoded constants assembled from decoded string fragments (not KDF-derived)
- **SHA-1**: Init constants `[1732584193, 4023233417, 2562383102, 271733878, 3285377520]`
- **SHA-256**: H₀ `1779033703`, K[0] `1116352408`
- **SHA-512**: K[0] hi/lo `1116352408, 3609767458`
- **MD5**: Init `[1732584193, 4023233417, 2562383102, 271733878]`
- **RC4**: 256-element KSA
- **DES**: PC-1/PC-2 permutation tables, keySize:2
- **TripleDES**: keySize:6
- **RIPEMD-160**: message-selection + shift arrays
- **EvpKDF**: MD5-based OpenSSL key derivation
- **Modes**: CBC, ECB, CTR, CFB, OFB
- **Padding**: Pkcs7, Zero, Iso10126, AnsiX923

## Shell Commands (inferred from parsing patterns)

All command strings are AES-encrypted in the string table. The following are inferred from output-parsing logic:

| Command | Platform | Evidence |
|---|---|---|
| `wmic` | Windows | WMI query output parsing (Win32_VideoController, Win32_PnPEntity) |
| `powershell` | Windows | PowerShell-style output format |
| `dmidecode` | Linux | SMBIOS/DMI type parsing |
| `system_profiler` | macOS | SPHardwareDataType output format |
| `ioreg` | macOS | IOKit registry parsing |
| `lsblk -P` | Linux | `NAME=`, `FSTYPE=`, `SERIAL=`, `MODEL=`, `ROTA=` field parsing |
| `/proc/cpuinfo` | Linux | CPU model string parsing, Pi revision decode |
| `/proc/<pid>/stat` | Linux | Process stat fields (utime, stime, cutime, cstime) |
| `ps` | All | Process list parsing |
| `netstat` / `ss` | All | Active connection enumeration |
| `who` / `w` | All | Logged-in user sessions |
| `iw dev scan` | Linux | WiFi AP scanning (`-g` flag, channel/frequency fields) |
| `nvidia-smi --query-gpu` | All | 16-field GPU telemetry parsing |
| `VBoxManage showvminfo` | All | VirtualBox VM enumeration |
| `docker inspect` | All | Container/image/volume parsing |
| `diskutil` | macOS | Disk info parsing |

## Network Communication

### Exfiltration via Gmail API
- Module 9993 = `googleapis`
- Module 7147 = Gmail client
- Uses `users.messages.send` to exfiltrate collected data
- `from`/`to` email addresses read from `process.env`
- Command output piped as email body (line 41758: `2>&1` redirection)

### Discord RPC
- Rich presence with `state`, `details`, `largeImageKey`, `largeImageText`, `smallImageKey`, `smallImageText`
- Local IPC socket (not network exfiltration)

### Electron IPC
- 25 `ipcMain.on` handlers for renderer ↔ main communication
- `child_process.execFile` with `windowsHide:true, maxBuffer:20480000`

## String Obfuscation

The app uses javascript-obfuscator's string array technique:
- **Decoder function**: `a0_0x2d98(index, key)` → returns decoded string
- **String table**: AES-encrypted, decrypted at runtime with hardcoded key/IV
- **Split strings**: Literal strings split into 9–10 char chunks
- **Hex identifiers**: All variable/function names mangled (`_0x47f30c`, `a0_0x2d98`)
- **Proxy functions**: Obfuscated call indirection
- **RO references**: `<ro0_NNNN>` placeholders for read-only heap strings not in the ro-map

## What's NOT Recoverable Statically

1. **AES key/IV** — assembled from decoded string fragments at runtime
2. **Command strings** — AES-encrypted in the string table
3. **C2 endpoints / email addresses** — same AES-encrypted string table
4. **IPC channel names** — runtime-decoded
5. **Module names** — webpack module IDs (numeric), resolved at runtime

To recover these, the app would need to be run in a sandboxed Electron 11 environment with `child_process.execFile`, `crypto.createDecipheriv`, and `gmail.users.messages.send` intercepted.

## Function Inventory

| Type | Count | Description |
|---|---|---|
| `_anon_NNNNN` | 1,848 | Anonymous functions (closures, callbacks, parsers) |
| `_0xNNNNNN` | 6,722 | Obfuscated named functions |
| `a0_0xNNNNNN` | 2 | String decoder + string table initializer |
| **Total** | **8,591** | |

## Assessment

This is a **hardware fingerprinting / device intelligence SDK** embedded in an Electron 11 desktop application. It collects a comprehensive, stable, globally-unique machine fingerprint including:

- CPU brand/model/cores/speed
- RAM DIMM serials + part numbers
- Disk serials + UUIDs + SMART
- GPU PCI device/vendor IDs
- Monitor serials + EDID
- MAC addresses
- WiFi BSSID/SSID of all visible APs
- Active network connections with owning PID
- Full process list with command lines
- Logged-in usernames + source IPs
- Docker container inventory
- VirtualBox VM inventory
- BIOS/DMI hardware UUID

The collected data is AES-256-CBC encrypted and exfiltrated via Gmail API. The app also maintains Discord Rich Presence. All command strings and endpoints are AES-encrypted in a runtime-decoded string table, preventing static extraction.
