<p align="center">
  <a href="https://seda.xyz/">
    <img width="90%" alt="seda-overlay" src="https://www.seda.xyz/images/footer/footer-image.png">
  </a>
</p>

<h1 align="center">
  SEDA SDK Starter Template
</h1>

Starter template to create Data Requests on the SEDA network using AssemblyScript.
Includes an example of how to fetch an API that returns JSON and how to parse it.

## Requirements

* Have [Bun](https://bun.sh/) installed in your system OR
* Use the devcontainer which installs all requirements for you


## Getting started

To build the binaries:

```sh
bun run build
```

To test the binary it uses `@seda-protocol/vm` which allows you to run WASM binaries locally:

```sh
bun run test
```

